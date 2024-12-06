export interface orderType {
  userId: string;
  items: { productId: string; quantity: number; price: number }[];
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  paymentStatus: string;
  paymentTransaction: string | null;
  status: string;
  totalAmount: number;
}
