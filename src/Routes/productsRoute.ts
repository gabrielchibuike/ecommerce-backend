import express, { Request, Response } from "express";
import {
  create_product_controller,
  delete_product_controller,
  edit_product_controller,
  featuerd_product_controller,
  get_product_controller,
  getByCategory_controller,
  getOne_product_controller,
  search_product_controller,
} from "../controllers/productsController";
import { authorizePermission, verifyToken } from "../middleware/verifyJwt";
// import { upload } from "../config/multer.config";
import { cacheMiddleware } from "../middleware/cacheMiddleware";
import { upload } from "../config/cloudinary.config";

const productRoute = express.Router();

productRoute.post(
  "/create_product",
  upload.array("files", 4),
  create_product_controller
);

productRoute.get(
  "/get_featured_products",
  verifyToken,
  // authorizePermission("admin", "user"),
  featuerd_product_controller
);

productRoute.get(
  "/search",
  verifyToken,
  // authorizePermission("admin", "user"),
  search_product_controller
);

productRoute.get(
  "/get_products",
  verifyToken,
  cacheMiddleware,
  // authorizePermission("admin", "user"),
  get_product_controller
);

productRoute.get("/get_product/:id", getOne_product_controller);

productRoute.get("/get_products/:slug", getByCategory_controller);

productRoute.put(
  "/edit_product/:id",
  upload.array("files", 4),
  // authorizePermission("admin"),
  edit_product_controller
);

productRoute.delete("/delete_product", delete_product_controller);

export default productRoute;
