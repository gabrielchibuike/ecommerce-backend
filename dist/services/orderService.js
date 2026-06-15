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
exports.create_order_service = create_order_service;
exports.find_existing_order = find_existing_order;
exports.viewOne_order_service = viewOne_order_service;
exports.cancle_order_service = cancle_order_service;
exports.delete_order_service = delete_order_service;
const orderModel_1 = __importDefault(require("../model/orderModel"));
function create_order_service(_a) {
    return __awaiter(this, arguments, void 0, function* ({ userId, items, shippingAddress, paymentStatus, transactionId, status, totalPrices, }) {
        const result = yield orderModel_1.default.create({
            userId,
            items,
            shippingAddress,
            paymentStatus,
            transactionId,
            status,
            totalPrices,
        });
        return result;
    });
}
function find_existing_order(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield orderModel_1.default.findOne({ userId });
        return result;
    });
}
// export async function view_order_service() {
//   const result = await order.find();
//   return result;
// }
function viewOne_order_service(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield orderModel_1.default.findOne({ userId });
        return result;
    });
}
function cancle_order_service(userId, status) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield orderModel_1.default.updateOne({ userId }, { status: status }, { new: true });
        return result;
    });
}
function delete_order_service(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield orderModel_1.default.deleteOne({ userId });
        return result;
    });
}
