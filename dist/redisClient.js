"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
const logger_1 = __importDefault(require("./config/logger"));
const redis = new ioredis_1.default(process.env.REDIS_URL || "redis://127.0.0.1:6379", {
// retryStrategy: (times) => Math.min(times * 50, 2000), // Reconnect strategy
});
redis.on("connect", () => logger_1.default.info("Connected to Redis"));
redis.on("error", (err) => logger_1.default.error("Redis Error:", err));
exports.default = redis;
