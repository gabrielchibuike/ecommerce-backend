"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOtpEmail = generateOtpEmail;
const authModel_1 = __importDefault(require("../model/authModel"));
function generateOTP() {
    return __awaiter(this, void 0, void 0, function* () {
        const digits = "0123456789";
        let otp = "";
        for (let i = 0; i < 4; i++) {
            otp += digits[Math.floor(Math.random() * digits.length)];
        }
        return otp;
    });
}
function generateOtpEmail(res, email) {
    return __awaiter(this, void 0, void 0, function* () {
        const otp = yield generateOTP();
        const currentTime = new Date();
        currentTime.getTime();
        const result = yield authModel_1.default.findOneAndUpdate({ email: email }, { otp: otp }, { new: true });
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
    });
}
