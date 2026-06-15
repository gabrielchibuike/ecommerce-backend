export type ShipmentStatus =
  | "PENDING"
  | "PACKED"
  | "SHIPPED"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "FAILED"
  | "RETURNED";

export const ALLOWED_TRANSITIONS: Record<ShipmentStatus, ShipmentStatus[]> = {
  PENDING: ["PACKED", "FAILED"],
  PACKED: ["SHIPPED", "FAILED"],
  SHIPPED: ["IN_TRANSIT", "FAILED"],
  IN_TRANSIT: ["DELIVERED", "FAILED"],
  DELIVERED: ["RETURNED"],
  FAILED: ["PENDING", "PACKED"], // Allow retrying/repacking
  RETURNED: [],
};

export function validateShipmentTransition(
  currentStatus: ShipmentStatus,
  nextStatus: ShipmentStatus
): boolean {
  return ALLOWED_TRANSITIONS[currentStatus].includes(nextStatus);
}

export type OrderStatus =
  | "Pending"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Completed"
  | "Delivery Failed"
  | "Returned"
  | "Cancelled";

export const SHIPMENT_TO_ORDER_STATUS: Partial<
  Record<ShipmentStatus, OrderStatus>
> = {
  SHIPPED: "Shipped",
  DELIVERED: "Completed",
  FAILED: "Delivery Failed",
  RETURNED: "Returned",
};
