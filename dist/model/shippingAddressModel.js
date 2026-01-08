"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const shippingAddressSchema = new mongoose_1.default.Schema({
    firstName: { type: String, require: true },
    lastName: { type: String, require: true },
    phone: { type: String, require: true },
    email: { type: String, require: true },
    streetAddress: { type: String, require: true },
    additionalInfo: { type: String, require: true },
    city: { type: String, require: true },
    state: { type: String, require: true },
}, { timestamps: true });
const ShippingAddress = mongoose_1.default.model("shippingAddress", shippingAddressSchema);
exports.default = ShippingAddress;
