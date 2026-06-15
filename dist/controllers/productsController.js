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
exports.create_product_controller = create_product_controller;
exports.featuerd_product_controller = featuerd_product_controller;
exports.get_product_controller = get_product_controller;
exports.getOne_product_controller = getOne_product_controller;
exports.getByCategory_controller = getByCategory_controller;
exports.edit_product_controller = edit_product_controller;
exports.delete_product_controller = delete_product_controller;
const productService_1 = require("../services/productService");
const redisClient_1 = __importDefault(require("../redisClient"));
const http_status_codes_1 = require("http-status-codes");
const logger_1 = __importDefault(require("../config/logger"));
function create_product_controller(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!req.files)
                return res.status(404).send("files not found");
            const files = req.files;
            const { product_name, product_category, sub_category, product_gender, tags, description, color, size, quantity, price, discount, } = JSON.parse(req.body.jsonData);
            const existing_product = yield (0, productService_1.find_existing_product)(product_name);
            if (existing_product)
                return res
                    .status(http_status_codes_1.StatusCodes.CONFLICT)
                    .json({ message: "Product already exist" });
            const products = yield (0, productService_1.create_product_service)({
                product_name,
                product_category,
                sub_category,
                product_gender,
                description,
                color,
                size,
                tags,
                price,
                discount,
                quantity,
                product_image: files.map((file) => file.path),
            });
            yield redisClient_1.default.del("/api/products/get_products");
            res.status(201).json({ data: products, message: "Created Sucessfully" });
        }
        catch (err) {
            logger_1.default.error(err);
            res.status(500).json({ error: err.message });
        }
    });
}
function featuerd_product_controller(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const products = yield (0, productService_1.featured_product_service)();
            res.status(200).send(products);
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
}
function get_product_controller(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const filters = {
                // main_category: req.query.main_category as string,
                category: req.query.category,
                subcategory: req.query.subcategory,
                gender: req.query.gender,
                color: req.query.color,
                size: req.query.size,
                price_min: req.query.price_min
                    ? parseFloat(req.query.price_min)
                    : undefined,
                price_max: req.query.price_max
                    ? parseFloat(req.query.price_max)
                    : undefined,
                search: req.query.search,
            };
            // Extract pagination and sorting parameters
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const sort_by = req.query.sort_by || "createdAt";
            const sort_order = req.query.sort_order || "desc";
            const { products, total } = yield (0, productService_1.get_product_service_with_filters)({
                filters,
                page,
                limit,
                sort_by,
                sort_order,
            });
            // if (res.locals.cacheKey) {
            //   await redis.setex(
            //     res.locals.cacheKey,
            //     300,
            //     JSON.stringify({ products, total })
            //   );
            // }
            const data = { products, total, page, limit };
            console.log(data, "dataaaa");
            res.status(200).json({ data: data, message: "Retrived successfully" });
        }
        catch (err) {
            res.status(500).json({ data: null, message: err.message });
        }
    });
}
function getOne_product_controller(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        try {
            const products = yield (0, productService_1.getOne_product_service)(id);
            res.status(201).json({ data: products, message: "Retrived successfully" });
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
}
function getByCategory_controller(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { slug } = req.params;
        try {
            const products = yield (0, productService_1.getByCategory_service)(slug);
            res.status(201).json({ data: products, message: "Retrived successfully" });
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
}
function edit_product_controller(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            console.log(req.files);
            if (!req.files)
                return res.status(404).send("files not found");
            const files = req.files;
            const { product_name, product_category, sub_category, product_gender, description, color, size, tags, quantity, price, discount, } = JSON.parse(req.body.jsonData);
            const product = yield (0, productService_1.edit_product_service)({
                id,
                product_name,
                product_category,
                sub_category,
                product_gender,
                description,
                color,
                size,
                tags,
                quantity,
                price,
                discount,
                product_image: files.map((file) => file.filename),
            });
            // const product = await getOne_product_service(id as string);
            res.status(201).json({ message: "Updated Sucessfully" });
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
}
function delete_product_controller(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { productId } = req.body;
        console.log(productId);
        try {
            yield (0, productService_1.delete_product_service)(productId);
            res.status(200).send("Product deleted");
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
}
