import express, { Request, Response } from "express";

import {
  delete_shipping_address_controller,
  edit_shipping_address_controller,
  get_shipping_address_controller,
  shipping_address_controller,
} from "../controllers/shippingAddressContoller";

const shippingRoute = express.Router();

shippingRoute.post("/createShippingAddress", shipping_address_controller);

shippingRoute.get("/getShippingAddress", get_shipping_address_controller);

shippingRoute.put("/editShippingAddress", edit_shipping_address_controller);

shippingRoute.delete(
  "/deleteShippingAddress",
  delete_shipping_address_controller
);

export default shippingRoute;
