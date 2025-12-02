import express from "express";
import {
  login,
  logout,
  signup,
  refreshTokens,
  getProfile,
  getAllUsers,
  updateProfile
} from "../controllers/auth.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", signup);
router.post("/login", login);
router.post("/logout", logout);
router.put("/update", updateProfile);
router.post("/refreshToken", refreshTokens);
router.get("/profile", protectedRoute, getProfile);
router.get("/check", protectedRoute, getAllUsers); 

export default router;
