/**
 * Main Express Application
 */

import express, { Application } from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import fs from "fs";
import config from "./config";
import logger from "./config/logger";
import pipelineRoutes from "./routes/pipeline.routes";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.initializeDirectories();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeDirectories(): void {
    // Create necessary directories if they don't exist
    const dirs = [config.upload.uploadDir, config.upload.tempDir];

    dirs.forEach((dir) => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        logger.info(`Created directory: ${dir}`);
      }
    });
  }

  private initializeMiddlewares(): void {
    // Security middleware
    this.app.use(helmet());

    // CORS configuration
    this.app.use(
      cors({
        origin: config.cors.origin,
        credentials: config.cors.credentials,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
      })
    );

    // Compression middleware
    this.app.use(compression());

    // Body parser middleware
    this.app.use(express.json({ limit: "10mb" }));
    this.app.use(express.urlencoded({ extended: true, limit: "10mb" }));

    // Request logging
    this.app.use((req, _res, next) => {
      logger.info("Incoming request", {
        method: req.method,
        path: req.path,
        ip: req.ip,
      });
      next();
    });
  }

  private initializeRoutes(): void {
    // API routes
    this.app.use("/api", pipelineRoutes);

    // Root endpoint
    this.app.get("/", (_req, res) => {
      res.json({
        success: true,
        message: "ML Pipeline API Server",
        version: "1.0.0",
        endpoints: {
          health: "GET /api/health",
          upload: "POST /api/upload",
          preprocess: "POST /api/preprocess",
          split: "POST /api/split",
          train: "POST /api/train",
          results: "GET /api/results/:modelId",
        },
        timestamp: new Date().toISOString(),
      });
    });
  }

  private initializeErrorHandling(): void {
    // 404 handler
    this.app.use(notFoundHandler);

    // Global error handler
    this.app.use(errorHandler);
  }

  public listen(): void {
    this.app.listen(config.server.port, () => {
      logger.info(`Server started`, {
        port: config.server.port,
        env: config.server.env,
        nodeVersion: process.version,
      });
      console.log(
        `🚀 Server running on http://localhost:${config.server.port}`
      );
      console.log(`📝 Environment: ${config.server.env}`);
    });
  }
}

export default App;
