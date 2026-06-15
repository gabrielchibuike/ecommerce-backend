"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../controllers/auth");
const authRoute = express_1.default.Router();
authRoute.post("/createUser", auth_1.createUserController);
authRoute.post("/login", auth_1.loginController);
authRoute.post("/getUserEmail", auth_1.getEmailController);
authRoute.post("/verifyOtp", auth_1.verifyOtpController);
authRoute.post("/resetPassword", auth_1.resetPasswordController);
exports.default = authRoute;
