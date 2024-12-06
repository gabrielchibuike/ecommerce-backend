import { CartType } from "../Interface/productsType";
import Cart from "../model/user.cart";

export async function add_cart_service({ userId, items }: CartType) {
  const result = await Cart.create({
    userId,
    items,
  });
  return result;
}

export async function find_existing_cart_item(userId: string) {
  const isExisting = await Cart.findOne({
    userId,
  });
  return isExisting;
}

export async function get_cart_service(userId: string) {
  const cartItem = await Cart.findOne({
    userId,
  });
  return cartItem;
}

export async function edit_cart_service(userId: string) {
  const cartItem = await Cart.findOne({
    userId,
  });
  return cartItem;
}

export async function delete_cart_service(
  userId: string,
  item: {
    productId: string;
    quantity: number;
  }[]
) {
  const cartItem = await Cart.updateOne(
    { userId: userId },
    { items: item },
    { new: true }
  );
  return cartItem;
}
