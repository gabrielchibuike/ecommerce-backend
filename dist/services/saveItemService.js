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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveItem_service = saveItem_service;
exports.find_existing_saved_item = find_existing_saved_item;
exports.readSavedItem_service = readSavedItem_service;
exports.removeSavedItem_service = removeSavedItem_service;
const saveItemModel_1 = __importDefault(require("../model/saveItemModel"));
function saveItem_service(_a) {
    return __awaiter(this, arguments, void 0, function* ({ userId, items }) {
        const result = yield saveItemModel_1.default.create({
            userId,
            items,
        });
        return result;
    });
}
function find_existing_saved_item(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const isExisting = yield saveItemModel_1.default.findOne({
            userId,
        });
        return isExisting;
    });
}
function readSavedItem_service(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const savedItem = yield saveItemModel_1.default.findOne({
            userId,
        });
        return savedItem;
    });
}
function removeSavedItem_service(userId, item) {
    return __awaiter(this, void 0, void 0, function* () {
        const savedItem = yield saveItemModel_1.default.updateOne({ userId: userId }, { items: item }, { new: true });
        return savedItem;
    });
}
