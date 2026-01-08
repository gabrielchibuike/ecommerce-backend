"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ProductSchema = new mongoose_1.default.Schema({
    product_gender: {
        type: String,
        enum: ["Women", "Men", "Unisex"],
        required: true,
    },
    product_category: { type: String, required: true },
    sub_category: { type: String, required: true },
    product_name: { type: String, required: true },
    description: { type: String },
    color: { type: [String], required: true },
    size: { type: [String], required: true },
    tags: { type: [String], required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, required: true },
    status: {
        type: String,
        required: true,
        enum: ["Available", "Unavailable"],
        default: "Available",
    },
    product_image: { type: [String] },
    visible: { type: Boolean, default: true },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
}, { timestamps: true });
const ProductDetails = mongoose_1.default.model("Products", ProductSchema);
exports.default = ProductDetails;
