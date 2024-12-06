import { Request, Response } from "express";
import {
  find_existing_saved_item,
  readSavedItem_service,
  removeSavedItem_service,
  saveItem_service,
} from "../services/user.saveItem";

export async function saveItem_controller(req: Request, res: Response) {
  const { userId, productId, quantity } = req.body;
  try {
    const existing_item = await find_existing_saved_item(userId);

    if (existing_item && existing_item!.items.length > 0) {
      // add item in cart
      existing_item!.items.push({ productId, quantity });

      // Save the updated document
      await existing_item.save();

      res.status(200).send(existing_item);
    } else {
      // create cart for users

      const arr = [];

      arr.push({ productId, quantity });

      const products = await saveItem_service({
        userId,
        items: arr,
      });
      res.status(200).send(products);
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function readSavedItem_controller(req: Request, res: Response) {
  const { userId } = req.params;
  try {
    const savedItem = await readSavedItem_service(userId as string);

    const cart = await savedItem!.populate("items.productId");

    res.status(200).send(cart.items);
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
}

export async function removeSavedItem_controller(req: Request, res: Response) {
  const { userId, itemId } = req.params;
  try {
    const savedItem = await readSavedItem_service(userId as string);

    const result = savedItem?.items.filter((item) => item._id != itemId);

    const item = await removeSavedItem_service(
      userId as string,
      result as unknown as any
    );

    res.status(200).send("item deleted");
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
}
