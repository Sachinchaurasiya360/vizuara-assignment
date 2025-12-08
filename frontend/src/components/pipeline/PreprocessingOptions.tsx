import React, { useState } from "react";
import { Settings } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import type {
  PreprocessingConfig,
  MissingValueStrategy,
  ScalingStrategy,
  EncodingStrategy,
  ColumnInfo,
} from "@/types/pipeline.types";

interface PreprocessingOptionsProps {
  columns: ColumnInfo[];
  onApply: (config: PreprocessingConfig) => void;
  isLoading?: boolean;
}

export function PreprocessingOptions({
  columns,
  onApply,
  isLoading,
}: PreprocessingOptionsProps) {
  const [missingStrategy, setMissingStrategy] =
    useState<MissingValueStrategy["strategy"]>("mean");
  const [scalingMethod, setScalingMethod] =
    useState<ScalingStrategy["method"]>("standardize");
  const [encodingMethod, setEncodingMethod] =
    useState<EncodingStrategy["method"]>("onehot");

  const numericColumns = columns.filter((col) => col.type === "numeric");
  const categoricalColumns = columns.filter(
    (col) => col.type === "categorical"
  );
  const columnsWithMissing = columns.filter((col) => col.missingCount > 0);

  const handleApply = () => {
    const config: PreprocessingConfig = {};

    // Add missing value handling if needed
    if (columnsWithMissing.length > 0) {
      config.missingValues = [
        {
          strategy: missingStrategy,
          columns: columnsWithMissing.map((col) => col.name),
        },
      ];
    }

    // Add scaling for numeric columns
    if (numericColumns.length > 0) {
      config.scaling = [
        {
          method: scalingMethod,
          columns: numericColumns.map((col) => col.name),
        },
      ];
    }

    // Add encoding for categorical columns
    if (categoricalColumns.length > 0) {
      config.encoding = [
        {
          method: encodingMethod,
          columns: categoricalColumns.map((col) => col.name),
        },
      ];
    }

    onApply(config);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Preprocessing Options
        </CardTitle>
        <CardDescription>Configure data preprocessing steps</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Missing Values */}
        {columnsWithMissing.length > 0 && (
          <div className="space-y-3">
            <div>
              <Label className="text-base font-semibold">Missing Values</Label>
              <p className="text-sm text-slate-500 mt-1">
                {columnsWithMissing.length} column(s) have missing values
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="missing-strategy">Strategy</Label>
              <Select
                id="missing-strategy"
                value={missingStrategy}
                onChange={(e) =>
                  setMissingStrategy(
                    e.target.value as MissingValueStrategy["strategy"]
                  )
                }
              >
                <option value="drop">Drop rows with missing values</option>
                <option value="mean">Fill with mean (numeric only)</option>
                <option value="median">Fill with median (numeric only)</option>
                <option value="mode">Fill with mode</option>
                <option value="constant">Fill with constant value</option>
              </Select>
            </div>
            <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded">
              Columns: {columnsWithMissing.map((col) => col.name).join(", ")}
            </div>
          </div>
        )}

        {/* Feature Scaling */}
        {numericColumns.length > 0 && (
          <div className="space-y-3">
            <div>
              <Label className="text-base font-semibold">Feature Scaling</Label>
              <p className="text-sm text-slate-500 mt-1">
                Scale numeric features for better model performance
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="scaling-method">Method</Label>
              <Select
                id="scaling-method"
                value={scalingMethod}
                onChange={(e) =>
                  setScalingMethod(e.target.value as ScalingStrategy["method"])
                }
              >
                <option value="standardize">
                  Standardization (mean=0, std=1)
                </option>
                <option value="normalize">Normalization (0 to 1)</option>
                <option value="minmax">Min-Max Scaling</option>
                <option value="robust">
                  Robust Scaling (outlier-resistant)
                </option>
              </Select>
            </div>
            <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded">
              Columns: {numericColumns.map((col) => col.name).join(", ")}
            </div>
          </div>
        )}

        {/* Categorical Encoding */}
        {categoricalColumns.length > 0 && (
          <div className="space-y-3">
            <div>
              <Label className="text-base font-semibold">
                Categorical Encoding
              </Label>
              <p className="text-sm text-slate-500 mt-1">
                Convert categorical variables to numeric
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="encoding-method">Method</Label>
              <Select
                id="encoding-method"
                value={encodingMethod}
                onChange={(e) =>
                  setEncodingMethod(
                    e.target.value as EncodingStrategy["method"]
                  )
                }
              >
                <option value="onehot">One-Hot Encoding</option>
                <option value="label">Label Encoding</option>
                <option value="ordinal">Ordinal Encoding</option>
                <option value="target">Target Encoding</option>
              </Select>
            </div>
            <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded">
              Columns: {categoricalColumns.map((col) => col.name).join(", ")}
            </div>
          </div>
        )}

        <Button onClick={handleApply} disabled={isLoading} className="w-full">
          {isLoading ? "Applying..." : "Apply Preprocessing"}
        </Button>
      </CardContent>
    </Card>
  );
}
