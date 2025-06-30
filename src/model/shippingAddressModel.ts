import mongoose from "mongoose";

const shippingAddressSchema = new mongoose.Schema(
  {
    firstName: { type: String, require: true },
    lastName: { type: String, require: true },
    phone: { type: String, require: true },
    email: { type: String, require: true },
    streetAddress: { type: String, require: true },
    additionalInfo: { type: String, require: true },
    city: { type: String, require: true },
    state: { type: String, require: true },
  },
  { timestamps: true }
);

const ShippingAddress = mongoose.model(
  "shippingAddress",
  shippingAddressSchema
);

export default ShippingAddress;
