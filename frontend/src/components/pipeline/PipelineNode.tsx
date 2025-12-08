import React, { memo } from "react";
import { Handle, Position } from "reactflow";
import {
  Upload,
  Settings,
  Split,
  Brain,
  BarChart3,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
} from "lucide-react";
import type { PipelineNodeData } from "@/types/pipeline.types";

const ICONS = {
  upload: Upload,
  preprocess: Settings,
  split: Split,
  model: Brain,
  results: BarChart3,
};

const STATUS_STYLES = {
  pending: {
    border: "border-slate-200",
    bg: "bg-white",
    icon: Clock,
    iconColor: "text-slate-400",
  },
  processing: {
    border: "border-blue-500",
    bg: "bg-blue-50",
    icon: Loader2,
    iconColor: "text-blue-600 animate-spin",
  },
  completed: {
    border: "border-green-500",
    bg: "bg-green-50",
    icon: CheckCircle2,
    iconColor: "text-green-600",
  },
  error: {
    border: "border-red-500",
    bg: "bg-red-50",
    icon: AlertCircle,
    iconColor: "text-red-600",
  },
};

interface PipelineNodeProps {
  data: PipelineNodeData;
  isConnectable: boolean;
}

export const PipelineNode = memo(
  ({ data, isConnectable }: PipelineNodeProps) => {
    const Icon = ICONS[data.type];
    const statusStyle = STATUS_STYLES[data.status];
    const StatusIcon = statusStyle.icon;

    return (
      <div
        className={`relative px-6 py-4 rounded-lg border-2 shadow-sm min-w-[200px] ${statusStyle.border} ${statusStyle.bg}`}
      >
        {/* Input Handle */}
        {data.type !== "upload" && (
          <Handle
            type="target"
            position={Position.Left}
            isConnectable={isConnectable}
            className="!bg-slate-400 !w-3 !h-3 !border-2 !border-white"
          />
        )}

        {/* Node Content */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-white border">
            <Icon className="h-5 w-5 text-slate-700" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-sm">{data.label}</div>
            {data.description && (
              <div className="text-xs text-slate-500 mt-0.5">
                {data.description}
              </div>
            )}
          </div>
          <StatusIcon className={`h-5 w-5 ${statusStyle.iconColor}`} />
        </div>

        {/* Output Handle */}
        {data.type !== "results" && (
          <Handle
            type="source"
            position={Position.Right}
            isConnectable={isConnectable}
            className="!bg-slate-400 !w-3 !h-3 !border-2 !border-white"
          />
        )}
      </div>
    );
  }
);

PipelineNode.displayName = "PipelineNode";
