import express, { Request, Response, NextFunction } from "express";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { find_refresh_token } from "./general";

export async function verifyRefreshToken(req: Request, res: Response) {
  const refreshToken = req.cookies.refreshToken;
  console.log(refreshToken);

  if (!refreshToken) return res.status(403).send("Refresh token not found");

  try {
    const payload = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_PRIVATE_KEY!
    ) as any;

    // Validate refresh token in database
    const storedToken = await find_refresh_token(payload.id, refreshToken);
    if (!storedToken) return res.status(403).send("Invalid refresh token");

    // Generate a new access token
    const accessToken = jwt.sign(
      { id: payload.id, email: payload.email },
      process.env.ACCESS_TOKEN_PRIVATE_KEY! as string,
      { expiresIn: "30s" }
    );

    res.status(200).json({ accessToken });
  } catch (error: any) {
    res.status(403).send("Invalid or expired refresh token");
  }
}
