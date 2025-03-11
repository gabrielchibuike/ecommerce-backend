import express, { Request, Response } from "express";

import {
  readSavedItem_controller,
  removeSavedItem_controller,
  saveItem_controller,
} from "../controllers/saveItemController";

const savedItemRoute = express.Router();

savedItemRoute.post("/saveItem", saveItem_controller);

savedItemRoute.get("/getItem/:userId", readSavedItem_controller);

savedItemRoute.delete(
  "/deleteItem/:userId/:itemId",
  removeSavedItem_controller
);

export default savedItemRoute;
