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
    const { fileId, config, splitRatio } = req.body;

    if (!fileId) {
      return res.status(400).json({ error: "File ID is required" });
    }

    const dataset = getDataset(fileId);
    if (!dataset) {
      return res.status(404).json({ error: "Dataset not found" });
    }

    // Use preprocessed data if available, otherwise use original data
    const data = dataset.processedData || dataset.data;

    // Validate config - support both config.testSize and legacy splitRatio
    const testSize = config?.testSize ?? (splitRatio ? 1 - splitRatio : 0.2);
    const trainRatio = 1 - testSize;
    const randomSeed = config?.randomState || config?.randomSeed || 42;

    if (testSize <= 0 || testSize >= 1) {
      return res.status(400).json({
        error: "Test size must be between 0 and 1",
      });
    }

    // Perform split
    console.log(
      `📊 [SPLIT] Splitting data with ratio ${trainRatio}:${testSize}...`
    );
    const { trainData, testData } = trainTestSplit(data, testSize, randomSeed);

    // Validate split results
    console.log(
      `📊 [SPLIT] Train samples: ${trainData.length}, Test samples: ${testData.length}`
    );

    if (testData.length === 0) {
      console.error("❌ [ERROR] Test set is empty after split");
      return res.status(400).json({
        success: false,
        error: "Test set is empty. Adjust split ratio or dataset.",
        details: `With test size ${testSize}, the resulting test set has 0 rows. Try using a larger dataset or different split ratio.`,
      });
    }

    if (trainData.length === 0) {
      console.error("❌ [ERROR] Training set is empty after split");
      return res.status(400).json({
        success: false,
        error: "Training set is empty. Adjust split ratio.",
      });
    }

    console.log(
      `✅ [SPLIT] Split successful - Train: ${trainData.length} rows, Test: ${testData.length} rows`
    );

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
          totalRows: trainData.length,
        },
        testPreview: {
          headers,
          rows: testPreview,
          totalRows: testData.length,
        },
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
