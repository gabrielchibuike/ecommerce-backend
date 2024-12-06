import { Request, Response } from "express";
import {
  add_cart_service,
  delete_cart_service,
  find_existing_cart_item,
  get_cart_service,
} from "../services/user.cart";

export async function add_cart_controller(req: Request, res: Response) {
  const { userId, productId, quantity } = req.body;
  try {
    const existing_cart = await find_existing_cart_item(userId);

    if (existing_cart && existing_cart!.items.length > 0) {
      // add item in cart
      existing_cart!.items.push({ productId, quantity });

      // Save the updated document
      await existing_cart.save();

      res.status(200).send(existing_cart);
    } else {
      // create cart for users

      const arr = [];

      arr.push({ productId, quantity });

      const products = await add_cart_service({
        userId,
        items: arr,
      });
      res.status(200).send(products);
    }
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
}

export async function get_cart_controller(req: Request, res: Response) {
  const { userId } = req.params;
  try {
    const cartItem = await get_cart_service(userId as string);

    const cart = await cartItem!.populate("items.productId");

    res.status(200).send(cart.items);
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
}

export async function edit_cart_controller(req: Request, res: Response) {
  const { userId, itemId } = req.params;
  const { quantity } = req.body;
  try {
    const cartItem = await get_cart_service(userId as string);

    const item = cartItem!.items;

    const index = item.findIndex((item) => item._id!.toString() === itemId);
    console.log(index);

    if (index !== -1) {
      cartItem!.items[index]!.quantity =
        quantity || cartItem!.items[index]!.quantity;
      cartItem!.items[index]!.productId;
    }
    await cartItem?.save();
    res.status(200).send(cartItem?.items);
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
}

export async function delete_cart_controller(req: Request, res: Response) {
  const { userId, itemId } = req.params;
  try {
    const cartItem = await get_cart_service(userId as string);

    const result = cartItem?.items.filter((item) => item._id != itemId);

    const item = await delete_cart_service(
      userId as string,
      result as unknown as any
    );

    res.status(200).send("item deleted");
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
}
