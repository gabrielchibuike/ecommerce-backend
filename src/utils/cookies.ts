// config/cookies.ts
import { CookieOptions } from "express";

const isProduction = process.env.NODE_ENV === "production";

export const cookieConfig: CookieOptions = {
  httpOnly: true, // JS cannot access cookie — prevents XSS theft
  secure: isProduction, // HTTPS only in production
  sameSite: isProduction ? "strict" : "lax", // CSRF protection
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  path: "/", // cookie sent on all routes
  //   domain: isProduction
  //     ? process.env.COOKIE_DOMAIN  // e.g ".yourapp.com" — note the leading dot
  //     : undefined,                 // localhost needs no domain
};

// Separate config for short-lived sensitive cookies (e.g. reset password)
export const shortLivedCookieConfig: CookieOptions = {
  ...cookieConfig,
  maxAge: 15 * 60 * 1000, // 15 minutes
};

// Config for clearing/expiring a cookie
export const clearCookieConfig: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "strict" : "lax",
  path: "/",
  domain: isProduction ? process.env.COOKIE_DOMAIN : undefined,
};
