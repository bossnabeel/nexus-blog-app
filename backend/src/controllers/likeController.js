import { prisma } from "../config/db.js";
import { catchAsync } from "../utils/catchAsync.js";

const getAllLikes = catchAsync(async (req, res) => {
  const postId = req.params.postId;
  const limit = parseInt(req.query.limit) || 20;
  const page = parseInt(req.query.page) || 1;
  const skip = (page - 1) * limit;
  const [likes, totalLikes] = await prisma.$transaction([
    prisma.like.findMany({
      skip: skip,
      take: limit,
      where: {
        post_id: postId,
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    }),
    prisma.like.count({
      where: {
        post_id: postId,
      },
    }),
  ]);
  const pageCount = Math.ceil(totalLikes / limit);
  res.json({
    status: "success",
    data: likes,
    pagination: {
      totalLikes: totalLikes,
      pageCount: pageCount,
      limit: limit,
      skip: skip,
    },
  });
});
const likePost = catchAsync(async (req, res) => {
  const postId = req.params.postId;
  const userId = req.user.id;
  const existLike = await prisma.like.findFirst({
    where: {
      user_id: userId,
      post_id: postId,
    },
  });
  if (!existLike) {
    await prisma.like.create({
      data: {
        post_id: postId,
        user_id: userId,
      },
    });
    return res.status(201).json({});
  }
  await prisma.like.delete({
    where: {
      id: existLike.id,
    },
  });
  res.status(204).json({})
});

export { getAllLikes, likePost };
