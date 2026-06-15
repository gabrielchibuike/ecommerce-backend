import express from "express";
import {
  get_active_deals_controller,
  create_deal_controller,
  get_all_deals_controller,
  update_deal_controller,
  delete_deal_controller,
} from "../controllers/dealController";
// import { isAdmin } from "../middleware/authMiddleware"; // Assuming isAdmin middleware exists

const router = express.Router();

// Public route to get active deals
router.get("/today", get_active_deals_controller);

// Admin routes (should be protected in a real app)
router.get("/all", get_all_deals_controller);
router.post("/", create_deal_controller);
router.patch("/:id", update_deal_controller);
router.delete("/:id", delete_deal_controller);

export default router;
