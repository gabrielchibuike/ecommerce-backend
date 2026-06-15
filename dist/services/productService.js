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
exports.create_product_service = create_product_service;
exports.find_existing_product = find_existing_product;
exports.featured_product_service = featured_product_service;
exports.get_product_service_with_filters = get_product_service_with_filters;
exports.search_product_service = search_product_service;
exports.getOne_product_service = getOne_product_service;
exports.getByCategory_service = getByCategory_service;
exports.edit_product_service = edit_product_service;
exports.delete_product_service = delete_product_service;
const productModel_1 = __importDefault(require("../model/productModel"));
function create_product_service(_a) {
    return __awaiter(this, arguments, void 0, function* ({ product_name, product_category, sub_category, product_gender, description, color, size, tags, quantity, price, discount, product_image, }) {
        const result = yield productModel_1.default.create({
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
            product_image,
        });
        return result;
    });
}
function find_existing_product(product_name) {
    return __awaiter(this, void 0, void 0, function* () {
        const isExisting = yield productModel_1.default.findOne({
            product_name,
        });
        return isExisting;
    });
}
function featured_product_service() {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield productModel_1.default.find({}).limit(5);
        return result;
    });
}
function get_product_service_with_filters(_a) {
    return __awaiter(this, arguments, void 0, function* ({ filters, page, limit, sort_by, sort_order, }) {
        // Build query object
        const query = {};
        if (filters.main_category)
            query.main_category = filters.main_category;
        if (filters.category)
            query.product_category = filters.category;
        if (filters.subcategory)
            query.sub_category = filters.subcategory;
        if (filters.gender)
            query.product_gender = filters.gender;
        // Handle color and size as arrays with case-insensitive matching
        if (filters.color) {
            const colors = Array.isArray(filters.color)
                ? filters.color
                : [filters.color];
            query.color = { $in: colors.map((color) => new RegExp(`^${color}$`, "i")) };
        }
        if (filters.size) {
            const sizes = Array.isArray(filters.size) ? filters.size : [filters.size];
            query.size = { $in: sizes.map((size) => new RegExp(`^${size}$`, "i")) };
        }
        // Handle price range (convert to string for comparison)
        if (filters.price_min || filters.price_max) {
            query.price = {};
            if (filters.price_min)
                query.price.$gte = filters.price_min.toString();
            if (filters.price_max)
                query.price.$lte = filters.price_max.toString();
        }
        // Handle search with validation
        if (filters.search && filters.search.trim()) {
            const searchTerm = filters.search.trim();
            query.$or = [{ product_name: { $regex: searchTerm, $options: "i" } }];
            console.log("Applied search term:", searchTerm); // Log search term
        }
        // Calculate skip for pagination
        const skip = (page - 1) * limit;
        console.log(limit);
        // Execute query
        const [products, total] = yield Promise.all([
            productModel_1.default.find(query)
                .sort({ [sort_by]: sort_order === "asc" ? 1 : -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            productModel_1.default.countDocuments(query), // Get total matching documents
        ]);
        const mappedProducts = products.map((product) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
            return ({
                product_name: (_a = product.product_name) !== null && _a !== void 0 ? _a : "",
                product_category: (_b = product.product_category) !== null && _b !== void 0 ? _b : "",
                sub_category: (_c = product.sub_category) !== null && _c !== void 0 ? _c : "",
                product_gender: (_d = product.product_gender) !== null && _d !== void 0 ? _d : "",
                description: (_e = product.description) !== null && _e !== void 0 ? _e : "",
                color: (_f = product.color) !== null && _f !== void 0 ? _f : [],
                size: (_g = product.size) !== null && _g !== void 0 ? _g : [],
                tags: (_h = product.tags) !== null && _h !== void 0 ? _h : [],
                quantity: (_j = product.quantity) !== null && _j !== void 0 ? _j : 0,
                price: (_k = product.price) !== null && _k !== void 0 ? _k : 0,
                discount: (_l = product.discount) !== null && _l !== void 0 ? _l : 0,
                status: (_m = product.status) !== null && _m !== void 0 ? _m : "",
                product_image: (_o = product.product_image) !== null && _o !== void 0 ? _o : [],
                _id: (_q = (_p = product._id) === null || _p === void 0 ? void 0 : _p.toString()) !== null && _q !== void 0 ? _q : "",
            });
        });
        return { products: mappedProducts, total };
    });
}
function search_product_service(query, page, limit) {
    return __awaiter(this, void 0, void 0, function* () {
        const searchResults = yield productModel_1.default.find({
            product_name: { $regex: query, $options: "i" }, // Case-insensitive search
        })
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();
        // Count total matching documents
        const total = yield productModel_1.default.countDocuments({
            product_name: { $regex: query, $options: "i" },
        });
        return { products: searchResults, total };
    });
}
function getOne_product_service(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield productModel_1.default.findOne({ _id: id });
        return result;
    });
}
function getByCategory_service(slug) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield productModel_1.default.find({ product_category: slug });
        return result;
    });
}
function edit_product_service(_a) {
    return __awaiter(this, arguments, void 0, function* ({ id, product_name, product_category, sub_category, product_gender, description, color, size, tags, quantity, price, discount, product_image, }) {
        const result = yield productModel_1.default.updateOne({ _id: id }, {
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
            product_image,
        }, { new: true });
        return result;
    });
}
function delete_product_service(productId) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield productModel_1.default.deleteOne({ _id: productId });
        console.log(result);
        return result;
    });
}
