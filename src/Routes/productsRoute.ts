import express, { Request, Response } from "express";
import {
  create_product_controller,
  delete_product_controller,
  edit_product_controller,
  get_product_controller,
  getOne_product_controller,
} from "../controllers/productsController";
import { authorizePermission, verifyToken } from "../middleware/verifyJwt";
import { upload } from "../config/multer.config";
import { cacheMiddleware } from "../middleware/cacheMiddleware";

const productRoute = express.Router();

productRoute.post(
  "/create_product",
  upload.array("files", 4),
  create_product_controller
);

productRoute.get(
  "/get_products",
  cacheMiddleware,
  // authorizePermission("admin", "user"),
  get_product_controller
);

productRoute.get("/get_product/:id", getOne_product_controller);

productRoute.put(
  "/edit_product/:id",
  upload.array("files", 4),
  // authorizePermission("admin"),
  edit_product_controller
);

productRoute.delete("/delete_product", delete_product_controller);

export default productRoute;
