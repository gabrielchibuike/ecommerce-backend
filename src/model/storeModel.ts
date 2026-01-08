import mongoose from "mongoose";

const SubCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const GenderGroupSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ["Men", "Women", "Unisex"],
    required: true,
  },
  subCategories: [SubCategorySchema],
});

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  genderGroups: [GenderGroupSchema],
});

const StoreSchema = new mongoose.Schema(
  {
    isSetup: { type: Boolean, default: false },
    categories: [CategorySchema],
  },
  { timestamps: true }
);

const StoreModel = mongoose.model("Store", StoreSchema);

export default StoreModel;
