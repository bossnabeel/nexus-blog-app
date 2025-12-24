import express from "express";
import {
  searchUser,
  getCurrentUser,
  register,
  login,
  logout,
  updateUser,
} from "../controllers/userController.js";
import { validate } from "../middleware/validate.js";
import { loginSchema, registerSchema } from "../validators/authValidator.js";
import { authMiddleware } from "../middleware/auth.js";
import { getUserStats } from "../controllers/statController.js";
import { isLoginMiddleware } from "../middleware/isLogin.js";
import { authLimit } from "../middleware/rateLimiter.js";

const router = express.Router();

router.get("/", authMiddleware, searchUser);
router.get("/me", authMiddleware, isLoginMiddleware, getCurrentUser);
router.patch("/me", authMiddleware, isLoginMiddleware, updateUser);
router.get("/me/stats", authMiddleware, isLoginMiddleware, getUserStats);
router.post("/register",authLimit, validate(registerSchema), register);
router.post("/login",authLimit, validate(loginSchema), login);
router.get("/logout", logout);

export default router;
