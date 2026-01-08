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
exports.verifyRefreshToken = verifyRefreshToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const general_1 = require("../utils/general");
function verifyRefreshToken(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("server hit");
        const refreshToken = req.cookies.refreshToken;
        console.log(refreshToken, "refreshToken");
        if (!refreshToken)
            return res.status(403).json({ message: "Refresh token not found" });
        try {
            const payload = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_PRIVATE_KEY);
            // Validate refresh token in database
            const storedToken = yield (0, general_1.find_refresh_token)(payload.id, refreshToken);
            if (!storedToken)
                return res.status(403).send("Invalid refresh token");
            // Generate a new access token
            const accessToken = jsonwebtoken_1.default.sign(
            // @ts-ignore
            { id: payload.id, email: payload.email, role: payload.role }, process.env.ACCESS_TOKEN_PRIVATE_KEY, { expiresIn: "1d" });
            res
                .status(200)
                .json({ data: accessToken, message: "New access token created." });
        }
        catch (error) {
            res.status(403).send("Invalid or expired refresh token");
        }
    });
}
