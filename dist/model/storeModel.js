"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const SubCategorySchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
});
const GenderGroupSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        enum: ["Men", "Women", "Unisex"],
        required: true,
    },
    subCategories: [SubCategorySchema],
});
const CategorySchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    genderGroups: [GenderGroupSchema],
});
const StoreSchema = new mongoose_1.default.Schema({
    isSetup: { type: Boolean, default: false },
    categories: [CategorySchema],
}, { timestamps: true });
const StoreModel = mongoose_1.default.model("Store", StoreSchema);
exports.default = StoreModel;
