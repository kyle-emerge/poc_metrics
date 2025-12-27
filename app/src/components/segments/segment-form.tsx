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
import { Checkbox } from "@/components/ui/checkbox";
import { RuleBuilder } from "./rule-builder";
import type { Segment, SegmentRule } from "@/types";

interface SegmentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (segment: Segment) => void;
  initialSegment?: Segment;
  mode?: "create" | "edit";
  availableMetrics: string[];
}

type SegmentType = "EXCLUSION" | "INCLUSION";
type EntityType = "LOAD" | "STOP" | "TENDER";

interface FormData {
  segment_name: string;
  segment_code: string;
  description: string;
  segment_type: SegmentType;
  applies_to: EntityType[];
  affected_metrics: string[];
  auto_apply: boolean;
  is_active: boolean;
}

const defaultRules: SegmentRule = {
  field: "",
  operator: "=",
  value: "",
};

export function SegmentForm({
  open,
  onOpenChange,
  onSave,
  initialSegment,
  mode = "create",
  availableMetrics,
}: SegmentFormProps) {
  const [formData, setFormData] = useState<FormData>({
    segment_name: initialSegment?.segment_name || "",
    segment_code: initialSegment?.segment_code || "",
    description: initialSegment?.description || "",
    segment_type: initialSegment?.segment_type || "EXCLUSION",
    applies_to: initialSegment?.applies_to || [],
    affected_metrics: initialSegment?.affected_metrics || [],
    auto_apply: initialSegment?.auto_apply || false,
    is_active: initialSegment?.is_active ?? true,
  });

  const [rules, setRules] = useState<SegmentRule>(
    initialSegment?.rules || defaultRules
  );

  const [activeTab, setActiveTab] = useState("basic");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Sync form data when initialSegment changes (for AI-generated segments)
  useEffect(() => {
    if (initialSegment) {
      setFormData({
        segment_name: initialSegment.segment_name || "",
        segment_code: initialSegment.segment_code || "",
        description: initialSegment.description || "",
        segment_type: initialSegment.segment_type || "EXCLUSION",
        applies_to: initialSegment.applies_to || [],
        affected_metrics: initialSegment.affected_metrics || [],
        auto_apply: initialSegment.auto_apply || false,
        is_active: initialSegment.is_active ?? true,
      });
      if (initialSegment.rules) {
        setRules(initialSegment.rules);
      }
    }
  }, [initialSegment]);

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
      segment_name: name,
      segment_code: prev.segment_code || generateCode(name),
    }));
  };

  const toggleEntity = (entity: EntityType) => {
    setFormData((prev) => ({
      ...prev,
      applies_to: prev.applies_to.includes(entity)
        ? prev.applies_to.filter((e) => e !== entity)
        : [...prev.applies_to, entity],
    }));
  };

  const toggleMetric = (metric: string) => {
    setFormData((prev) => ({
      ...prev,
      affected_metrics: prev.affected_metrics.includes(metric)
        ? prev.affected_metrics.filter((m) => m !== metric)
        : [...prev.affected_metrics, metric],
    }));
  };

  const selectAllMetrics = () => {
    setFormData((prev) => ({
      ...prev,
      affected_metrics: [...availableMetrics],
    }));
  };

  const clearAllMetrics = () => {
    setFormData((prev) => ({
      ...prev,
      affected_metrics: [],
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.segment_name.trim()) {
      newErrors.segment_name = "Segment name is required";
    }
    if (!formData.segment_code.trim()) {
      newErrors.segment_code = "Segment code is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (formData.applies_to.length === 0) {
      newErrors.applies_to = "Select at least one entity type";
    }
    if (formData.affected_metrics.length === 0) {
      newErrors.affected_metrics = "Select at least one metric";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      if (errors.segment_name || errors.segment_code || errors.description) {
        setActiveTab("basic");
      } else if (errors.applies_to || errors.affected_metrics) {
        setActiveTab("scope");
      }
      return;
    }

    const newSegment: Segment = {
      segment_id: initialSegment?.segment_id || `seg_${Date.now()}`,
      segment_code: formData.segment_code,
      segment_name: formData.segment_name,
      description: formData.description,
      segment_type: formData.segment_type,
      applies_to: formData.applies_to,
      affected_metrics: formData.affected_metrics,
      rules: rules,
      auto_apply: formData.auto_apply,
      is_active: formData.is_active,
      created_by: "current_user",
      created_at: new Date().toISOString(),
    };

    onSave(newSegment);
    onOpenChange(false);

    // Reset form
    setFormData({
      segment_name: "",
      segment_code: "",
      description: "",
      segment_type: "EXCLUSION",
      applies_to: [],
      affected_metrics: [],
      auto_apply: false,
      is_active: true,
    });
    setRules(defaultRules);
    setActiveTab("basic");
  };

  const entityTypes: { value: EntityType; label: string; description: string }[] = [
    { value: "LOAD", label: "Load", description: "Apply to entire load records" },
    { value: "STOP", label: "Stop", description: "Apply to individual stops (pickups/deliveries)" },
    { value: "TENDER", label: "Tender", description: "Apply to tender records" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[95vw] w-full h-[95vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>
            {mode === "create" ? "Create New Segment" : "Edit Segment"}
          </DialogTitle>
          <DialogDescription>
            Define rules to include or exclude records from metric calculations
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4 flex-1 flex flex-col min-h-0">
          <TabsList className="grid w-full grid-cols-3 flex-shrink-0">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="scope">Scope & Metrics</TabsTrigger>
            <TabsTrigger value="rules">Rule Builder</TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 mt-4 pr-4">
            <TabsContent value="basic" className="space-y-4 mt-0">
              <div className="space-y-2">
                <Label htmlFor="segment_name">
                  Segment Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="segment_name"
                  placeholder="e.g., Exclude Shipper Fault"
                  value={formData.segment_name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className={errors.segment_name ? "border-red-500" : ""}
                />
                {errors.segment_name && (
                  <p className="text-sm text-red-500">{errors.segment_name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="segment_code">
                  Segment Code <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="segment_code"
                  placeholder="e.g., NO_SHIPPER_FAULT"
                  value={formData.segment_code}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      segment_code: e.target.value.toUpperCase(),
                    }))
                  }
                  className={`font-mono ${errors.segment_code ? "border-red-500" : ""}`}
                />
                {errors.segment_code && (
                  <p className="text-sm text-red-500">{errors.segment_code}</p>
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
                  placeholder="Describe what this segment does and when it should be applied..."
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
                <Label htmlFor="segment_type">Segment Type</Label>
                <Select
                  value={formData.segment_type}
                  onValueChange={(value: SegmentType) =>
                    setFormData((prev) => ({ ...prev, segment_type: value }))
                  }
                >
                  <SelectTrigger id="segment_type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EXCLUSION">
                      <div className="flex items-center gap-2">
                        <Badge variant="destructive" className="text-xs">EXCLUSION</Badge>
                        <span>Exclude matching records</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="INCLUSION">
                      <div className="flex items-center gap-2">
                        <Badge variant="default" className="text-xs">INCLUSION</Badge>
                        <span>Include only matching records</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {formData.segment_type === "EXCLUSION"
                    ? "Records matching the rules will be excluded from metric calculations"
                    : "Only records matching the rules will be included in metric calculations"}
                </p>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <Label>Auto Apply</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically apply this segment to all matching calculations
                  </p>
                </div>
                <Switch
                  checked={formData.auto_apply}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, auto_apply: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <Label>Active</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable or disable this segment
                  </p>
                </div>
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, is_active: checked }))
                  }
                />
              </div>
            </TabsContent>

            <TabsContent value="scope" className="space-y-6 mt-0">
              <div className="space-y-4">
                <div>
                  <Label>
                    Applies To <span className="text-red-500">*</span>
                  </Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Select which entity types this segment applies to
                  </p>
                </div>
                <div className="grid gap-3">
                  {entityTypes.map((entity) => (
                    <div
                      key={entity.value}
                      className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                        formData.applies_to.includes(entity.value)
                          ? "border-primary bg-primary/5"
                          : "hover:bg-muted"
                      }`}
                      onClick={() => toggleEntity(entity.value)}
                    >
                      <Checkbox
                        checked={formData.applies_to.includes(entity.value)}
                        onCheckedChange={() => toggleEntity(entity.value)}
                      />
                      <div className="flex-1">
                        <Label className="font-medium cursor-pointer">
                          {entity.label}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {entity.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {errors.applies_to && (
                  <p className="text-sm text-red-500">{errors.applies_to}</p>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>
                      Affected Metrics <span className="text-red-500">*</span>
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Select which metrics this segment affects
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={selectAllMetrics}>
                      Select All
                    </Button>
                    <Button variant="outline" size="sm" onClick={clearAllMetrics}>
                      Clear All
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {availableMetrics.map((metric) => (
                    <div
                      key={metric}
                      className={`flex items-center space-x-2 p-2 border rounded cursor-pointer transition-colors ${
                        formData.affected_metrics.includes(metric)
                          ? "border-primary bg-primary/5"
                          : "hover:bg-muted"
                      }`}
                      onClick={() => toggleMetric(metric)}
                    >
                      <Checkbox
                        checked={formData.affected_metrics.includes(metric)}
                        onCheckedChange={() => toggleMetric(metric)}
                      />
                      <Label className="text-xs font-mono cursor-pointer">
                        {metric}
                      </Label>
                    </div>
                  ))}
                </div>
                {errors.affected_metrics && (
                  <p className="text-sm text-red-500">{errors.affected_metrics}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Selected: {formData.affected_metrics.length} metric(s)
                </p>
              </div>
            </TabsContent>

            <TabsContent value="rules" className="space-y-4 mt-0">
              <RuleBuilder
                rules={rules}
                onChange={setRules}
                appliesTo={formData.applies_to}
              />
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <DialogFooter className="mt-4 flex-shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {mode === "create" ? "Create Segment" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
