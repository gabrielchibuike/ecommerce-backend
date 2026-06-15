import nodemailer from "nodemailer";
import logger from "../config/logger";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "your_email@gmail.com",
    pass: process.env.EMAIL_PASS || "your_app_password",
  },
});

export async function sendOrderConfirmationEmail(data: {
  email: string;
  orderId: string;
  items: any[];
  totalAmount: number;
  billingDetails: any;
  shippingAddress: any;
  paymentStatus: string;
}) {
  const itemsHtml = data.items
    .map(
      (item) =>
        `<li>${item.productId.product_name} x ${item.quantity} - $${item.price}</li>`
    )
    .join("");

  const mailOptions = {
    from: '"E-commerce Checkout" <no-reply@ecommerce.com>',
    to: data.email,
    subject: `Order Confirmation - #${data.orderId}`,
    html: `
      <h2>Thank you for your order!</h2>
      <p>Your order <strong>#${data.orderId}</strong> has been received and is being processed.</p>
      <h3>Order Summary</h3>
      <ul>${itemsHtml}</ul>
      <p><strong>Total Amount:</strong> $${data.totalAmount}</p>
      <p><strong>Payment Status:</strong> ${data.paymentStatus}</p>
      <h3>Shipping Address</h3>
      <p>${data.shippingAddress.streetAddress}, ${data.shippingAddress.city}, ${data.shippingAddress.state}, ${data.shippingAddress.zipCode}, ${data.shippingAddress.country}</p>
      <p>We'll notify you when your items are on the way!</p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info(`Confirmation email sent to ${data.email}: ${info.response}`);
  } catch (error: any) {
    logger.error(
      `Error sending confirmation email to ${data.email}: ${error.message}`
    );
    // Non-blocking: we don't throw error to avoid breaking the workflow
  }
}
