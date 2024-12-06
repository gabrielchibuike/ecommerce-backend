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

// export async function view_order_service() {
//   const result = await order.find();

//   return result;
// }

export async function viewOne_order_service(userId: string) {
  const result = await order.findOne({ userId });

  return result;
}

export async function cancle_order_service(userId: string, status: string) {
  const result = await order.updateOne(
    { userId },
    { status: status },
    { new: true }
  );

  return result;
}
