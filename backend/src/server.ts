/**
 * Server Entry Point
 */

import App from "./app";
import logger from "./config/logger";
import { cacheManager } from "./utils/cacheManager";

// Handle uncaught exceptions
process.on("uncaughtException", (error: Error) => {
  logger.error("Uncaught Exception", {
    error: error.message,
    stack: error.stack,
  });
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason: any) => {
  logger.error("Unhandled Rejection", {
    reason: reason?.message || reason,
  });
  process.exit(1);
});

// Initialize and start server
const app = new App();
app.listen();

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  logger.info(`${signal} received, starting graceful shutdown`);

  try {
    // Close cache
    cacheManager.shutdown();
    logger.info("Cache closed");

    logger.info("Graceful shutdown completed");
    process.exit(0);
  } catch (error) {
    logger.error("Error during graceful shutdown", { error });
    process.exit(1);
  }
};

// Listen for termination signals
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
