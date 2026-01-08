import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    customerName: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
