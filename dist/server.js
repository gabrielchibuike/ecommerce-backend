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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const Routes_1 = __importDefault(require("./Routes"));
const refreshToken_1 = require("./middleware/refreshToken");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
const rate_limiter_flexible_1 = require("rate-limiter-flexible");
const redisClient_1 = __importDefault(require("./redisClient"));
const errorHandler_1 = require("./middleware/errorHandler");
const logger_1 = __importDefault(require("./config/logger"));
const aiProductController_1 = require("./controllers/aiProductController");
dotenv_1.default.config();
const PORT = process.env.PORT;
// connetion to database
mongoose_1.default
    .connect(process.env.MONGODB_CONNECTION || "mongodb://localhost:27017/Ecommerce")
    .then(() => logger_1.default.info("Connected to mongoDb"))
    .catch((err) => logger_1.default.error("mongo connection error", err));
app.use((0, helmet_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.use(express_1.default.static("src/uploads"));
app.use((req, res, next) => {
    try {
        logger_1.default.info(`Recieved ${req.method} request to ${req.url} `);
        logger_1.default.info(`Request body, ${req.body}  `);
        console.log("No issue here");
        next();
    }
    catch (err) {
        logger_1.default.error("Unhandle Rejection", err);
    }
});
// DDos protection
const rateLimiter = new rate_limiter_flexible_1.RateLimiterRedis({
    storeClient: redisClient_1.default,
    keyPrefix: "middleware",
    points: 10,
    duration: 2,
});
app.use((req, res, next) => {
    rateLimiter
        .consume(req.ip)
        .then(() => next())
        .catch(() => {
        logger_1.default.warn("Rate limit exceed for ip :" + req.ip);
        res
            .status(429)
            .json({ message: "Too many requests. Please try again later." });
    });
});
app.use("/api", Routes_1.default);
app.post("/api/createProductFromUrl", aiProductController_1.createProductFromUrl);
app.get("/api/refreshToken", refreshToken_1.verifyRefreshToken);
app.use(errorHandler_1.errorHandler);
app.listen(PORT || 5000, () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.default.info(`Server is running on port:  ${PORT}`);
    }
    catch (err) {
        logger_1.default.error("Unhandle Rejection", err);
    }
}));
