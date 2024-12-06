import express, { Request, Response } from "express";
import {
  create_order_controller,
  get_order_controller,
  getOne_order_controller,
} from "../../controllers/admin.order";

const adminOrderRoute = express.Router();

adminOrderRoute.post("/create_order", create_order_controller);

adminOrderRoute.post("/view_orders", get_order_controller);

adminOrderRoute.post("/view_single_orders/:id", getOne_order_controller);

adminOrderRoute.post("/delete_orders/:id", getOne_order_controller);

export default adminOrderRoute;
