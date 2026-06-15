export interface CourierTrackResult {
  status: string;
  trackingNumber: string;
  estimatedDelivery?: Date;
  details?: string;
}

export interface ICourierService {
  assignShipment(orderId: string, address: any): Promise<CourierTrackResult>;
  trackShipment(trackingNumber: string): Promise<CourierTrackResult>;
}

class GIGLogisticsService implements ICourierService {
  async assignShipment(
    orderId: string,
    address: any
  ): Promise<CourierTrackResult> {
    // Mock API call to GIGL
    return {
      status: "PACKED",
      trackingNumber: `GIGL-${Math.random()
        .toString(36)
        .substring(7)
        .toUpperCase()}`,
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
    };
  }

  async trackShipment(trackingNumber: string): Promise<CourierTrackResult> {
    return { status: "IN_TRANSIT", trackingNumber };
  }
}

class KwikDeliveryService implements ICourierService {
  async assignShipment(
    orderId: string,
    address: any
  ): Promise<CourierTrackResult> {
    // Mock API call to Kwik
    return {
      status: "PACKED",
      trackingNumber: `KWIK-${Math.random()
        .toString(36)
        .substring(7)
        .toUpperCase()}`,
      estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
    };
  }

  async trackShipment(trackingNumber: string): Promise<CourierTrackResult> {
    return { status: "SHIPPED", trackingNumber };
  }
}

export const courierServices: Record<string, ICourierService> = {
  GIGL: new GIGLogisticsService(),
  KWIK: new KwikDeliveryService(),
};

export function getCourier(name: string): ICourierService | null {
  return courierServices[name.toUpperCase()] || null;
}
