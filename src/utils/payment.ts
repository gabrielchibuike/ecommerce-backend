import axios from "axios";
import { logger } from "./logger";

//  const callbackUrl = `http://localhost:3000/verify?reference=${order._id}`;

export async function initiatePayment(email: string, amount: number) {
  try {
    // initiate payment on Paystack
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: amount * 100, // Convert amount to Kobo
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
    if (axios.isAxiosError(error)) {
      logger.error("Paystack Error:", error.response?.data || error.message);
    } else {
      logger.error("Paystack Error:", (error as Error).message);
    }
  }
}
