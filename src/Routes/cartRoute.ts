import express, { Request, Response } from "express";

import {
  add_cart_controller,
  delete_cart_controller,
  edit_cart_controller,
  get_cart_controller,
} from "../controllers/cartController";

const cartRoute = express.Router();

cartRoute.post("/addItem", add_cart_controller);

cartRoute.get("/getItem/:userId", get_cart_controller);

cartRoute.put("/editItem/:userId/:itemId", edit_cart_controller);

cartRoute.delete("/deleteItem/:userId/:itemId", delete_cart_controller);

export default cartRoute;
