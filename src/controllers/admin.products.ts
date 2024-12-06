import { Request, Response } from "express";
import {
  create_product_service,
  delete_product_service,
  edit_product_service,
  find_existing_product,
  get_product_service,
  getOne_product_service,
} from "../services/admin.products";

export async function create_product_controller(req: Request, res: Response) {
  const {
    product_name,
    product_image,
    category_name,
    price,
    description,
    quantity,
    specification,
  } = req.body;
  try {
    const existing_product = await find_existing_product(product_name);

    if (existing_product) return res.status(200).send("product already exist");

    const products = await create_product_service({
      product_name,
      product_image,
      category_name,
      price,
      description,
      quantity,
      specification,
    });

    res.status(200).send(products);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function get_product_controller(req: Request, res: Response) {
  try {
    const products = await get_product_service();

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
  const {
    product_name,
    product_image,
    category_name,
    price,
    description,
    quantity,
    specification,
  } = req.body;

  const { id } = req.params;
  try {
    await edit_product_service({
      id,
      product_name,
      product_image,
      category_name,
      price,
      description,
      quantity,
      specification,
    });
    const product = await getOne_product_service(id as string);

    res.status(200).send(product);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function delete_product_controller(req: Request, res: Response) {
  const { id } = req.params;
  try {
    await delete_product_service(id as string);

    res.status(200).send("Product deleted");
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
