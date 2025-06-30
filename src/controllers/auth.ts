import { Request, Response } from "express";
import {
  create_user_service,
  find_user,
  get_user_email_service,
  login_user_service,
  reset_password_service,
  verify_otp_service,
} from "../services/authService";

import {
  createAccSchema,
  emailSchema,
  updatePasswordSchema,
} from "../utils/validation";
import jwt from "jsonwebtoken";
import sha1 from "sha1";
import dotenv from "dotenv";
// import { generateOtpEmail } from "../utils/generateOtpEmail";
import { UserType } from "../Interface/userType";
import { save_refresh_token } from "../utils/general";
import { generateOtpEmail } from "../utils/generateOtpEmail";
import { logger } from "../utils/logger";

dotenv.config();

const ACCESS_TOKEN = process.env.ACCESS_TOKEN_PRIVATE_KEY;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN_PRIVATE_KEY;

export async function create_user_controller(req: Request, res: Response) {
  const { firstName, lastName, email, password }: UserType = req.body;
  console.log("git");

  try {
    const hashedpassword = sha1(password as string);
    const { error } = createAccSchema.validate({
      firstName,
      lastName,
      email,
      password,
    });
    if (error)
      return res.status(400).send(error.details.map((err) => err.message));

    const existing_user = await find_user(email);

    if (existing_user)
      return res.status(409).send("User already exist on database");

    const user_id = await create_user_service({
      firstName,
      lastName,
      email,
      hashedpassword,
    });

    res.status(200).json({ message: "Account Created!!" });
  } catch (error: any) {
    console.log(error);

    res.status(500).json({ error: error.message });
  }
}

export async function login_user_controller(req: Request, res: Response) {
  const { email, password }: UserType = req.body;
  console.log(email, password);

  const hashedPassword = sha1(password as string);
  try {
    const user = await login_user_service(email, hashedPassword);

    if (!user) return res.status(401).send("Incorrect  email or password");

    const accessToken = jwt.sign(
      { id: user?._id, email: email, role: user.role },
      ACCESS_TOKEN as string,
      {
        expiresIn: "40s",
      }
    );

    const refreshToken = jwt.sign(
      { id: user?._id, email: email, role: user.role },
      REFRESH_TOKEN as string,
      { expiresIn: "7d" } // 7 days
    );

    await save_refresh_token(user._id as unknown as string, refreshToken);

    return res
      .status(200)
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      })
      .json({ data: accessToken, message: "Login sucessful" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

// forget password section
export async function get_user_email_controller(req: Request, res: Response) {
  try {
    const { email }: UserType = req.body;

    logger.info("Reset email ", email);

    const { error } = emailSchema.validate(req.body);

    if (error) return res.status(401).send(error.details[0]!.message);

    const user = await get_user_email_service(email);

    if (!user) return res.status(400).json({ message: "User not found" });

    const result = await generateOtpEmail(res, email);

    return res
      .status(200)
      .json({ message: "OTP sent successfully", data: result });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function verify_otp_controller(req: Request, res: Response) {
  try {
    const { otp } = req.body;

    const result = await verify_otp_service(otp);

    if (!result) {
      throw new Error("Fail to verify");
    }
    res.status(200).json({ message: "success!!" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function reset_password_controller(req: Request, res: Response) {
  try {
    const { password, email } = req.body;

    const hashedpassword = sha1(password as string);

    const { error } = updatePasswordSchema.validate({
      password,
    });
    if (error)
      return res.status(400).send(error.details.map((err) => err.message));

    const result = await reset_password_service(hashedpassword, email);

    if (!result) throw new Error("Fial to update password");

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
    throw new Error(error.message);
  }
}
