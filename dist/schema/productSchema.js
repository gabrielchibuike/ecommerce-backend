"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductSchema = void 0;
const zod_1 = require("zod");
exports.ProductSchema = zod_1.z.object({
    product_gender: zod_1.z.enum(["Men", "Women", "Unisex"]),
    product_category: zod_1.z.string().min(1),
    sub_category: zod_1.z.string().min(1),
    product_name: zod_1.z.string().min(1),
    description: zod_1.z.string().nullable().optional(),
    color: zod_1.z.array(zod_1.z.string()).default([]),
    size: zod_1.z.array(zod_1.z.string()).default([]),
    tags: zod_1.z.array(zod_1.z.string()).default([]),
    quantity: zod_1.z.coerce.number().int().min(0),
    price: zod_1.z.coerce.number().positive(),
    discount: zod_1.z.coerce.number().min(0).max(100).default(0),
    status: zod_1.z.enum(["Available", "Unavailable"]).default("Available"),
    visible: zod_1.z.boolean().default(true),
    product_image: zod_1.z.array(zod_1.z.string().url()).default([]),
});
