import { prisma } from "../config/db.js";
import { catchAsync } from "../utils/catchAsync.js";

const getAdminStats = catchAsync(async (_req, res) => {
  const [users, posts, likes, comments] = await prisma.$transaction([
    prisma.user.count(),
    prisma.post.count(),
    prisma.like.count(),
    prisma.comment.count(),
  ]);
  res.status(200).json({
    status: "success",
    data: {
      users,
      posts,
      likes,
      comments,
    },
  });
});

const getUserStats = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const [likesCount, commentsCount, postsCount] = await prisma.$transaction([
    prisma.like.count({
      where: {
        created_at: {
          gte: thirtyDaysAgo,
        },
        post: {
          user_id: userId,
        },
      },
    }),
    prisma.comment.count({
      where: {
        created_at: {
          gte: thirtyDaysAgo,
        },
        post: {
          user_id: userId,
        },
      },
    }),
    prisma.post.count({
      where: {
        created_at: {
          gte: thirtyDaysAgo,
        },
        user_id: userId,
      },
    }),
  ]);
  res.status(200).json({
    status: "success",
    data: {
      likesReceivedLast30Days: likesCount,
      commentsReceivedLast30Days: commentsCount,
      postsCreatedLast30Days: postsCount,
    },
  });
});

export { getAdminStats, getUserStats };
