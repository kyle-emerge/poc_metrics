"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Copy, Trash2, Code } from "lucide-react";
import type { MetricDefinition } from "@/types";

interface MetricCardProps {
  metric: MetricDefinition;
  onEdit?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  onViewFormula?: () => void;
}

const categoryColors: Record<string, string> = {
  PERFORMANCE: "bg-blue-100 text-blue-800",
  COST: "bg-green-100 text-green-800",
  TENDER: "bg-purple-100 text-purple-800",
  DWELL: "bg-orange-100 text-orange-800",
  SERVICE: "bg-pink-100 text-pink-800",
};

const returnTypeLabels: Record<string, string> = {
  PERCENTAGE: "Percentage",
  CURRENCY: "Currency",
  DECIMAL: "Decimal",
  INTEGER: "Integer",
  DURATION: "Duration",
};

export function MetricCard({
  metric,
  onEdit,
  onDuplicate,
  onDelete,
  onViewFormula,
}: MetricCardProps) {
  return (
    <Card className="group relative">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{metric.metric_name}</CardTitle>
            <CardDescription className="text-xs font-mono text-muted-foreground">
              {metric.metric_code}
            </CardDescription>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onViewFormula}>
              <Code className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onEdit}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onDuplicate}>
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{metric.description}</p>

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className={categoryColors[metric.category] || ""}>
            {metric.category}
          </Badge>
          <Badge variant="outline">
            {returnTypeLabels[metric.return_type] || metric.return_type}
          </Badge>
          {metric.is_baseline && (
            <Badge variant="default">Baseline</Badge>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Unit:</span>
            <span className="ml-2 font-medium">{metric.unit}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Precision:</span>
            <span className="ml-2 font-medium">{metric.precision} decimals</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
