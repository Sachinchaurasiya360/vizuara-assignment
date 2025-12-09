import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log("🧪 Starting API Tests...\n");

const BASE_URL = "http://localhost:3001/api";
let fileId = null;

// Helper function to make API calls
async function apiCall(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  console.log(`\n📡 ${options.method || "GET"} ${endpoint}`);

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.log("❌ Error:", data.error || data.message);
      return null;
    }

    console.log("✅ Success");
    return data;
  } catch (error) {
    console.log("❌ Request failed:", error.message);
    return null;
  }
}

// Test 1: Health Check
async function testHealthCheck() {
  console.log("\n=== Test 1: Health Check ===");
  const result = await apiCall("/health");
  if (result) {
    console.log("Status:", result.status);
    console.log("Message:", result.message);
  }
  return result !== null;
}

// Test 2: Upload Dataset
async function testUpload() {
  console.log("\n=== Test 2: Upload Dataset ===");

  // Create test CSV file
  const testDataPath = path.join(__dirname, "../test-data/test-dataset.csv");
  const csvContent = `age,income,education,purchased
25,50000,bachelor,1
30,60000,master,1
22,45000,bachelor,0
35,70000,master,1
28,55000,bachelor,1
40,80000,phd,1
23,42000,bachelor,0
32,65000,master,1
27,52000,bachelor,0
38,75000,phd,1
24,48000,bachelor,0
33,68000,master,1
29,58000,bachelor,1
41,82000,phd,1
26,51000,bachelor,0
31,62000,master,1
36,72000,phd,1
25,49000,bachelor,0
34,69000,master,1
39,78000,phd,1`;

  // Ensure test-data directory exists
  const testDataDir = path.join(__dirname, "../test-data");
  if (!fs.existsSync(testDataDir)) {
    fs.mkdirSync(testDataDir, { recursive: true });
  }

  fs.writeFileSync(testDataPath, csvContent);

  // Create FormData for file upload
  const formData = new FormData();
  const fileBlob = new Blob([csvContent], { type: "text/csv" });
  formData.append("file", fileBlob, "test-dataset.csv");

  const result = await apiCall("/upload", {
    method: "POST",
    body: formData,
  });

  if (result) {
    fileId = result.fileId;
    console.log("File ID:", fileId);
    console.log("Rows:", result.rowCount);
    console.log("Columns:", result.columnCount);
    console.log("Column Names:", result.columns.map((c) => c.name).join(", "));
  }

  return result !== null;
}

// Test 3: Preprocess Data
async function testPreprocess() {
  console.log("\n=== Test 3: Preprocess Data ===");

  if (!fileId) {
    console.log("❌ No file ID available");
    return false;
  }

  const result = await apiCall("/preprocess", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fileId,
      config: {
        missingValueStrategy: "mean",
        encodeCategorical: ["education"],
        scaleNumeric: {
          columns: ["age", "income"],
          method: "normalize",
        },
      },
    }),
  });

  if (result) {
    console.log("Transformations:", result.transformations.length);
    console.log("New columns:", result.newColumns.join(", "));
  }

  return result !== null;
}

// Test 4: Train-Test Split
async function testSplit() {
  console.log("\n=== Test 4: Train-Test Split ===");

  if (!fileId) {
    console.log("❌ No file ID available");
    return false;
  }

  const result = await apiCall("/split", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fileId,
      config: {
        testSize: 0.2,
        randomSeed: 42,
      },
    }),
  });

  if (result) {
    console.log("Train samples:", result.trainCount);
    console.log("Test samples:", result.testCount);
    console.log("Test size:", result.testSize * 100 + "%");
  }

  return result !== null;
}

// Test 5: Train Model
async function testTrain() {
  console.log("\n=== Test 5: Train Model ===");

  if (!fileId) {
    console.log("❌ No file ID available");
    return false;
  }

  const result = await apiCall("/train", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fileId,
      config: {
        modelType: "logistic_regression",
        taskType: "classification",
        targetColumn: "purchased",
        featureColumns: ["age", "income"],
        hyperparameters: {
          learningRate: 0.01,
          iterations: 1000,
        },
      },
    }),
  });

  if (result) {
    console.log("Training time:", result.trainingTime);
    console.log("Train accuracy:", result.trainMetrics.accuracy);
    console.log("Test accuracy:", result.testMetrics.accuracy);
    console.log("Feature importance:");
    result.featureImportance.forEach((f) => {
      console.log(`  - ${f.feature}: ${f.importance}`);
    });
  }

  return result !== null;
}

// Run all tests
async function runTests() {
  const results = {
    healthCheck: false,
    upload: false,
    preprocess: false,
    split: false,
    train: false,
  };

  try {
    results.healthCheck = await testHealthCheck();
    await new Promise((resolve) => setTimeout(resolve, 500));

    results.upload = await testUpload();
    await new Promise((resolve) => setTimeout(resolve, 500));

    results.preprocess = await testPreprocess();
    await new Promise((resolve) => setTimeout(resolve, 500));

    results.split = await testSplit();
    await new Promise((resolve) => setTimeout(resolve, 500));

    results.train = await testTrain();

    // Summary
    console.log("\n\n=== Test Summary ===");
    console.log("Health Check:", results.healthCheck ? "✅ PASS" : "❌ FAIL");
    console.log("Upload:", results.upload ? "✅ PASS" : "❌ FAIL");
    console.log("Preprocess:", results.preprocess ? "✅ PASS" : "❌ FAIL");
    console.log("Split:", results.split ? "✅ PASS" : "❌ FAIL");
    console.log("Train:", results.train ? "✅ PASS" : "❌ FAIL");

    const passed = Object.values(results).filter((r) => r).length;
    const total = Object.keys(results).length;

    console.log(`\n${passed}/${total} tests passed`);

    if (passed === total) {
      console.log("\n🎉 All tests passed!");
    } else {
      console.log(
        "\n⚠️  Some tests failed. Make sure the server is running on port 3001"
      );
    }
  } catch (error) {
    console.error("\n❌ Test suite failed:", error.message);
  }
}

runTests();
