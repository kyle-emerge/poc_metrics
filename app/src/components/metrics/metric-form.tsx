"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FormulaBuilder } from "./formula-builder";
import type { MetricDefinition, MetricFormula } from "@/types";

interface MetricFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (metric: MetricDefinition) => void;
  initialMetric?: MetricDefinition;
  mode?: "create" | "edit";
}

type CategoryType = "PERFORMANCE" | "COST" | "TENDER" | "DWELL" | "SERVICE";
type ReturnType = "PERCENTAGE" | "CURRENCY" | "DECIMAL" | "INTEGER" | "DURATION";

interface FormData {
  metric_name: string;
  metric_code: string;
  description: string;
  return_type: ReturnType;
  unit: string;
  precision: number;
  category: CategoryType;
  is_baseline: boolean;
}

const defaultFormula: MetricFormula = {
  type: "percentage",
  numerator: {
    type: "count",
    filter: { field: "", operator: "=", value: "" },
  },
  denominator: {
    type: "count",
    filter: { field: "", operator: "=", value: "" },
  },
};

export function MetricForm({
  open,
  onOpenChange,
  onSave,
  initialMetric,
  mode = "create",
}: MetricFormProps) {
  const [formData, setFormData] = useState<FormData>({
    metric_name: initialMetric?.metric_name || "",
    metric_code: initialMetric?.metric_code || "",
    description: initialMetric?.description || "",
    return_type: initialMetric?.return_type || "PERCENTAGE",
    unit: initialMetric?.unit || "%",
    precision: initialMetric?.precision || 1,
    category: initialMetric?.category || "PERFORMANCE",
    is_baseline: initialMetric?.is_baseline || false,
  });

  const [formula, setFormula] = useState<MetricFormula>(
    initialMetric?.formula || defaultFormula
  );

  const [activeTab, setActiveTab] = useState("basic");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Sync form data when initialMetric changes (for AI-generated metrics)
  useEffect(() => {
    if (initialMetric) {
      setFormData({
        metric_name: initialMetric.metric_name || "",
        metric_code: initialMetric.metric_code || "",
        description: initialMetric.description || "",
        return_type: initialMetric.return_type || "PERCENTAGE",
        unit: initialMetric.unit || "%",
        precision: initialMetric.precision || 1,
        category: initialMetric.category || "PERFORMANCE",
        is_baseline: initialMetric.is_baseline || false,
      });
      if (initialMetric.formula) {
        setFormula(initialMetric.formula);
      }
    }
  }, [initialMetric]);

  const generateCode = (name: string) => {
    return name
      .toUpperCase()
      .replace(/[^A-Z0-9\s]/g, "")
      .replace(/\s+/g, "_")
      .substring(0, 30);
  };

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      metric_name: name,
      metric_code: prev.metric_code || generateCode(name),
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.metric_name.trim()) {
      newErrors.metric_name = "Metric name is required";
    }
    if (!formData.metric_code.trim()) {
      newErrors.metric_code = "Metric code is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      setActiveTab("basic");
      return;
    }

    const newMetric: MetricDefinition = {
      metric_id: initialMetric?.metric_id || `metric_${Date.now()}`,
      metric_code: formData.metric_code,
      metric_name: formData.metric_name,
      description: formData.description,
      formula: formula,
      return_type: formData.return_type as MetricDefinition["return_type"],
      unit: formData.unit,
      precision: formData.precision,
      is_baseline: formData.is_baseline,
      category: formData.category as MetricDefinition["category"],
      is_active: true,
      created_by: "current_user",
      created_at: new Date().toISOString(),
    };

    onSave(newMetric);
    onOpenChange(false);

    // Reset form
    setFormData({
      metric_name: "",
      metric_code: "",
      description: "",
      return_type: "PERCENTAGE",
      unit: "%",
      precision: 1,
      category: "PERFORMANCE",
      is_baseline: false,
    });
    setFormula(defaultFormula);
    setActiveTab("basic");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[95vw] w-full h-[95vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>
            {mode === "create" ? "Create New Metric" : "Edit Metric"}
          </DialogTitle>
          <DialogDescription>
            Define a custom metric with formula and properties
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4 flex-1 flex flex-col min-h-0">
          <TabsList className="grid w-full grid-cols-3 flex-shrink-0">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="formula">Formula Builder</TabsTrigger>
            <TabsTrigger value="properties">Properties</TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 mt-4 pr-4">
            <TabsContent value="basic" className="space-y-4 mt-0">
              <div className="space-y-2">
                <Label htmlFor="metric_name">
                  Metric Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="metric_name"
                  placeholder="e.g., On-Time Pickup - Custom Grace"
                  value={formData.metric_name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className={errors.metric_name ? "border-red-500" : ""}
                />
                {errors.metric_name && (
                  <p className="text-sm text-red-500">{errors.metric_name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="metric_code">
                  Metric Code <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="metric_code"
                  placeholder="e.g., OTP_CUSTOM_GRACE"
                  value={formData.metric_code}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      metric_code: e.target.value.toUpperCase(),
                    }))
                  }
                  className={`font-mono ${errors.metric_code ? "border-red-500" : ""}`}
                />
                {errors.metric_code && (
                  <p className="text-sm text-red-500">{errors.metric_code}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Unique identifier for API access
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe what this metric measures and how it should be interpreted..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={3}
                  className={errors.description ? "border-red-500" : ""}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value: CategoryType) =>
                    setFormData((prev) => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PERFORMANCE">Performance</SelectItem>
                    <SelectItem value="COST">Cost</SelectItem>
                    <SelectItem value="TENDER">Tender</SelectItem>
                    <SelectItem value="DWELL">Dwell</SelectItem>
                    <SelectItem value="SERVICE">Service</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <Label>Mark as Baseline Metric</Label>
                  <p className="text-sm text-muted-foreground">
                    Baseline metrics are standard KPIs available to all users
                  </p>
                </div>
                <Switch
                  checked={formData.is_baseline}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, is_baseline: checked }))
                  }
                />
              </div>
            </TabsContent>

            <TabsContent value="formula" className="space-y-4 mt-0">
              <FormulaBuilder formula={formula} onChange={setFormula} />
            </TabsContent>

            <TabsContent value="properties" className="space-y-4 mt-0">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="return_type">Return Type</Label>
                  <Select
                    value={formData.return_type}
                    onValueChange={(value: ReturnType) =>
                      setFormData((prev) => ({ ...prev, return_type: value }))
                    }
                  >
                    <SelectTrigger id="return_type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                      <SelectItem value="CURRENCY">Currency</SelectItem>
                      <SelectItem value="DECIMAL">Decimal</SelectItem>
                      <SelectItem value="INTEGER">Integer</SelectItem>
                      <SelectItem value="DURATION">Duration</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Input
                    id="unit"
                    placeholder="e.g., %, USD, HOURS"
                    value={formData.unit}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, unit: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="precision">Decimal Precision</Label>
                <Select
                  value={formData.precision.toString()}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      precision: parseInt(value),
                    }))
                  }
                >
                  <SelectTrigger id="precision" className="w-[180px]">
                    <SelectValue placeholder="Select precision" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0 decimals (e.g., 92)</SelectItem>
                    <SelectItem value="1">1 decimal (e.g., 92.5)</SelectItem>
                    <SelectItem value="2">2 decimals (e.g., 92.54)</SelectItem>
                    <SelectItem value="3">3 decimals (e.g., 92.543)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-4 bg-muted rounded-lg space-y-2">
                <Label>Preview</Label>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">
                    {formData.return_type === "CURRENCY" && "$"}
                    {(92.54321).toFixed(formData.precision)}
                  </span>
                  <span className="text-muted-foreground">{formData.unit}</span>
                </div>
              </div>

              <div className="p-4 border rounded-lg space-y-3">
                <Label>Formula Summary</Label>
                <div className="bg-muted rounded-lg p-3 overflow-x-auto">
                  <pre className="text-xs font-mono">
                    {JSON.stringify(formula, null, 2)}
                  </pre>
                </div>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <DialogFooter className="mt-4 flex-shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {mode === "create" ? "Create Metric" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
