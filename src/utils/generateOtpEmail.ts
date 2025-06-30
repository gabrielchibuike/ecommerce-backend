import { Response } from "express";
import nodemailer from "nodemailer";
import userDetails from "../model/authModel";

async function generateOTP() {
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < 4; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }
  return otp;
}
export async function generateOtpEmail(res: Response, email: string) {
  const otp = await generateOTP();

  const currentTime = new Date();
  currentTime.getTime();
  const result = await userDetails.findOneAndUpdate(
    { email: email },
    { otp: otp },
    { new: true }
  );

  if (!result) {
    throw new Error("Fail to save to DB");
  }

  console.log(otp);

  return otp;

  //   const transporter = nodemailer.createTransport({
  //     service: "gmail", // or use 'smtp.example.com'
  //     auth: {
  //       user: "your_email@gmail.com",
  //       pass: "your_app_password", // Use app password, NOT your actual password
  //     },
  //   });

  //   const mailOptions = {
  //     from: "Blooms clothing",
  //     to: email,
  //     subject: "OTP for verification",
  //     html: `
  //       <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; border: 1px solid #eee;">
  //         <h2 style="color: #333;">Your One-Time Password (OTP)</h2>
  //         <p style="font-size: 18px;">Use the following OTP to proceed:</p>
  //         <div style="font-size: 32px; font-weight: bold; margin: 20px 0; color: #2c3e50;">
  //           ${otp}
  //         </div>
  //         <p style="font-size: 14px; color: #777;">This OTP is valid for the next 5 minutes. Do not share it with anyone.</p>
  //       </div>
  //     `,
  //   };

  //   try {
  //     const info = await transporter.sendMail(mailOptions);
  //     console.log("OTP email sent:", info.response);
  //   } catch (error) {
  //     console.error("Error sending OTP email:", error);
  //   }
}
