import { Request, Response } from "express";
import logger from "../config/logger";
import {
  changePasswordService,
  createUserService,
  getEmailService,
  getMeService,
  loginService,
  resetPasswordWithOtpService,
  updateMeService,
  refreshAccessTokenService,
  logoutService,
} from "../services/authService";

export async function createUserController(req: Request, res: Response) {
  try {
    const user = await createUserService(req.body);
    res.status(201).json({ data: user, message: "Account Created!!" });
  } catch (error: any) {
    if (error.message === "User already exist on database") {
      return res.status(409).json({ message: "User already exists" });
    }
    res.status(500).json({ error: "An internal error occurred" });
  }
}

export async function loginController(req: Request, res: Response) {
  try {
    const { accessToken, refreshToken, accountData } = await loginService(
      req.body,
    );
    return res
      .status(200)
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .json({
        data: { accessToken, refreshToken, accountData },
        message: "Login successful",
      });
  } catch (error: any) {
    logger.error(`Login failed: ${error.message}`);
    if (
      error.message === "Invalid email or password" ||
      error.message === "Account is temporarily locked. Please try again later."
    ) {
      return res.status(401).json({ message: error.message });
    }
    res.status(500).json({ error: "An internal error occurred" });
  }
}

export async function getEmailController(req: Request, res: Response) {
  try {
    const { email } = req.body;
    const result = await getEmailService(email, res);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ error: "An internal error occurred" });
  }
}

export async function resetPasswordWithOtpController(
  req: Request,
  res: Response,
) {
  try {
    const { email, otp, password } = req.body;
    const result = await resetPasswordWithOtpService({ email, otp, password });
    res.status(200).json(result);
  } catch (error: any) {
    logger.error(`Reset password failed: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
}

export async function refreshAccessTokenController(
  req: Request,
  res: Response,
) {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
    console.log(refreshToken);
    if (!refreshToken)
      return res.status(401).json({ message: "Refresh token required" });

    const result = await refreshAccessTokenService(refreshToken);
    res.status(200).json({ data: result });
  } catch (error: any) {
    res.status(401).json({ message: "Invalid refresh token" });
  }
}

export async function getMeController(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).send("Unauthorized");
    const user = await getMeService(userId);
    res
      .status(200)
      .json({ data: user, message: "Profile fetched successfully" });
  } catch (error: any) {
    res.status(500).json({ error: "An internal error occurred" });
  }
}

export async function updateMeController(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).send("Unauthorized");
    const user = await updateMeService(userId, req.body);
    res
      .status(200)
      .json({ data: user, message: "Profile updated successfully" });
  } catch (error: any) {
    logger.error(error.message);
    res.status(500).json({ error: "An internal error occurred" });
  }
}

export async function changePasswordController(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).send("Unauthorized");
    const result = await changePasswordService(userId, req.body);
    res.status(200).json(result);
  } catch (error: any) {
    logger.error(error.message);
    res.status(400).json({ error: error.message });
  }
}

export async function logoutController(req: Request, res: Response) {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      await logoutService(refreshToken);
    }
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error: any) {
    res.status(500).json({ error: "An internal error occurred" });
  }
}
