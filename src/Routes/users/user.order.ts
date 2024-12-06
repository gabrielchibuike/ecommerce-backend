import express, { Request, Response } from "express";
import {
  cancle_order_controller,
  create_order_controller,
  viewOne_order_controller,
} from "../../controllers/user.order";

const orderRoute = express.Router();

orderRoute.post("/create_order", create_order_controller);

// orderRoute.post("/view_orders", view_order_controller);

orderRoute.get("/view_order/:userId", viewOne_order_controller);

orderRoute.put("/cancle_order/:userId", cancle_order_controller);

export default orderRoute;
