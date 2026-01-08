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
exports.get_navigation_menu_service = exports.update_store_config_service = exports.get_store_config_service = void 0;
const storeModel_1 = __importDefault(require("../model/storeModel"));
const get_store_config_service = () => __awaiter(void 0, void 0, void 0, function* () {
    let store = yield storeModel_1.default.findOne();
    if (!store) {
        store = yield storeModel_1.default.create({ isSetup: false, categories: [] });
    }
    return store;
});
exports.get_store_config_service = get_store_config_service;
const update_store_config_service = (data) => __awaiter(void 0, void 0, void 0, function* () {
    let store = yield storeModel_1.default.findOne();
    if (!store) {
        store = new storeModel_1.default(data);
    }
    else {
        store.isSetup = data.isSetup;
        store.categories = data.categories;
    }
    yield store.save();
    return store;
});
exports.update_store_config_service = update_store_config_service;
const get_navigation_menu_service = () => __awaiter(void 0, void 0, void 0, function* () {
    const store = yield storeModel_1.default.findOne();
    if (!store)
        return [];
    const genders = ["Men", "Women"];
    const menu = genders.map((gender) => {
        const sections = store.categories
            .map((category) => {
            const genderGroup = category.genderGroups.find((g) => g.name === gender);
            if (genderGroup && genderGroup.subCategories.length > 0) {
                return {
                    title: category.name,
                    items: genderGroup.subCategories.map((sub) => ({
                        name: sub.name,
                        href: `/shop?gender=${gender}&category=${encodeURIComponent(category.name)}&subcategory=${encodeURIComponent(sub.name)}`,
                    })),
                };
            }
            return null;
        })
            .filter(Boolean);
        return {
            gender,
            sections,
            promo: {
                title: "Latest Offers",
                subtitle: `25% Off on ${gender}'s Collection`,
                ctaText: "Shop Now",
                ctaLink: `/shop?category=${gender}`,
                imageColor: gender === "Men" ? "bg-blue-100" : "bg-pink-100",
            },
        };
    });
    return menu;
});
exports.get_navigation_menu_service = get_navigation_menu_service;
