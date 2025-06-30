import express, { Request, Response } from "express";

import {
  create_user_controller,
  get_user_email_controller,
  login_user_controller,
  reset_password_controller,
  verify_otp_controller,
} from "../controllers/auth";

const authRoute = express.Router();

authRoute.post("/createUser", create_user_controller);

authRoute.post("/login", login_user_controller);

authRoute.post("/getUserEmail", get_user_email_controller);

authRoute.post("/verifyOtp", verify_otp_controller);

authRoute.post("/resetPassword", reset_password_controller);

export default authRoute;
