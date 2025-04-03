import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
const app = express();
import dotenv from "dotenv";
import mongoose from "mongoose";
import allRoutes from "./Routes";
import { verifyRefreshToken } from "./middleware/refreshToken";
import cookieParser from "cookie-parser";
import { verifyToken } from "./middleware/verifyJwt";
import helmet from "helmet";
import { logger } from "./utils/logger";
import { RateLimiterRedis } from "rate-limiter-flexible";
import redisClient from "./redisClient";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

const PORT = process.env.PORT;

// connetion to database
mongoose
  .connect(
    process.env.MONGODB_CONNECTION || "mongodb://localhost:27017/Ecommerce"
  )
  .then(() => logger.info("Connected to mongoDb"))
  .catch((err) => logger.error("mongo connection error", err));

app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(express.static("src/uploads"));

app.use((req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info(`Recieved ${req.method} request to ${req.url} `);
    logger.info(`Request body, ${req.body}  `);
    console.log("No issue here");
    next();
  } catch (err) {
    logger.error("Unhandle Rejection", err);
  }
});

// DDos protection
const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "middleware",
  points: 10,
  duration: 2,
});

app.use((req: Request, res: Response, next: NextFunction) => {
  rateLimiter
    .consume(req.ip as string)
    .then(() => next())
    .catch(() => {
      logger.warn("Rate limit exceed for ip :" + req.ip);
      res
        .status(429)
        .json({ message: "Too many requests. Please try again later." });
    });
});

app.use("/api", allRoutes);

app.post("/auth/refresh", verifyRefreshToken);

app.use(errorHandler);

app.listen(PORT || 5000, async () => {
  try {
    logger.info(`Server is running on port:  ${PORT}`);
  } catch (err) {
    logger.error("Unhandle Rejection", err);
  }
});
