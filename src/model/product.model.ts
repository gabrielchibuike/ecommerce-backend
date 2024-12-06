import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  product_name: { type: String, require: true },
  product_image: { type: [] },
  category_name: { type: String },
  price: { type: Number },
  description: { type: String },
  quantity: { type: Number },
  specification: { type: [] },
  dateCreated: { type: Date, default: Date.now() },
  dateUpdated: { type: Date, default: Date.now() },
  visible: { type: Boolean, default: true },
});

const ProductDetails = mongoose.model("Products", ProductSchema);

export default ProductDetails;
