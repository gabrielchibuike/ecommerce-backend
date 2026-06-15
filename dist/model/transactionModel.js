"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const transactionSchema = new mongoose_1.default.Schema({
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: true },
    orderId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Order",
        required: true,
    },
    paymentMethod: { type: String, required: true }, // e.g., "Paystack", "Stripe"
    transactionReference: { type: String, required: true }, // From payment gateway
    amount: { type: Number, required: true },
    status: {
        type: String,
        enum: ["Pending", "Success", "Failed", "Refunded"],
        default: "Pending",
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Transaction", transactionSchema);
