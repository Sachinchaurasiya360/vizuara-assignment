import express from "express";
import {
  handleMissingValues,
  encodeCategorical,
  scaleNumeric,
  getDataPreview,
} from "../utils/dataProcessing.js";
import { getDataset, updateDataset } from "../utils/storage.js";

const router = express.Router();

/**
 * POST /api/preprocess
 * Preprocess the dataset
 */
router.post("/", async (req, res) => {
  try {
    const { fileId, config } = req.body;

    if (!fileId) {
      return res.status(400).json({ error: "File ID is required" });
    }

    const dataset = getDataset(fileId);
    if (!dataset) {
      return res.status(404).json({ error: "Dataset not found" });
    }

    let processedData = [...dataset.data];
    const transformations = [];
    let rowsRemoved = 0;
    let columnsRemoved = 0;
    const newColumns = [];

    // Handle missing values
    if (config.missingValues && config.missingValues.length > 0) {
      config.missingValues.forEach((mvConfig) => {
        if (mvConfig.strategy && mvConfig.strategy !== "none") {
          const beforeCount = processedData.length;
          processedData = handleMissingValues(
            processedData,
            mvConfig.strategy,
            dataset.columnInfo
          );
          const rowsAffected = beforeCount - processedData.length;
          rowsRemoved += rowsAffected;
          transformations.push({
            type: "missing_values",
            strategy: mvConfig.strategy,
            columns: mvConfig.columns,
            rowsAffected,
          });
        }
      });
    }

    // Encode categorical variables
    if (config.encoding && config.encoding.length > 0) {
      config.encoding.forEach((encConfig) => {
        if (encConfig.columns && encConfig.columns.length > 0) {
          const { data: encodedData, encodingMap } = encodeCategorical(
            processedData,
            encConfig.columns,
            dataset.columnInfo
          );
          processedData = encodedData;

          const encodedCols = Object.keys(encodingMap);
          newColumns.push(...encodedCols.map((col) => `${col}_encoded`));

          transformations.push({
            type: "categorical_encoding",
            method: encConfig.method,
            columns: encodedCols,
            encodingMap,
          });
        }
      });
    }

    // Scale numeric columns
    if (config.scaling && config.scaling.length > 0) {
      config.scaling.forEach((scaleConfig) => {
        if (scaleConfig.columns && scaleConfig.columns.length > 0) {
          const { data: scaledData, scalingParams } = scaleNumeric(
            processedData,
            scaleConfig.columns,
            scaleConfig.method,
            dataset.columnInfo
          );
          processedData = scaledData;

          const scaledCols = Object.keys(scalingParams);
          newColumns.push(...scaledCols.map((col) => `${col}_scaled`));

          transformations.push({
            type: "numeric_scaling",
            method: scaleConfig.method,
            columns: scaledCols,
            params: scalingParams,
          });
        }
      });
    }

    // Remove columns if specified
    if (config.removeColumns && config.removeColumns.length > 0) {
      processedData = processedData.map((row) => {
        const newRow = { ...row };
        config.removeColumns.forEach((col) => delete newRow[col]);
        return newRow;
      });
      columnsRemoved = config.removeColumns.length;
      transformations.push({
        type: "column_removal",
        columns: config.removeColumns,
      });
    }

    // Update dataset with preprocessed data
    updateDataset(fileId, {
      processedData,
      preprocessConfig: config,
      transformations,
    });

    // Get preview of preprocessed data
    const preview = getDataPreview(processedData, 10);

    // Get column headers
    const headers =
      processedData.length > 0 ? Object.keys(processedData[0]) : [];

    res.json({
      success: true,
      data: {
        preview: {
          headers,
          rows: preview,
          totalRows: processedData.length,
        },
        transformations,
        rowsRemoved,
        columnsRemoved,
        newColumns,
        totalRows: processedData.length,
      },
      message: "Data preprocessed successfully",
    });
  } catch (error) {
    console.error("Preprocessing error:", error);
    res.status(500).json({
      success: false,
      error: "Preprocessing failed",
      message: error.message,
    });
  }
});

export default router;
