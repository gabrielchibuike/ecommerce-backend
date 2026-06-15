import mongoose, { Schema } from "mongoose";
import { IDeal } from "../Interface/dealType";

const DealSchema = new Schema<IDeal>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Products",
      required: true,
    },
    discountType: {
      type: String,
      enum: ["PERCENT", "FLAT"],
      default: "PERCENT",
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
    },
    startAt: {
      type: Date,
      required: true,
    },
    endAt: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Prevent overlapping deals for the same product
DealSchema.index({ productId: 1, startAt: 1, endAt: 1 });

const DealModel = mongoose.model<IDeal>("Deals", DealSchema);
export default DealModel;
