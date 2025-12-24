import express from "express";
import { getAdminStats } from "../controllers/statController.js";
import { isAdmin } from "../middleware/isAdmin.js";
import { isLoginMiddleware } from "../middleware/isLogin.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/stats", authMiddleware,isLoginMiddleware, isAdmin, getAdminStats);

export default router;
