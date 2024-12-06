import express, { Request, Response } from "express";

import {
  readSavedItem_controller,
  removeSavedItem_controller,
  saveItem_controller,
} from "../../controllers/user.saveItem";

const userSavedItem = express.Router();

userSavedItem.post("/saveItem", saveItem_controller);

userSavedItem.get("/getItem/:userId", readSavedItem_controller);

userSavedItem.delete("/deleteItem/:userId/:itemId", removeSavedItem_controller);

export default userSavedItem;
