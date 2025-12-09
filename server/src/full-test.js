import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BASE_URL = "http://localhost:3001";
let fileId = null;

console.log("🧪 Testing ML Pipeline Server Endpoints\n");

// Helper to make HTTP requests
function makeRequest(method, path, data = null, isMultipart = false) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "localhost",
      port: 3001,
      path: path,
      method: method,
      headers: isMultipart
        ? {}
        : {
            "Content-Type": "application/json",
          },
    };

    if (data && !isMultipart) {
      const jsonData = JSON.stringify(data);
      options.headers["Content-Length"] = Buffer.byteLength(jsonData);
    }

    const req = http.request(options, (res) => {
      let responseData = "";

      res.on("data", (chunk) => {
        responseData += chunk;
      });

      res.on("end", () => {
        try {
          const result = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: result });
        } catch (err) {
          reject(new Error("Failed to parse response: " + responseData));
        }
      });
    });

    req.on("error", (err) => {
      reject(err);
    });

    if (data && !isMultipart) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Test 1: Health Check
async function testHealthCheck() {
  console.log("=== Test 1: Health Check ===");
  try {
    const result = await makeRequest("GET", "/api/health");
    console.log("✅ Status:", result.data.status);
    console.log("✅ Message:", result.data.message);
    return true;
  } catch (error) {
    console.log("❌ Error:", error.message);
    return false;
  }
}

// Test 2: Upload Invalid File
async function testInvalidUpload() {
  console.log("\n=== Test 2: Upload Invalid File (TXT) ===");
  try {
    const testFile = path.join(__dirname, "../../test-data/invalid.txt");
    const boundary = "----WebKitFormBoundary" + Math.random().toString(36);
    const fileContent = fs.readFileSync(testFile);

    const formData = [
      `--${boundary}`,
      'Content-Disposition: form-data; name="file"; filename="invalid.txt"',
      "Content-Type: text/plain",
      "",
      fileContent.toString(),
      `--${boundary}--`,
    ].join("\r\n");

    const options = {
      hostname: "localhost",
      port: 3001,
      path: "/api/upload",
      method: "POST",
      headers: {
        "Content-Type": `multipart/form-data; boundary=${boundary}`,
        "Content-Length": Buffer.byteLength(formData),
      },
    };

    const result = await new Promise((resolve, reject) => {
      const req = http.request(options, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(data) });
          } catch {
            resolve({ status: res.statusCode, data: { raw: data } });
          }
        });
      });
      req.on("error", reject);
      req.write(formData);
      req.end();
    });

    if (result.status >= 400) {
      console.log("✅ Correctly rejected invalid file");
      console.log("   Error:", result.data.error || result.data.message);
      return true;
    } else {
      console.log("❌ Should have rejected invalid file");
      return false;
    }
  } catch (error) {
    console.log("❌ Error:", error.message);
    return false;
  }
}

// Test 3: Upload Valid CSV
async function testValidUpload() {
  console.log("\n=== Test 3: Upload Valid CSV File ===");
  try {
    const testFile = path.join(__dirname, "../../test-data/valid-sample.csv");
    const boundary = "----WebKitFormBoundary" + Math.random().toString(36);
    const fileContent = fs.readFileSync(testFile);

    const formData = [
      `--${boundary}`,
      'Content-Disposition: form-data; name="file"; filename="valid-sample.csv"',
      "Content-Type: text/csv",
      "",
      fileContent.toString(),
      `--${boundary}--`,
    ].join("\r\n");

    const options = {
      hostname: "localhost",
      port: 3001,
      path: "/api/upload",
      method: "POST",
      headers: {
        "Content-Type": `multipart/form-data; boundary=${boundary}`,
        "Content-Length": Buffer.byteLength(formData),
      },
    };

    const result = await new Promise((resolve, reject) => {
      const req = http.request(options, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(data) });
          } catch {
            reject(new Error("Failed to parse response"));
          }
        });
      });
      req.on("error", reject);
      req.write(formData);
      req.end();
    });

    if (result.status === 200 && result.data.fileId) {
      fileId = result.data.fileId;
      console.log("✅ Upload successful");
      console.log("   File ID:", fileId);
      console.log("   Rows:", result.data.rowCount);
      console.log("   Columns:", result.data.columnCount);
      console.log(
        "   Column Names:",
        result.data.columns.map((c) => c.name).join(", ")
      );
      console.log(
        "   Column Types:",
        result.data.columns.map((c) => `${c.name}(${c.type})`).join(", ")
      );
      return true;
    } else {
      console.log("❌ Upload failed:", result.data);
      return false;
    }
  } catch (error) {
    console.log("❌ Error:", error.message);
    return false;
  }
}

// Test 4: Preprocess with Standardization
async function testPreprocessStandardization() {
  console.log("\n=== Test 4: Preprocess - Standardization ===");
  if (!fileId) {
    console.log("❌ No file ID available");
    return false;
  }

  try {
    const result = await makeRequest("POST", "/api/preprocess", {
      fileId: fileId,
      config: {
        missingValueStrategy: "mean",
        scaleNumeric: {
          columns: ["age", "salary", "experience"],
          method: "standardize",
        },
      },
    });

    if (result.status === 200) {
      console.log("✅ Standardization successful");
      console.log("   Transformations:", result.data.transformations.length);
      console.log("   New columns:", result.data.newColumns.join(", "));
      console.log("   Total rows:", result.data.totalRows);

      if (result.data.preview && result.data.preview.length > 0) {
        console.log("\n   Preview (first row):");
        const firstRow = result.data.preview[0];
        Object.keys(firstRow).forEach((key) => {
          if (key.includes("_scaled")) {
            console.log(`     ${key}: ${firstRow[key]}`);
          }
        });
      }
      return true;
    } else {
      console.log("❌ Preprocessing failed:", result.data);
      return false;
    }
  } catch (error) {
    console.log("❌ Error:", error.message);
    return false;
  }
}

