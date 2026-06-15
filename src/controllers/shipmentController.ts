import { Request, Response } from "express";
import {
  getAllShipmentsService,
  getShipmentByIdService,
  updateShipmentStatusService,
  assignCourierService,
  trackShipmentByOrderIdService,
} from "../services/shipmentService";
import logger from "../config/logger";

export async function getAllShipmentsController(req: Request, res: Response) {
  try {
    const filters = req.query;
    const shipments = await getAllShipmentsService(filters);
    res
      .status(200)
      .json({ data: shipments, message: "Shipments fetched successfully" });
  } catch (error: any) {
    logger.error(error.message);
    res.status(500).json({ error: error.message });
  }
}

export async function getShipmentByIdController(req: Request, res: Response) {
  try {
    const { id } = req.params;
    logger.info(id);
    const shipment = await getShipmentByIdService(id as string);
    if (!shipment)
      return res
        .status(404)
        .json({ data: null, message: "Shipment not found" });
    res
      .status(200)
      .json({ data: shipment, message: "Shipment fetched successfully" });
  } catch (error: any) {
    logger.error(error.message);
    res.status(500).json({ error: error.message });
  }
}

export async function updateShipmentStatusController(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;
    const shipment = await updateShipmentStatusService(
      id as string,
      status,
      reason
    );
    res.status(200).json({
      data: shipment,
      message: "Shipment status updated successfully",
    });
  } catch (error: any) {
    logger.error(error.message);
    res.status(400).json({ error: error.message });
  }
}

export async function assignCourierController(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { courierName } = req.body;
    const shipment = await assignCourierService(id as string, courierName);
    res
      .status(200)
      .json({ data: shipment, message: "Courier assigned successfully" });
  } catch (error: any) {
    logger.error(error.message);
    res.status(400).json({ error: error.message });
  }
}

export async function trackShipmentByOrderIdController(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;
    logger.info(id);
    const shipment = await trackShipmentByOrderIdService(id as string);
    if (!shipment)
      return res
        .status(404)
        .json({ data: null, message: "Shipment not found" });
    res
      .status(200)
      .json({ data: shipment, message: "Shipment fetched successfully" });
  } catch (error: any) {
    logger.error(error.message);
    res.status(500).json({ error: error.message });
  }
}
