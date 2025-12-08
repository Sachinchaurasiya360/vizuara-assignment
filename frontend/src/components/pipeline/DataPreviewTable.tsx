import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { DataPreview, ColumnInfo } from '@/types/pipeline.types';

interface DataPreviewTableProps {
  preview: DataPreview;
  columns: ColumnInfo[];
  title?: string;
  description?: string;
}

export function DataPreviewTable({ preview, columns, title, description }: DataPreviewTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title || 'Data Preview'}</CardTitle>
        <CardDescription>
          {description || `Showing ${preview.rows.length} of ${preview.totalRows} rows`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {preview.headers.map((header) => {
                  const columnInfo = columns.find((col) => col.name === header);
                  return (
                    <TableHead key={header}>
                      <div className="flex flex-col">
                        <span className="font-medium">{header}</span>
                        {columnInfo && (
                          <span className="text-xs text-slate-500 font-normal">
                            {columnInfo.type}
                            {columnInfo.missingCount > 0 && 
                              ` • ${columnInfo.missingCount} missing`
                            }
                          </span>
                        )}
                      </div>
                    </TableHead>
                  );
                })}
              </TableRow>
            </TableHeader>
            <TableBody>
              {preview.rows.map((row, idx) => (
                <TableRow key={idx}>
                  {preview.headers.map((header) => (
                    <TableCell key={header}>
                      {row[header] !== null && row[header] !== undefined
                        ? String(row[header])
                        : <span className="text-slate-400 italic">null</span>
                      }
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Column Statistics */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {columns.map((column) => (
            <div key={column.name} className="p-4 border rounded-lg">
              <h4 className="font-medium text-sm mb-2">{column.name}</h4>
              <div className="space-y-1 text-xs text-slate-600">
                <p>Type: <span className="font-medium">{column.type}</span></p>
                <p>Unique: <span className="font-medium">{column.uniqueCount}</span></p>
                {column.missingCount > 0 && (
                  <p>Missing: <span className="font-medium text-red-600">{column.missingCount}</span></p>
                )}
                {column.stats && (
                  <div className="mt-2 pt-2 border-t">
                    {column.stats.mean && <p>Mean: {column.stats.mean.toFixed(2)}</p>}
                    {column.stats.min && <p>Min: {column.stats.min.toFixed(2)}</p>}
                    {column.stats.max && <p>Max: {column.stats.max.toFixed(2)}</p>}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
