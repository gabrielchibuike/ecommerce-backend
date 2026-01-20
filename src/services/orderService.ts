import { orderType } from "../Interface/orderType";
import order from "../model/orderModel";
import mongoose from "mongoose";
import ProductDetails from "../model/productModel";
import { initiatePayment } from "../utils/payment";
import axios from "axios";
import crypto from "crypto";
import { runPostCheckoutWorkflow } from "./workflowService";
import userDetails from "../model/authModel";
import DealModel from "../model/dealModel";

export async function create_checkout_order_service(data: {
  userId: string;
  items: { productId: string; quantity: number }[];
  billingDetails: any;
  shippingAddress: any;
  userEmail: string;
}) {
  let totalAmount = 0;
  const verifiedItems = [];

  const now = new Date();

  // 1. Recalculate prices and check stock
  for (const item of data.items) {
    const product = await ProductDetails.findById(item.productId);
    if (!product) throw new Error(`Product ${item.productId} not found`);
    if (product.quantity < item.quantity) {
      throw new Error(`Insufficient stock for ${product.product_name}`);
    }

    let price = product.price; // Use price from DB

    // Check for active deals
    const activeDeal = await DealModel.findOne({
      productId: item.productId,
      startAt: { $lte: now },
      endAt: { $gte: now },
      isActive: true,
    });

    if (activeDeal) {
      if (activeDeal.discountType === "PERCENT") {
        price = product.price * (1 - activeDeal.discountValue / 100);
      } else if (activeDeal.discountType === "FLAT") {
        price = Math.max(0, product.price - activeDeal.discountValue);
      }
    }

    totalAmount += price * item.quantity;
    verifiedItems.push({
      productId: item.productId,
      quantity: item.quantity,
      price: price,
    });
  }

  // 2. Create the order
  const newOrder = await order.create({
    userId: data.userId,
    items: verifiedItems,
    billingDetails: data.billingDetails,
    shippingAddress: data.shippingAddress,
    totalPrices: totalAmount,
    paymentStatus: "Pending",
    status: "Pending",
  });

  // 3. Initiate Paystack payment
  const paystackResponse = await initiatePayment(
    data.userEmail,
    totalAmount,
    newOrder
  );

  if (!paystackResponse || !paystackResponse.status) {
    throw new Error(
      paystackResponse?.message || "Payment initialization failed"
    );
  }

  // 4. Save payment reference
  newOrder.paymentReference = paystackResponse.data.reference;
  await newOrder.save();

  return {
    order: newOrder,
    paymentLink: paystackResponse.data.authorization_url,
  };
}

// Fallback logic for Paystack verification
// export async function verify_payment_service(reference: string) {
//   const response: any = await axios.get(
//     `https://api.paystack.co/transaction/verify/${reference}`,
//     {
//       headers: {
//         Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
//       },
//     }
//   );

//   const paymentData = response.data.data;
//   const orderItem = await order.findOne({ paymentReference: reference });

//   if (!orderItem) throw new Error("Order not found for this reference");

//   if (paymentData.status === "success") {
//     orderItem.paymentStatus = "Paid";
//     orderItem.status = "Processing"; // Move to processing after payment
//     // Decrement stock
//     for (const item of orderItem.items) {
//       await ProductDetails.findByIdAndUpdate(item.productId, {
//         $inc: { quantity: -item.quantity },
//       });
//     }
//   } else {
//     orderItem.paymentStatus = "Failed";
//   }

//   await orderItem.save();
//   return orderItem;
// }

// export async function handle_paystack_webhook_service(
//   signature: string,
//   payload: any
// ) {
//   const hash = crypto
//     .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY as string)
//     .update(JSON.stringify(payload))
//     .digest("hex");

//   if (hash !== signature) {
//     throw new Error("Invalid Paystack signature");
//   }

//   if (payload.event === "charge.success") {
//     const reference = payload.data.reference;
//     return await verify_payment_service(reference);
//   }
// }

export async function verify_payment_service(reference: string) {
  const response: any = await axios.get(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    }
  );

  const paymentData = response!.data.data;
  const orderItem = await order.findOne({ paymentReference: reference });

  if (!orderItem) {
    throw new Error("Order not found for this reference");
  }

  // If webhook already finalized, do nothing
  if (orderItem.paymentStatus === "Paid") {
    return orderItem;
  }

  if (paymentData.status === "success") {
    orderItem.paymentStatus = "Paid";
    orderItem.status = "Processing";

    await finalize_order_payment_service(reference);
    await orderItem.save();
  } else {
    orderItem.paymentStatus = "Failed";
    await orderItem.save();
  }

  return orderItem;
}

export async function finalize_order_payment_service(reference: string) {
  const orderItem = await order.findOne({ paymentReference: reference });

  if (!orderItem) {
    throw new Error("Order not found for this reference");
  }

  // 🛑 Idempotency check
  if (orderItem.paymentStatus === "Paid") {
    return orderItem;
  }

  orderItem.paymentStatus = "Paid";
  orderItem.status = "Processing";

  for (const item of orderItem.items) {
    await ProductDetails.findByIdAndUpdate(item.productId, {
      $inc: { quantity: -item.quantity },
    });
  }

  await orderItem.save();

  // 🚀 Trigger Post-Checkout Workflow
  // We run this asynchronously to avoid blocking the initial finalization response
  runPostCheckoutWorkflow(orderItem._id.toString()).catch((err) => {
    console.error(
      `Post-checkout workflow failed for order ${orderItem._id}:`,
      err.message
    );
  });

  return orderItem;
}

