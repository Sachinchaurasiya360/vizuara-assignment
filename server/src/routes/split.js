import express from "express";
import { trainTestSplit, getDataPreview } from "../utils/dataProcessing.js";
import { getDataset, updateDataset } from "../utils/storage.js";

const router = express.Router();

/**
 * POST /api/split
 * Configure train-test split
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

    // Use preprocessed data if available, otherwise use original data
    const data = dataset.processedData || dataset.data;

    // Validate config
    const testSize = config.testSize || 0.2;
    const randomSeed = config.randomSeed || 42;

    if (testSize <= 0 || testSize >= 1) {
      return res.status(400).json({
        error: "Test size must be between 0 and 1",
      });
    }

    // Perform split
    const { trainData, testData } = trainTestSplit(data, testSize, randomSeed);

    // Get previews
    const trainPreview = getDataPreview(trainData, 5);
    const testPreview = getDataPreview(testData, 5);
    const headers = trainData.length > 0 ? Object.keys(trainData[0]) : [];

    // Update dataset with split data
    updateDataset(fileId, {
      trainData,
      testData,
      splitConfig: {
        testSize,
        trainSize: 1 - testSize,
        randomSeed,
        trainCount: trainData.length,
        testCount: testData.length,
      },
    });

    res.json({
      success: true,
      data: {
        trainCount: trainData.length,
        testCount: testData.length,
        testSize,
        trainSize: 1 - testSize,
        trainPercentage: ((1 - testSize) * 100).toFixed(1),
        testPercentage: (testSize * 100).toFixed(1),
        trainPreview: {
          headers,
          rows: trainPreview,
          totalRows: trainData.length
        },
        testPreview: {
          headers,
          rows: testPreview,
          totalRows: testData.length
        }
      },
      message: "Data split successfully",
    });
  } catch (error) {
    console.error("Split error:", error);
    res.status(500).json({
      success: false,
      error: "Split failed",
      message: error.message,
    });
  }
});

export default router;
