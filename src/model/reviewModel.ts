import mongoose, { Document, Schema } from "mongoose";

// export interface IReview extends Document {
//   userId: mongoose.Types.ObjectId;
//   productId: mongoose.Types.ObjectId;
//   rating: number;
//   comment: string;
//   createdAt: Date;
//   updatedAt: Date;
// }

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Products",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);

export default Review;
