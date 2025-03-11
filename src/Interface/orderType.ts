export interface orderType {
  userId: string;
  items: { productId: string; quantity: number; price: number }[];
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }[];
  paymentStatus: string;
  transactionId: string | null;
  status: string;
  totalAmount?: number;
}
