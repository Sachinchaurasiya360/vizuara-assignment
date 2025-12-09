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
    shadow: "shadow-sm",
  },
  processing: {
    border: "border-blue-400",
    bg: "bg-gradient-to-br from-blue-50 to-white",
    icon: Loader2,
    iconColor: "text-blue-600 animate-spin",
    shadow: "shadow-lg shadow-blue-100",
  },
  completed: {
    border: "border-green-400",
    bg: "bg-gradient-to-br from-green-50 to-white",
    icon: CheckCircle2,
    iconColor: "text-green-600",
    shadow: "shadow-lg shadow-green-100",
  },
  error: {
    border: "border-red-400",
    bg: "bg-gradient-to-br from-red-50 to-white",
    icon: AlertCircle,
    iconColor: "text-red-600",
    shadow: "shadow-lg shadow-red-100",
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
        className={`
          relative px-6 py-4 rounded-xl border-2 min-w-[200px] 
          transition-all duration-300 hover:scale-105
          ${statusStyle.border} ${statusStyle.bg} ${statusStyle.shadow}
          ${data.status === "processing" ? "animate-pulse" : ""}
        `}
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
          <div
            className={`
            p-2.5 rounded-xl border transition-all duration-300
            ${
              data.status === "completed"
                ? "bg-green-500 border-green-400"
                : data.status === "processing"
                ? "bg-blue-500 border-blue-400"
                : data.status === "error"
                ? "bg-red-500 border-red-400"
                : "bg-white border-slate-200"
            }
          `}
          >
            <Icon
              className={`h-5 w-5 ${
                data.status === "completed" ||
                data.status === "processing" ||
                data.status === "error"
                  ? "text-white"
                  : "text-slate-700"
              }`}
            />
          </div>
          <div className="flex-1">
            <div className="font-bold text-sm text-slate-900">{data.label}</div>
            {data.description && (
              <div className="text-xs text-slate-500 mt-0.5">
                {data.description}
              </div>
            )}
          </div>
          <StatusIcon
            className={`h-5 w-5 flex-shrink-0 ${statusStyle.iconColor}`}
          />
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
