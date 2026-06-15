// import { Request, Response } from "express";
// import axios from "axios";
// import * as cheerio from "cheerio";
// import { GoogleGenAI } from "@google/genai";

// import ProductDetails from "../model/productModel";
// import { ProductSchema } from "../schema/productSchema";
// import logger from "../config/logger";

// // ---------- Gemini Setup ----------
// const genAI = new GoogleGenAI({
//   apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "",
// });

// if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_API_KEY) {
//   throw new Error("GEMINI_API_KEY or GOOGLE_API_KEY must be set");
// }

// const MODEL_NAME = "gemini-2.5-flash";

// // ---------- Controller ----------
// export const createProductFromUrl = async (req: Request, res: Response) => {
//   const { productUrl } = req.body;

//   logger.info(`Received ${req.method} ${req.url}`);

//   if (!productUrl) {
//     return res.status(400).json({ error: "productUrl is required" });
//   }

//   try {
//     // 1️⃣ Fetch webpage
//     const { data: html } = await axios.get<string>(productUrl, {
//       headers: {
//         "User-Agent":
//           "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
//         Accept: "text/html",
//       },
//       timeout: 15000,
//     });

//     // 2️⃣ Load + clean DOM
//     const $ = cheerio.load(html);
//     $("script, style, nav, footer, header, aside, iframe").remove();

//     // ---------- Description ----------
//     let description = "";

//     const descEl = $("div.markup.-mhm.-pvl.-oxa.-sc");

//     if (descEl.length) {
//       description = descEl
//         .clone()
//         .find("br")
//         .replaceWith("\n")
//         .end()
//         .text()
//         .replace(/\s+/g, " ")
//         .trim();
//     }

//     description = removeRepeatedText(description);

//     // ---------- Fallback description ----------
//     if (!description) {
//       description = $("body").text().replace(/\s+/g, " ").trim().slice(0, 3000);
//     }

//     // 3️⃣ Extract images
//     const imageUrls = extractImages($, productUrl);

//     // 4️⃣ AI extraction (TEXT ONLY)
//     const aiInputText = `
//       Product URL:
//       ${productUrl}

//       Product Description:
//       ${description || "No description available"}
//       `;

//     const extracted = await extractWithGemini(aiInputText, imageUrls);

//     // 5️⃣ Attach images manually
//     extracted.product_image = imageUrls;

//     // 6️⃣ Save
//     const product = new ProductDetails(extracted);
//     await product.save();

//     res.status(201).json({
//       message: "Product imported from URL",
//       product,
//     });
//   } catch (error: unknown) {
//     logger.error("URL extraction failed", error);

//     res.status(500).json({
//       error: "Failed to process URL",
//     });
//   }
// };

// // ---------- Helpers ----------
// function removeRepeatedText(text: string): string {
//   const sentences = text.split(". ");
//   const seen = new Set<string>();

//   return sentences
//     .filter((s) => {
//       const key = s.trim().toLowerCase();
//       if (seen.has(key)) return false;
//       seen.add(key);
//       return true;
//     })
//     .join(". ");
// }

// function extractImages($: cheerio.Root, baseUrl: string): string[] {
//   const urls = new Set<string>();

//   $("a.itm").each((_, el) => {
//     const href = $(el).attr("href");
//     if (href?.startsWith("http")) {
//       urls.add(href);
//     }
//   });

//   $("img").each((_, el) => {
//     const src =
//       $(el).attr("data-src") || $(el).attr("data-srcset") || $(el).attr("src");

//     if (
//       !src ||
//       src.startsWith("data:") ||
//       src.includes("svg") ||
//       src.includes("placeholder")
//     ) {
//       return;
//     }

//     try {
//       urls.add(new URL(src, baseUrl).href);
//     } catch {
//       /* ignore */
//     }
//   });

//   return Array.from(urls).slice(0, 10);
// }

// // ---------- Gemini ----------
// async function extractWithGemini(pageText: string, imageUrls: string[]) {
//   const prompt = `
// You are an expert e-commerce product data extractor.

// Extract product information from the content below.

// Return ONLY valid JSON matching this structure:

// {
//   "product_gender": "Women" | "Men" | "Unisex",
//   "product_category": string,
//   "sub_category": string,
//   "product_name": string,
//   "description": string | null,
//   "color": string[],
//   "size": string[],
//   "tags": string[],
//   "quantity": number,
//   "price": number,
//   "discount": number,
//   "status": "Available" | "Unavailable",
//   "visible": boolean
// }

// Rules:
// - All fields must exist
// - Use logical defaults if missing
// - Output JSON only
// `;

//   const content = `
// PRODUCT TEXT:
// ${pageText}

// IMAGE URLS:
// ${imageUrls.join("\n")}
// `;

//   const result = await genAI.models.generateContent({
//     model: MODEL_NAME,
//     contents: [
//       {
//         role: "user",
//         parts: [{ text: prompt }, { text: content }],
//       },
//     ],
//     config: {
//       temperature: 0.2,
//       responseMimeType: "application/json",
//     },
//   });

//   const responseText = result.text;

//   if (!responseText) {
//     throw new Error("Empty response from Gemini");
//   }

//   const parsed = JSON.parse(responseText);

//   if (!parsed.product_name || parsed.price === undefined) {
//     throw new Error("Missing critical product fields");
//   }

//   return ProductSchema.parse(parsed);
// }
