import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Import routes
import uploadRouter from "./routes/upload.js";
import preprocessRouter from "./routes/preprocess.js";
import splitRouter from "./routes/split.js";
import trainRouter from "./routes/train.js";
import evaluationRouter from "./modules/model-evaluation/routes/evaluation.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for all origins with explicit configuration
app.use(
  cors({
    origin: true, // Allow any origin
    credentials: false,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
    ],
    optionsSuccessStatus: 200,
  })
);

// Handle preflight requests
app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const uploadsDir =
  process.env.NODE_ENV === "production"
    ? "/tmp/uploads"
    : path.join(__dirname, "../uploads");

try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
} catch (error) {
  console.warn("Could not create uploads directory:", error.message);
}

// Routes
app.use("/api/upload", uploadRouter);
app.use("/api/preprocess", preprocessRouter);
app.use("/api/split", splitRouter);
app.use("/api/train", trainRouter);
app.use("/api/model-evaluation", evaluationRouter);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "ML Pipeline Server is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Something went wrong!",
    message: err.message,
  });
});

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🚀 ML Pipeline Server running on http://localhost:${PORT}`);
  });
}

export default app;
