import express from "express";
import {
  getDashboardSummaryController,
  getSalesByCategoryController,
  getActivityFeedController,
  getTopSellingProductsController,
  getLatestOffersController,
} from "../controllers/dashboardController";

const dashboardRoute = express.Router();

dashboardRoute.get("/summary", getDashboardSummaryController);
dashboardRoute.get("/sales-by-category", getSalesByCategoryController);
dashboardRoute.get("/activity-feed", getActivityFeedController);
dashboardRoute.get("/top-selling", getTopSellingProductsController);
dashboardRoute.get("/latest-offers", getLatestOffersController);

export default dashboardRoute;
