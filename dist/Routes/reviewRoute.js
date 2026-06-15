"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const reviewController_1 = require("../controllers/reviewController");
const reviewRoute = express_1.default.Router();
reviewRoute.post("/add", reviewController_1.addReviewController);
reviewRoute.get("/get/:productId", reviewController_1.getReviewsController);
exports.default = reviewRoute;
