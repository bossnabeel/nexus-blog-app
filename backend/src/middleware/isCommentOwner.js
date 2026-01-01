import { prisma } from "../config/db.js";
import { catchAsync } from "../utils/catchAsync.js";
import { NotFound } from "../utils/errors/NotFound.js";
import { ForbiddenError } from "../utils/errors/ForbiddenError.js";

const isCommentOwner = catchAsync(async (req, _res, next) => {
  const commentId = req.params.commentId;
  const postId = req.params.postId;
  const userId = req.user.id;
  const [existComment, post] = await prisma.$transaction([
    prisma.comment.findUnique({
      where: { id: commentId },
      select: { user_id: true },
    }),
    prisma.post.findUnique({
      where: { id: postId },
      select: { user_id: true },
    }),
  ]);
  if (!post || !existComment) {
    return next(new NotFound("comment doesn't exist"));
  }
  const isAuthorOfComment = existComment.user_id === userId;
  const isAuthorOfPost = post.user_id === userId;
  if (isAuthorOfComment || isAuthorOfPost) {
    return next();
  }
  return next(
    new ForbiddenError("You are not authorized to delete this comment")
  );
});

export { isCommentOwner };
