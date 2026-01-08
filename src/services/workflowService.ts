import orders from "../model/orderModel";
import { sendOrderConfirmationEmail } from "./emailService";
import { generateInvoiceService } from "./invoiceService";
import { notifyAdminService } from "./notificationService";
import { clearPurchasedItemsService } from "./cartService";
import { prepareShipmentService } from "./shipmentService";
import logger from "../config/logger";

export async function runPostCheckoutWorkflow(orderId: string) {
  try {
    const order = await orders.findById(orderId).populate("items.productId");
    if (!order) throw new Error("Order not found");

    // Idempotency check
    if (order.isPostProcessed) {
      logger.info(
        `Post-checkout workflow already completed for order ${orderId}`
      );
      return;
    }

    logger.info(`Starting post-checkout workflow for order ${orderId}`);

    // 1. Generate Invoice (Critical)
    await generateInvoiceService(orderId);

    // 2. Clear Cart Items (Critical)
    await clearPurchasedItemsService(
      order.userId.toString(),
      order.items as any
    );

    // 3. Prepare Shipment (Critical)
    await prepareShipmentService({
      orderId: order._id.toString(),
      items: order.items,
      shippingAddress: order.shippingAddress,
    });

    // 4. Send Order Confirmation Email (Non-blocking)
    // We don't await this if we want it to be truly non-blocking,
    // but for reliability in this sequential flow we can await it within a try-catch in the email service
    await sendOrderConfirmationEmail({
      email: order.billingDetails!.email,
      orderId: order._id.toString(),
      items: order.items,
      totalAmount: order.totalPrices,
      billingDetails: order.billingDetails,
      shippingAddress: order.shippingAddress,
      paymentStatus: order.paymentStatus,
    });

    // 5. Notify Admin (Non-blocking)
    await notifyAdminService({
      orderId: order._id.toString(),
      customerName: `${order.billingDetails!.firstName} ${
        order.billingDetails!.lastName
      }`,
      totalAmount: order.totalPrices,
      paymentMethod: "Paystack", // Assuming this for now, could be dynamic
    });

    // Mark as post-processed
    order.isPostProcessed = true;
    await order.save();

    logger.info(
      `Post-checkout workflow completed successfully for order ${orderId}`
    );
  } catch (error: any) {
    logger.error(
      `Post-checkout workflow failed for order ${orderId}: ${error.message}`
    );
    // In a real production system, we might want to enqueue failed workflows for retry
    throw error;
  }
}
