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
Object.defineProperty(exports, "__esModule", { value: true });
exports.shipping_address_controller = shipping_address_controller;
exports.get_shipping_address_controller = get_shipping_address_controller;
exports.edit_shipping_address_controller = edit_shipping_address_controller;
exports.delete_shipping_address_controller = delete_shipping_address_controller;
const shippingAddressService_1 = require("../services/shippingAddressService");
const validation_1 = require("../utils/validation");
function shipping_address_controller(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { firstName, lastName, phone, email, streetAddress, additionalInfo, city, state, } = req.body;
        try {
            const { error } = validation_1.shippingAddressSchema.validate({
                firstName,
                lastName,
                phone,
                email,
                streetAddress,
                additionalInfo,
                city,
                state,
            });
            if (error)
                return res.status(400).send(error.details.map((err) => err.message));
            //   console.log(error.details.map((err) => err.message));
            const result = yield (0, shippingAddressService_1.shipping_address_service)({
                firstName,
                lastName,
                phone,
                email,
                streetAddress,
                additionalInfo,
                city,
                state,
            });
            res.status(200).json({ data: result, message: "Created Sucessfully" });
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ error: err.message });
        }
    });
}
function get_shipping_address_controller(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId } = req.params;
        try {
            const result = yield (0, shippingAddressService_1.get_shipping_address_service)(userId);
            res.status(200).send(result);
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ error: err.message });
        }
    });
}
function edit_shipping_address_controller(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { shippingAddressId } = req.params;
        const { firstName, lastName, phone, email, streetAddress, additionalInfo, city, state, } = req.body;
        try {
            const result = yield (0, shippingAddressService_1.edit_shipping_address_service)({
                shippingAddressId,
                firstName,
                lastName,
                phone,
                email,
                streetAddress,
                additionalInfo,
                city,
                state,
            });
            res.status(200).send(result);
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ error: err.message });
        }
    });
}
function delete_shipping_address_controller(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { shippingAddressId } = req.body;
        try {
            yield (0, shippingAddressService_1.delete_shipping_address_service)(shippingAddressId);
            res.status(200).send("Product deleted");
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
}
