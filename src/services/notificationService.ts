import Notification from "../model/notificationModel";
import logger from "../config/logger";

export async function notifyAdminService(data: {
  orderId: string;
  customerName: string;
  totalAmount: number;
  paymentMethod: string;
}) {
  try {
    await Notification.create({
      orderId: data.orderId,
      customerName: data.customerName,
      totalAmount: data.totalAmount,
      paymentMethod: data.paymentMethod,
    });
    logger.info(`Admin notification created for order ${data.orderId}`);
  } catch (error: any) {
    logger.error(
      `Error notifying admin for order ${data.orderId}: ${error.message}`
    );
    // Non-blocking
  }
}
