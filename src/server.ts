import express, { Request, Response } from "express";
import cors from "cors";
const app = express();
import dotenv from "dotenv";
import mongoose from "mongoose";
import allRoutes from "./Routes";
import { verifyRefreshToken } from "./utils/refreshToken";
import cookieParser from "cookie-parser";
dotenv.config();

// connetion to database
mongoose.connect(
  process.env.MONGODB_CONNECTION || "mongodb://localhost:27017/Ecommerce"
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(express.static("uploads"));
app.use(cookieParser());

app.use("/", allRoutes);

app.get("/getToken", (req, res) => {
  res.send("My Token");
});

app.post("/auth/refresh", verifyRefreshToken);

app.listen(process.env.PORT || 5000, async () => {
  try {
    console.log("server is running on port " + process.env.PORT);
  } catch (err) {
    console.log(err);
  }
});
