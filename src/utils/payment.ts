import axios from "axios";
import logger from "../config/logger";
// import { PaystackVerifyResponse } from "../Routes/orderRoute";

//  const callbackUrl = `http://localhost:3000/verify?reference=${order._id}`;

export async function initiatePayment(
  email: string,
  amount: number,
  order: any
) {
  try {
    // initiate payment on Paystack
    const response = await axios.post<any>(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: amount * 100, // Convert amount to Kobo
        callback_url: `${process.env.PAYSTACK_CALLBACK_URL}`,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Send the Paystack response to frontend
    return response.data;
  } catch (error) {
    if ((error as any).response) {
      logger.error(
        "Paystack Error:",
        (error as any).response?.data || (error as any).message
      );
    } else {
      logger.error("Paystack Error:", (error as Error).message);
    }
  }
}
