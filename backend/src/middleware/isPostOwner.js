// src/middleware/isPostOwner.js
import { prisma } from "../config/db.js";
import { catchAsync } from "../utils/catchAsync.js";
import  ForbiddenError from "../utils/errors/ForbiddenError.js";
import { NotFound } from "../utils/errors/NotFound.js";

const isPostOwner = catchAsync(async (req, _res, next) => {
  const postId = req.params.postId;
  const userId = req.user.id;
  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { user_id: true },
  });
  if (!post) {
    return next(new NotFound("Post not found."));
  }
  if (post.user_id !== userId) {
    return next(new ForbiddenError("you are not authorized"));
  }
  next();
});

export { isPostOwner };
