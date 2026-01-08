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
exports.addCartController = addCartController;
exports.getCartController = getCartController;
exports.updateCartController = updateCartController;
exports.deleteCartController = deleteCartController;
const cartService_1 = require("../services/cartService");
const productModel_1 = __importDefault(require("../model/productModel"));
function addCartController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId, productId, quantity } = req.body;
        try {
            // Check product availability
            const product = yield productModel_1.default.findById(productId);
            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }
            if (product.quantity < quantity) {
                return res.status(400).json({ message: "Insufficient stock" });
            }
            const existing_cart = yield (0, cartService_1.findExitingCartItem)(userId);
            if (existing_cart && existing_cart.items.length > 0) {
                // Check if item already exists in cart
                const itemIndex = existing_cart.items.findIndex((item) => item.productId.toString() === productId);
                if (itemIndex > -1) {
                    // Update quantity if item exists
                    const newQuantity = existing_cart.items[itemIndex].quantity + quantity;
                    if (product.quantity < newQuantity) {
                        return res
                            .status(400)
                            .json({ message: "Insufficient stock for update" });
                    }
                    existing_cart.items[itemIndex].quantity = newQuantity;
                }
                else {
                    // Add new item
                    existing_cart.items.push({ productId, quantity });
                }
                // Save the updated document
                yield existing_cart.save();
                res.status(200).send(existing_cart);
            }
            else {
                // create cart for users
                const arr = [];
                arr.push({ productId, quantity });
                const products = yield (0, cartService_1.addCartService)({
                    userId,
                    items: arr,
                });
                res.status(200).send(products);
            }
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ error: err.message });
        }
    });
}
function getCartController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId } = req.params;
        try {
            const cartItem = yield (0, cartService_1.getCartService)(userId);
            if (!cartItem) {
                return res.status(200).send([]);
            }
            const cart = yield cartItem.populate("items.productId");
            res.status(200).send(cart.items);
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ error: err.message });
        }
    });
}
function updateCartController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId, itemId } = req.params;
        const { quantity } = req.body;
        try {
            const cartItem = yield (0, cartService_1.getCartService)(userId);
            if (!cartItem)
                return res.status(404).json({ message: "Cart not found" });
            const item = cartItem.items;
            const index = item.findIndex((item) => item._id.toString() === itemId);
            if (index !== -1) {
                // Validate stock for update
                const productId = cartItem.items[index].productId;
                const product = yield productModel_1.default.findById(productId);
                if (!product) {
                    return res.status(404).json({ message: "Product not found" });
                }
                if (product.quantity < quantity) {
                    return res.status(400).json({ message: "Insufficient stock" });
                }
                cartItem.items[index].quantity = quantity;
            }
            yield cartItem.save();
            // Re-populate to return full product details if needed, or just return items
            // const populatedCart = await cartItem.populate("items.productId");
            res.status(200).send(cartItem.items);
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ error: err.message });
        }
    });
}
function deleteCartController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId, itemId } = req.params;
        try {
            const cartItem = yield (0, cartService_1.getCartService)(userId);
            const result = cartItem === null || cartItem === void 0 ? void 0 : cartItem.items.filter((item) => item._id != itemId);
            const item = yield (0, cartService_1.deleteCartService)(userId, result);
            res.status(200).send("item deleted");
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ error: err.message });
        }
    });
}
