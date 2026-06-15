"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("../controllers/orderController");
const axios_1 = __importDefault(require("axios"));
const logger_1 = __importDefault(require("../config/logger"));
const orderRoute = express_1.default.Router();
// orderRoute.post("/create_order", create_order_controller);
// orderRoute.post("/view_orders", get_order_controller);
// orderRoute.post("/view_single_orders/:id", getOne_order_controller);
// orderRoute.post("/delete_orders/:id", getOne_order_controller);
require("dotenv").config(); // Load environment variables
// Initialize a Paystack transaction
orderRoute.post("/initialize-payment", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { email, amount } = req.body;
        console.log(email, amount);
        const response = yield axios_1.default.post("https://api.paystack.co/transaction/initialize", {
            email,
            amount: amount * 100, // Convert amount to Kobo
        }, {
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                "Content-Type": "application/json",
            },
        });
        res.json(response.data); // Send the Paystack response to frontend
    }
    catch (error) {
        if (error) {
            logger_1.default.error("Paystack Error:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
            res.status(500).json({
                error: ((_b = error.response) === null || _b === void 0 ? void 0 : _b.data) || error.message,
            });
        }
        else {
            logger_1.default.error("Paystack Error:", error.message);
            res.status(500).json({ error: "Unexpected error occurred" });
        }
    }
}));
// Verify payment
orderRoute.get("/verify-payment/:reference", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { reference } = req.params;
        const response = yield axios_1.default.get(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                "Content-Type": "application/json",
            },
        });
        if (response.data.data.status === "success") {
            res.json({
                success: true,
                message: "Payment successful",
                data: response.data.data,
            });
        }
        else {
            console.log(response.data.data);
            res.status(400).json({ success: false, message: "Payment failed" });
        }
    }
    catch (error) {
        if (error) {
            logger_1.default.error("Paystack Error:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
            return res.status(500).json({
                error: ((_b = error.response) === null || _b === void 0 ? void 0 : _b.data) || error.message,
            });
        }
        if (error instanceof Error) {
            logger_1.default.error("Unexpected Error:", error.message);
            return res.status(500).json({
                error: error.message,
            });
        }
        logger_1.default.error("Unknown error occurred");
        return res.status(500).json({
            error: "Unknown error occurred",
        });
    }
}));
exports.default = orderRoute;
