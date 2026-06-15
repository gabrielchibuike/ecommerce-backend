import { Request, Response } from "express";
import {
  addCartItemService,
  deleteCartItemService,
  getCartService,
  syncCartService,
  updateCartItemService,
} from "../services/cartService";
import logger from "../config/logger";

export async function addCartController(req: Request, res: Response) {
  const { userId, productId, quantity } = req.body;
  try {
    const cart = await addCartItemService(userId, productId, quantity);
    res.status(200).send(cart);
  } catch (err: any) {
    logger.error(err);
    res.status(500).json({ error: err.message });
  }
}

export async function getCartController(req: Request, res: Response) {
  const { userId } = req.params;
  try {
    const items = await getCartService(userId as string);
    res.status(200).json({ data: items, message: "Retrived successfully" });
  } catch (err: any) {
    logger.error(err);
    res.status(500).json({ error: err.message });
  }
}

export async function updateCartController(req: Request, res: Response) {
  const { userId, itemId } = req.params;
  const { quantity } = req.body;
  try {
    const items = await updateCartItemService(
      userId as string,
      itemId as string,
      quantity
    );
    res.status(200).send(items);
  } catch (err: any) {
    logger.error(err);
    res.status(500).json({ error: err.message });
  }
}

export async function deleteCartController(req: Request, res: Response) {
  const { userId, itemId } = req.params;
  try {
    const result = await deleteCartItemService(
      userId as string,
      itemId as string
    );
    res.status(200).send(result.message);
  } catch (err: any) {
    logger.error(err);
    res.status(500).json({ error: err.message });
  }
}

export async function syncCartController(req: Request, res: Response) {
  const { userId, items } = req.body;
  try {
    const finalItems = await syncCartService(userId, items);
    res.status(200).json({
      data: finalItems,
      message: "Cart synced successfully",
    });
  } catch (err: any) {
    logger.error(err);
    res.status(500).json({ error: err.message });
  }
}
