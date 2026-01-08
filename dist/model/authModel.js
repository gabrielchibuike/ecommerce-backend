"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    firstname: { type: String, require: true },
    lastname: { type: String, require: true },
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
    role: { type: String, enum: ["user", "admin"], default: "user" },
    savedItem: {
        type: [
            {
                productId: {
                    type: mongoose_1.default.Schema.Types.ObjectId,
                    ref: "Products",
                    required: true,
                },
                quantity: { type: Number, required: true, min: 1 },
            },
        ],
    },
    address: [
        {
            street: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            postalCode: { type: String, required: true },
            country: { type: String, required: true },
        },
    ],
    refreshToken: { type: String },
    otp: { type: String },
    dateCreated: { type: Date, default: Date.now() },
    dateUpdated: { type: Date, default: Date.now() },
    visible: { type: Boolean, default: true },
});
const userDetails = mongoose_1.default.model("User", userSchema);
exports.default = userDetails;
