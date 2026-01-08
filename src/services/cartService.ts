import { Types } from "mongoose";
import { CartType } from "../Interface/productsType";
import Cart from "../model/cartModel";
import ProductDetails from "../model/productModel";
import logger from "../config/logger";

export async function findExitingCartItem(userId: string) {
  return await Cart.findOne({ userId });
}

export async function getCartService(userId: string) {
  const cartItem = await Cart.findOne({ userId });
  if (!cartItem) return [];
  const populatedCart = await cartItem.populate("items.productId");
  return populatedCart.items;
}

export async function addCartItemService(
  userId: string,
  productId: string,
  quantity: number
) {
  // Check product availability
  const product = await ProductDetails.findById(productId);
  if (!product) {
    throw new Error("Product not found");
  }

  if (product.quantity < quantity) {
    throw new Error("Insufficient stock");
  }

  let cart = await Cart.findOne({ userId });

  if (cart) {
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      const newQuantity = cart.items[itemIndex]!.quantity + quantity;
      if (product.quantity < newQuantity) {
        throw new Error("Insufficient stock for update");
      }
      cart.items[itemIndex]!.quantity = newQuantity;
    } else {
      cart.items.push({ productId, quantity });
    }
    await cart.save();
    return cart;
  } else {
    const newCart = await Cart.create({
      userId,
      items: [{ productId, quantity }],
    });
    return newCart;
  }
}

export async function updateCartItemService(
  userId: string,
  itemId: string,
  quantity: number
) {
  const cart = await Cart.findOne({ userId });
  if (!cart) throw new Error("Cart not found");

  const itemIndex = cart.items.findIndex(
    (item) => item._id!.toString() === itemId
  );
  if (itemIndex === -1) throw new Error("Item not found in cart");

  const productId = cart.items[itemIndex]!.productId;
  const product = await ProductDetails.findById(productId);

  if (!product) throw new Error("Product not found");
  if (product.quantity < quantity) throw new Error("Insufficient stock");

  cart.items[itemIndex]!.quantity = quantity;
  await cart.save();
  return cart.items;
}

export async function deleteCartItemService(userId: string, itemId: string) {
  const cart = await Cart.findOne({ userId });
  if (!cart) throw new Error("Cart not found");

  const initialLength = cart.items.length;
  cart.items = cart.items.filter(
    (item) => item._id!.toString() !== itemId
  ) as any;

  if (cart.items.length === 0) {
    await Cart.deleteOne({ userId });
    return { message: "Cart cleared and deleted" };
  }

  if (cart.items.length === initialLength) {
    throw new Error("Item not found in cart");
  }

  await cart.save();
  return { message: "Item deleted", items: cart.items };
}

export async function syncCartService(
  userId: string,
  items: { productId: Types.ObjectId; quantity: number }[]
) {
  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = await Cart.create({ userId, items });
  } else {
    cart.items = items.map(
      (item: { productId: Types.ObjectId; quantity: number }) => ({
        productId: item.productId,
        quantity: item.quantity,
      })
    ) as any;
    await cart.save();
  }

  const populatedCart = await cart.populate("items.productId");
  return populatedCart.items;
}

export async function clearPurchasedItemsService(
  userId: string,
  items: { productId: Types.ObjectId | string }[]
) {
  const purchasedIds = items.map((item) =>
    item.productId instanceof Types.ObjectId
      ? item.productId
      : new Types.ObjectId(item.productId)
  );

  const result = await Cart.updateOne(
    { userId },
    {
      $pull: {
        items: {
          productId: { $in: purchasedIds },
        },
      },
    }
  );

  logger.info("Cart update result:", result);

  const cart = await Cart.findOne({ userId });

  if (!cart || cart.items.length === 0) {
    await Cart.deleteOne({ userId });
    return { message: "Cart cleared" };
  }

  return { message: "Purchased items removed", items: cart.items };
}
