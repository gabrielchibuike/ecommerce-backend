import express from "express";
import {
  get_store_config_controller,
  update_store_config_controller,
  get_navigation_menu_controller,
} from "../controllers/storeController";

const router = express.Router();

router.get("/getStoreConfig", get_store_config_controller);
router.put("/updateStoreConfig", update_store_config_controller);
router.get("/navigation-menu", get_navigation_menu_controller);

export default router;
