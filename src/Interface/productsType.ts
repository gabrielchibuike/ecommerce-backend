export interface productsType {
  id?: string;
  product_name: string;
  product_image: string;
  category_name: string;
  price: number;
  description: string;
  quantity: number;
  specification: [{ color: []; size: [] }];
}

export interface CartType {
  userId: string;
  items: { _id?: string; productId: string; quantity: number }[];
}
