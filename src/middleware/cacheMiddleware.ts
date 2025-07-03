import { Request, Response, NextFunction } from "express";
import redis from "../redisClient";
import { logger } from "../utils/logger";

export const cacheMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const key = req.originalUrl; // Unique cache key for each request

  console.log(key, "this is key");

  try {
    const cachedData = await redis.get(key);
    logger.info(cachedData);
    if (cachedData) {
      logger.info("Serving from cache");
      return res.json(JSON.parse(cachedData)); // Serve cached data
    } else {
      logger.info("Fetching from database...");
      res.locals.cacheKey = key; // Store key for later use
    }

    next();
  } catch (error) {
    logger.error("Redis Cache Error:", error);
    next();
  }
};
