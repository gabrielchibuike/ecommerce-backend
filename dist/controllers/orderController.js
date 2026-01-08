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
exports.viewOne_order_controller = viewOne_order_controller;
exports.cancle_order_controller = cancle_order_controller;
exports.delete_order_controller = delete_order_controller;
const orderService_1 = require("../services/orderService");
// export async function create_order_controller(req: Request, res: Response) {
//   const { userId, items, shippingAddress } = req.body;
//   try {
//     const existing_order = await find_existing_order(userId);
//     if (existing_order)
//       return res.status(200).send("Order has already been placed");
//     let totalPrices = 0;
//     for (const item of items) {
//       const product = await ProductDetails.findById(item.productId);
//       if (!product || product.quantity! < item.quantity) {
//         return res.status(200).send("Product is out of stock");
//       }
//       totalPrices += parseInt(product.price!) * item.quantity;
//     }
//     // create the order
//     const order = await create_order_service({
//       userId,
//       items,
//       shippingAddress,
//       paymentStatus: "Pending",
//       transactionId: null,
//       status: "Pending",
//       totalPrices,
//     });
//     // get user email
//     const userEmail = await userDetails.findById(userId);
//     // initiate payment
//     const response = await initiatePayment(
//       userEmail!.email,
//       totalPrices,
//       order
//     );
//     if (!response) {
//       logger.error("Paystack Error:", response.data.message);
//       return res.status(500).json({ error: response.data.message });
//     }
//     order.transactionId = response.data.reference;
//     await order.save();
//     res.status(200).json({
//       success: true,
//       paymentLink: response.data.data.authorization_url,
//     });
//   } catch (err: any) {
//     res.status(500).json({ error: err.message });
//   }
// }
function viewOne_order_controller(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId } = req.params;
        try {
            const orders = yield (0, orderService_1.viewOne_order_service)(userId);
            console.log(orders);
            const result = yield orders.populate("items.productId");
            res.status(200).send(result);
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
}
function cancle_order_controller(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId } = req.params;
        const { status } = req.body;
        try {
            const orderItem = yield (0, orderService_1.find_existing_order)(userId);
            const orderStatus = orderItem === null || orderItem === void 0 ? void 0 : orderItem.status;
            if (orderStatus === "Pending") {
                console.log(orderItem);
                const orders = yield (0, orderService_1.cancle_order_service)(userId, status);
                res.status(200).send("Order cancled!!");
            }
            else {
                res.status(200).send("Order cannot be revert");
            }
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
}
function delete_order_controller(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId } = req.params;
        try {
            const orders = yield (0, orderService_1.delete_order_service)(userId);
            res.status(200).send("Order Deleted!!");
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
}
