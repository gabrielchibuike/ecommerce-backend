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
exports.createUserController = createUserController;
exports.loginController = loginController;
exports.getEmailController = getEmailController;
exports.verifyOtpController = verifyOtpController;
exports.resetPasswordController = resetPasswordController;
const validation_1 = require("../utils/validation");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sha1_1 = __importDefault(require("sha1"));
const dotenv_1 = __importDefault(require("dotenv"));
const general_1 = require("../utils/general");
const generateOtpEmail_1 = require("../utils/generateOtpEmail");
const logger_1 = __importDefault(require("../config/logger"));
const authService_1 = require("../services/authService");
dotenv_1.default.config();
const ACCESS_TOKEN = process.env.ACCESS_TOKEN_PRIVATE_KEY;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN_PRIVATE_KEY;
function createUserController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { firstName, lastName, email, password } = req.body;
        try {
            const hashedpassword = (0, sha1_1.default)(password);
            const { error } = validation_1.createAccSchema.validate({
                firstName,
                lastName,
                email,
                password,
            });
            if (error)
                return res.status(400).send(error.details.map((err) => err.message));
            const existing_user = yield (0, authService_1.findUser)(email);
            if (existing_user)
                return res.status(409).send("User already exist on database");
            const user_id = yield (0, authService_1.createUserService)({
                firstName,
                lastName,
                email,
                hashedpassword,
            });
            res.status(200).json({ message: "Account Created!!" });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message });
        }
    });
}
function loginController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = req.body;
        console.log(email, password);
        const hashedPassword = (0, sha1_1.default)(password);
        try {
            const user = yield (0, authService_1.loginService)(email, hashedPassword);
            if (!user)
                return res.status(401).send("Incorrect email or password");
            const accessToken = jsonwebtoken_1.default.sign({ id: user === null || user === void 0 ? void 0 : user._id, email: email, role: user.role }, ACCESS_TOKEN, {
                expiresIn: "10s",
            });
            const refreshToken = jsonwebtoken_1.default.sign({ id: user === null || user === void 0 ? void 0 : user._id, email: email, role: user.role }, REFRESH_TOKEN, { expiresIn: "7d" } // 7 days
            );
            yield (0, general_1.save_refresh_token)(user._id, refreshToken);
            return res
                .status(200)
                .cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
            })
                .json({ data: accessToken, message: "Login sucessful" });
        }
        catch (error) {
            logger_1.default.error(error.message);
            res.status(500).json({ error: error.message });
        }
    });
}
// forget password section
function getEmailController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email } = req.body;
            logger_1.default.info("Reset email ", email);
            const { error } = validation_1.emailSchema.validate(req.body);
            if (error)
                return res.status(401).send(error.details[0].message);
            const user = yield (0, authService_1.getEmailService)(email);
            if (!user)
                return res.status(400).json({ message: "User not found" });
            const result = yield (0, generateOtpEmail_1.generateOtpEmail)(res, email);
            return res
                .status(200)
                .json({ message: "OTP sent successfully", data: result });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
}
function verifyOtpController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { otp } = req.body;
            const result = yield (0, authService_1.verifyOtpService)(otp);
            if (!result) {
                throw new Error("Fail to verify");
            }
            res.status(200).json({ message: "success!!" });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
}
function resetPasswordController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { password, email } = req.body;
            const hashedpassword = (0, sha1_1.default)(password);
            const { error } = validation_1.updatePasswordSchema.validate({
                password,
            });
            if (error)
                return res.status(400).send(error.details.map((err) => err.message));
            const result = yield (0, authService_1.resetPasswordService)(hashedpassword, email);
            if (!result)
                throw new Error("Fial to update password");
            res.status(200).json({ message: "Password reset successfully" });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
            throw new Error(error.message);
        }
    });
}
