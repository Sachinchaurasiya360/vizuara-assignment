/**
 * File Upload Service
 * Handles CSV and Excel file uploads using Danfo.js
 */

import * as dfd from "danfojs-node";
import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import logger from "../config/logger";
import config from "../config";
import { FileUploadResponse, ColumnInfo } from "../types/pipeline.types";
import { datasetStorage } from "../utils/datasetStorage";
import { cacheManager } from "../utils/cacheManager";

export class FileUploadService {
  public async processFile(
    file: Express.Multer.File
  ): Promise<FileUploadResponse> {
    logger.info("Processing uploaded file", {
      filename: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
    });

    try {
      const fileId = uuidv4();
      let df: dfd.DataFrame;

      // Read file based on type
      if (file.mimetype === "text/csv") {
        df = await dfd.readCSV(file.path);
      } else if (
        file.mimetype === "application/vnd.ms-excel" ||
        file.mimetype ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        df = await dfd.readExcel(file.path);
      } else {
        throw new Error("Unsupported file type");
      }

      // Store dataset
      datasetStorage.storeDataset(fileId, df, file.originalname);

      // Get column information
      const columns = this.getColumnInfo(df);

      // Get preview
      const preview = this.getPreview(df);

      // Clean up uploaded file
      await this.cleanupFile(file.path);

      const response: FileUploadResponse = {
        fileId,
        fileName: file.originalname,
        rowCount: df.shape[0],
        columnCount: df.shape[1],
        columns,
        preview,
        uploadedAt: new Date().toISOString(),
      };

      // Store file metadata
      cacheManager.set(`file:${fileId}`, response);

      logger.info("File processed successfully", {
        fileId,
        filename: file.originalname,
        rows: df.shape[0],
        cols: df.shape[1],
      });

      return response;
    } catch (error) {
      // Clean up file on error
      if (file.path) {
        await this.cleanupFile(file.path).catch(() => {});
      }

      logger.error("File processing failed", { error });
      throw error;
    }
  }

  /**
   * Get column information from DataFrame
   */
  private getColumnInfo(df: dfd.DataFrame): ColumnInfo[] {
    const columns = df.columns;
    const dtypes = df.ctypes;

    return columns.map((col, idx) => {
      const series = df[col];
      const dtype = String(dtypes[idx]);

      // Determine type
      let type: ColumnInfo["type"] = "numeric";
      if (dtype === "string" || dtype === "object") {
        type = "categorical";
      } else if (dtype === "boolean") {
        type = "boolean";
      } else if (dtype.includes("date") || dtype.includes("time")) {
        type = "datetime";
      }

      // Count nulls
      const nullCount = series.isNa().sum();

      // Count unique values
      const uniqueCount = series.unique().shape[0];

      // Get sample values
      const sample = series
        .head(5)
        .values.map((v: any) =>
          v === null || v === undefined ? "null" : String(v)
        );

      return {
        name: col,
        type,
        nullCount,
        uniqueCount,
        sample,
      };
    });
  }

  /**
   * Get preview of DataFrame
   */
  private getPreview(
    df: dfd.DataFrame,
    rows: number = 10
  ): Record<string, any>[] {
    const preview = df.head(rows);
    return dfd.toJSON(preview) as Record<string, any>[];
  }

  /**
   * Clean up uploaded file
   */
  private async cleanupFile(filePath: string): Promise<void> {
    try {
      await fs.unlink(filePath);
      logger.debug("Cleaned up uploaded file", { filePath });
    } catch (error) {
      logger.warn("Failed to clean up file", { filePath, error });
    }
  }

  /**
   * Get file metadata
   */
  public getFileMetadata(fileId: string): FileUploadResponse | null {
    const metadata = cacheManager.get<FileUploadResponse>(`file:${fileId}`);

    if (!metadata) {
      logger.warn("File metadata not found", { fileId });
      return null;
    }

    return metadata;
  }
}

export const fileUploadService = new FileUploadService();
export default fileUploadService;
