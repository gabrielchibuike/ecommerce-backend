import { Document, Schema } from "mongoose";

export interface IDeal extends Document {
  productId: Schema.Types.ObjectId;
  discountType: "PERCENT" | "FLAT";
  discountValue: number;
  startAt: Date;
  endAt: Date;
  isActive: boolean;
}
