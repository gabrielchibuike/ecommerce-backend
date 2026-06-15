import express from "express";
import {
  getAllShipmentsController,
  getShipmentByIdController,
  updateShipmentStatusController,
  assignCourierController,
  trackShipmentByOrderIdController,
} from "../controllers/shipmentController";

const shipmentRoute = express.Router();

// Admin routes
shipmentRoute.get("/admin/all", getAllShipmentsController);
shipmentRoute.get("/:id", getShipmentByIdController);
shipmentRoute.patch("/status/:id", updateShipmentStatusController);
shipmentRoute.patch("/assign-courier/:id", assignCourierController);

// Customer routes (tracking)
shipmentRoute.get("/track/:id", trackShipmentByOrderIdController);

export default shipmentRoute;
