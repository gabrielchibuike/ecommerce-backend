"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cartController_1 = require("../controllers/cartController");
const cartRoute = express_1.default.Router();
cartRoute.post("/addItem", cartController_1.addCartController);
cartRoute.get("/getItem/:userId", cartController_1.getCartController);
cartRoute.put("/editItem/:userId/:itemId", cartController_1.updateCartController);
cartRoute.delete("/deleteItem/:userId/:itemId", cartController_1.deleteCartController);
exports.default = cartRoute;
