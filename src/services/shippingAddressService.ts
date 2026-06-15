import { shippingAddressType } from "../Interface/shippingAddressType";
import ShippingAddress from "../model/shippingAddressModel";
import { shippingAddressSchema } from "../utils/validation";

export async function shipping_address_service(
  data: shippingAddressType & { userId: string }
) {
  const { error } = shippingAddressSchema.validate(data);
  if (error)
    throw new Error(error.details.map((err) => err.message).join(", "));

  return await ShippingAddress.create(data);
}

export async function get_shipping_address_service(userId: string) {
  return await ShippingAddress.find({ userId });
}

export async function edit_shipping_address_service(
  data: shippingAddressType & { shippingAddressId: string; userId: string }
) {
  const result = await ShippingAddress.findOneAndUpdate(
    { _id: data.shippingAddressId, userId: data.userId },
    data,
    { new: true }
  );
  if (!result) throw new Error("Shipping address not found or unauthorized");
  return result;
}

export async function delete_shipping_address_service(
  shippingAddressId: string,
  userId: string
) {
  const result = await ShippingAddress.deleteOne({
    _id: shippingAddressId,
    userId: userId,
  });
  if (result.deletedCount === 0)
    throw new Error("Shipping address not found or unauthorized");
  return result;
}
