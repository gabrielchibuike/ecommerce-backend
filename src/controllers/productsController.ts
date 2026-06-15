import { Request, Response } from "express";
import {
  create_product_service,
  delete_product_service,
  edit_product_service,
  featured_product_service,
  get_product_service_with_filters,
  getByCategory_service,
  getOne_product_service,
} from "../services/productService";
// import redis from "../redisClient";
import logger from "../config/logger";
import DealModel from "../model/dealModel";

export async function create_product_controller(req: Request, res: Response) {
  try {
    if (!req.files) return res.status(404).send("files not found");

    const files = req.files as Express.Multer.File[];
    const jsonData = JSON.parse(req.body.jsonData);

    const products = await create_product_service({
      ...jsonData,
      product_image: files.map((file) => file.path),
    });

    // await redis.del("/api/products/get_products");

    res.status(201).json({ data: products, message: "Created Successfully" });
  } catch (err: any) {
    logger.error(err);
    if (err.message === "Product already exists") {
      return res.status(409).json({ message: err.message });
    }
    res.status(500).json({ error: err.message });
  }
}

export async function featuerd_product_controller(req: Request, res: Response) {
  try {
    const products = await featured_product_service();
    res.status(200).send(products);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function get_product_controller(req: Request, res: Response) {
  try {
    const filters = {
      category: req.query.category as string,
      subcategory: req.query.subcategory as string,
      gender: req.query.gender as string,
      color: req.query.color as string,
      size: req.query.size as string,
      price_min: req.query.price_min
        ? parseFloat(req.query.price_min as string)
        : undefined,
      price_max: req.query.price_max
        ? parseFloat(req.query.price_max as string)
        : undefined,
      search: req.query.search as string,
    };

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const sort_by = (req.query.sort_by as string) || "createdAt";
    const sort_order = (req.query.sort_order as string) || "desc";

    const { products, total } = await get_product_service_with_filters({
      filters,
      page,
      limit,
      sort_by,
      sort_order,
    });

    const totalPages = Math.ceil(total / limit);

    // Check for active deals for each product
    const now = new Date();
    const productsWithDeals = await Promise.all(
      products.map(async (product: any) => {
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
                    ((product.price - dealPrice) / product.price) * 100,
                  ),
            isDealActive: true,
            dealExpiry: activeDeal.endAt,
          };
        }
        return product;
      }),
    );

    const data = {
      products: productsWithDeals,
      total,
      totalPages,
      page,
      limit,
    };
    res.status(200).json({ data: data, message: "Retrieved successfully" });
  } catch (err: any) {
    res.status(500).json({ data: null, message: err.message });
  }
}

export async function getOne_product_controller(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const product = await getOne_product_service(id as string);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const now = new Date();
    const activeDeal = await DealModel.findOne({
      productId: product._id,
      startAt: { $lte: now },
      endAt: { $gte: now },
      isActive: true,
    });

    let result: any = product.toObject();
    if (activeDeal) {
      let dealPrice = product.price;
      if (activeDeal.discountType === "PERCENT") {
        dealPrice = product.price * (1 - activeDeal.discountValue / 100);
      } else if (activeDeal.discountType === "FLAT") {
        dealPrice = Math.max(0, product.price - activeDeal.discountValue);
      }

      result = {
        ...result,
        dealPrice,
        originalPrice: product.price,
        discountPercentage:
          activeDeal.discountType === "PERCENT"
            ? activeDeal.discountValue
            : Math.round(((product.price - dealPrice) / product.price) * 100),
        isDealActive: true,
        dealExpiry: activeDeal.endAt,
      };
    }

    res.status(200).json({ data: result, message: "Retrieved successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function getByCategory_controller(req: Request, res: Response) {
  const { slug } = req.params;
  try {
    const products = await getByCategory_service(slug as string);
    res.status(200).json({ data: products, message: "Retrieved successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function edit_product_controller(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (!req.files) return res.status(404).send("files not found");

    const files = req.files as Express.Multer.File[];
    const jsonData = JSON.parse(req.body.jsonData);

    await edit_product_service({
      ...jsonData,
      id,
      product_image: files.map((file) => file.filename),
    });

    res.status(200).json({ message: "Updated Successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function delete_product_controller(req: Request, res: Response) {
  const { productId } = req.body;
  try {
    await delete_product_service(productId as string);
    res.status(200).send("Product deleted");
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
