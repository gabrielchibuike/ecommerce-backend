"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizePermission = void 0;
exports.verifyToken = verifyToken;
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
function verifyToken(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const authHeader = req.headers["x-auth-token"];
            if (!authHeader)
                return res.status(401).send("Access Denied!!");
            const token = jsonwebtoken_1.default.verify(authHeader, process.env.ACCESS_TOKEN_PRIVATE_KEY);
            // @ts-ignore
            req.user = token.role;
            next();
        }
        catch (err) {
            // console.log(err);
            if (err instanceof jsonwebtoken_1.JsonWebTokenError) {
                console.log(err);
                return res.status(403).json({ message: "Forbidden", statusCode: 403 }); // Forbidden
            }
        }
    });
}
const authorizePermission = (...roles) => (req, res, next) => {
    try {
        // @ts-ignore
        if (!roles.includes(req.user)) {
            return res.status(403).json({ error: "Access denied" });
        }
        next();
    }
    catch (err) {
        console.log(err);
        res.status(401).json({ error: "Invalid token" });
    }
};
exports.authorizePermission = authorizePermission;
