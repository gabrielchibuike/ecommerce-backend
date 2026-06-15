import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    paymentMethod: { type: String, required: true }, // e.g., "Paystack", "Stripe"
    transactionReference: { type: String, required: true }, // From payment gateway
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Success", "Failed", "Refunded"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);
