import { Request, Response } from "express";
import {
  create_product_service,
  delete_product_service,
  edit_product_service,
  find_existing_product,
  get_product_service,
  getOne_product_service,
} from "../services/admin.products";
import {
  create_order_service,
  delete_order_service,
  find_existing_order,
  get_order_service,
  getOne_order_service,
} from "../services/admin.order";

export async function create_order_controller(req: Request, res: Response) {
  const {
    userId,
    items,
    shippingAddress,
    paymentStatus,
    paymentTransaction,
    status,
    totalAmount,
  } = req.body;
  try {
    const existing_product = await find_existing_order(userId);

    if (existing_product)
      return res.status(200).send("Order has already been placed");

    const products = await create_order_service({
      userId,
      items,
      shippingAddress,
      paymentStatus,
      paymentTransaction,
      status,
      totalAmount,
    });

    res.status(200).send(products);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function get_order_controller(req: Request, res: Response) {
  try {
    const orders = await get_order_service();
    res.status(200).send(orders);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function getOne_order_controller(req: Request, res: Response) {
  const { userId } = req.params;
  try {
    const orders = await getOne_order_service(userId as string);
    res.status(200).send(orders);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function delete_order_controller(req: Request, res: Response) {
  const { userId } = req.params;
  try {
    const orders = await delete_order_service(userId as string);
    res.status(200).send("Order Deleted!!");
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
