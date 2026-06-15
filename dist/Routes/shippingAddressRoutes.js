"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const shippingAddressContoller_1 = require("../controllers/shippingAddressContoller");
const shippingRoute = express_1.default.Router();
shippingRoute.post("/createShippingAddress", shippingAddressContoller_1.shipping_address_controller);
shippingRoute.get("/getShippingAddress", shippingAddressContoller_1.get_shipping_address_controller);
shippingRoute.put("/editShippingAddress", shippingAddressContoller_1.edit_shipping_address_controller);
shippingRoute.delete("/deleteShippingAddress", shippingAddressContoller_1.delete_shipping_address_controller);
exports.default = shippingRoute;
