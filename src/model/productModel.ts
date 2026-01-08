import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    product_gender: {
      type: String,
      enum: ["Women", "Men", "Unisex"],
      required: true,
    },
    product_category: { type: String, required: true },
    sub_category: { type: String, required: true },
    product_name: { type: String, required: true },
    description: { type: String },
    color: { type: [String], required: true },
    size: { type: [String], required: true },
    tags: { type: [String], required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, required: true },
    status: {
      type: String,
      required: true,
      enum: ["Available", "Unavailable"],
      default: "Available",
    },
    product_image: { type: [String] },
    visible: { type: Boolean, default: true },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    additionalInfo: { type: String },
  },
  { timestamps: true }
);

const ProductDetails = mongoose.model("Products", ProductSchema);
export default ProductDetails;
