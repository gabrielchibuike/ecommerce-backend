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
exports.saveItem_controller = saveItem_controller;
exports.readSavedItem_controller = readSavedItem_controller;
exports.removeSavedItem_controller = removeSavedItem_controller;
const saveItemService_1 = require("../services/saveItemService");
function saveItem_controller(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId, productId, quantity } = req.body;
        try {
            const existing_item = yield (0, saveItemService_1.find_existing_saved_item)(userId);
            if (existing_item && existing_item.items.length > 0) {
                // Check if item already exists
                const itemExists = existing_item.items.some((item) => item.productId.toString() === productId);
                if (itemExists) {
                    return res
                        .status(200)
                        .json({ message: "Item already in wishlist", data: existing_item });
                }
                // add item in wishlist
                existing_item.items.push({ productId, quantity });
                // Save the updated document
                yield existing_item.save();
                res.status(200).send(existing_item);
            }
            else {
                // create wishlist for users
                const arr = [];
                arr.push({ productId, quantity });
                const products = yield (0, saveItemService_1.saveItem_service)({
                    userId,
                    items: arr,
                });
                res.status(200).send(products);
            }
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
}
function readSavedItem_controller(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId } = req.params;
        try {
            const savedItem = yield (0, saveItemService_1.readSavedItem_service)(userId);
            const cart = yield savedItem.populate("items.productId");
            res.status(200).send(cart.items);
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ error: err.message });
        }
    });
}
function removeSavedItem_controller(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId, itemId } = req.params;
        try {
            const savedItem = yield (0, saveItemService_1.readSavedItem_service)(userId);
            const result = savedItem === null || savedItem === void 0 ? void 0 : savedItem.items.filter((item) => item._id != itemId);
            const item = yield (0, saveItemService_1.removeSavedItem_service)(userId, result);
            res.status(200).send("item deleted");
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ error: err.message });
        }
    });
}
