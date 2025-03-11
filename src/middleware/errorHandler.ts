import Express, { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

interface customError extends Error {
  status: number;
}

const errorHandler = (
  err: customError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(err.stack);

  res
    .status(err.status || 500)
    .json({ message: err.message || "internal server error" });
};

export { errorHandler };
