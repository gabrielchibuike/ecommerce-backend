import { CorsOptions } from "cors";

const allowedOrigins: string[] = [];

if (process.env.ALLOWED_ORIGINS) {
  const extraOrigins = process.env.ALLOWED_ORIGINS.split(",").map((s) =>
    s.trim(),
  );
  allowedOrigins.push(...extraOrigins);
}

export const corsOptions: CorsOptions = {
  origin: (requestOrigin, callback) => {
    // Allow server-to-server requests (no origin header)
    if (!requestOrigin) return callback(null, true);

    if (allowedOrigins.includes(requestOrigin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: Origin '${requestOrigin}' not allowed`));
    }
  },
  credentials: true,
  //   methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  //   allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  //   exposedHeaders: ["X-Total-Count", "X-Page-Count"], // expose only what clients need
  //   maxAge: 86400, // cache preflight for 24h — reduces OPTIONS request overhead
};
