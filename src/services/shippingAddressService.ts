import { shippingAddressType } from "../Interface/shippingAddressType";
import ShippingAddress from "../model/shippingAddressModel";

export async function shipping_address_service({
  firstName,
  lastName,
  phone,
  email,
  streetAddress,
  additionalInfo,
  city,
  state,
}: shippingAddressType) {
  const result = await ShippingAddress.create({
    firstName,
    lastName,
    phone,
    email,
    streetAddress,
    additionalInfo,
    city,
    state,
  });
  return result;
}

export async function get_shipping_address_service(userId: string) {
  return await ShippingAddress.findById({ _id: userId });
}

export async function edit_shipping_address_service({
  shippingAddressId,
  firstName,
  lastName,
  phone,
  email,
  streetAddress,
  additionalInfo,
  city,
  state,
}: shippingAddressType) {
  const result = await ShippingAddress.updateOne(
    { _id: shippingAddressId },
    {
      firstName,
      lastName,
      phone,
      email,
      streetAddress,
      additionalInfo,
      city,
      state,
    },
    { new: true }
  );
  return result;
}

export async function delete_shipping_address_service(
  shippingAddressId: string
) {
  const result = await ShippingAddress.deleteOne({ _id: shippingAddressId });
  return result;
}
