import express, { Request, Response } from "express";
import {
  create_product_controller,
  delete_product_controller,
  edit_product_controller,
  get_product_controller,
  getOne_product_controller,
} from "../../controllers/admin.products";
import { verifyToken } from "../../utils/verifyJwt";

const product = express.Router();

product.post("/create_products", create_product_controller);

product.get("/get_products", verifyToken, get_product_controller);

product.get("/get_products/:id", getOne_product_controller);

product.put("/edit_products/:id", edit_product_controller);

product.delete("/delete_products/:id", delete_product_controller);

export default product;
