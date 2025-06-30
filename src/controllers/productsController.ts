import { Request, Response } from "express";
import {
  create_product_service,
  delete_product_service,
  edit_product_service,
  featured_product_service,
  find_existing_product,
  get_product_service_with_filters,
  getByCategory_service,
  getOne_product_service,
  search_product_service,
} from "../services/productService";
import { StatusCodes } from "http-status-codes";
import redis from "../redisClient";
import { logger } from "../utils/logger";

export async function create_product_controller(req: Request, res: Response) {
  try {
    if (!req.files) return res.status(404).send("files not found");

    const files = req.files as Express.Multer.File[];

    // console.log(files);
    const {
      product_name,
      product_category,
      sub_category,
      manufacturer_brand,
      description,
      color,
      size,
      status,
      quantity,
      price,
      discount,
    } = JSON.parse(req.body.jsonData);

    const existing_product = await find_existing_product(product_name);

    if (existing_product)
      return res.status(200).json({ message: "Product already exist" });

    const products = await create_product_service({
      product_name,
      product_category,
      sub_category,
      manufacturer_brand,
      description,
      color,
      size,
      status,
      quantity,
      price,
      discount,
      product_image: files.map((file) => file.path),
    });

    await redis.del("/api/products/get_products");

    res.status(201).json({ data: products, message: "Created Sucessfully" });
  } catch (err: any) {
    console.log(err);

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

export async function search_product_controller(req: Request, res: Response) {
  console.log("search");

  try {
    const { searchQuery } = req.query;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    console.log(searchQuery);

    if (!searchQuery || typeof searchQuery !== "string") {
      return res.status(400).json({ error: "Search query is required" });
    }

    const { products, total } = await search_product_service(
      searchQuery,
      page,
      limit
    );

    res.json({ products: products, total });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function get_product_controller(req: Request, res: Response) {
  console.log("hittt");

  try {
    const filters = {
      main_category: req.query.main_category as string,
      product_category: req.query.product_category as string,
      sub_category: req.query.sub_category as string,
      manufacturer_brand: req.query.brand as string,
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

    // Extract pagination and sorting parameters
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const sort_by = (req.query.sort_by as string) || "createdAt";
    const sort_order = (req.query.sort_order as string) || "desc";

    // Generate a unique cache key based on filters, pagination, and sorting
    const cacheKey = `/api/products/get_products?${JSON.stringify({
      ...filters,
      page,
      limit,
      sort_by,
      sort_order,
    })}`;

    // Check cache
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      logger.info("sending cached data");
      return res.status(200).json(JSON.parse(cachedData));
    }

    console.log(filters, "kol");

    // Fetch filtered products
    const { products, total } = await get_product_service_with_filters({
      filters,
      page,
      limit,
      sort_by,
      sort_order,
    });

    // Cache the response for 5 minutes
    await redis.setex(cacheKey, 300, JSON.stringify({ products, total }));

    res.status(200).json({ products, total, page, limit });

    // res.status(200).send(products);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function getOne_product_controller(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const products = await getOne_product_service(id as string);

    res.status(200).send(products);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function getByCategory_controller(req: Request, res: Response) {
  const { slug } = req.params;
  try {
    const products = await getByCategory_service(slug as string);

    res.status(200).send(products);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function edit_product_controller(req: Request, res: Response) {
  try {
    const { id } = req.params;

    console.log(req.files);

    if (!req.files) return res.status(404).send("files not found");

    const files = req.files as Express.Multer.File[];

    const {
      product_name,
      product_category,
      sub_category,
      manufacturer_brand,
      description,
      color,
      size,
      status,
      quantity,
      price,
      discount,
    } = JSON.parse(req.body.jsonData);

    const product = await edit_product_service({
      id,
      product_name,
      product_category,
      sub_category,
      manufacturer_brand,
      description,
      color,
      size,
      status,
      quantity,
      price,
      discount,
      product_image: files.map((file) => file.filename),
    });
    // const product = await getOne_product_service(id as string);

    res.status(201).json({ message: "Updated Sucessfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function delete_product_controller(req: Request, res: Response) {
  const { productId } = req.body;

  console.log(productId);

  try {
    await delete_product_service(productId as string);

    res.status(200).send("Product deleted");
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
