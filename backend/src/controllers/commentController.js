import { prisma } from "../config/db.js";
import { catchAsync } from "../utils/catchAsync.js";
import { NotFound } from "../utils/errors/NotFound.js"

const allComment = catchAsync(async (req, res, next) => {
  const postId = req.params.postId;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  const [comments, totalComments] = await prisma.$transaction([
    prisma.comment.findMany({
      skip: skip,
      take: limit,
      where: {
        post_id: postId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: { created_at: "desc" },
    }),
    prisma.comment.count({
      where: { post_id: postId },
    }),
  ]);
  if (!comments) {
    return next(new NotFound("there is no comment"));
  }
  const totalPages = Math.ceil(totalComments / limit);
  res.status(200).json({
    status: "success",
    data: comments,
    pagination: {
      totalComments: totalComments,
      totalPages: totalPages,
      currentPage: page,
      limit: limit,
    },
  });
});
const doComment = catchAsync(async (req, res, _next) => {
  const { text } = req.body;
  const postId = req.params.postId;
  const userId = req.user.id;
  const comment = await prisma.comment.create({
    data: {
      user_id: userId,
      post_id: postId,
      text: text,
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });
  res.status(201).json({
    status: "success",
    data: {
      id: comment.id,
      text: comment.text,
      postId: comment.post_id,
      userId: comment.user_id,
      created_at: comment.created_at,
      user: comment.user,
    },
  });
});
const updateComment = catchAsync(async (req, res, _next) => {
  const commentId = req.params.commentId;
  const { text } = req.body;
  const comment = await prisma.comment.update({
    where: {
      id: commentId,
    },
    data: {
      text: text,
    },
  });
  res.status(200).json({
    status: "success",
    data: comment,
  });
});
const deleteComment = catchAsync(async (req, res) => {
  const commentId = req.params.commentId;
  await prisma.comment.delete({
    where: {
      id: commentId,
    },
  });
  return res.status(204).json({});
});

export { allComment, doComment, updateComment, deleteComment };
