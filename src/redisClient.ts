import Redis from "ioredis";
import { logger } from "./utils/logger";

const redis = new Redis({
  //   host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_CONNECTION) || 6379,
  retryStrategy: (times) => Math.min(times * 50, 2000), // Reconnect strategy
});

redis.on("connect", () => logger.info("Connected to Redis"));
redis.on("error", (err) => logger.error("Redis Error:", err));

export default redis;
