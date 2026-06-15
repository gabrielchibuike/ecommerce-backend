import { Request, Response } from "express";
import {
  get_store_config_service,
  update_store_config_service,
  get_navigation_menu_service,
} from "../services/storeService";

export const get_store_config_controller = async (
  req: Request,
  res: Response
) => {
  try {
    const store = await get_store_config_service();
    res.status(200).json({ data: store, message: "Retrived Sucessfully" });
  } catch (error: any) {
    res.status(500).json({ data: null, message: error.message });
  }
};

export const update_store_config_controller = async (
  req: Request,
  res: Response
) => {
  try {
    const store = await update_store_config_service(req.body);
    res.status(200).json({ data: store, message: "Created Sucessfully" });
  } catch (error: any) {
    res.status(500).json({ data: null, message: error.message });
  }
};

export const get_navigation_menu_controller = async (
  req: Request,
  res: Response
) => {
  try {
    const menu = await get_navigation_menu_service();
    res.status(200).json({ data: menu, message: "Retrieved Successfully" });
  } catch (error: any) {
    res.status(500).json({ data: null, message: error.message });
  }
};
