import { productsType } from "../Interface/productsType";
import ProductDetails from "../model/productModel";
import adminProductDetails from "../model/productModel";

export async function create_product_service({
  product_name,
  product_category,
  sub_category,
  manufacturer_brand,
  description,
  color,
  size,
  status,
  quantity,
  price,
  discount,
  product_image,
}: productsType) {
  const result = await ProductDetails.create({
    product_name,
    product_category,
    sub_category,
    manufacturer_brand,
    description,
    color,
    size,
    status,
    quantity,
    price,
    discount,
    product_image,
  });
  console.log(result);

  return result;
}

export async function find_existing_product(product_name: string) {
  const isExisting = await ProductDetails.findOne({
    product_name,
  });
  return isExisting;
}

export async function get_product_service() {
  const result = await ProductDetails.find({});
  return result;
}

export async function getOne_product_service(id: string) {
  const result = await ProductDetails.findOne({ _id: id });
  return result;
}

export async function edit_product_service({
  id,
  product_name,
  product_category,
  sub_category,
  manufacturer_brand,
  description,
  color,
  size,
  status,
  quantity,
  price,
  discount,
  product_image,
}: productsType) {
  const result = await ProductDetails.updateOne(
    { _id: id },
    {
      product_name,
      product_category,
      sub_category,
      manufacturer_brand,
      description,
      color,
      size,
      status,
      quantity,
      price,
      discount,
      product_image,
    },
    { new: true }
  );

  return result;
}

export async function delete_product_service(productId: string) {
  const result = await ProductDetails.deleteOne({ _id: productId });
  console.log(result);

  return result;
}
