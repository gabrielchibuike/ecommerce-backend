import { orderType } from "../Interface/orderType";
import order from "../model/orders.model";

export async function create_order_service({
  userId,
  items,
  shippingAddress,
  paymentStatus,
  paymentTransaction,
  status,
  totalAmount,
}: orderType) {
  const result = await order.create({
    userId,
    items,
    shippingAddress,
    paymentStatus,
    paymentTransaction,
    status,
    totalAmount,
  });
  return result;
}

export async function find_existing_order(userId: string) {
  const result = await order.findOne({ userId });

  return result;
}

export async function get_order_service() {
  const result = await order.find();

  return result;
}

export async function getOne_order_service(userId: string) {
  const result = await order.findOne({ userId });

  return result;
}

export async function delete_order_service(userId: string) {
  const result = await order.deleteOne({ userId });

  return result;
}
