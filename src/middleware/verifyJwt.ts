import express, { Request, Response, NextFunction } from "express";
import jwt, { JsonWebTokenError } from "jsonwebtoken";

interface newRequest extends Request {
  user?: string | {};
}

export async function verifyToken(
  req: newRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers["x-auth-token"];

    if (!authHeader) return res.status(401).send("Access Denied!!");

    const token = jwt.verify(
      authHeader as unknown as string,
      process.env.ACCESS_TOKEN_PRIVATE_KEY!
    );

    // @ts-ignore
    req.user = token.role;

    next();
  } catch (err) {
    console.log(err);
    if (err instanceof JsonWebTokenError) {
      console.log(err);

      return res.status(403).send(err.message); // Forbidden
    }
  }
}

export const authorizePermission =
  (...roles: string[]) =>
  (req: newRequest, res: Response, next: NextFunction) => {
    try {
      // @ts-ignore
      if (!roles.includes(req.user)) {
        return res.status(403).json({ error: "Access denied" });
      }
      next();
    } catch (err) {
      console.log(err);

      res.status(401).json({ error: "Invalid token" });
    }
  };
