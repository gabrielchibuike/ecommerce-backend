export interface BillingDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  streetAddress: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  companyName?: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  phone: string;
  streetAddress: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface orderType {
  userId: string;
  items: { productId: string; quantity: number; price: number }[];
  billingDetails: BillingDetails;
  shippingAddress: ShippingAddress;
  paymentStatus: string;
  paymentReference?: string;
  transactionId?: string | null;
  status: string;
  totalPrices: number;
}
