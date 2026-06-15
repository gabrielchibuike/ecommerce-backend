import { Request, Response } from "express";
import {
  cancle_order_service,
  create_checkout_order_service,
  delete_order_service,
  getAllOrdersService,
  getCustomerOrdersService,
  getCustomerProfileService,
  getCustomerStatsService,
  getOrderByIdService,
  getOrderStatsService,
  handle_paystack_webhook_service,
  verify_payment_service,
  viewOne_order_service,
} from "../services/orderService";
import logger from "../config/logger";

export async function createOrderController(req: Request, res: Response) {
  const { userId, items, billingDetails, shippingAddress, userEmail } =
    req.body;

  try {
    const result = await create_checkout_order_service({
      userId,
      items,
      billingDetails,
      shippingAddress,
      userEmail,
    });
    res.status(201).json(result);
  } catch (err: any) {
    logger.error(err);
    res.status(500).json({ error: err.message });
  }
}

export async function verifyPaymentController(req: Request, res: Response) {
  const { reference } = req.params;
  try {
    const order = await verify_payment_service(reference as string);
    res.status(200).json({ success: true, order });
  } catch (err: any) {
    logger.error(err);
    res.status(500).json({ error: err.message });
  }
}

export async function paystackWebhookController(req: Request, res: Response) {
  const signature = req.headers["x-paystack-signature"] as string;
  try {
    await handle_paystack_webhook_service(signature, req.body);
    res.status(200).send("Webhook handled successfully");
  } catch (err: any) {
    logger.error("Paystack Webhook Error:", err.message);
    res.status(400).send(err.message);
  }
}

export async function viewOne_order_controller(req: Request, res: Response) {
  const { userId } = req.params;
  try {
    const orders = await viewOne_order_service(userId as string);
    res.status(200).send(orders);
  } catch (err: any) {
    logger.error(err);
    res.status(500).json({ error: err.message });
  }
}

export async function cancle_order_controller(req: Request, res: Response) {
  const { id } = req.params; // orderId
  const userId = (req as any).user?.id;
  try {
    await cancle_order_service(id as string, userId as string);
    res.status(200).send("Order canceled!!");
  } catch (err: any) {
    logger.error(err);
    if (err.message === "Order not found") {
      return res.status(404).send(err.message);
    }
    res.status(500).json({ error: err.message });
  }
}

export async function getMyOrdersController(req: Request, res: Response) {
  const userId = (req as any).user?.id;
  try {
    const result = await getCustomerOrdersService(userId as string);
    res
      .status(200)
      .json({ data: result, message: "Orders fetched successfully" });
  } catch (err: any) {
    logger.error(err);
    res.status(500).json({ error: err.message });
  }
}

export async function delete_order_controller(req: Request, res: Response) {
  const { userId } = req.params;
  try {
    await delete_order_service(userId as string);
    res.status(200).send("Order Deleted!!");
  } catch (err: any) {
    logger.error(err);
    res.status(500).json({ error: err.message });
  }
}

export async function getAllOrdersController(req: Request, res: Response) {
  try {
    const filters = req.query;
    const result = await getAllOrdersService(filters);
    res
      .status(200)
      .json({ data: result, message: "Orders fetched successfully" });
  } catch (err: any) {
    logger.error(err);
    res.status(500).json({ error: err.message });
  }
}

export async function getOrderByIdController(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const result = await getOrderByIdService(id as string);
    if (!result)
      return res.status(404).json({ data: null, message: "Order not found" });
    res
      .status(200)
      .json({ data: result, message: "Order fetched successfully" });
  } catch (err: any) {
    logger.error(err);
    res.status(500).json({ error: err.message });
  }
}

export async function getCustomerStatsController(req: Request, res: Response) {
  try {
    const result = await getCustomerStatsService();
    res
      .status(200)
      .json({ data: result, message: "Customer stats fetched successfully" });
  } catch (err: any) {
    logger.error(err);
    res.status(500).json({ error: err.message });
  }
}

export async function getOrderStatsController(req: Request, res: Response) {
  try {
    const result = await getOrderStatsService();
    res
      .status(200)
      .json({ data: result, message: "Order stats fetched successfully" });
  } catch (err: any) {
    logger.error(err);
    res.status(500).json({ error: err.message });
  }
}

export async function getCustomerProfileController(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;
    const result = await getCustomerProfileService(id as string);
    res
      .status(200)
      .json({ data: result, message: "Customer profile fetched successfully" });
  } catch (err: any) {
    logger.error(err);
    res.status(500).json({ error: err.message });
  }
}

export async function getCustomerOrdersController(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const result = await getCustomerOrdersService(id as string);
    res
      .status(200)
      .json({ data: result, message: "Customer orders fetched successfully" });
  } catch (err: any) {
    logger.error(err);
    res.status(500).json({ error: err.message });
  }
}
