import React, { useState, useCallback } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert } from '@/components/ui/alert';
import { uploadFile } from '@/api/pipeline.api';
import { usePipelineStore } from '@/store/usePipelineStore';
import type { FileUploadResponse } from '@/types/pipeline.types';

export function FileUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { setUploadedFile, setLoading, setCurrentStep } = usePipelineStore();

  const handleFileUpload = useCallback(async (file: File) => {
    // Validate file type
    const validTypes = ['.csv', '.xlsx', '.xls', '.json'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!validTypes.includes(fileExtension)) {
      setError('Please upload a valid file (CSV, Excel, or JSON)');
      return;
    }

    // Validate file size (max 100MB)
    if (file.size > 100 * 1024 * 1024) {
      setError('File size must be less than 100MB');
      return;
    }

    setError(null);
    setIsUploading(true);
    setLoading(true);

    try {
      const response: FileUploadResponse = await uploadFile(file, (progress) => {
        setUploadProgress(progress);
      });

      setUploadedFile(response);
      setCurrentStep('preprocess');
      setUploadProgress(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload file');
    } finally {
      setIsUploading(false);
      setLoading(false);
    }
  }, [setUploadedFile, setLoading, setCurrentStep]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  }, [handleFileUpload]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Dataset</CardTitle>
        <CardDescription>
          Upload your dataset to begin the machine learning pipeline
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
            isDragging
              ? 'border-slate-900 bg-slate-50'
              : 'border-slate-200 hover:border-slate-300'
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
              <Upload className="h-12 w-12 text-slate-400" />
              <div>
                <p className="text-lg font-medium">Drop your file here or</p>
                <label htmlFor="file-upload">
                  <Button variant="link" className="mt-2" asChild>
                    <span className="cursor-pointer">Browse files</span>
                  </Button>
                </label>
              </div>
              <p className="text-sm text-slate-500">
                Supported formats: CSV, Excel, JSON (max 100MB)
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <FileText className="h-12 w-12 text-slate-400 animate-pulse" />
              <div className="w-full max-w-xs">
                <Progress value={uploadProgress} />
                <p className="text-sm text-slate-600 mt-2">
                  Uploading... {uploadProgress}%
                </p>
              </div>
            </div>
          )}
        </div>

        {error && (
          <Alert variant="destructive" className="mt-4">
            {error}
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
