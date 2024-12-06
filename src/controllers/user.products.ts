import { Request, Response } from "express";
import {
  all_product_service,
  product_cart_service,
  single_product_service,
} from "../services/user.products";

export async function all_product_controller(req: Request, res: Response) {
  try {
    const products = await all_product_service();

    res.status(200).send(products);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function single_product_controller(req: Request, res: Response) {
  const { productId } = req.params;
  console.log(productId);

  try {
    const product = await single_product_service(productId as string);

    res.status(200).send(product);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

// export async function product_cart_controller(req: Request, res: Response) {
//   const { cat } = req.params;
//   try {
//     const products = await product_cart_service(cat as string);

//     res.status(200).send(products);
//   } catch (err: any) {
//     res.status(500).json({ error: err.message });
//   }
// }
