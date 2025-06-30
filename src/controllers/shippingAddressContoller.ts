import { Request, Response } from "express";
import {
  delete_shipping_address_service,
  edit_shipping_address_service,
  get_shipping_address_service,
  shipping_address_service,
} from "../services/shippingAddressService";
import { shippingAddressSchema } from "../utils/validation";

export async function shipping_address_controller(req: Request, res: Response) {
  const {
    firstName,
    lastName,
    phone,
    email,
    streetAddress,
    additionalInfo,
    city,
    state,
  } = req.body;
  try {
    const { error } = shippingAddressSchema.validate({
      firstName,
      lastName,
      phone,
      email,
      streetAddress,
      additionalInfo,
      city,
      state,
    });
    if (error)
      return res.status(400).send(error.details.map((err) => err.message));
    //   console.log(error.details.map((err) => err.message));
    const result = await shipping_address_service({
      firstName,
      lastName,
      phone,
      email,
      streetAddress,
      additionalInfo,
      city,
      state,
    });
    res.status(200).json({ data: result, message: "Created Sucessfully" });
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
}

export async function get_shipping_address_controller(
  req: Request,
  res: Response
) {
  const { userId } = req.params;
  try {
    const result = await get_shipping_address_service(userId as string);
    res.status(200).send(result);
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
}

export async function edit_shipping_address_controller(
  req: Request,
  res: Response
) {
  const { shippingAddressId } = req.params;
  const {
    firstName,
    lastName,
    phone,
    email,
    streetAddress,
    additionalInfo,
    city,
    state,
  } = req.body;
  try {
    const result = await edit_shipping_address_service({
      shippingAddressId,
      firstName,
      lastName,
      phone,
      email,
      streetAddress,
      additionalInfo,
      city,
      state,
    });
    res.status(200).send(result);
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
}

export async function delete_shipping_address_controller(
  req: Request,
  res: Response
) {
  const { shippingAddressId } = req.body;
  try {
    await delete_shipping_address_service(shippingAddressId as string);

    res.status(200).send("Product deleted");
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
