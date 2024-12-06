import express, { Request, Response } from "express";
import usersAuth from "./user.info";
import usersCart from "./user.cart";
import usersProduct from "./user.products";
import userSavedItem from "./user.saveItem";
import orderRoute from "./user.order";

const userRoutes = express.Router();

userRoutes.use("/user/auth/", usersAuth);

userRoutes.use("/user/cart", usersCart);

userRoutes.use("/user/order", orderRoute);

userRoutes.use("/user/products", usersProduct);

userRoutes.use("/user/saveItem", userSavedItem);

export default userRoutes;
