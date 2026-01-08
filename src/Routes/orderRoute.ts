import express from "express";
import {
  cancle_order_controller,
  createOrderController,
  delete_order_controller,
  getAllOrdersController,
  getCustomerOrdersController,
  getCustomerProfileController,
  getCustomerStatsController,
  getMyOrdersController,
  getOrderByIdController,
  getOrderStatsController,
  paystackWebhookController,
  verifyPaymentController,
  viewOne_order_controller,
} from "../controllers/orderController";
import { verifyToken } from "../middleware/verifyJwt";

const orderRoute = express.Router();

// Order management routes
orderRoute.post("/create", verifyToken, createOrderController);
orderRoute.get("/status/:reference", verifyToken, verifyPaymentController);
orderRoute.get("/user/:userId", verifyToken, viewOne_order_controller);
orderRoute.put("/cancel/:id", verifyToken, cancle_order_controller);
orderRoute.get("/my", verifyToken, getMyOrdersController);
orderRoute.delete("/:userId", verifyToken, delete_order_controller);

// Admin routes
orderRoute.get("/admin/all", getAllOrdersController);
orderRoute.get("/admin/single/:id", getOrderByIdController);
orderRoute.get("/admin/customers", getCustomerStatsController);
orderRoute.get("/admin/stats", getOrderStatsController);
orderRoute.get("/admin/customer/:id", getCustomerProfileController);
orderRoute.get("/admin/customer/:id/orders", getCustomerOrdersController);

// Paystack Webhook
orderRoute.post("/webhook", paystackWebhookController);

export default orderRoute;
