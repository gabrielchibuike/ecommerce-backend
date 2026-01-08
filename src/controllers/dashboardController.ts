import { Request, Response } from "express";
import order from "../model/orderModel";
import ProductDetails from "../model/productModel";
import Review from "../model/reviewModel";
import userDetails from "../model/authModel";
import mongoose from "mongoose";
import logger from "../config/logger";

export async function getDashboardSummaryController(
  req: Request,
  res: Response
) {
  try {
    const totalRevenue = await order.aggregate([
      { $match: { paymentStatus: "Paid" } },
      { $group: { _id: null, total: { $sum: "$totalPrices" } } },
    ]);

    const totalOrders = await order.countDocuments();
    const totalCustomers = await userDetails.countDocuments({ role: "user" });
    const totalProducts = await ProductDetails.countDocuments();

    res.status(200).json({
      data: {
        revenue: totalRevenue[0]?.total || 0,
        orders: totalOrders,
        customers: totalCustomers,
        products: totalProducts,
      },
      message: "Dashboard summary fetched successfully",
    });
  } catch (err: any) {
    logger.error(err);
    res.status(500).json({ error: err.message });
  }
}

export async function getSalesByCategoryController(
  req: Request,
  res: Response
) {
  try {
    const { range = "week" } = req.query;
    let startDate = new Date();

    if (range === "week") {
      startDate.setDate(startDate.getDate() - 7);
    } else if (range === "month") {
      startDate.setMonth(startDate.getMonth() - 1);
    } else if (range === "year") {
      startDate.setFullYear(startDate.getFullYear() - 1);
    }

    const salesByCategory = await order.aggregate([
      { $match: { createdAt: { $gte: startDate }, paymentStatus: "Paid" } },
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.productId",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $group: {
          _id: "$product.product_category",
          value: { $sum: { $multiply: ["$items.quantity", "$items.price"] } },
        },
      },
      {
        $project: {
          name: "$_id",
          value: 1,
          _id: 0,
        },
      },
    ]);

    res.status(200).json({
      data: salesByCategory,
      message: "Sales by category fetched successfully",
    });
  } catch (err: any) {
    logger.error(err);
    res.status(500).json({ error: err.message });
  }
}

export async function getActivityFeedController(req: Request, res: Response) {
  try {
    const latestOrders = await order
      .find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("userId", "firstname lastname")
      .lean();

    const latestReviews = await Review.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("userId", "firstname lastname")
      .populate("productId", "product_name product_image")
      .lean();

    const feed = [
      ...latestOrders.map((o: any) => ({
        id: o._id,
        title: `New Order #${o._id.toString().substring(0, 8).toUpperCase()}`,
        description: `Customer: ${o.userId?.firstname} ${o.userId?.lastname}\nAmount: $${o.totalPrices}`,
        date: o.createdAt,
        type: "order",
      })),
      ...latestReviews.map((r: any) => ({
        id: r._id,
        title: "New Review to Product",
        description: r.comment,
        date: r.createdAt,
        type: "review",
        images: r.productId?.product_image || [],
      })),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    res.status(200).json({
      data: feed.slice(0, 10),
      message: "Activity feed fetched successfully",
    });
  } catch (err: any) {
    logger.error(err);
    res.status(500).json({ error: err.message });
  }
}

export async function getTopSellingProductsController(
  req: Request,
  res: Response
) {
  try {
    const topProducts = await order.aggregate([
      { $match: { paymentStatus: "Paid" } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          totalSold: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 6 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $project: {
          _id: 1,
          name: "$product.product_name",
          productId: "$product._id",
          price: "$revenue",
          image: { $arrayElemAt: ["$product.product_image", 0] },
        },
      },
    ]);

    res.status(200).json({
      data: topProducts,
      message: "Top selling products fetched successfully",
    });
  } catch (err: any) {
    logger.error(err);
    res.status(500).json({ error: err.message });
  }
}

export async function getLatestOffersController(req: Request, res: Response) {
  try {
    const offers = await ProductDetails.find({
      discount: { $gt: 0 },
      visible: true,
    })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      data: offers,
      message: "Latest offers fetched successfully",
    });
  } catch (err: any) {
    logger.error(err);
    res.status(500).json({ error: err.message });
  }
}
