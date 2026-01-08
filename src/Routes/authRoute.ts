import express from "express";
import {
  changePasswordController,
  createUserController,
  getEmailController,
  getMeController,
  loginController,
  resetPasswordWithOtpController,
  updateMeController,
  refreshAccessTokenController,
  logoutController,
} from "../controllers/auth";
import { verifyToken } from "../middleware/verifyJwt";
import { authRateLimiter, otpRateLimiter } from "../middleware/rateLimiter";

const authRoute = express.Router();

authRoute.post("/signup", authRateLimiter, createUserController);
authRoute.post("/login", authRateLimiter, loginController);
authRoute.post("/refresh", authRateLimiter, refreshAccessTokenController);
authRoute.post("/logout", logoutController);
authRoute.post("/forgot-password", otpRateLimiter, getEmailController);
authRoute.post(
  "/reset-password",
  authRateLimiter,
  resetPasswordWithOtpController
);

authRoute.get("/me", verifyToken, getMeController);
authRoute.put("/me", verifyToken, updateMeController);
authRoute.post(
  "/change-password",
  verifyToken,
  authRateLimiter,
  changePasswordController
);

export default authRoute;
