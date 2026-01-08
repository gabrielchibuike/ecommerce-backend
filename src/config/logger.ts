import winston from "winston";

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

winston.addColors(colors);

// Set log level based on environment
const getLevel = () => {
  const env = process.env.NODE_ENV || "development";
  return env === "development" ? "debug" : "info";
};

// Define log format
const format = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.printf((info) => {
    const { timestamp, level, message } = info;
    const coloredLevel = winston.format.colorize().colorize(level, level);
    return `${coloredLevel}: ${message} ${timestamp}`;
  })
);

// Define transports
const transports = [
  new winston.transports.Console(),
  new winston.transports.File({
    filename: "logs/error.log",
    level: "error",
  }),
  new winston.transports.File({
    filename: "logs/all.log",
  }),
];

// Create logger instance
const logger = winston.createLogger({
  level: getLevel(),
  levels,
  format,
  transports,
});

export default logger;
