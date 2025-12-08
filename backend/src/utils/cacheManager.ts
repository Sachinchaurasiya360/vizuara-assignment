/**
 * Cache Manager for Pipeline State Management
 * Uses node-cache for in-memory caching with TTL and memory management
 */

import NodeCache from "node-cache";
import { v4 as uuidv4 } from "uuid";
import config from "../config";
import logger from "../config/logger";
import { PipelineState } from "../types/pipeline.types";

class CacheManager {
  private cache: NodeCache;
  private memoryCheckInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.cache = new NodeCache({
      stdTTL: config.cache.ttl,
      checkperiod: config.cache.checkPeriod,
      useClones: false, // Don't clone data for better performance
      deleteOnExpire: true,
    });

    // Setup event listeners
    this.setupEventListeners();

    // Start memory monitoring
    this.startMemoryMonitoring();

    logger.info("CacheManager initialized", {
      ttl: config.cache.ttl,
      maxKeys: config.cache.maxKeys,
    });
  }

  private setupEventListeners(): void {
    this.cache.on("set", (key, _value) => {
      logger.debug(`Cache SET: ${key}`);
    });

    this.cache.on("del", (key, _value) => {
      logger.debug(`Cache DELETE: ${key}`);
    });

    this.cache.on("expired", (key, _value) => {
      logger.debug(`Cache EXPIRED: ${key}`);
      this.cleanupExpiredData(key);
    });
  }

  private startMemoryMonitoring(): void {
    this.memoryCheckInterval = setInterval(() => {
      this.checkMemoryUsage();
    }, config.memory.cleanupInterval);
  }

  private checkMemoryUsage(): void {
    const usage = process.memoryUsage();
    const usedMB = Math.round(usage.heapUsed / 1024 / 1024);

    logger.debug("Memory usage", {
      heapUsed: `${usedMB}MB`,
      heapTotal: `${Math.round(usage.heapTotal / 1024 / 1024)}MB`,
    });

    // If memory usage exceeds threshold, trigger cleanup
    if (usedMB > config.memory.maxUsageMB) {
      logger.warn(
        `Memory usage (${usedMB}MB) exceeds threshold, triggering cleanup`
      );
      this.performEmergencyCleanup();
    }
  }

  private performEmergencyCleanup(): void {
    const keys = this.cache.keys();
    const stats = this.cache.getStats();

    logger.info("Performing emergency cleanup", {
      totalKeys: keys.length,
      hits: stats.hits,
      misses: stats.misses,
    });

    // Remove oldest entries (LRU strategy)
    const sortedKeys = keys.sort((a, b) => {
      const ttlA = this.cache.getTtl(a) || 0;
      const ttlB = this.cache.getTtl(b) || 0;
      return ttlA - ttlB;
    });

    // Delete 25% of oldest entries
    const deleteCount = Math.ceil(sortedKeys.length * 0.25);
    for (let i = 0; i < deleteCount && i < sortedKeys.length; i++) {
      this.delete(sortedKeys[i]);
    }

    // Force garbage collection if available
    if (global.gc) {
      global.gc();
      logger.info("Forced garbage collection");
    }
  }

  private cleanupExpiredData(key: string): void {
    // Additional cleanup logic if needed
    logger.debug(`Cleaning up expired data for key: ${key}`);
  }

  /**
   * Generate a unique file ID
   */
  public generateFileId(): string {
    return uuidv4();
  }

  /**
   * Store pipeline state
   */
  public set<T = any>(key: string, value: T, ttl?: number): boolean {
    try {
      const success = this.cache.set(key, value, ttl || config.cache.ttl);

      if (success) {
        logger.debug(`Cached data for key: ${key}`);
      }

      return success;
    } catch (error) {
      logger.error("Failed to cache data", { key, error });
      return false;
    }
  }

  /**
   * Retrieve pipeline state
   */
  public get<T = any>(key: string): T | undefined {
    try {
      const value = this.cache.get<T>(key);

      if (value === undefined) {
        logger.debug(`Cache miss for key: ${key}`);
      }

      return value;
    } catch (error) {
      logger.error("Failed to retrieve cached data", { key, error });
      return undefined;
    }
  }

  /**
   * Check if key exists
   */
  public has(key: string): boolean {
    return this.cache.has(key);
  }

  /**
   * Delete cached data
   */
  public delete(key: string): number {
    try {
      const deleted = this.cache.del(key);

      if (deleted > 0) {
        logger.debug(`Deleted cache for key: ${key}`);
      }

      return deleted;
    } catch (error) {
      logger.error("Failed to delete cached data", { key, error });
      return 0;
    }
  }

  /**
   * Update pipeline state
   */
  public updatePipelineState(
    fileId: string,
    updates: Partial<PipelineState>
  ): boolean {
    const existing = this.get<PipelineState>(fileId);

    if (!existing) {
      logger.warn(`Pipeline state not found for fileId: ${fileId}`);
      return false;
    }

    const updated: PipelineState = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };

    return this.set(fileId, updated);
  }

  /**
   * Get all cached keys
   */
  public getAllKeys(): string[] {
    return this.cache.keys();
  }

  /**
   * Get cache statistics
   */
  public getStats(): NodeCache.Stats {
    return this.cache.getStats();
  }

  /**
   * Clear all cache
   */
  public flush(): void {
    this.cache.flushAll();
    logger.info("Cache flushed");
  }

  /**
   * Cleanup on shutdown
   */
  public shutdown(): void {
    if (this.memoryCheckInterval) {
      clearInterval(this.memoryCheckInterval);
    }
    this.cache.close();
    logger.info("CacheManager shutdown complete");
  }
}

// Singleton instance
export const cacheManager = new CacheManager();

export default cacheManager;
