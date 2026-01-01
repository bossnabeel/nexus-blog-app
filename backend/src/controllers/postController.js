import { prisma } from "../config/db.js";
import { catchAsync } from "../utils/catchAsync.js";
import { NotFound } from "../utils/errors/NotFound.js";

const getSingleBlog = catchAsync(async (req, res) => {
  const postId = req.params.postId;
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
        },
      },
      comments: {
        include: {
          user: {
            select: { id: true, username: true },
          },
          _count: { select: { likes: true, comments: true } },
          likes: req.user
            ? { where: { user_id: req.user.id }, select: { user_id: true } }
            : false,
        },
        orderBy: { created_at: "asc" },
      },
      likes: true,
    },
  });
  if (!post) {
    return next(new NotFound("post not found"));
  }
  return res.status(200).json({
    status: "success",
    data: {
      title: post.title,
      content: post.content,
      created_at: post.created_at,
      author: post.user,
      commentsCount: post._count.comments,
      isLiked: !!(post.likes && post.likes.length > 0),
      likesCount: post._count.likes,
    },
  });
});
const getAllBlogs = catchAsync(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(req.query.limit) || 10));
  const skip = (page - 1) * limit;

  let condition = { AND: [] };
  if (req.query.username) {
    condition.AND.push({ user: { username: req.query.username } });
  }

  if (req.query.search) {
    const search = req.query.search.split("+").join(" ");
    condition.AND.push({
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ],
    });
  }
  const finalWhere = condition.AND.length > 0 ? condition : {};
  const [posts, totalPosts] = await prisma.$transaction([
    prisma.post.findMany({
      skip,
      take: limit,
      where: finalWhere,
      orderBy: { created_at: "desc" },
      include: {
        user: { select: { id: true, username: true, created_at: true } },
        _count: { select: { likes: true, comments: true } },
        likes: req.user
          ? { where: { user_id: req.user.id }, select: { user_id: true } }
          : false,
      },
    }),
    prisma.post.count({ where: finalWhere }),
  ]);

  const totalPages = Math.ceil(totalPosts / limit);

  const formatePosts = posts.map((post) => ({
    id: post.id,
    title: post.title,
    content:
      post.content.length > 200
        ? post.content.substring(0, 200) + "..."
        : post.content,
    created_at: post.created_at,
    author: post.user,
    isLiked: !!(post.likes && post.likes.length > 0),
    likesCount: post._count.likes,
    commentsCount: post._count.comments,
  }));

  res.status(200).json({
    status: "success",
    data: formatePosts,
    pagination: { totalPosts, totalPages, currentPage: page, limit },
  });
});
const uploadBlog = catchAsync(async (req, res) => {
  const { title, content } = req.body;
  const userId = req.user.id;
  const post = await prisma.post.create({
    data: {
      user_id: userId,
      title: title,
      content: content,
    },
  });
  res.status(201).json({
    status: "success",
    data: {
      post: {
        id: post.id,
        userId: post.user_id,
        title: post.title,
        content: post.content,
        created_at: post.created_at,
      },
    },
  });
});
const updateBlog = catchAsync(async (req, res) => {
  const postId = req.params.postId;
  const { title, content } = req.body;
  const updatedPost = await prisma.post.update({
    where: { id: postId },
    data: {
      title: title,
      content: content,
    },
  });
  res.status(200).json({
    status: "success",
    data: {
      post: {
        id: updatedPost.id,
        userId: updatedPost.user_id,
        title: updatedPost.title,
        content: updatedPost.content,
        created_at: updatedPost.created_at,
      },
    },
  });
});
const deleteBlog = catchAsync(async (req, res) => {
  const postId = req.params.postId;
  await prisma.post.delete({
    where: {
      id: postId,
    },
  });
  res.status(204).json({});
});

export { getAllBlogs, getSingleBlog, uploadBlog, updateBlog, deleteBlog };
