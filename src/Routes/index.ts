import express, { Request, Response } from "express";
// import orderRoute from "./orderRoute";
import cartRoute from "./cartRoute";
import authRoute from "./authRoute";
import productRoute from "./productsRoute";
import savedItemRoute from "./saveItemRoute";
import { verifyToken } from "../middleware/verifyJwt";
import orderRoute from "./orderRoute";
import ShippingAddress from "../model/shippingAddressModel";
import shippingRoute from "./shippingAddressRoutes";

const allRoutes = express.Router();

allRoutes.use("/auth/", authRoute);

allRoutes.use("/cart", cartRoute);

allRoutes.use("/order", orderRoute);

allRoutes.use("/products", productRoute);

allRoutes.use("/saveItem", savedItemRoute);

allRoutes.use("/shippingAddress", shippingRoute);

export default allRoutes;
