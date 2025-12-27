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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{metric.metric_name}</DialogTitle>
          <DialogDescription className="font-mono text-xs">
            {metric.metric_code}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Description</h4>
            <p className="text-sm text-muted-foreground">{metric.description}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Formula Definition</h4>
            <div className="bg-muted rounded-lg p-4 overflow-x-auto">
              <pre className="text-xs font-mono">
                {JSON.stringify(metric.formula, null, 2)}
              </pre>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Properties</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-2 bg-muted rounded">
                <span className="text-sm text-muted-foreground">Return Type</span>
                <Badge variant="outline">{metric.return_type}</Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-muted rounded">
                <span className="text-sm text-muted-foreground">Unit</span>
                <Badge variant="outline">{metric.unit}</Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-muted rounded">
                <span className="text-sm text-muted-foreground">Precision</span>
                <Badge variant="outline">{metric.precision} decimals</Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-muted rounded">
                <span className="text-sm text-muted-foreground">Category</span>
                <Badge variant="outline">{metric.category}</Badge>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
