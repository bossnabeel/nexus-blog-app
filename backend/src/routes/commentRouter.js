import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import {
  allComment,
  doComment,
  deleteComment,
} from "../controllers/commentController.js";
import { sanitizeInput } from "../middleware/sanitize.js";
import { isCommentOwner } from "../middleware/isCommentOwner.js";
import { validate } from "../middleware/validate.js";
import { commentSchema } from "../validators/postValidator.js";
import { isLoginMiddleware } from "../middleware/isLogin.js";

const router = express.Router({ mergeParams: true });

router.get("/:postId/comments", allComment);
router.post(
  "/:postId/comments",
  authMiddleware,
  isLoginMiddleware,
  validate(commentSchema),
  sanitizeInput,
  doComment
);
router.delete(
  "/:postId/comments/:commentId",
  authMiddleware,
  isLoginMiddleware,
  isCommentOwner,
  deleteComment
);

export default router;
