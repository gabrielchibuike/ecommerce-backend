"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addReviewController = addReviewController;
exports.getReviewsController = getReviewsController;
const reviewModel_1 = __importDefault(require("../model/reviewModel"));
const productModel_1 = __importDefault(require("../model/productModel"));
function addReviewController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId, productId, rating, comment } = req.body;
        try {
            // Check if user already reviewed this product
            const existingReview = yield reviewModel_1.default.findOne({ userId, productId });
            if (existingReview) {
                return res
                    .status(400)
                    .json({ message: "You have already reviewed this product" });
            }
            const newReview = new reviewModel_1.default({
                userId,
                productId,
                rating,
                comment,
            });
            yield newReview.save();
            // Update product average rating
            const reviews = yield reviewModel_1.default.find({ productId });
            const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
            const averageRating = totalRating / reviews.length;
            yield productModel_1.default.findByIdAndUpdate(productId, {
                rating: averageRating,
                reviews: reviews.length,
            });
            res.status(201).json(newReview);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    });
}
function getReviewsController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { productId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        try {
            const reviews = yield reviewModel_1.default.find({ productId })
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .populate("userId", "firstName lastName image"); // Assuming User model has these fields
            const total = yield reviewModel_1.default.countDocuments({ productId });
            res.status(200).json({
                reviews,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
            });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    });
}
