import { Request, Response } from "express";
import {
  cancle_order_service,
  create_order_service,
  delete_order_service,
  find_existing_order,
  viewOne_order_service,
} from "../services/orderService";
import ProductDetails from "../model/productModel";
import userDetails from "../model/authModel";
import { initiatePayment } from "../utils/payment";

export async function create_order_controller(req: Request, res: Response) {
  const { userId, items, shippingAddress } = req.body;
  try {
    const existing_order = await find_existing_order(userId);

    if (existing_order)
      return res.status(200).send("Order has already been placed");

    let totalPrices = 0;
    for (const item of items) {
      const product = await ProductDetails.findById(item.productId);

      if (!product || product.quantity! < item.quantity) {
        return res.status(200).send("Product is out of stock");
      }

      totalPrices += parseInt(product.price!) * item.quantity;
    }

    // create the order
    const order = await create_order_service({
      userId,
      items,
      shippingAddress,
      paymentStatus: "Pending",
      transactionId: null,
      status: "Pending",
      totalPrices,
    });

    // get user email
    const userEmail = await userDetails.findById(userId);

    // initiate payment
    const result = await initiatePayment(userEmail!.email, totalPrices, order);

    res.status(200).send(result);

    // res.status(200).send(products);
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

export async function delete_order_controller(req: Request, res: Response) {
  const { userId } = req.params;
  try {
    const orders = await delete_order_service(userId as string);
    res.status(200).send("Order Deleted!!");
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
