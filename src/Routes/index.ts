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
import storeRoutes from "./storeRoutes";
import reviewRoute from "./reviewRoute";
import shipmentRoute from "./shipmentRoute";
import dashboardRoute from "./dashboardRoute";

const allRoutes = express.Router();

allRoutes.use("/auth/", authRoute);

allRoutes.use("/cart", cartRoute);

allRoutes.use("/order", orderRoute);

allRoutes.use("/product", productRoute);

allRoutes.use("/saveItem", savedItemRoute);

allRoutes.use("/shippingAddress", shippingRoute);

allRoutes.use("/store", storeRoutes);

allRoutes.use("/review", reviewRoute);

allRoutes.use("/shipment", shipmentRoute);

allRoutes.use("/dashboard", dashboardRoute);

export default allRoutes;
