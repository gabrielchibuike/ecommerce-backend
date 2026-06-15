import express, { Request, Response } from "express";
import {
  addCartController,
  deleteCartController,
  getCartController,
  updateCartController,
  syncCartController,
} from "../controllers/cartController";
import { verifyToken } from "../middleware/verifyJwt";

const cartRoute = express.Router();

cartRoute.post("/addItem", verifyToken, addCartController);

cartRoute.post("/sync", verifyToken, syncCartController);

cartRoute.get("/getItem/:userId", verifyToken, getCartController);

cartRoute.put("/editItem/:userId/:itemId", verifyToken, updateCartController);

cartRoute.delete(
  "/deleteItem/:userId/:itemId",
  verifyToken,
  deleteCartController
);

export default cartRoute;
