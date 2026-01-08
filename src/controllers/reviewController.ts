import { Request, Response } from "express";
import {
  addReviewService,
  getAllReviewsService,
  getReviewsService,
} from "../services/reviewService";

export async function addReviewController(req: Request, res: Response) {
  const { userId, productId, rating, comment } = req.body;

  try {
    const review = await addReviewService({
      userId,
      productId,
      rating,
      comment,
    });

    res.status(201).json({
      data: review,
      message: "Review created successfully",
    });
  } catch (error: any) {
    if (error.message === "You have already reviewed this product") {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({
      message: error.message || "Failed to create review",
    });
  }
}

export async function getReviewsController(req: Request, res: Response) {
  const { productId } = req.params;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  try {
    const data = await getReviewsService({
      productId: productId as string,
      page,
      limit,
    });

    res.status(200).json({
      data,
      message: "Reviews retrieved successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Failed to fetch reviews",
    });
  }
}

export async function getAllReviewsController(req: Request, res: Response) {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  try {
    const data = await getAllReviewsService({
      page,
      limit,
    });

    res.status(200).json({
      data,
      message: "All reviews retrieved successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Failed to fetch reviews",
    });
  }
}
