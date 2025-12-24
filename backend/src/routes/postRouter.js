import express from "express";
import {
  getAllBlogs,
  getSingleBlog,
  uploadBlog,
  deleteBlog,
  updateBlog,
} from "../controllers/postController.js";
import commentRouter from "./commentRouter.js";
import likeRouter from "./likeRouter.js";
import { isPostOwner } from "../middleware/isPostOwner.js";
import { validate } from "../middleware/validate.js";
import { sanitizeInput } from "../middleware/sanitize.js";
import { authMiddleware } from "../middleware/auth.js";
import { isLoginMiddleware } from "../middleware/isLogin.js";
import { postSchema } from "../validators/postValidator.js";

const router = express.Router();

router.get("/", authMiddleware, getAllBlogs);
router.post(
  "/",
  authMiddleware,
  isLoginMiddleware,
  validate(postSchema),
  sanitizeInput,
  uploadBlog
);
router.get("/:postId", getSingleBlog);
router.patch(
  "/:postId",
  authMiddleware,
  isLoginMiddleware,
  isPostOwner,
  validate(postSchema),
  sanitizeInput,
  updateBlog
);
router.delete(
  "/:postId",
  authMiddleware,
  isLoginMiddleware,
  isPostOwner,
  deleteBlog
);

router.use("/", commentRouter);
router.use("/", likeRouter);

export default router;
