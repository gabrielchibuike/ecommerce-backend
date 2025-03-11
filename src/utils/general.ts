import mongoose from "mongoose";
import userDetails from "../model/authModel";

export async function save_refresh_token(userId: string, refreshToken: string) {
  // Save the refreshToken against the userId in your database
  const res = await userDetails.updateOne(
    { _id: userId },
    { refreshToken },
    { new: true }
  );
  return res;
}

export async function find_refresh_token(userId: string, refreshToken: string) {
  // Find and return the refreshToken for the user
  const res = await userDetails.findOne({ refreshToken: refreshToken });
  return res;
}
