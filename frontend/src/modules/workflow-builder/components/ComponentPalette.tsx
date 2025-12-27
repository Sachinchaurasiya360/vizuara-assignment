import React, { useState } from "react";
import { Search, ChevronDown, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PALETTE_ITEMS, PALETTE_CATEGORIES } from "../config/paletteConfig";
import type { PaletteItem } from "../types/workflow.types";

interface ComponentPaletteProps {
  onDragStart: (item: PaletteItem) => void;
}

export function ComponentPalette({ onDragStart }: ComponentPaletteProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(["data", "preprocessing", "model", "evaluation"])
  );

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  const filteredItems = PALETTE_ITEMS.filter(
    (item) =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDragStart = (e: React.DragEvent, item: PaletteItem) => {
    e.dataTransfer.effectAllowed = "copy";
    e.dataTransfer.setData("application/reactflow", item.type);
    e.dataTransfer.setData("paletteItem", JSON.stringify(item));
    onDragStart(item);
  };

  return (
    <div className="h-full flex flex-col bg-white border-r border-slate-200">
      {/* Header */}
      <div className="p-4 border-b border-slate-200">
        <h2 className="text-lg font-bold text-slate-900 mb-3">Components</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-sm"
          />
        </div>
      </div>

      {/* Component List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {PALETTE_CATEGORIES.map((category) => {
          const categoryItems = filteredItems.filter(
            (item) => item.category === category.id
          );

          if (categoryItems.length === 0) return null;

          const isExpanded = expandedCategories.has(category.id);

          return (
            <div key={category.id}>
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full flex items-center gap-2 px-2 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg transition-colors mb-2"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                <span className="text-lg">{category.icon}</span>
                <span>{category.label}</span>
                <span className="ml-auto text-xs text-slate-500">
                  {categoryItems.length}
                </span>
              </button>

              {/* Category Items */}
              {isExpanded && (
                <div className="space-y-2">
                  {categoryItems.map((item) => (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item)}
                      className="group cursor-grab active:cursor-grabbing"
                    >
                      <Card className="p-3 hover:shadow-md hover:border-slate-300 transition-all duration-200 bg-white border-2 border-slate-200">
                        <div className="flex items-start gap-3">
                          <div
                            className="p-2 rounded-lg text-xl flex-shrink-0"
                            style={{
                              backgroundColor: `${item.color}15`,
                              border: `2px solid ${item.color}30`,
                            }}
                          >
                            {item.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm text-slate-900 mb-1 group-hover:text-slate-700">
                              {item.label}
                            </h3>
                            <p className="text-xs text-slate-500 leading-relaxed">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </Card>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {filteredItems.length === 0 && (
          <div className="text-center py-8">
            <p className="text-sm text-slate-500">No components found</p>
          </div>
        )}
      </div>

      {/* Footer Tip */}
      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <div className="flex items-start gap-2 text-xs text-slate-600">
          <span className="text-sm">💡</span>
          <p>
            Drag components onto the canvas to build your ML pipeline. Connect
            nodes by dragging from output to input handles.
          </p>
        </div>
      </div>
    </div>
  );
}
