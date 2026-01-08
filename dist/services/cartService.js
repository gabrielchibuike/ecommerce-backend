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
exports.addCartService = addCartService;
exports.findExitingCartItem = findExitingCartItem;
exports.getCartService = getCartService;
exports.deleteCartService = deleteCartService;
const cartModel_1 = __importDefault(require("../model/cartModel"));
function addCartService(_a) {
    return __awaiter(this, arguments, void 0, function* ({ userId, items }) {
        const result = yield cartModel_1.default.create({
            userId,
            items,
        });
        return result;
    });
}
function findExitingCartItem(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const isExisting = yield cartModel_1.default.findOne({
            userId,
        });
        return isExisting;
    });
}
function getCartService(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const cartItem = yield cartModel_1.default.findOne({
            userId,
        });
        return cartItem;
    });
}
// export async function updateCartService(userId: string) {
//   const cartItem = await Cart.findOne({
//     userId,
//   });
//   return cartItem;
// }
function deleteCartService(userId, item) {
    return __awaiter(this, void 0, void 0, function* () {
        const cartItem = yield cartModel_1.default.updateOne({ userId: userId }, { items: item }, { new: true });
        return cartItem;
    });
}
