import { Request, Response } from "express";
import {
  delete_shipping_address_service,
  edit_shipping_address_service,
  get_shipping_address_service,
  shipping_address_service,
} from "../services/shippingAddressService";
import logger from "../config/logger";

export async function shipping_address_controller(req: Request, res: Response) {
  const userId = (req as any).user?.id;
  try {
    const result = await shipping_address_service({ ...req.body, userId });
    res.status(200).json({ data: result, message: "Created Successfully" });
  } catch (err: any) {
    logger.error(err);
    res.status(500).json({ error: err.message });
  }
}

export async function get_shipping_address_controller(
  req: Request,
  res: Response
) {
  const userId = (req as any).user?.id;
  try {
    const result = await get_shipping_address_service(userId as string);
    res.status(200).send(result);
  } catch (err: any) {
    logger.error(err);
    res.status(500).json({ error: err.message });
  }
}

export async function edit_shipping_address_controller(
  req: Request,
  res: Response
) {
  const { shippingAddressId } = req.params;
  const userId = (req as any).user?.id;
  try {
    const result = await edit_shipping_address_service({
      ...req.body,
      shippingAddressId,
      userId,
    });
    res.status(200).send(result);
  } catch (err: any) {
    logger.error(err);
    res.status(500).json({ error: err.message });
  }
}

export async function delete_shipping_address_controller(
  req: Request,
  res: Response
) {
  const { shippingAddressId } = req.params; // Changed from body to params for REST consistency
  const userId = (req as any).user?.id;
  try {
    await delete_shipping_address_service(
      shippingAddressId as string,
      userId as string
    );
    res.status(200).send("Shipping address deleted");
  } catch (err: any) {
    logger.error(err);
    res.status(500).json({ error: err.message });
  }
}
