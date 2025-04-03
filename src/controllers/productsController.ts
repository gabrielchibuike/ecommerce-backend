import { Request, Response } from "express";
import {
  create_product_service,
  delete_product_service,
  edit_product_service,
  find_existing_product,
  get_product_service,
  getOne_product_service,
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

export async function get_product_controller(req: Request, res: Response) {
  try {
    const products = await get_product_service();

    await redis.setex(res.locals.cacheKey, 300, JSON.stringify(products));

    res.status(200).send(products);
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
