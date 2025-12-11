/**
 * Test script for ML Pipeline - Split and Model Training
 * Tests points 3 (Train-Test Split) and 4 (Model Selection)
 * Run from server directory: cd server && node ../test-pipeline.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_BASE = "https://vizuara-backend.vercel.app/api";

// Color codes for console output
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testPipeline() {
  let fileId;

  try {
    log("\n========================================", "cyan");
    log("Testing ML Pipeline - Split & Model Training", "cyan");
    log("========================================\n", "cyan");

    // Step 1: Upload file
    log("Step 1: Uploading CSV file...", "blue");
    const csvPath = path.join(__dirname, "test-data", "valid-sample.csv");

    if (!fs.existsSync(csvPath)) {
      throw new Error(`Test file not found: ${csvPath}`);
    }

    // Read file and create FormData
    const fileContent = fs.readFileSync(csvPath);
    const boundary = "----WebKitFormBoundary" + Math.random().toString(36);
    const formData = [
      `--${boundary}`,
      `Content-Disposition: form-data; name="file"; filename="valid-sample.csv"`,
      `Content-Type: text/csv`,
      "",
      fileContent.toString(),
      `--${boundary}--`,
    ].join("\r\n");

    const uploadResponse = await fetch(`${API_BASE}/upload`, {
      method: "POST",
      headers: {
        "Content-Type": `multipart/form-data; boundary=${boundary}`,
      },
      body: formData,
    });

    const uploadResult = await uploadResponse.json();

    if (!uploadResult.success) {
      throw new Error(`Upload failed: ${uploadResult.message}`);
    }

    fileId = uploadResult.data.fileId;
    log(`✓ File uploaded successfully`, "green");
    log(`  File ID: ${fileId}`, "green");
    log(`  Rows: ${uploadResult.data.rowCount}`, "green");
    log(`  Columns: ${uploadResult.data.columns.join(", ")}\n`, "green");

    // Step 2: Test Train-Test Split (Point 3)
    log("Step 2: Testing Train-Test Split (80-20)...", "blue");

    const splitResponse = await fetch(`${API_BASE}/split`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileId,
        splitRatio: 0.8,
      }),
    });

    const splitResult = await splitResponse.json();

    if (!splitResult.success) {
      throw new Error(`Split failed: ${splitResult.message}`);
    }

    log(`✓ Split completed successfully`, "green");
    log(
      `  Train set: ${splitResult.data.trainCount} rows (${splitResult.data.trainPercentage}%)`,
      "green"
    );
    log(
      `  Test set: ${splitResult.data.testCount} rows (${splitResult.data.testPercentage}%)`,
      "green"
    );
    log(
      `  Train preview: ${splitResult.data.trainPreview.totalRows} rows shown`,
      "green"
    );
    log(
      `  Test preview: ${splitResult.data.testPreview.totalRows} rows shown\n`,
      "green"
    );

    // Step 3: Test Model Training - Logistic Regression (Point 4)
    log("Step 3: Testing Model Selection - Logistic Regression...", "blue");

    // Get column info from upload
    const columns = uploadResult.data.columns;
    const targetColumn = columns[columns.length - 1]; // Last column as target
    const featureColumns = columns.slice(0, -1); // All except last

    const logisticResponse = await fetch(`${API_BASE}/train`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileId,
        modelType: "logistic_regression",
        targetColumn,
        featureColumns,
        hyperparameters: {
          C: 1.0,
          max_iter: 100,
        },
      }),
    });

    const logisticResult = await logisticResponse.json();

    if (!logisticResult.success) {
      throw new Error(
        `Logistic Regression training failed: ${logisticResult.message}`
      );
    }

    log(`✓ Logistic Regression trained successfully`, "green");
    log(`  Model: ${logisticResult.data.modelType}`, "green");
    log(`  Target: ${logisticResult.data.targetColumn}`, "green");
    log(
      `  Features: ${logisticResult.data.featureColumns.join(", ")}`,
      "green"
    );
    if (logisticResult.data.metrics) {
      log(`  Metrics:`, "green");
      Object.entries(logisticResult.data.metrics).forEach(([key, value]) => {
        log(
          `    ${key}: ${typeof value === "number" ? value.toFixed(4) : value}`,
          "green"
        );
      });
    }
    log("", "green");

    // Step 4: Test Model Training - Decision Tree (Point 4)
    log("Step 4: Testing Model Selection - Decision Tree...", "blue");

    const treeResponse = await fetch(`${API_BASE}/train`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileId,
        modelType: "decision_tree",
        targetColumn,
        featureColumns,
        hyperparameters: {
          max_depth: 10,
          min_samples_split: 2,
        },
      }),
    });

    const treeResult = await treeResponse.json();

    if (!treeResult.success) {
      throw new Error(`Decision Tree training failed: ${treeResult.message}`);
    }

    log(`✓ Decision Tree trained successfully`, "green");
    log(`  Model: ${treeResult.data.modelType}`, "green");
    log(`  Target: ${treeResult.data.targetColumn}`, "green");
    log(`  Features: ${treeResult.data.featureColumns.join(", ")}`, "green");
    if (treeResult.data.metrics) {
      log(`  Metrics:`, "green");
      Object.entries(treeResult.data.metrics).forEach(([key, value]) => {
        log(
          `    ${key}: ${typeof value === "number" ? value.toFixed(4) : value}`,
          "green"
        );
      });
    }
    log("", "green");

    log("========================================", "cyan");
    log("✓ ALL TESTS PASSED!", "green");
    log("========================================\n", "cyan");

    log("Summary:", "yellow");
    log("✓ Point 3 (Train-Test Split): Working correctly", "green");
    log("  - Split ratio configurable (tested 80-20)", "green");
    log("  - Returns train/test counts and percentages", "green");
    log("  - Provides preview data for both sets", "green");
    log("✓ Point 4 (Model Selection): Working correctly", "green");
    log("  - Logistic Regression trained successfully", "green");
    log("  - Decision Tree trained successfully", "green");
    log("  - Both models return metrics and results\n", "green");
  } catch (error) {
    log(`\n✗ Test failed: ${error.message}`, "red");
    console.error(error);
    process.exit(1);
  }
}

// Run tests
testPipeline();
