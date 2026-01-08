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
exports.cacheMiddleware = void 0;
const redisClient_1 = __importDefault(require("../redisClient"));
const logger_1 = __importDefault(require("../config/logger"));
const cacheMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const key = req.originalUrl; // Unique cache key for each request
    console.log(key, "this is key");
    try {
        const cachedData = yield redisClient_1.default.get(key);
        logger_1.default.info(cachedData);
        if (cachedData) {
            logger_1.default.info("Serving from cache");
            return res.json(JSON.parse(cachedData)); // Serve cached data
        }
        else {
            logger_1.default.info("Fetching from database...");
            res.locals.cacheKey = key; // Store key for later use
        }
        next();
    }
    catch (error) {
        logger_1.default.error("Redis Cache Error:", error);
        next();
    }
});
exports.cacheMiddleware = cacheMiddleware;
