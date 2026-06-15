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
exports.createUserService = createUserService;
exports.loginService = loginService;
exports.findUser = findUser;
exports.getEmailService = getEmailService;
exports.verifyOtpService = verifyOtpService;
exports.resetPasswordService = resetPasswordService;
const authModel_1 = __importDefault(require("../model/authModel"));
function createUserService(_a) {
    return __awaiter(this, arguments, void 0, function* ({ firstName, lastName, email, hashedpassword, }) {
        const result = yield authModel_1.default.create({
            firstName,
            lastName,
            email,
            password: hashedpassword,
        });
        return result;
    });
}
function loginService(email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield authModel_1.default.findOne({
            email,
            password,
        });
        return result;
    });
}
function findUser(email) {
    return __awaiter(this, void 0, void 0, function* () {
        const isExisting = yield authModel_1.default.findOne({
            email,
        });
        return isExisting;
    });
}
function getEmailService(email) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield authModel_1.default.findOne({
            email,
        });
        return result;
    });
}
function verifyOtpService(otp) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield authModel_1.default.findOneAndUpdate({ otp: otp }, { verified: "yes", otp: "" }, { new: true });
        return result;
    });
}
function resetPasswordService(password, email) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield authModel_1.default.findOneAndUpdate({ email: email }, { password: password }, { new: true });
        return result;
    });
}
// export async function fetch_user_details(email: string) {
//   const result = await UserDetails.findOne({ email });
//   return result;
// }
