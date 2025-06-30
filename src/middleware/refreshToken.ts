import express, { Request, Response, NextFunction } from "express";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { find_refresh_token } from "../utils/general";

export async function verifyRefreshToken(req: Request, res: Response) {
  console.log("server hit");

  const refreshToken = req.cookies.refreshToken;

  console.log(refreshToken);

  if (!refreshToken)
    return res.status(403).json({ message: "Refresh token not found" });

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
      // @ts-ignore
      { id: payload.id, email: payload.email, role: payload.role },
      process.env.ACCESS_TOKEN_PRIVATE_KEY! as string,
      { expiresIn: "1d" }
    );

    res
      .status(200)
      .json({ data: accessToken, message: "New access token created." });
  } catch (error: any) {
    res.status(403).send("Invalid or expired refresh token");
  }
}
