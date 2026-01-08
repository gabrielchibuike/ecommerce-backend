import mongoose from "mongoose";

const shipmentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Products",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
    shippingAddress: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      phone: { type: String, required: true },
      streetAddress: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      zipCode: { type: String, required: true },
    },
    status: {
      type: String,
      enum: [
        "PENDING",
        "PACKED",
        "SHIPPED",
        "IN_TRANSIT",
        "DELIVERED",
        "FAILED",
        "RETURNED",
      ],
      default: "PENDING",
    },
    courier: {
      name: { type: String },
      trackingNumber: { type: String },
      contactInfo: { type: String },
    },
    statusHistory: [
      {
        status: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        reason: { type: String },
      },
    ],
    estimatedDelivery: { type: Date },
  },
  { timestamps: true }
);

const Shipment = mongoose.model("Shipment", shipmentSchema);

export default Shipment;
