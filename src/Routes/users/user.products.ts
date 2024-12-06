import express, { Request, Response } from "express";

import {
  all_product_controller,
  product_cart_controller,
  single_product_controller,
} from "../../controllers/user.products";

const usersProduct = express.Router();

usersProduct.get("/allProducts", all_product_controller);

usersProduct.get("/singleProducts/:productId", single_product_controller);

usersProduct.get("/productCategory/:cat", product_cart_controller);

export default usersProduct;
