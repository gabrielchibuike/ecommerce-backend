import express, { Request, Response } from "express";
import {
  create_order_controller,
  //   get_order_controller,
  //   getOne_order_controller,
} from "../controllers/orderController";
import axios from "axios";
import { logger } from "../utils/logger";

const orderRoute = express.Router();

orderRoute.post("/create_order", create_order_controller);

// orderRoute.post("/view_orders", get_order_controller);

// orderRoute.post("/view_single_orders/:id", getOne_order_controller);

// orderRoute.post("/delete_orders/:id", getOne_order_controller);

require("dotenv").config(); // Load environment variables

// Initialize a Paystack transaction
orderRoute.post("/initialize-payment", async (req, res) => {
  try {
    const { email, amount } = req.body;

    console.log(email, amount);

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

    res.json(response.data); // Send the Paystack response to frontend
  } catch (error) {
    if (axios.isAxiosError(error)) {
      logger.error("Paystack Error:", error.response?.data || error.message);
      res.status(500).json({ error: error.response?.data || error.message });
    } else {
      logger.error("Paystack Error:", (error as Error).message);
    }
  }
});

// Verify payment
orderRoute.get("/verify-payment/:reference", async (req, res) => {
  try {
    const { reference } = req.params;

    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.data.status === "success") {
      res.json({
        success: true,
        message: "Payment successful",
        data: response.data.data,
      });
    } else {
      console.log(response.data.data);

      res.status(400).json({ success: false, message: "Payment failed" });
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      logger.error("Paystack Error:", error.response?.data || error.message);
      res.status(500).json({ error: "Payment verification failed" });
    } else {
      logger.error("Paystack Error:", (error as Error).message);
    }
  }
});

export default orderRoute;
