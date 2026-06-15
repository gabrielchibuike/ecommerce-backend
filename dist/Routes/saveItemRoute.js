"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const saveItemController_1 = require("../controllers/saveItemController");
const savedItemRoute = express_1.default.Router();
savedItemRoute.post("/saveItem", saveItemController_1.saveItem_controller);
savedItemRoute.get("/getItem/:userId", saveItemController_1.readSavedItem_controller);
savedItemRoute.delete("/deleteItem/:userId/:itemId", saveItemController_1.removeSavedItem_controller);
exports.default = savedItemRoute;
