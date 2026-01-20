import { Request, Response } from "express";
import {
  get_active_deals_service,
  create_deal_service,
  get_all_deals_service,
  update_deal_service,
  delete_deal_service,
} from "../services/dealService";
import logger from "../config/logger";

export const get_active_deals_controller = async (
  req: Request,
  res: Response
) => {
  try {
    const deals = await get_active_deals_service();
    res
      .status(200)
      .json({ data: deals, message: "Active deals retrieved successfully" });
  } catch (err: any) {
    logger.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const create_deal_controller = async (req: Request, res: Response) => {
  try {
    const deal = await create_deal_service(req.body);
    res.status(201).json({ data: deal, message: "Deal created successfully" });
  } catch (err: any) {
    logger.error(err);
    if (err.message.includes("overlapping")) {
      return res.status(409).json({ message: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

export const get_all_deals_controller = async (req: Request, res: Response) => {
  try {
    const deals = await get_all_deals_service();
    res
      .status(200)
      .json({ data: deals, message: "All deals retrieved successfully" });
  } catch (err: any) {
    logger.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const update_deal_controller = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deal = await update_deal_service(id as string, req.body);
    res.status(200).json({ data: deal, message: "Deal updated successfully" });
  } catch (err: any) {
    logger.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const delete_deal_controller = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await delete_deal_service(id as string);
    res.status(200).json({ message: "Deal deleted successfully" });
  } catch (err: any) {
    logger.error(err);
    res.status(500).json({ error: err.message });
  }
};
