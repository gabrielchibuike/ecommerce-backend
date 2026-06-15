"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const adminSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profileImg: { type: String },
    shippingAddress: { type: [] },
    otp: { type: String },
    dateCreated: { type: Date, default: Date.now() },
    dateUpdated: { type: Date, default: Date.now() },
    visible: { type: Boolean, default: true },
});
const adminPage = mongoose_1.default.model("admin_info", adminSchema);
exports.default = adminPage;
