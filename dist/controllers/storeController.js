"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_navigation_menu_controller = exports.update_store_config_controller = exports.get_store_config_controller = void 0;
const storeService_1 = require("../services/storeService");
const get_store_config_controller = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const store = yield (0, storeService_1.get_store_config_service)();
        res.status(200).json({ data: store, message: "Retrived Sucessfully" });
    }
    catch (error) {
        res.status(500).json({ data: null, message: error.message });
    }
});
exports.get_store_config_controller = get_store_config_controller;
const update_store_config_controller = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const store = yield (0, storeService_1.update_store_config_service)(req.body);
        res.status(200).json({ data: store, message: "Created Sucessfully" });
    }
    catch (error) {
        res.status(500).json({ data: null, message: error.message });
    }
});
exports.update_store_config_controller = update_store_config_controller;
const get_navigation_menu_controller = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const menu = yield (0, storeService_1.get_navigation_menu_service)();
        res.status(200).json({ data: menu, message: "Retrieved Successfully" });
    }
    catch (error) {
        res.status(500).json({ data: null, message: error.message });
    }
});
exports.get_navigation_menu_controller = get_navigation_menu_controller;
