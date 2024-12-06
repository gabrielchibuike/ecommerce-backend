import { Request, Response } from "express";
import {
  cancle_order_service,
  create_order_service,
  find_existing_order,
  viewOne_order_service,
} from "../services/user.order";

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

export async function viewOne_order_controller(req: Request, res: Response) {
  const { userId } = req.params;
  try {
    const orders = await viewOne_order_service(userId as string);

    console.log(orders);

    const result = await orders!.populate("items.productId");

    res.status(200).send(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function cancle_order_controller(req: Request, res: Response) {
  const { userId } = req.params;
  const { status } = req.body;
  try {
    const orderItem = await find_existing_order(userId as string);

    const orderStatus = orderItem?.status;

    if (orderStatus === "Pending") {
      console.log(orderItem);
      const orders = await cancle_order_service(
        userId as string,
        status as string
      );
      res.status(200).send("Order cancled!!");
    } else {
      res.status(200).send("Order cannot be revert");
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