export async function handle_paystack_webhook_service(
  signature: string,
  payload: any
) {
  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY as string)
    .update(JSON.stringify(payload))
    .digest("hex");

  if (hash !== signature) {
    throw new Error("Invalid Paystack signature");
  }

  if (payload.event === "charge.success") {
    const reference = payload.data.reference;

    return await finalize_order_payment_service(reference);
  }
}

export async function find_existing_order(userId: string) {
  return await order.findOne({ userId }).sort({ createdAt: -1 });
}

export async function viewOne_order_service(userId: string) {
  const result = await order.findOne({ userId }).sort({ createdAt: -1 });
  if (!result) return null;
  return await result.populate("items.productId");
}

export async function cancle_order_service(orderId: string, userId: string) {
  const orderItem = await order.findOne({ _id: orderId, userId: userId });
  if (!orderItem) throw new Error("Order not found");

  const allowedStatuses = ["Pending", "Processing"];
  if (!allowedStatuses.includes(orderItem.status)) {
    throw new Error(`Order cannot be cancelled in ${orderItem.status} status`);
  }

  // Release stock if it was already deducted (Paid/Processing)
  if (orderItem.paymentStatus === "Paid" || orderItem.status === "Processing") {
    for (const item of orderItem.items) {
      await ProductDetails.findByIdAndUpdate(item.productId, {
        $inc: { quantity: item.quantity },
      });
    }
  }

  orderItem.status = "Cancelled";
  return await orderItem.save();
}

export async function delete_order_service(userId: string) {
  const result = await order.deleteOne({ userId });
  if (result.deletedCount === 0) throw new Error("Order not found");
  return result;
}

export async function getAllOrdersService(filters: any = {}) {
  const { status, page = 1, limit = 10, sort = -1, search } = filters;
  const query: any = {};
  if (status && status !== "ALL") query.status = status;

  if (search) {
    query.$or = [
      { email: { $regex: search, $options: "i" } },
      { "billingDetails.email": { $regex: search, $options: "i" } },
      { "billingDetails.firstName": { $regex: search, $options: "i" } },
      { "billingDetails.lastName": { $regex: search, $options: "i" } },
    ];
    // If search is a valid ObjectId, search by ID too
    if (mongoose.Types.ObjectId.isValid(search)) {
      query.$or.push({ _id: search });
    }
  }

  const total = await order.countDocuments(query);
  const orders = await order
    .find(query)
    .populate("userId", "firstname lastname email")
    .sort({ createdAt: sort })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  return { orders, total, page: Number(page), limit: Number(limit) };
}

export async function getOrderStatsService() {
  const allOrders = await order.countDocuments();
  const pending = await order.countDocuments({ status: "Pending" });
  const completed = await order.countDocuments({ status: "Completed" });
  const processing = await order.countDocuments({ status: "Processing" });
  const returned = await order.countDocuments({ status: "Returned" });
  const cancelled = await order.countDocuments({ status: "Cancelled" });
  const failed = await order.countDocuments({ status: "Delivery Failed" });

  return {
    allOrders,
    pending,
    completed,
    processing,
    returned,
    cancelled,
    failed,
  };
}

export async function getOrderByIdService(id: string) {
  const orderData = await order
    .findById(id)
    .populate("userId", "firstname lastname email phone profileImg")
    .populate("items.productId");

  if (!orderData) return null;

  // We can also try to find associated shipment
  const Shipment = mongoose.model("Shipment");
  const shipment = await Shipment.findOne({ orderId: id });

  return { order: orderData, shipment };
}

export async function getCustomerStatsService() {
  return await order.aggregate([
    {
      $group: {
        _id: "$userId",
        totalOrders: { $sum: 1 },
        totalSpent: { $sum: "$totalPrices" },
        lastOrderDate: { $max: "$createdAt" },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "userDetails",
      },
    },
    {
      $unwind: "$userDetails",
    },
    {
      $project: {
        _id: 1,
        name: {
          $concat: ["$userDetails.firstname", " ", "$userDetails.lastname"],
        },
        email: "$userDetails.email",
        phone: "$userDetails.phone",
        totalOrders: 1,
        totalSpent: 1,
        lastOrderDate: 1,
        status: { $ifNull: ["$userDetails.visible", true] },
      },
    },
  ]);
}

export async function getCustomerProfileService(userId: string) {
  const user = await userDetails
    .findById(userId)
    .select("-password -refreshToken -otp");
  if (!user) throw new Error("User not found");

  const stats = await order.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: "$userId",
        totalOrders: { $sum: 1 },
        totalSpent: { $sum: "$totalPrices" },
        lastOrderDate: { $max: "$createdAt" },
      },
    },
  ]);

  const customerStats = stats[0] || {
    totalOrders: 0,
    totalSpent: 0,
    lastOrderDate: null,
  };

  return {
    ...user.toObject(),
    ...customerStats,
  };
}

export async function getCustomerOrdersService(userId: string) {
  return await order
    .find({ userId })
    .populate("items.productId")
    .sort({ createdAt: -1 });
}
