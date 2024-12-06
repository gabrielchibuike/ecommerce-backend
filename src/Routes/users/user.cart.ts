import express, { Request, Response } from "express";

import {
  add_cart_controller,
  delete_cart_controller,
  edit_cart_controller,
  get_cart_controller,
} from "../../controllers/user.cart";

const usersCart = express.Router();

usersCart.post("/addItem", add_cart_controller);

usersCart.get("/getItem/:userId", get_cart_controller);

usersCart.put("/editItem/:userId/:itemId", edit_cart_controller);

usersCart.delete("/deleteItem/:userId/:itemId", delete_cart_controller);

export default usersCart;
