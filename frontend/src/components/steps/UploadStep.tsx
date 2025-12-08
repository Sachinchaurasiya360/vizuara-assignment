import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Loader } from '@/components/ui/loader';
import { FileUpload } from '@/components/pipeline/FileUpload';
import { DataPreviewTable } from '@/components/pipeline/DataPreviewTable';
import { usePipelineStore } from '@/store/usePipelineStore';

export function UploadStep() {
  const { uploadedFile } = usePipelineStore();

  return (
    <div className="space-y-6">
      {!uploadedFile ? (
        <FileUpload />
      ) : (
        <>
          <Alert variant="success" title="File Uploaded Successfully">
            {uploadedFile.fileName} - {uploadedFile.rowCount} rows, {uploadedFile.columnCount} columns
          </Alert>
          
          <DataPreviewTable
            preview={uploadedFile.preview}
            columns={uploadedFile.columns}
            title="Dataset Preview"
          />
        </>
      )}
    </div>
  );
}
