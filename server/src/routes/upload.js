import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";
import { dirname } from "path";
import {
  parseCSV,
  parseExcel,
  analyzeColumns,
  getDataPreview,
  validateFileType,
} from "../utils/dataProcessing.js";
import { saveDataset } from "../utils/storage.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Use /tmp for serverless environments (Vercel), local directory otherwise
    const uploadDir =
      process.env.NODE_ENV === "production"
        ? "/tmp/uploads"
        : path.join(__dirname, "../../uploads");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    if (validateFileType(file.originalname)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only CSV and Excel files are allowed."));
    }
  },
});

/**
 * POST /api/upload
 * Upload a dataset file
 */
router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;
    const fileExt = path.extname(req.file.originalname).toLowerCase();
    const fileId = uuidv4();

    let data;

    // Parse file based on extension
    try {
      if (fileExt === ".csv") {
        data = await parseCSV(filePath);
      } else if (fileExt === ".xlsx" || fileExt === ".xls") {
        data = await parseExcel(filePath);
      } else {
        throw new Error("Unsupported file format");
      }
    } catch (parseError) {
      // Clean up uploaded file
      fs.unlinkSync(filePath);
      return res.status(400).json({
        error: "Failed to parse file",
        message: parseError.message,
      });
    }

    // Validate data
    if (!data || data.length === 0) {
      fs.unlinkSync(filePath);
      return res.status(400).json({
        error: "Empty file or invalid format",
      });
    }

    
    const columnInfo = analyzeColumns(data);
    const preview = getDataPreview(data, 10);

 
    saveDataset(fileId, {
      fileId,
      fileName: req.file.originalname,
      filePath,
      data,
      columnInfo,
      rowCount: data.length,
      columnCount: columnInfo.length,
      uploadedAt: new Date().toISOString(),
    });

    // Clean up file after storing in memory
    setTimeout(() => {
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (err) {
        console.error("Error cleaning up file:", err);
      }
    }, 1000);

    // Send response with formatted preview
    res.json({
      success: true,
      data: {
        fileId,
        fileName: req.file.originalname,
        rowCount: data.length,
        columnCount: columnInfo.length,
        columns: columnInfo,
        preview: {
          headers: columnInfo.map((c) => c.name),
          rows: preview,
          totalRows: data.length,
        },
      },
    });
  } catch (error) {
    console.error("Upload error:", error);

    // Clean up file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      error: "Upload failed",
      message: error.message,
    });
  }
});

export default router;
