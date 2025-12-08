/**
 * Application Configuration
 */

import dotenv from "dotenv";

dotenv.config();

export const config = {
  // Server
  server: {
    port: parseInt(process.env.PORT || "5000", 10),
    host: process.env.HOST || "localhost",
    env: process.env.NODE_ENV || "development",
  },

  // CORS
  cors: {
    origin: process.env.CORS_ORIGIN?.split(",") || ["http://localhost:5173"],
    credentials: true,
  },

  // Upload
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || "104857600", 10), // 100MB
    allowedTypes: (process.env.ALLOWED_FILE_TYPES || "csv,xlsx,xls").split(","),
    uploadDir: "uploads",
    tempDir: "temp",
  },

  // Cache
  cache: {
    ttl: parseInt(process.env.CACHE_TTL || "3600", 10), // 1 hour
    checkPeriod: parseInt(process.env.CACHE_CHECK_PERIOD || "600", 10), // 10 minutes
    maxKeys: parseInt(process.env.MAX_DATASETS_IN_MEMORY || "100", 10),
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10), // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100", 10),
  },

  // Memory Management
  memory: {
    cleanupInterval: parseInt(
      process.env.MEMORY_CLEANUP_INTERVAL || "300000",
      10
    ), // 5 minutes
    maxUsageMB: parseInt(process.env.MAX_MEMORY_USAGE_MB || "1024", 10),
  },

  // ML Configuration
  ml: {
    defaultTestSize: parseFloat(process.env.DEFAULT_TEST_SIZE || "0.2"),
    defaultRandomState: parseInt(process.env.DEFAULT_RANDOM_STATE || "42", 10),
    maxTrainingTime: parseInt(process.env.MAX_TRAINING_TIME_MS || "60000", 10),
  },
};

export default config;
