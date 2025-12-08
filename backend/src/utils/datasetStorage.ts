/**
 * Dataset Storage Manager
 * Manages dataset storage and retrieval
 */

import { cacheManager } from "./cacheManager";
import logger from "../config/logger";

export interface StoredDataset {
  dataFrame: any;
  originalData: any[];
  metadata: {
    fileName: string;
    rowCount: number;
    columnCount: number;
    columns: string[];
    dtypes: Record<string, string>;
  };
  trainData?: any;
  testData?: any;
  trainLabels?: any;
  testLabels?: any;
  createdAt: Date;
  lastAccessed: Date;
}

class DatasetStorage {
  private static instance: DatasetStorage;
  private datasets: Map<string, StoredDataset>;
  private readonly DATASET_PREFIX = "dataset:";

  constructor() {
    this.datasets = new Map();
  }

  public static getInstance(): DatasetStorage {
    if (!DatasetStorage.instance) {
      DatasetStorage.instance = new DatasetStorage();
    }
    return DatasetStorage.instance;
  }

  public storeDataset(
    fileId: string,
    dataFrame: any,
    fileName: string,
    columns?: string[],
    dtypes?: Record<string, string>
  ): void {
    const dataset: StoredDataset = {
      dataFrame,
      originalData: [],
      metadata: {
        fileName,
        rowCount: dataFrame.data?.length || 0,
        columnCount: columns?.length || 0,
        columns: columns || [],
        dtypes: dtypes || {},
      },
      createdAt: new Date(),
      lastAccessed: new Date(),
    };

    this.datasets.set(fileId, dataset);
    cacheManager.set(`${this.DATASET_PREFIX}${fileId}`, dataset);
    logger.info("Dataset stored", { fileId, fileName });
  }

  public getDataset(fileId: string): StoredDataset | null {
    const dataset = this.datasets.get(fileId);
    if (dataset) {
      dataset.lastAccessed = new Date();
    }
    return dataset || null;
  }

  public updateDataFrame(fileId: string, dataFrame: any): boolean {
    const dataset = this.datasets.get(fileId);
    if (!dataset) return false;

    dataset.dataFrame = dataFrame;
    dataset.lastAccessed = new Date();
    this.datasets.set(fileId, dataset);
    return true;
  }

  public storeSplitData(
    fileId: string,
    trainData: any,
    testData: any,
    trainLabels: any,
    testLabels: any
  ): boolean {
    const dataset = this.datasets.get(fileId);
    if (!dataset) return false;

    dataset.trainData = trainData;
    dataset.testData = testData;
    dataset.trainLabels = trainLabels;
    dataset.testLabels = testLabels;
    dataset.lastAccessed = new Date();

    this.datasets.set(fileId, dataset);
    cacheManager.set(`${this.DATASET_PREFIX}${fileId}`, dataset);
    logger.info("Split data stored", { fileId });
    return true;
  }

  public getSplitData(fileId: string): {
    trainData: any;
    testData: any;
    trainLabels: any;
    testLabels: any;
    targetColumn: string;
  } | null {
    const dataset = this.datasets.get(fileId);
    if (!dataset || !dataset.trainData) return null;

    return {
      trainData: dataset.trainData,
      testData: dataset.testData,
      trainLabels: dataset.trainLabels,
      testLabels: dataset.testLabels,
      targetColumn: "",
    };
  }

  public deleteDataset(fileId: string): boolean {
    const deleted = this.datasets.delete(fileId);
    cacheManager.delete(`${this.DATASET_PREFIX}${fileId}`);
    logger.info("Dataset deleted", { fileId });
    return deleted;
  }

  public getMetadata(fileId: string) {
    const dataset = this.datasets.get(fileId);
    return dataset?.metadata || null;
  }
}

export const datasetStorage = DatasetStorage.getInstance();
export default DatasetStorage;
