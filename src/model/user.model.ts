import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstname: { type: String, require: true },
  lastname: { type: String, require: true },
  mobile: { type: String, require: true },
  dateOfBirth: { type: String, require: true },
  gender: { type: String, require: true },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profileImg: { type: String },
  savedItem: {
    type: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Products",
          required: true,
        },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
  },
  address: [
    {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
  ],
  refreshToken: { type: String },
  otp: { type: String },
  dateCreated: { type: Date, default: Date.now() },
  dateUpdated: { type: Date, default: Date.now() },
  visible: { type: Boolean, default: true },
});

const userDetails = mongoose.model("User", userSchema);

export default userDetails;
