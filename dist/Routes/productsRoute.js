"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productsController_1 = require("../controllers/productsController");
const verifyJwt_1 = require("../middleware/verifyJwt");
const cloudinary_config_1 = require("../config/cloudinary.config");
const productRoute = express_1.default.Router();
productRoute.post("/create_product", cloudinary_config_1.upload.array("files", 4), productsController_1.create_product_controller);
productRoute.get("/get_featured_products", verifyJwt_1.verifyToken, 
// authorizePermission("admin", "user"),
productsController_1.featuerd_product_controller);
// productRoute.get(
//   "/search",
//   verifyToken,
//   // authorizePermission("admin", "user"),
//   search_product_controller
// );
productRoute.get("/get_products", 
// verifyToken,
// cacheMiddleware,
// authorizePermission("admin", "user"),
productsController_1.get_product_controller);
productRoute.get("/get_product/:id", productsController_1.getOne_product_controller);
productRoute.get("/get_products/:slug", productsController_1.getByCategory_controller);
productRoute.put("/edit_product/:id", cloudinary_config_1.upload.array("files", 4), 
// authorizePermission("admin"),
productsController_1.edit_product_controller);
productRoute.delete("/delete_product", productsController_1.delete_product_controller);
exports.default = productRoute;
