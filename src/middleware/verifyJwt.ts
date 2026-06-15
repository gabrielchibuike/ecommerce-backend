import express, { Request, Response, NextFunction } from "express";
import jwt, { JsonWebTokenError } from "jsonwebtoken";

interface UserToken {
  id: string;
  email: string;
  role: string;
}

interface newRequest extends Request {
  user?: UserToken;
}

export async function verifyToken(
  req: newRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader =
      req.headers["x-auth-token"] || req.headers["authorization"];

    if (!authHeader) return res.status(401).send("Access Denied!!");

    let tokenString = (authHeader as string) || "";
    if (tokenString.startsWith("SFX_Bearer_")) {
      tokenString = tokenString.split("SFX_Bearer_")[1] as string;
    } else if (tokenString.startsWith("Bearer ")) {
      tokenString = tokenString.split("Bearer ")[1] as string;
    }

    const token = jwt.verify(
      tokenString,
      process.env.ACCESS_TOKEN_PRIVATE_KEY || "access_secret"
    ) as UserToken;

    req.user = token;

    next();
  } catch (err) {
    // console.log(err);
    if (err instanceof JsonWebTokenError) {
      console.log(err);

      return res.status(403).json({ message: "Forbidden", statusCode: 403 }); // Forbidden
    }
  }
}

export const authorizePermission =
  (...roles: string[]) =>
  (req: newRequest, res: Response, next: NextFunction) => {
    try {
      if (!roles.includes(req.user?.role as string)) {
        return res.status(403).json({ error: "Access denied" });
      }
      next();
    } catch (err) {
      console.log(err);

      res.status(401).json({ error: "Invalid token" });
    }
  };
