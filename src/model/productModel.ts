import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  product_name: { type: String, require: true },
  product_category: { type: String, require: true },
  sub_category: { type: String, require: true },
  manufacturer_brand: { type: String, require: true },
  description: { type: String },
  color: { type: [], require: true },
  size: { type: [], require: true },
  status: { type: String, require: true },
  quantity: { type: String, require: true },
  price: { type: String, require: true },
  discount: { type: String, require: true },
  product_image: { type: [] },
  dateCreated: { type: Date, default: Date.now() },
  dateUpdated: { type: Date, default: Date.now() },
  visible: { type: Boolean, default: true },
});

const ProductDetails = mongoose.model("Products", ProductSchema);

export default ProductDetails;
