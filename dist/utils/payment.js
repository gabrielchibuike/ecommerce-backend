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
exports.initiatePayment = initiatePayment;
const axios_1 = __importDefault(require("axios"));
const logger_1 = __importDefault(require("../config/logger"));
//  const callbackUrl = `http://localhost:3000/verify?reference=${order._id}`;
function initiatePayment(email, amount, order) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            // initiate payment on Paystack
            const response = yield axios_1.default.post("https://api.paystack.co/transaction/initialize", {
                email,
                amount: amount * 100, // Convert amount to Kobo
                callback_url: `${process.env.PAYSTACK_CALLBACK_URL}?reference=${order._id}`,
            }, {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    "Content-Type": "application/json",
                },
            });
            // Send the Paystack response to frontend
            return response.data;
        }
        catch (error) {
            if (error.response) {
                logger_1.default.error("Paystack Error:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
            }
            else {
                logger_1.default.error("Paystack Error:", error.message);
            }
        }
    });
}
