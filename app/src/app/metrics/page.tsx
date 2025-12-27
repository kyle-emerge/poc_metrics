"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Filter, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MetricCard } from "@/components/metrics/metric-card";
import { FormulaViewer } from "@/components/metrics/formula-viewer";
import { MetricForm } from "@/components/metrics/metric-form";
import { AIMetricAssistant } from "@/components/ai-assistant/ai-metric-assistant";
import { metricDefinitions as baselineMetricDefinitions } from "@/data";
import type { MetricDefinition } from "@/types";

// Local storage key for custom metrics
const CUSTOM_METRICS_KEY = "poc_metrics_custom";

export default function MetricsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedMetric, setSelectedMetric] = useState<MetricDefinition | null>(null);
  const [formulaViewerOpen, setFormulaViewerOpen] = useState(false);
  const [metricFormOpen, setMetricFormOpen] = useState(false);
  const [editingMetric, setEditingMetric] = useState<MetricDefinition | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [metricToDelete, setMetricToDelete] = useState<MetricDefinition | null>(null);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);

  // Custom metrics state (persisted to localStorage)
  const [customMetrics, setCustomMetrics] = useState<MetricDefinition[]>([]);

  // Load custom metrics from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(CUSTOM_METRICS_KEY);
    if (stored) {
      try {
        setCustomMetrics(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse stored metrics:", e);
      }
    }
  }, []);

  // Save custom metrics to localStorage when they change
  useEffect(() => {
    localStorage.setItem(CUSTOM_METRICS_KEY, JSON.stringify(customMetrics));
  }, [customMetrics]);

  // Combine baseline and custom metrics
  const allMetrics = [...baselineMetricDefinitions, ...customMetrics];

  const filteredMetrics = allMetrics.filter((metric) => {
    const matchesSearch =
      metric.metric_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      metric.metric_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      metric.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || metric.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const baselineMetrics = filteredMetrics.filter((m) => m.is_baseline);
  const customMetricsFiltered = filteredMetrics.filter((m) => !m.is_baseline);

  const handleViewFormula = (metric: MetricDefinition) => {
    setSelectedMetric(metric);
    setFormulaViewerOpen(true);
  };

  const handleCreateMetric = () => {
    setEditingMetric(null);
    setMetricFormOpen(true);
  };

  const handleEditMetric = (metric: MetricDefinition) => {
    setEditingMetric(metric);
    setMetricFormOpen(true);
  };

  const handleDuplicateMetric = (metric: MetricDefinition) => {
    const duplicated: MetricDefinition = {
      ...metric,
      metric_id: `metric_${Date.now()}`,
      metric_code: `${metric.metric_code}_COPY`,
      metric_name: `${metric.metric_name} (Copy)`,
      is_baseline: false,
      created_at: new Date().toISOString(),
    };
    setCustomMetrics((prev) => [...prev, duplicated]);
  };

  const handleDeleteMetric = (metric: MetricDefinition) => {
    setMetricToDelete(metric);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (metricToDelete) {
      setCustomMetrics((prev) =>
        prev.filter((m) => m.metric_id !== metricToDelete.metric_id)
      );
      setMetricToDelete(null);
    }
    setDeleteConfirmOpen(false);
  };

  const handleSaveMetric = (metric: MetricDefinition) => {
    if (editingMetric) {
      // Update existing metric
      setCustomMetrics((prev) =>
        prev.map((m) => (m.metric_id === metric.metric_id ? metric : m))
      );
    } else {
      // Add new metric
      setCustomMetrics((prev) => [...prev, metric]);
    }
    setEditingMetric(null);
  };

  const handleAIGenerate = (metric: Partial<MetricDefinition>) => {
    // Create a partial metric definition and open the form with it pre-filled
    const prefilledMetric: MetricDefinition = {
      metric_id: `metric_${Date.now()}`,
      metric_code: metric.metric_code || "",
      metric_name: metric.metric_name || "",
      description: metric.description || "",
      formula: metric.formula || { type: "percentage" },
      return_type: metric.return_type || "PERCENTAGE",
      unit: metric.unit || "%",
      precision: metric.precision || 1,
      is_baseline: false,
      category: metric.category || "PERFORMANCE",
      is_active: true,
      created_by: "current_user",
      created_at: new Date().toISOString(),
    };
    setEditingMetric(prefilledMetric);
    setMetricFormOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Metrics</h1>
          <p className="text-muted-foreground">
            Manage and create custom metric definitions for your logistics operations
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setAiAssistantOpen(true)}>
            <Sparkles className="h-4 w-4 mr-2" />
            AI Builder
          </Button>
          <Button onClick={handleCreateMetric}>
            <Plus className="h-4 w-4 mr-2" />
            Create Metric
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search metrics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="PERFORMANCE">Performance</SelectItem>
            <SelectItem value="COST">Cost</SelectItem>
            <SelectItem value="TENDER">Tender</SelectItem>
            <SelectItem value="DWELL">Dwell</SelectItem>
            <SelectItem value="SERVICE">Service</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="baseline" className="space-y-4">
        <TabsList>
          <TabsTrigger value="baseline">
            Baseline Metrics ({baselineMetrics.length})
          </TabsTrigger>
          <TabsTrigger value="custom">
            Custom Metrics ({customMetricsFiltered.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="baseline" className="space-y-4">
          {baselineMetrics.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No baseline metrics found matching your search.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {baselineMetrics.map((metric) => (
                <MetricCard
                  key={metric.metric_id}
                  metric={metric}
                  onViewFormula={() => handleViewFormula(metric)}
                  onEdit={() => handleDuplicateMetric(metric)}
                  onDuplicate={() => handleDuplicateMetric(metric)}
                  onDelete={() => {}} // Can't delete baseline metrics
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="custom" className="space-y-4">
          {customMetricsFiltered.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                No custom metrics created yet.
              </p>
              <Button variant="outline" onClick={handleCreateMetric}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Custom Metric
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {customMetricsFiltered.map((metric) => (
                <MetricCard
                  key={metric.metric_id}
                  metric={metric}
                  onViewFormula={() => handleViewFormula(metric)}
                  onEdit={() => handleEditMetric(metric)}
                  onDuplicate={() => handleDuplicateMetric(metric)}
                  onDelete={() => handleDeleteMetric(metric)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Formula Viewer Dialog */}
      <FormulaViewer
        metric={selectedMetric}
        open={formulaViewerOpen}
        onOpenChange={setFormulaViewerOpen}
      />

      {/* Metric Form Dialog */}
      <MetricForm
        open={metricFormOpen}
        onOpenChange={setMetricFormOpen}
        onSave={handleSaveMetric}
        initialMetric={editingMetric || undefined}
        mode={editingMetric ? "edit" : "create"}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Metric</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{metricToDelete?.metric_name}&quot;?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* AI Assistant */}
      <AIMetricAssistant
        open={aiAssistantOpen}
        onOpenChange={setAiAssistantOpen}
        onGenerate={handleAIGenerate}
      />
    </div>
  );
}
