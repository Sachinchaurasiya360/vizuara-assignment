/**
 * Zod Validation Schemas for ML Pipeline
 */

import { z } from "zod";

// Enums
export const TaskTypeSchema = z.enum(["classification", "regression"]);

export const ModelTypeSchema = z.enum([
  "logistic_regression",
  "decision_tree",
  "random_forest",
  "linear_regression",
  "ridge",
  "lasso",
]);

export const ScalerTypeSchema = z.enum([
  "standard",
  "minmax",
  "robust",
  "none",
]);

export const EncodingTypeSchema = z.enum(["onehot", "label", "target", "none"]);

export const MissingValueStrategySchema = z.enum([
  "drop",
  "mean",
  "median",
  "mode",
  "constant",
]);

// Preprocessing Validation
export const PreprocessingConfigSchema = z.object({
  fileId: z.string().uuid("Invalid file ID format"),
  missingValueHandling: z.object({
    strategy: MissingValueStrategySchema,
    columns: z.array(z.string()).optional(),
    fillValue: z.union([z.string(), z.number()]).optional(),
  }),
  scaling: z.object({
    method: ScalerTypeSchema,
    columns: z.array(z.string()).optional(),
  }),
  encoding: z.object({
    method: EncodingTypeSchema,
    columns: z.array(z.string()).optional(),
  }),
  removeColumns: z.array(z.string()).optional(),
});

// Train-Test Split Validation
export const TrainTestSplitConfigSchema = z.object({
  fileId: z.string().uuid("Invalid file ID format"),
  testSize: z
    .number()
    .min(0.1, "Test size must be at least 0.1")
    .max(0.9, "Test size must not exceed 0.9"),
  randomState: z.number().int().optional(),
  stratify: z.boolean().optional(),
  targetColumn: z.string().optional(),
  shuffle: z.boolean().optional().default(true),
});

// Model Training Validation
export const ModelConfigSchema = z.object({
  fileId: z.string().uuid("Invalid file ID format"),
  modelType: ModelTypeSchema,
  taskType: TaskTypeSchema,
  targetColumn: z.string().min(1, "Target column is required"),
  featureColumns: z
    .array(z.string())
    .min(1, "At least one feature column is required"),
  hyperparameters: z.record(z.any()).optional(),
});

// File Upload Validation
export const FileUploadSchema = z.object({
  mimetype: z.enum(
    [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ],
    {
      errorMap: () => ({ message: "Only CSV and Excel files are allowed" }),
    }
  ),
  size: z.number().max(100 * 1024 * 1024, "File size must not exceed 100MB"),
});

// Query Params Validation
export const FileIdParamSchema = z.object({
  fileId: z.string().uuid("Invalid file ID format"),
});

export const ModelIdParamSchema = z.object({
  modelId: z.string().uuid("Invalid model ID format"),
});

// Type inference
export type PreprocessingConfigInput = z.infer<
  typeof PreprocessingConfigSchema
>;
export type TrainTestSplitConfigInput = z.infer<
  typeof TrainTestSplitConfigSchema
>;
export type ModelConfigInput = z.infer<typeof ModelConfigSchema>;
export type FileIdParam = z.infer<typeof FileIdParamSchema>;
export type ModelIdParam = z.infer<typeof ModelIdParamSchema>;
