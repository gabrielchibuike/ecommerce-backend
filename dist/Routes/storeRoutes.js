"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const storeController_1 = require("../controllers/storeController");
const router = express_1.default.Router();
router.get("/getStoreConfig", storeController_1.get_store_config_controller);
router.put("/updateStoreConfig", storeController_1.update_store_config_controller);
router.get("/navigation-menu", storeController_1.get_navigation_menu_controller);
exports.default = router;
