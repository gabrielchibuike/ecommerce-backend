import { productsType } from "../Interface/productsType";
import adminProductDetails from "../model/product.model";

export async function create_product_service({
  product_name,
  product_image,
  category_name,
  price,
  description,
  quantity,
  specification,
}: productsType) {
  const result = await adminProductDetails.create({
    product_name,
    product_image,
    category_name,
    price,
    description,
    quantity,
    specification,
  });
  return result;
}

export async function find_existing_product(product_name: string) {
  const isExisting = await adminProductDetails.findOne({
    product_name,
  });
  return isExisting;
}

export async function get_product_service() {
  const result = await adminProductDetails.findOne({});
  return result;
}

export async function getOne_product_service(id: string) {
  const result = await adminProductDetails.findOne({ _id: id });
  return result;
}

export async function edit_product_service({
  id,
  product_name,
  product_image,
  category_name,
  price,
  description,
  quantity,
  specification,
}: productsType) {
  const result = await adminProductDetails.updateOne(
    { _id: id },
    {
      product_name,
      product_image,
      category_name,
      price,
      description,
      quantity,
      specification,
    },
    { new: true }
  );

  return result;
}

export async function delete_product_service(id: string) {
  const result = await adminProductDetails.deleteOne({ _id: id });
  return result;
}
