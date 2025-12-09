import fs from "fs";
import path from "path";
import csvParser from "csv-parser";
import XLSX from "xlsx";

/**
 * Parse CSV file and return data
 */
export async function parseCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (error) => reject(error));
  });
}

/**
 * Parse Excel file and return data
 */
export function parseExcel(filePath) {
  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
    return data;
  } catch (error) {
    throw new Error(`Failed to parse Excel file: ${error.message}`);
  }
}

/**
 * Get column types and basic statistics
 */
export function analyzeColumns(data) {
  if (!data || data.length === 0) {
    return [];
  }

  const columns = Object.keys(data[0]);
  const columnInfo = columns.map((col) => {
    const values = data
      .map((row) => row[col])
      .filter((val) => val !== null && val !== undefined && val !== "");
    const numericValues = values
      .filter((val) => !isNaN(val) && val !== "")
      .map(Number);

    const isNumeric = numericValues.length > values.length * 0.8; // 80% threshold
    const uniqueValues = [...new Set(values)];
    const missingCount = data.length - values.length;

    return {
      name: col,
      type: isNumeric ? "numeric" : "categorical",
      missingCount,
      missingPercentage: ((missingCount / data.length) * 100).toFixed(2),
      uniqueValues: uniqueValues.length,
      sampleValues: uniqueValues.slice(0, 5),
    };
  });

  return columnInfo;
}

/**
 * Get preview of data (first N rows)
 */
export function getDataPreview(data, rows = 5) {
  return data.slice(0, rows);
}

/**
 * Validate file type
 */
export function validateFileType(filename) {
  const ext = path.extname(filename).toLowerCase();
  const validExtensions = [".csv", ".xlsx", ".xls"];
  return validExtensions.includes(ext);
}

/**
 * Handle missing values
 */
export function handleMissingValues(data, strategy, columnInfo) {
  if (strategy === "none") return data;

  const processedData = data.map((row) => {
    const newRow = { ...row };

    columnInfo.forEach((col) => {
      const value = newRow[col.name];

      if (value === null || value === undefined || value === "") {
        if (strategy === "remove") {
          // Will be filtered out later
          newRow.__remove__ = true;
        } else if (strategy === "mean" && col.type === "numeric") {
          // Calculate mean
          const numericValues = data
            .map((r) => r[col.name])
            .filter(
              (v) => v !== null && v !== undefined && v !== "" && !isNaN(v)
            )
            .map(Number);
          const mean =
            numericValues.reduce((a, b) => a + b, 0) / numericValues.length;
          newRow[col.name] = mean;
        } else if (strategy === "median" && col.type === "numeric") {
          // Calculate median
          const numericValues = data
            .map((r) => r[col.name])
            .filter(
              (v) => v !== null && v !== undefined && v !== "" && !isNaN(v)
            )
            .map(Number)
            .sort((a, b) => a - b);
          const mid = Math.floor(numericValues.length / 2);
          const median =
            numericValues.length % 2 === 0
              ? (numericValues[mid - 1] + numericValues[mid]) / 2
              : numericValues[mid];
          newRow[col.name] = median;
        } else if (strategy === "mode") {
          // Calculate mode
          const values = data
            .map((r) => r[col.name])
            .filter((v) => v !== null && v !== undefined && v !== "");
          const frequency = {};
          values.forEach((v) => (frequency[v] = (frequency[v] || 0) + 1));
          const mode = Object.keys(frequency).reduce((a, b) =>
            frequency[a] > frequency[b] ? a : b
          );
          newRow[col.name] = mode;
        }
      }
    });

    return newRow;
  });

  // Remove rows if strategy is 'remove'
  if (strategy === "remove") {
    return processedData.filter((row) => !row.__remove__);
  }

  return processedData;
}

/**
 * Encode categorical variables
 */
export function encodeCategorical(data, columns, columnInfo) {
  const encodingMap = {};
  const processedData = [...data];

  columns.forEach((colName) => {
    const colInfo = columnInfo.find((c) => c.name === colName);
    if (!colInfo || colInfo.type !== "categorical") return;

    const uniqueValues = [
      ...new Set(data.map((row) => row[colName]).filter((v) => v)),
    ];
    const encoding = {};
    uniqueValues.forEach((value, index) => {
      encoding[value] = index;
    });

    encodingMap[colName] = encoding;

    processedData.forEach((row) => {
      if (row[colName]) {
        row[`${colName}_encoded`] = encoding[row[colName]];
      }
    });
  });

  return { data: processedData, encodingMap };
}

/**
 * Normalize/Scale numeric columns
 */
export function scaleNumeric(data, columns, method, columnInfo) {
  const scalingParams = {};
  const processedData = [...data];

  columns.forEach((colName) => {
    const colInfo = columnInfo.find((c) => c.name === colName);
    if (!colInfo || colInfo.type !== "numeric") return;

    const values = data
      .map((row) => Number(row[colName]))
      .filter((v) => !isNaN(v));

    if (method === "normalize") {
      // Min-Max normalization
      const min = Math.min(...values);
      const max = Math.max(...values);
      scalingParams[colName] = { method: "normalize", min, max };

      processedData.forEach((row) => {
        const val = Number(row[colName]);
        if (!isNaN(val)) {
          row[`${colName}_scaled`] = (val - min) / (max - min);
        }
      });
    } else if (method === "standardize") {
      // Z-score standardization
      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      const variance =
        values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
      const std = Math.sqrt(variance);
      scalingParams[colName] = { method: "standardize", mean, std };

      processedData.forEach((row) => {
        const val = Number(row[colName]);
        if (!isNaN(val)) {
          row[`${colName}_scaled`] = (val - mean) / std;
        }
      });
    }
  });

  return { data: processedData, scalingParams };
}

/**
 * Split data into train and test sets
 */
export function trainTestSplit(data, testSize = 0.2, randomSeed = 42) {
  // Simple random split with seed
  const shuffled = [...data];

  // Seeded shuffle
  let seed = randomSeed;
  for (let i = shuffled.length - 1; i > 0; i--) {
    seed = (seed * 9301 + 49297) % 233280;
    const j = Math.floor((seed / 233280) * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const splitIndex = Math.floor(shuffled.length * (1 - testSize));
  const trainData = shuffled.slice(0, splitIndex);
  const testData = shuffled.slice(splitIndex);

  return { trainData, testData };
}
