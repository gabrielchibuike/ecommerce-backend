import { Request, Response } from "express";
import order from "../model/orderModel";
import ProductDetails from "../model/productModel";
import Review from "../model/reviewModel";
import userDetails from "../model/authModel";
import mongoose from "mongoose";
import logger from "../config/logger";
import DealModel from "../model/dealModel";

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
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 4 },
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
        $replaceRoot: { newRoot: "$product" },
      },
    ]);

    // Populate deals and calculate prices
    const now = new Date();
    const result = await Promise.all(
      topProducts.map(async (product: any) => {
        const activeDeal = await DealModel.findOne({
          productId: product._id,
          startAt: { $lte: now },
          endAt: { $gte: now },
          isActive: true,
        });

        if (activeDeal) {
          let dealPrice = product.price;
          if (activeDeal.discountType === "PERCENT") {
            dealPrice = product.price * (1 - activeDeal.discountValue / 100);
          } else if (activeDeal.discountType === "FLAT") {
            dealPrice = Math.max(0, product.price - activeDeal.discountValue);
          }

          return {
            ...product,
            dealPrice,
            originalPrice: product.price,
            discountPercentage:
              activeDeal.discountType === "PERCENT"
                ? activeDeal.discountValue
                : Math.round(
                    ((product.price - dealPrice) / product.price) * 100
                  ),
            isDealActive: true,
            dealExpiry: activeDeal.endAt,
          };
        }
        return product;
      })
    );

    res.status(200).json({
      data: result,
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
