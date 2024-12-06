import express, { Request, Response } from "express";
import product from "./admin.product";
import adminOrder from "../../model/orders.model";
import adminOrderRoute from "./admin.order";

const adminRoutes = express.Router();

adminRoutes.use("/admin/products/", product);
adminRoutes.use("/admin/orders/", adminOrderRoute);

export default adminRoutes;
