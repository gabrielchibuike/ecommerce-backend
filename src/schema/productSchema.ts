import { z } from "zod";

export const ProductSchema = z.object({
  product_gender: z.enum(["Men", "Women", "Unisex"]),

  product_category: z.string().min(1),
  sub_category: z.string().min(1),
  product_name: z.string().min(1),

  description: z.string().nullable().optional(),

  color: z.array(z.string()).default([]),
  size: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),

  quantity: z.coerce.number().int().min(0),
  price: z.coerce.number().positive(),
  discount: z.coerce.number().min(0).max(100).default(0),

  status: z.enum(["Available", "Unavailable"]).default("Available"),
  visible: z.boolean().default(true),

  product_image: z.array(z.string().url()).default([]),
});
