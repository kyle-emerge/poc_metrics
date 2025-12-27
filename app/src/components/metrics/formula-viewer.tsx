"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { MetricDefinition } from "@/types";

interface FormulaViewerProps {
  metric: MetricDefinition | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FormulaViewer({ metric, open, onOpenChange }: FormulaViewerProps) {
  if (!metric) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[95vw] w-full h-[95vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>{metric.metric_name}</DialogTitle>
          <DialogDescription className="font-mono text-xs">
            {metric.metric_code}
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-auto space-y-6 pr-2">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Description</h4>
                <p className="text-sm text-muted-foreground">{metric.description}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Category</h4>
                <Badge>{metric.category}</Badge>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Properties</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center justify-between p-3 bg-muted rounded">
                    <span className="text-sm text-muted-foreground">Return Type</span>
                    <Badge variant="outline">{metric.return_type}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded">
                    <span className="text-sm text-muted-foreground">Unit</span>
                    <Badge variant="outline">{metric.unit}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded">
                    <span className="text-sm text-muted-foreground">Precision</span>
                    <Badge variant="outline">{metric.precision} decimals</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded">
                    <span className="text-sm text-muted-foreground">Baseline</span>
                    <Badge variant={metric.is_baseline ? "default" : "outline"}>
                      {metric.is_baseline ? "Yes" : "No"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Preview</h4>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">
                      {metric.return_type === "CURRENCY" && "$"}
                      {(92.54321).toFixed(metric.precision)}
                    </span>
                    <span className="text-muted-foreground">{metric.unit}</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Formula Definition (JSON)</h4>
              <div className="bg-muted rounded-lg p-4 overflow-auto max-h-[60vh]">
                <pre className="text-xs font-mono whitespace-pre-wrap">
                  {JSON.stringify(metric.formula, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
