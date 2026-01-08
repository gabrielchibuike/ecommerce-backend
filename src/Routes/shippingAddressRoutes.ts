import express from "express";
import {
  delete_shipping_address_controller,
  edit_shipping_address_controller,
  get_shipping_address_controller,
  shipping_address_controller,
} from "../controllers/shippingAddressContoller";
import { verifyToken } from "../middleware/verifyJwt";

const shippingRoute = express.Router();

shippingRoute.post("/", verifyToken, shipping_address_controller);

shippingRoute.get("/", verifyToken, get_shipping_address_controller);

shippingRoute.put(
  "/:shippingAddressId",
  verifyToken,
  edit_shipping_address_controller
);

shippingRoute.delete(
  "/:shippingAddressId",
  verifyToken,
  delete_shipping_address_controller
);

export default shippingRoute;
