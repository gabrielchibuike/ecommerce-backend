import { Request, Response } from "express";
import {
  create_user_service,
  find_user,
  login_user_service,
} from "../services/user.info";

import { createAccSchema, emailSchema } from "../utils/validation";
import jwt from "jsonwebtoken";
import sha1 from "sha1";
import dotenv from "dotenv";
// import { generateOtpEmail } from "../utils/generateOtpEmail";
import { UserType } from "../Interface/userType";
import { save_refresh_token } from "../utils/general";

dotenv.config();

const ACCESS_TOKEN = process.env.ACCESS_TOKEN_PRIVATE_KEY;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN_PRIVATE_KEY;

export async function create_user_controller(req: Request, res: Response) {
  const {
    firstname,
    lastname,
    gender,
    mobile,
    dateOfBirth,
    email,
    password,
  }: UserType = req.body;

  try {
    const hashedpassword = sha1(password as string);
    const { error } = createAccSchema.validate({
      firstname,
      lastname,
      gender,
      mobile,
      dateOfBirth,
      email,
      password,
    });
    if (error)
      return res.status(401).send(error.details.map((err) => err.message));
    console.log(hashedpassword);

    const existing_user = await find_user(email);

    if (existing_user)
      return res.status(409).send("User already exist on database");

    const user_id = await create_user_service({
      firstname,
      lastname,
      gender,
      mobile,
      dateOfBirth,
      email,
      hashedpassword,
    });

    res.status(200).send("Account Created!!");
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

    if (user == null)
      return res.status(401).send("Incorrect  email or password");

    const accessToken = jwt.sign(
      { id: user?._id, email: email },
      ACCESS_TOKEN as string,
      {
        expiresIn: "1m",
      }
    );

    const refreshToken = jwt.sign(
      { id: user?._id, email: email },
      REFRESH_TOKEN as string,
      { expiresIn: "7d" } // 7 days
    );

    await save_refresh_token(user._id as unknown as string, refreshToken);

    return res
      .status(200)
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      })
      .send(accessToken);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

// export async function getUser_info_controller(req: Request, res: Response) {
//   try {
//     if (!req.file) return res.status(404).send("File not recieved");
//     const { filename } = req.file!;

//     // const result = await cloud_upload.uploader.upload(req.file!.path, {
//     //   folder: `${filename.split(".")[0]}`,
//     //   public_id: filename.split(".")[0],
//     // });
//     // console.log(result);

//     const { id, email, title, bio, socialHandle }: UserType = JSON.parse(
//       req.body.jsonData
//     );

//     console.log(id, email);
//     await getUser_info_service(id, filename, title, bio, socialHandle);

//     await generateOtpEmail(res, email);
//   } catch (error: any) {
//     res.status(500).json({ error: error.message });
//   }
// }

// export async function get_user_email_controller(req: Request, res: Response) {
//   try {
//     const { email }: UserType = req.body;

//     const { error } = emailSchema.validate(req.body);

//     if (error) return res.status(401).send(error.details[0]!.message);

//     const user = await get_user_email_service(email);

//     if (!user) return res.status(400).json({ message: "User not found" });

//     await generateOtpEmail(res, email);
//   } catch (error: any) {
//     res.status(500).json({ error: error.message });
//   }
// }

// export async function verify_otp_controller(req: Request, res: Response) {
//   try {
//     const { otp }: UserType = req.body;

//     await verify_otp_service(otp);

//     res.status(200).send("success!!");
//   } catch (error: any) {
//     res.status(500).send(error.message);
//   }
// }