// Test 5: Preprocess with Normalization
async function testPreprocessNormalization() {
  console.log("\n=== Test 5: Preprocess - Normalization ===");
  if (!fileId) {
    console.log("❌ No file ID available");
    return false;
  }

  try {
    const result = await makeRequest("POST", "/api/preprocess", {
      fileId: fileId,
      config: {
        missingValueStrategy: "none",
        scaleNumeric: {
          columns: ["age", "salary"],
          method: "normalize",
        },
      },
    });

    if (result.status === 200) {
      console.log("✅ Normalization successful");
      console.log("   Transformations:", result.data.transformations.length);
      console.log("   New columns:", result.data.newColumns.join(", "));

      if (result.data.preview && result.data.preview.length > 0) {
        console.log("\n   Preview (first 3 rows normalized values):");
        result.data.preview.slice(0, 3).forEach((row, idx) => {
          const normalizedCols = Object.keys(row).filter((k) =>
            k.includes("_scaled")
          );
          console.log(
            `     Row ${idx + 1}:`,
            normalizedCols.map((k) => `${k}=${row[k]}`).join(", ")
          );
        });
      }
      return true;
    } else {
      console.log("❌ Preprocessing failed:", result.data);
      return false;
    }
  } catch (error) {
    console.log("❌ Error:", error.message);
    return false;
  }
}

// Test 6: Train-Test Split
async function testSplit() {
  console.log("\n=== Test 6: Train-Test Split ===");
  if (!fileId) {
    console.log("❌ No file ID available");
    return false;
  }

  try {
    const result = await makeRequest("POST", "/api/split", {
      fileId: fileId,
      config: {
        testSize: 0.3,
        randomSeed: 42,
      },
    });

    if (result.status === 200) {
      console.log("✅ Split successful");
      console.log("   Train samples:", result.data.trainCount);
      console.log("   Test samples:", result.data.testCount);
      console.log("   Test ratio:", result.data.testSize * 100 + "%");
      return true;
    } else {
      console.log("❌ Split failed:", result.data);
      return false;
    }
  } catch (error) {
    console.log("❌ Error:", error.message);
    return false;
  }
}

// Test 7: Train Model
async function testTrain() {
  console.log("\n=== Test 7: Train Model ===");
  if (!fileId) {
    console.log("❌ No file ID available");
    return false;
  }

  try {
    const result = await makeRequest("POST", "/api/train", {
      fileId: fileId,
      config: {
        modelType: "linear_regression",
        taskType: "regression",
        targetColumn: "salary",
        featureColumns: ["age", "experience"],
        hyperparameters: {},
      },
    });

    if (result.status === 200) {
      console.log("✅ Training successful");
      console.log("   Training time:", result.data.trainingTime);
      console.log("   Train R²:", result.data.trainMetrics.r2);
      console.log("   Test R²:", result.data.testMetrics.r2);
      console.log("   Train RMSE:", result.data.trainMetrics.rmse);
      console.log("   Test RMSE:", result.data.testMetrics.rmse);
      console.log("\n   Feature Importance:");
      result.data.featureImportance.forEach((f) => {
        console.log(`     ${f.feature}: ${f.importance}`);
      });
      return true;
    } else {
      console.log("❌ Training failed:", result.data);
      return false;
    }
  } catch (error) {
    console.log("❌ Error:", error.message);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  const results = {
    healthCheck: false,
    invalidUpload: false,
    validUpload: false,
    standardization: false,
    normalization: false,
    split: false,
    train: false,
  };

  try {
    results.healthCheck = await testHealthCheck();
    await new Promise((r) => setTimeout(r, 500));

    results.invalidUpload = await testInvalidUpload();
    await new Promise((r) => setTimeout(r, 500));

    results.validUpload = await testValidUpload();
    await new Promise((r) => setTimeout(r, 500));

    results.standardization = await testPreprocessStandardization();
    await new Promise((r) => setTimeout(r, 500));

    results.normalization = await testPreprocessNormalization();
    await new Promise((r) => setTimeout(r, 500));

    results.split = await testSplit();
    await new Promise((r) => setTimeout(r, 500));

    results.train = await testTrain();

    // Summary
    console.log("\n\n" + "=".repeat(50));
    console.log("TEST SUMMARY");
    console.log("=".repeat(50));
    console.log(
      "1. Health Check:",
      results.healthCheck ? "✅ PASS" : "❌ FAIL"
    );
    console.log(
      "2. Invalid Upload:",
      results.invalidUpload ? "✅ PASS" : "❌ FAIL"
    );
    console.log(
      "3. Valid Upload:",
      results.validUpload ? "✅ PASS" : "❌ FAIL"
    );
    console.log(
      "4. Standardization:",
      results.standardization ? "✅ PASS" : "❌ FAIL"
    );
    console.log(
      "5. Normalization:",
      results.normalization ? "✅ PASS" : "❌ FAIL"
    );
    console.log("6. Train-Test Split:", results.split ? "✅ PASS" : "❌ FAIL");
    console.log("7. Train Model:", results.train ? "✅ PASS" : "❌ FAIL");

    const passed = Object.values(results).filter((r) => r).length;
    const total = Object.keys(results).length;

    console.log("\n" + passed + "/" + total + " tests passed");

    if (passed === total) {
      console.log("\n🎉 ALL TESTS PASSED! Server is working perfectly!");
    } else {
      console.log("\n⚠️  Some tests failed.");
    }
  } catch (error) {
    console.error("\n❌ Test suite error:", error.message);
  }
}

runAllTests();
