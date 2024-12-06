import ProductDetails from "../model/product.model";

export async function all_product_service() {
  const result = await ProductDetails.find({});
  return result;
}

export async function single_product_service(productId: string) {
  const result = await ProductDetails.findOne({ _id: productId });
  return result;
}

export async function product_cart_service(cat: string) {
  const result = await ProductDetails.find({
    category_name: cat,
  });

  return result;
}
