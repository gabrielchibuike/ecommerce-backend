"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.createProductFromUrl = void 0;
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
const genai_1 = require("@google/genai");
const productModel_1 = __importDefault(require("../model/productModel"));
const productSchema_1 = require("../schema/productSchema");
const logger_1 = __importDefault(require("../config/logger"));
// ---------- Gemini Setup ----------
const genAI = new genai_1.GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "",
});
if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_API_KEY) {
    throw new Error("GEMINI_API_KEY or GOOGLE_API_KEY must be set");
}
const MODEL_NAME = "gemini-2.5-flash";
// ---------- Controller ----------
const createProductFromUrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productUrl } = req.body;
    logger_1.default.info(`Received ${req.method} ${req.url}`);
    if (!productUrl) {
        return res.status(400).json({ error: "productUrl is required" });
    }
    try {
        // 1️⃣ Fetch webpage
        const { data: html } = yield axios_1.default.get(productUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                Accept: "text/html",
            },
            timeout: 15000,
        });
        // 2️⃣ Load + clean DOM
        const $ = cheerio.load(html);
        $("script, style, nav, footer, header, aside, iframe").remove();
        // ---------- Description ----------
        let description = "";
        const descEl = $("div.markup.-mhm.-pvl.-oxa.-sc");
        if (descEl.length) {
            description = descEl
                .clone()
                .find("br")
                .replaceWith("\n")
                .end()
                .text()
                .replace(/\s+/g, " ")
                .trim();
        }
        description = removeRepeatedText(description);
        // ---------- Fallback description ----------
        if (!description) {
            description = $("body").text().replace(/\s+/g, " ").trim().slice(0, 3000);
        }
        // 3️⃣ Extract images
        const imageUrls = extractImages($, productUrl);
        // 4️⃣ AI extraction (TEXT ONLY)
        const aiInputText = `
      Product URL:
      ${productUrl}

      Product Description:
      ${description || "No description available"}
      `;
        const extracted = yield extractWithGemini(aiInputText, imageUrls);
        // 5️⃣ Attach images manually
        extracted.product_image = imageUrls;
        // 6️⃣ Save
        const product = new productModel_1.default(extracted);
        yield product.save();
        res.status(201).json({
            message: "Product imported from URL",
            product,
        });
    }
    catch (error) {
        logger_1.default.error("URL extraction failed", error);
        res.status(500).json({
            error: "Failed to process URL",
        });
    }
});
exports.createProductFromUrl = createProductFromUrl;
// ---------- Helpers ----------
function removeRepeatedText(text) {
    const sentences = text.split(". ");
    const seen = new Set();
    return sentences
        .filter((s) => {
        const key = s.trim().toLowerCase();
        if (seen.has(key))
            return false;
        seen.add(key);
        return true;
    })
        .join(". ");
}
function extractImages($, baseUrl) {
    const urls = new Set();
    $("a.itm").each((_, el) => {
        const href = $(el).attr("href");
        if (href === null || href === void 0 ? void 0 : href.startsWith("http")) {
            urls.add(href);
        }
    });
    $("img").each((_, el) => {
        const src = $(el).attr("data-src") || $(el).attr("data-srcset") || $(el).attr("src");
        if (!src ||
            src.startsWith("data:") ||
            src.includes("svg") ||
            src.includes("placeholder")) {
            return;
        }
        try {
            urls.add(new URL(src, baseUrl).href);
        }
        catch (_a) {
            /* ignore */
        }
    });
    return Array.from(urls).slice(0, 10);
}
// ---------- Gemini ----------
function extractWithGemini(pageText, imageUrls) {
    return __awaiter(this, void 0, void 0, function* () {
        const prompt = `
You are an expert e-commerce product data extractor.

Extract product information from the content below.

Return ONLY valid JSON matching this structure:

{
  "product_gender": "Women" | "Men" | "Unisex",
  "product_category": string,
  "sub_category": string,
  "product_name": string,
  "description": string | null,
  "color": string[],
  "size": string[],
  "tags": string[],
  "quantity": number,
  "price": number,
  "discount": number,
  "status": "Available" | "Unavailable",
  "visible": boolean
}

Rules:
- All fields must exist
- Use logical defaults if missing
- Output JSON only
`;
        const content = `
PRODUCT TEXT:
${pageText}

IMAGE URLS:
${imageUrls.join("\n")}
`;
        const result = yield genAI.models.generateContent({
            model: MODEL_NAME,
            contents: [
                {
                    role: "user",
                    parts: [{ text: prompt }, { text: content }],
                },
            ],
            config: {
                temperature: 0.2,
                responseMimeType: "application/json",
            },
        });
        const responseText = result.text;
        if (!responseText) {
            throw new Error("Empty response from Gemini");
        }
        const parsed = JSON.parse(responseText);
        if (!parsed.product_name || parsed.price === undefined) {
            throw new Error("Missing critical product fields");
        }
        return productSchema_1.ProductSchema.parse(parsed);
    });
}
