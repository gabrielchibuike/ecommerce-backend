"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const saveItemSchema = new mongoose_1.default.Schema({
    userId: {
        type: String,
        ref: "User",
        required: true,
    },
    items: [
        {
            productId: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "Products",
                required: true,
            },
            quantity: { type: Number, required: true, min: 1 },
        },
    ],
}, { timestamps: true });
const SavedItem = mongoose_1.default.model("SavedItem", saveItemSchema);
exports.default = SavedItem;
