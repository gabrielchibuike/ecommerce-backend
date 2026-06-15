"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
// Define custom log levels
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};
// Define colors for each level
const colors = {
    error: "bold red",
    warn: "yellow italic",
    info: "cyan",
    http: "magenta underline",
    debug: "dim white",
};
winston_1.default.addColors(colors);
// Set log level based on environment
const getLevel = () => {
    const env = process.env.NODE_ENV || "development";
    return env === "development" ? "debug" : "info";
};
// Define log format
const format = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }), winston_1.default.format.printf((info) => {
    const { timestamp, level, message } = info;
    const coloredLevel = winston_1.default.format.colorize().colorize(level, level);
    return `${coloredLevel}: ${message} ${timestamp}`;
}));
// Define transports
const transports = [
    new winston_1.default.transports.Console(),
    new winston_1.default.transports.File({
        filename: "logs/error.log",
        level: "error",
    }),
    new winston_1.default.transports.File({
        filename: "logs/all.log",
    }),
];
// Create logger instance
const logger = winston_1.default.createLogger({
    level: getLevel(),
    levels,
    format,
    transports,
});
exports.default = logger;
