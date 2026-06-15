"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shippingAddressSchema = exports.updatePasswordSchema = exports.emailSchema = exports.loginSchema = exports.createAccSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const joi_password_complexity_1 = __importDefault(require("joi-password-complexity"));
exports.createAccSchema = joi_1.default.object({
    firstName: joi_1.default.string().required().trim().messages({
        "string.empty": "This field is required",
    }),
    lastName: joi_1.default.string().required().trim().messages({
        "string.empty": "This field is required",
    }),
    email: joi_1.default.string()
        .email({ tlds: { allow: ["com", "net"] } })
        .messages({
        "string.empty": "This field is required",
        "string.email": "email must be a valid email",
    }),
    password: (0, joi_password_complexity_1.default)({
        min: 6,
        max: 20,
        lowerCase: 1,
        upperCase: 1,
        numeric: 1,
        symbol: 1,
        requirementCount: 6,
    }),
    // password: Joi.string()
    //   .min(8)
    //   .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    //   .messages({
    //     "string.password": "password must must the above pattern",
    //   }),
});
exports.loginSchema = joi_1.default.object({
    email: joi_1.default.string().email({ tlds: { allow: ["com", "net"] } }),
    password: (0, joi_password_complexity_1.default)({
        min: 6,
        max: 20,
        lowerCase: 1,
        upperCase: 1,
        numeric: 1,
        symbol: 1,
        requirementCount: 6,
    }),
});
exports.emailSchema = joi_1.default.object({
    email: joi_1.default.string().email({ tlds: { allow: ["com", "net"] } }),
});
exports.updatePasswordSchema = joi_1.default.object({
    password: (0, joi_password_complexity_1.default)({
        min: 6,
        max: 20,
        lowerCase: 1,
        upperCase: 1,
        numeric: 1,
        symbol: 1,
        requirementCount: 6,
    }),
});
exports.shippingAddressSchema = joi_1.default.object({
    firstName: joi_1.default.string().required().trim().messages({
        "string.empty": "This field is required",
    }),
    lastName: joi_1.default.string().required().trim().messages({
        "string.empty": "This field is required",
    }),
    phone: joi_1.default.string().min(11).max(11).required(),
    email: joi_1.default.string()
        .email({ tlds: { allow: ["com", "net"] } })
        .messages({
        "string.empty": "This field is required",
        "string.email": "email must be a valid email",
    }),
    StreetAddress: joi_1.default.string().required(),
    additionalInfo: joi_1.default.string().optional(),
    city: joi_1.default.string().required(),
    state: joi_1.default.string().required(),
});
