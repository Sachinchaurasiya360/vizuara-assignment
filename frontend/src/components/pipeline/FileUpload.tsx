import React, { useState, useCallback } from "react";
import { Upload, FileText } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert } from "@/components/ui/alert";
import { uploadFile } from "@/api/pipeline.api";
import { usePipelineStore } from "@/store/usePipelineStore";
import type { FileUploadResponse } from "@/types/pipeline.types";

export function FileUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { setUploadedFile, setLoading, setCurrentStep } = usePipelineStore();

  const handleFileUpload = useCallback(
    async (file: File) => {
      // Validate file type
      const validTypes = [".csv", ".xlsx", ".xls", ".json"];
      const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();

      if (!validTypes.includes(fileExtension)) {
        setError("Please upload a valid file (CSV, Excel, or JSON)");
        return;
      }

      // Validate file size (max 100MB)
      if (file.size > 100 * 1024 * 1024) {
        setError("File size must be less than 100MB");
        return;
      }

      setError(null);
      setIsUploading(true);
      setLoading(true);

      try {
        const response: FileUploadResponse = await uploadFile(
          file,
          (progress) => {
            setUploadProgress(progress);
          }
        );

        setUploadedFile(response);
        setCurrentStep("preprocess");
        setUploadProgress(0);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to upload file");
      } finally {
        setIsUploading(false);
        setLoading(false);
      }
    },
    [setUploadedFile, setLoading, setCurrentStep]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFileUpload(file);
      }
    },
    [handleFileUpload]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFileUpload(file);
      }
    },
    [handleFileUpload]
  );

  return (
    <Card className="shadow-lg border-slate-200">
      <CardHeader className="border-b bg-slate-50">
        <CardTitle className="text-2xl">Upload Dataset</CardTitle>
        <CardDescription className="text-base">
          Upload your dataset to begin the machine learning pipeline
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-8">
        <div
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
            isDragging
              ? "border-black bg-slate-100 scale-[1.02] shadow-lg"
              : "border-slate-300 hover:border-slate-500 hover:bg-slate-50"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileSelect}
            accept=".csv,.xlsx,.xls,.json"
            disabled={isUploading}
          />

          {!isUploading ? (
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-black rounded-full shadow-lg">
                <Upload className="h-10 w-10 text-white" />
              </div>
              <div>
                <p className="text-xl font-semibold text-slate-900">
                  Drop your file here or
                </p>
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer inline-block mt-2"
                >
                  <span className="text-lg font-medium text-black hover:text-slate-700 underline underline-offset-4 transition-colors">
                    Browse files
                  </span>
                </label>
              </div>
              <p className="text-sm text-slate-600 bg-slate-100 px-4 py-2 rounded-full">
                Supported formats: CSV, Excel, JSON (max 100MB)
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-slate-200 rounded-full">
                <FileText className="h-10 w-10 text-slate-900 animate-pulse" />
              </div>
              <div className="w-full max-w-md">
                <Progress value={uploadProgress} className="h-3" />
                <p className="text-base font-medium text-slate-700 mt-3">
                  Uploading... {uploadProgress}%
                </p>
              </div>
            </div>
          )}
        </div>

        {error && (
          <Alert
            variant="destructive"
            className="mt-6 animate-in slide-in-from-top-2"
          >
            {error}
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
