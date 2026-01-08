import Shipment from "../model/shipmentModel";
import orders from "../model/orderModel";
import logger from "../config/logger";
import {
  ShipmentStatus,
  validateShipmentTransition,
  SHIPMENT_TO_ORDER_STATUS,
} from "../utils/shipmentStateMachine";
import { getCourier } from "./courierService";

/**
 * Initial shipment creation during post-checkout
 */
export async function prepareShipmentService(data: {
  orderId: string;
  items: any[];
  shippingAddress: any;
}) {
  try {
    const shipment = await Shipment.create({
      orderId: data.orderId,
      items: data.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      shippingAddress: data.shippingAddress,
      status: "PENDING",
      statusHistory: [{ status: "PENDING", reason: "Order confirmed" }],
    });
    logger.info(`Shipment record created for order ${data.orderId}`);
    return shipment;
  } catch (error: any) {
    logger.error(
      `Error preparing shipment for order ${data.orderId}: ${error.message}`
    );
    throw error;
  }
}

/**
 * Admin updates shipment status
 */
export async function updateShipmentStatusService(
  shipmentId: string,
  nextStatus: ShipmentStatus,
  reason?: string
) {
  const shipment = await Shipment.findById(shipmentId);
  if (!shipment) throw new Error("Shipment not found");

  const currentStatus = shipment.status as ShipmentStatus;

  // 1. Validate state transition
  if (!validateShipmentTransition(currentStatus, nextStatus)) {
    throw new Error(
      `Invalid transition from ${currentStatus} to ${nextStatus}`
    );
  }

  // 2. Update Shipment
  shipment.status = nextStatus;
  shipment.statusHistory.push({
    status: nextStatus,
    timestamp: new Date(),
    reason: reason || "Admin update",
  });
  await shipment.save();

  // 3. Sync with Order status
  const orderStatus = SHIPMENT_TO_ORDER_STATUS[nextStatus];
  if (orderStatus) {
    await orders.findByIdAndUpdate(shipment.orderId, { status: orderStatus });
    logger.info(`Order ${shipment.orderId} status synced to ${orderStatus}`);
  }

  logger.info(`Shipment ${shipmentId} updated to ${nextStatus}`);
  return shipment;
}

/**
 * Admin assigns a courier
 */
export async function assignCourierService(
  shipmentId: string,
  courierName: string
) {
  const shipment = await Shipment.findById(shipmentId);
  if (!shipment) throw new Error("Shipment not found");

  const courierProvider = getCourier(courierName);
  if (!courierProvider) throw new Error("Unsupported courier");

  const assignment = await courierProvider.assignShipment(
    shipment.orderId.toString(),
    shipment.shippingAddress
  );

  shipment.courier = {
    name: courierName,
    trackingNumber: assignment.trackingNumber,
  };
  shipment.estimatedDelivery = assignment.estimatedDelivery;

  // Move to PACKED/SHIPPED if assignment succeeds
  return await updateShipmentStatusService(
    shipmentId,
    assignment.status as ShipmentStatus,
    `Assigned to ${courierName}`
  );
}

export async function getAllShipmentsService(filter: any = {}) {
  return await Shipment.find(filter)
    .sort({ createdAt: -1 })
    .populate("orderId");
}

export async function getShipmentByIdService(id: string) {
  return await Shipment.findById(id)
    .populate("orderId")
    .populate("items.productId");
}

export async function trackShipmentByOrderIdService(id: string) {
  return await Shipment.findOne({ orderId: id })
    .populate("orderId")
    .populate("items.productId");
}
