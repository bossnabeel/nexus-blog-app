import express from "express";
import { likePost, getAllLikes } from "../controllers/likeController.js";
import { authMiddleware } from "../middleware/auth.js";
import { isLoginMiddleware } from "../middleware/isLogin.js";

const router = express.Router({ mergeParams: true });

router.post("/:postId/likes", authMiddleware,isLoginMiddleware, likePost);
router.get("/:postId/likes", getAllLikes);

export default router;
