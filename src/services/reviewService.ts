import mongoose from "mongoose";
import Review from "../model/reviewModel";
import ProductDetails from "../model/productModel";

interface GetReviewsParams {
  productId: string;
  page: number;
  limit: number;
}

interface AddReviewParams {
  userId: string;
  productId: string;
  rating: number;
  comment: string;
}

export async function addReviewService({
  userId,
  productId,
  rating,
  comment,
}: AddReviewParams) {
  const userObjectId = new mongoose.Types.ObjectId(userId);
  const productObjectId = new mongoose.Types.ObjectId(productId);

  // 1. Prevent duplicate reviews
  const existingReview = await Review.findOne({
    userId: userObjectId,
    productId: productObjectId,
  });

  if (existingReview) {
    throw new Error("You have already reviewed this product");
  }

  // 2. Create review
  const newReview = await Review.create({
    userId: userObjectId,
    productId: productObjectId,
    rating,
    comment,
  });

  // 3. Recalculate product rating (single DB roundtrip)
  const stats = await Review.aggregate([
    { $match: { productId: productObjectId } },
    {
      $group: {
        _id: "$productId",
        avgRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await ProductDetails.findByIdAndUpdate(productObjectId, {
      rating: Number(stats[0].avgRating.toFixed(1)),
      reviews: stats[0].totalReviews,
    });
  }

  return newReview;
}

export async function getReviewsService({
  productId,
  page,
  limit,
}: GetReviewsParams) {
  const skip = (page - 1) * limit;

  const [reviews, total] = await Promise.all([
    Review.find({ productId: new mongoose.Types.ObjectId(productId) })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("userId", "firstname lastname profile_img")
      .lean(),

    Review.countDocuments({ productId }),
  ]);

  return {
    reviews,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    total,
  };
}

export async function getAllReviewsService({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) {
  const skip = (page - 1) * limit;

  const [reviews, total] = await Promise.all([
    Review.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("userId", "firstname lastname profile_img")
      .populate("productId", "product_name product_category")
      .lean(),
    Review.countDocuments(),
  ]);

  return {
    reviews,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    total,
  };
}
