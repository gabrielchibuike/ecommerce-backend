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
exports.shipping_address_service = shipping_address_service;
exports.get_shipping_address_service = get_shipping_address_service;
exports.edit_shipping_address_service = edit_shipping_address_service;
exports.delete_shipping_address_service = delete_shipping_address_service;
const shippingAddressModel_1 = __importDefault(require("../model/shippingAddressModel"));
function shipping_address_service(_a) {
    return __awaiter(this, arguments, void 0, function* ({ firstName, lastName, phone, email, streetAddress, additionalInfo, city, state, }) {
        const result = yield shippingAddressModel_1.default.create({
            firstName,
            lastName,
            phone,
            email,
            streetAddress,
            additionalInfo,
            city,
            state,
        });
        return result;
    });
}
function get_shipping_address_service(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield shippingAddressModel_1.default.findById({ _id: userId });
    });
}
function edit_shipping_address_service(_a) {
    return __awaiter(this, arguments, void 0, function* ({ shippingAddressId, firstName, lastName, phone, email, streetAddress, additionalInfo, city, state, }) {
        const result = yield shippingAddressModel_1.default.updateOne({ _id: shippingAddressId }, {
            firstName,
            lastName,
            phone,
            email,
            streetAddress,
            additionalInfo,
            city,
            state,
        }, { new: true });
        return result;
    });
}
function delete_shipping_address_service(shippingAddressId) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield shippingAddressModel_1.default.deleteOne({ _id: shippingAddressId });
        return result;
    });
}
