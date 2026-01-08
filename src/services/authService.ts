import { UserType } from "../Interface/userType";
import userDetails from "../model/authModel";
import { hashPassword, verifyPassword } from "../utils/argon2Helper";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/tokenHelper";
import {
  createAccSchema,
  emailSchema,
  updatePasswordSchema,
} from "../utils/validation";
import { generateOtpEmail } from "../utils/generateOtpEmail";
import { Response } from "express";
import crypto from "crypto";
import logger from "../config/logger";

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 30 * 60 * 1000; // 30 minutes
const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes
const MAX_OTP_ATTEMPTS = 5;

export async function createUserService(data: UserType) {
  const { error } = createAccSchema.validate(data);
  if (error)
    throw new Error(error.details.map((err) => err.message).join(", "));

  const normalizedEmail = data.email.toLowerCase().trim();
  const existing_user = await userDetails.findOne({ email: normalizedEmail });
  if (existing_user) throw new Error("User already exist on database");

  const hashedPassword = await hashPassword(data.password as string);

  return await userDetails.create({
    firstname: data.firstName,
    lastname: data.lastName,
    email: normalizedEmail,
    password: hashedPassword,
  });
}

export async function loginService(data: UserType) {
  const normalizedEmail = data.email.toLowerCase().trim();
  const user = await userDetails.findOne({ email: normalizedEmail });

  if (!user) throw new Error("Invalid email or password");

  // Check if account is locked
  if (user.lockUntil && user.lockUntil > new Date()) {
    throw new Error("Account is temporarily locked. Please try again later.");
  }

  const isMatch = await verifyPassword(data.password as string, user.password);

  if (!isMatch) {
    user.failedLoginAttempts += 1;
    if (user.failedLoginAttempts >= MAX_LOGIN_ATTEMPTS) {
      user.lockUntil = new Date(Date.now() + LOCK_TIME);
      logger.warn(`Account locked: ${normalizedEmail}`);
    }
    await user.save();
    throw new Error("Invalid email or password");
  }

  // Reset failed attempts on successful login
  user.failedLoginAttempts = 0;
  user.lockUntil = undefined;

  const payload = {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
  };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  user.refreshToken = refreshToken;
  await user.save();

  logger.info(`Login successful: ${normalizedEmail}`);

  const accountData = {
    id: user._id,
    first_name: user.firstname,
    last_name: user.lastname,
    email: user.email,
    role: user.role,
    profile_img: user.profileImg,
  };

  return { accessToken, refreshToken, accountData };
}

export async function findUser(email: string) {
  return await userDetails.findOne({ email: email.toLowerCase().trim() });
}

export async function getEmailService(email: string, res: Response) {
  const { error } = emailSchema.validate({ email });
  if (error) throw new Error(error.details[0]!.message);

  const normalizedEmail = email.toLowerCase().trim();
  const user = await userDetails.findOne({ email: normalizedEmail });
  if (!user) {
    // Return success to avoid email enumeration
    return { message: "If an account exists, an OTP has been sent." };
  }

  // Generate 6-digit OTP
  const rawOtp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOtp = crypto.createHash("sha256").update(rawOtp).digest("hex");

  user.otp = hashedOtp;
  user.otpExpiry = new Date(Date.now() + OTP_EXPIRY_MS);
  user.otpAttempts = 0;
  await user.save();

  // Send raw OTP via email (mocked or using existing service)
  // Assuming generateOtpEmail handles sending the provided OTP string
  await generateOtpEmail(res, normalizedEmail, rawOtp);

  logger.info(`OTP requested: ${normalizedEmail}`);
  logger.info(`OTP requested: ${rawOtp}`);
  return { message: "If an account exists, an OTP has been sent." };
}

export async function resetPasswordWithOtpService(data: {
  email: string;
  otp: string;
  password: string;
}) {
  const normalizedEmail = data.email.toLowerCase().trim();
  const user = await userDetails.findOne({ email: normalizedEmail });

  if (!user || !user.otp || !user.otpExpiry) {
    throw new Error("Invalid or expired OTP");
  }

  if (user.otpExpiry < new Date()) {
    throw new Error("OTP has expired");
  }

  if (user.otpAttempts >= MAX_OTP_ATTEMPTS) {
    throw new Error("Too many failed attempts. Please request a new OTP.");
  }

  const hashedProvidedOtp = crypto
    .createHash("sha256")
    .update(data.otp)
    .digest("hex");

  if (user.otp !== hashedProvidedOtp) {
    user.otpAttempts += 1;
    await user.save();
    throw new Error("Invalid or expired OTP");
  }

  // OTP is valid
  const { error } = updatePasswordSchema.validate({ password: data.password });
  if (error)
    throw new Error(error.details.map((err) => err.message).join(", "));

  user.password = await hashPassword(data.password);
  user.otp = undefined;
  user.otpExpiry = undefined;
  user.otpAttempts = 0;
  user.refreshToken = undefined; // Invalidate all sessions
  await user.save();

  logger.info(`Password reset via OTP: ${normalizedEmail}`);
  return { message: "Password reset successfully" };
}

export async function updateMeService(
  userId: string,
  data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    profileImg?: string;
  }
) {
  const updateData: any = {};
  if (data.firstName) updateData.firstname = data.firstName;
  if (data.lastName) updateData.lastname = data.lastName;
  if (data.phone) updateData.phone = data.phone;
  if (data.profileImg) updateData.profileImg = data.profileImg;

  const result = await userDetails
    .findByIdAndUpdate(userId, updateData, {
      new: true,
    })
    .select("-password -refreshToken -otp -otpExpiry -otpAttempts");

  if (!result) throw new Error("User not found");
  return result;
}

export async function changePasswordService(
  userId: string,
  data: { oldPassword: string; newPassword: string }
) {
  if (!data?.oldPassword || !data?.newPassword) {
    throw new Error("Current and new password are required");
  }

  const { error } = updatePasswordSchema.validate({
    password: data.newPassword,
  });

  if (error)
    throw new Error(error.details.map((err) => err.message).join(", "));

  const user = await userDetails.findById(userId);
  if (!user) throw new Error("User not found");

  const isMatch = await verifyPassword(data.oldPassword, user.password);
  if (!isMatch) {
    throw new Error("Incorrect current password");
  }

  user.password = await hashPassword(data.newPassword);
  user.refreshToken = undefined; // Invalidate current session (force logout)
  await user.save();

  logger.info(`Password changed: ${user.email}`);
  return { message: "Password updated successfully. Please log in again." };
}

export async function getMeService(userId: string) {
  const user = await userDetails
    .findById(userId)
    .select("-password -refreshToken -otp -otpExpiry -otpAttempts");
  if (!user) throw new Error("User not found");
  return user;
}

export async function refreshAccessTokenService(refreshToken: string) {
  const user = await userDetails.findOne({ refreshToken });
  if (!user) throw new Error("Invalid refresh token");

  try {
    const payload = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    };
    // Optionally rotate refresh token
    const newAccessToken = generateAccessToken(payload);
    return { accessToken: newAccessToken, refreshToken }; // Return existing for now
  } catch (error) {
    throw new Error("Invalid or expired refresh token");
  }
}

export async function logoutService(refreshToken: string) {
  await userDetails.findOneAndUpdate(
    { refreshToken },
    { $unset: { refreshToken: "" } }
  );
  return { message: "Logged out successfully" };
}
