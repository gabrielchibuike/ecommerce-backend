"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path = require("path");
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "src/uploads");
    },
    filename: (req, file, cb) => {
        const original = file.originalname.split(".")[0];
        const ext = path.extname(file.originalname);
        const newExt = original + ext;
        const arrExt = [".jpeg", ".png", ".jpg", ".avif"];
        if (arrExt.includes(ext)) {
            cb(null, newExt);
        }
        else {
            console.log("not supported");
        }
    },
});
const upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 1048576 * 5,
    },
});
