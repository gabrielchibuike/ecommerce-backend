export interface productsType {
  id?: string;
  product_name: string;
  product_category: string;
  sub_category: string;
  manufacturer_brand: string;
  description: string;
  color: string[];
  size: string[];
  status: string;
  quantity: string;
  price: string;
  discount: string;
  product_image: string[];
}

export interface CartType {
  userId: string;
  items: { _id?: string; productId: string; quantity: number }[];
}
