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
    if (!authHeader) return res.status(401).send("Token Required");
    const verifyExpiedTime = jwt.verify(
      authHeader as unknown as string,
      process.env.ACCESS_TOKEN_PRIVATE_KEY!
    );
    req.user = verifyExpiedTime;
    next();
  } catch (err) {
    console.log(err);
    if (err instanceof JsonWebTokenError) {
      return res.status(403).send(err.message); // Forbidden
    }
  }
}
