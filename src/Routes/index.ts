import express, { Request, Response } from "express";
import adminRoutes from "./admin";
import userRoutes from "./users";

const allRoutes = express.Router();

allRoutes.use("/api", adminRoutes);

allRoutes.use("/api", userRoutes);

export default allRoutes;
