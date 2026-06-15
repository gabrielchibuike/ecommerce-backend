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
exports.save_refresh_token = save_refresh_token;
exports.find_refresh_token = find_refresh_token;
const authModel_1 = __importDefault(require("../model/authModel"));
function save_refresh_token(userId, refreshToken) {
    return __awaiter(this, void 0, void 0, function* () {
        // Save the refreshToken against the userId in your database
        const res = yield authModel_1.default.updateOne({ _id: userId }, { refreshToken }, { new: true });
        return res;
    });
}
function find_refresh_token(userId, refreshToken) {
    return __awaiter(this, void 0, void 0, function* () {
        // Find and return the refreshToken for the user
        const res = yield authModel_1.default.findOne({ refreshToken: refreshToken });
        return res;
    });
}
