import express from "express";
import {
  addReviewController,
  getReviewsController,
  getAllReviewsController,
} from "../controllers/reviewController";
import { verifyToken } from "../middleware/verifyJwt";

const reviewRoute = express.Router();

reviewRoute.post("/add", verifyToken, addReviewController);
reviewRoute.get("/all", verifyToken, getAllReviewsController);
reviewRoute.get("/get/:productId", verifyToken, getReviewsController);

export default reviewRoute;
