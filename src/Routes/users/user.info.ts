import express, { Request, Response } from "express";

import {
  create_user_controller,
  login_user_controller,
} from "../../controllers/user.info";

const usersAuth = express.Router();

usersAuth.post("/create_user", create_user_controller);

usersAuth.post("/login", login_user_controller);

// product.get("/get_products", get_product_controller);

// product.get("/get_products/:id", getOne_product_controller);

// product.put("/edit_products/:id", edit_product_controller);

// product.delete("/delete_products/:id", delete_product_controller);

export default usersAuth;
