import orders from "../model/orderModel";
import logger from "../config/logger";

export async function generateInvoiceService(orderId: string) {
  try {
    const order = await orders.findById(orderId);
    if (!order) throw new Error("Order not found");

    if (order.invoiceNumber) return order;

    const timestamp = Date.now();
    const invoiceNumber = `INV-${orderId
      .substring(orderId.length - 6)
      .toUpperCase()}-${timestamp}`;

    // Here we could generate a PDF and upload to S3/Cloudinary
    // For now, we'll just store the invoice number and a mock reference
    const invoiceReference = `https://ecommerce.com/invoices/${invoiceNumber}.json`;

    order.invoiceNumber = invoiceNumber;
    order.invoiceReference = invoiceReference;
    await order.save();

    logger.info(`Invoice generated for order ${orderId}: ${invoiceNumber}`);
    return order;
  } catch (error: any) {
    logger.error(
      `Error generating invoice for order ${orderId}: ${error.message}`
    );
    throw error; // Critical task
  }
}
