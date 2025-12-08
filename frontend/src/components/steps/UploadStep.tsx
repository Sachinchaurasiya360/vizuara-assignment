import React from "react";
import { FileUpload } from "@/components/pipeline/FileUpload";
import { DataPreviewTable } from "@/components/pipeline/DataPreviewTable";
import { usePipelineStore } from "@/store/usePipelineStore";

export function UploadStep() {
  const { uploadedFile } = usePipelineStore();

  return (
    <div className="space-y-6">
      {!uploadedFile ? (
        <FileUpload />
      ) : (
        <>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-semibold text-green-900">
              File Uploaded Successfully
            </h3>
            <p className="text-green-700">
              {uploadedFile.fileName} - {uploadedFile.rowCount} rows,{" "}
              {uploadedFile.columnCount} columns
            </p>
          </div>

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
