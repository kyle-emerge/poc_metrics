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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Badge } from "@/components/ui/badge";
import { SegmentCard } from "@/components/segments/segment-card";
import { SegmentForm } from "@/components/segments/segment-form";
import { AISegmentAssistant } from "@/components/ai-assistant/ai-segment-assistant";
import { segments as baselineSegments, transactionOverrides } from "@/data";
import { metricDefinitions } from "@/data";
import type { Segment } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Local storage key for custom segments
const CUSTOM_SEGMENTS_KEY = "poc_segments_custom";

export default function SegmentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedSegment, setSelectedSegment] = useState<Segment | null>(null);
  const [rulesViewerOpen, setRulesViewerOpen] = useState(false);
  const [segmentFormOpen, setSegmentFormOpen] = useState(false);
  const [editingSegment, setEditingSegment] = useState<Segment | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [segmentToDelete, setSegmentToDelete] = useState<Segment | null>(null);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);

  // Custom segments state (persisted to localStorage)
  const [customSegments, setCustomSegments] = useState<Segment[]>([]);

  // Load custom segments from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(CUSTOM_SEGMENTS_KEY);
    if (stored) {
      try {
        setCustomSegments(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse stored segments:", e);
      }
    }
  }, []);

  // Save custom segments to localStorage when they change
  useEffect(() => {
    localStorage.setItem(CUSTOM_SEGMENTS_KEY, JSON.stringify(customSegments));
  }, [customSegments]);

  // Combine baseline and custom segments
  const allSegments = [...baselineSegments, ...customSegments];

  // Get all available metric codes for the form
  const availableMetrics = [
    "ALL",
    ...metricDefinitions.map((m) => m.metric_code),
  ];

  const filteredSegments = allSegments.filter((segment) => {
    const matchesSearch =
      segment.segment_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      segment.segment_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      segment.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      typeFilter === "all" || segment.segment_type === typeFilter;

    return matchesSearch && matchesType;
  });

  const activeSegments = filteredSegments.filter((s) => s.is_active);
  const inactiveSegments = filteredSegments.filter((s) => !s.is_active);

  // Check if segment is a baseline (system) segment
  const isBaselineSegment = (segment: Segment) => {
    return baselineSegments.some((s) => s.segment_id === segment.segment_id);
  };

  const handleViewRules = (segment: Segment) => {
    setSelectedSegment(segment);
    setRulesViewerOpen(true);
  };

  const handleCreateSegment = () => {
    setEditingSegment(null);
    setSegmentFormOpen(true);
  };

  const handleEditSegment = (segment: Segment) => {
    if (isBaselineSegment(segment)) {
      // For baseline segments, duplicate instead
      handleDuplicateSegment(segment);
    } else {
      setEditingSegment(segment);
      setSegmentFormOpen(true);
    }
  };

  const handleDuplicateSegment = (segment: Segment) => {
    const duplicated: Segment = {
      ...segment,
      segment_id: `seg_${Date.now()}`,
      segment_code: `${segment.segment_code}_COPY`,
      segment_name: `${segment.segment_name} (Copy)`,
      created_by: "current_user",
      created_at: new Date().toISOString(),
    };
    setCustomSegments((prev) => [...prev, duplicated]);
  };

  const handleDeleteSegment = (segment: Segment) => {
    if (isBaselineSegment(segment)) return; // Can't delete baseline segments
    setSegmentToDelete(segment);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (segmentToDelete) {
      setCustomSegments((prev) =>
        prev.filter((s) => s.segment_id !== segmentToDelete.segment_id)
      );
      setSegmentToDelete(null);
    }
    setDeleteConfirmOpen(false);
  };

  const handleToggleActive = (segment: Segment, active: boolean) => {
    if (isBaselineSegment(segment)) {
      // For baseline segments, we can't modify them directly
      // Could show a message or create a custom override
      return;
    }
    setCustomSegments((prev) =>
      prev.map((s) =>
        s.segment_id === segment.segment_id ? { ...s, is_active: active } : s
      )
    );
  };

  const handleSaveSegment = (segment: Segment) => {
    if (editingSegment) {
      // Update existing segment
      setCustomSegments((prev) =>
        prev.map((s) => (s.segment_id === segment.segment_id ? segment : s))
      );
    } else {
      // Add new segment
      setCustomSegments((prev) => [...prev, segment]);
    }
    setEditingSegment(null);
  };

  const handleAIGenerate = (segment: Partial<Segment>) => {
    // Create a partial segment definition and open the form with it pre-filled
    const prefilledSegment: Segment = {
      segment_id: `seg_${Date.now()}`,
      segment_code: segment.segment_code || "",
      segment_name: segment.segment_name || "",
      description: segment.description || "",
      segment_type: segment.segment_type || "EXCLUSION",
      applies_to: segment.applies_to || [],
      affected_metrics: segment.affected_metrics || [],
      rules: segment.rules || { field: "", operator: "=", value: "" },
      auto_apply: segment.auto_apply || false,
      is_active: segment.is_active ?? true,
      created_by: "current_user",
      created_at: new Date().toISOString(),
    };
    setEditingSegment(prefilledSegment);
    setSegmentFormOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Segments</h1>
          <p className="text-muted-foreground">
            Define exclusion and inclusion rules for metric calculations
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setAiAssistantOpen(true)}>
            <Sparkles className="h-4 w-4 mr-2" />
            AI Builder
          </Button>
          <Button onClick={handleCreateSegment}>
            <Plus className="h-4 w-4 mr-2" />
            Create Segment
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search segments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="EXCLUSION">Exclusion</SelectItem>
            <SelectItem value="INCLUSION">Inclusion</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="segments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="segments">
            Segments ({filteredSegments.length})
          </TabsTrigger>
          <TabsTrigger value="overrides">
            Transaction Overrides ({transactionOverrides.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="segments" className="space-y-6">
          {/* Active Segments */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              Active Segments ({activeSegments.length})
            </h3>
            {activeSegments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No active segments found.
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {activeSegments.map((segment) => (
                  <SegmentCard
                    key={segment.segment_id}
                    segment={segment}
                    onViewRules={() => handleViewRules(segment)}
                    onEdit={() => handleEditSegment(segment)}
                    onDuplicate={() => handleDuplicateSegment(segment)}
                    onDelete={() => handleDeleteSegment(segment)}
                    onToggleActive={(active) =>
                      handleToggleActive(segment, active)
                    }
                  />
                ))}
              </div>
            )}
          </div>

          {/* Inactive Segments */}
          {inactiveSegments.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-muted-foreground">
                Inactive Segments ({inactiveSegments.length})
              </h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {inactiveSegments.map((segment) => (
                  <SegmentCard
                    key={segment.segment_id}
                    segment={segment}
                    onViewRules={() => handleViewRules(segment)}
                    onEdit={() => handleEditSegment(segment)}
                    onDuplicate={() => handleDuplicateSegment(segment)}
                    onDelete={() => handleDeleteSegment(segment)}
                    onToggleActive={(active) =>
                      handleToggleActive(segment, active)
                    }
                  />
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="overrides" className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Entity ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Segment</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Applied By</TableHead>
                  <TableHead>Applied At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactionOverrides.map((override) => {
                  const segment = allSegments.find(
                    (s) => s.segment_id === override.segment_id
                  );
                  return (
                    <TableRow key={override.override_id}>
                      <TableCell className="font-mono text-xs">
                        {override.entity_id}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{override.entity_type}</Badge>
                      </TableCell>
                      <TableCell>{segment?.segment_name || "Unknown"}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            override.override_action === "EXCLUDE"
                              ? "destructive"
                              : "default"
                          }
                        >
                          {override.override_action}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {override.reason}
                      </TableCell>
                      <TableCell>{override.applied_by}</TableCell>
                      <TableCell>
                        {new Date(override.applied_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Rules Viewer Dialog */}
      <Dialog open={rulesViewerOpen} onOpenChange={setRulesViewerOpen}>
        <DialogContent className="!max-w-[95vw] w-full h-[95vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>{selectedSegment?.segment_name}</DialogTitle>
            <DialogDescription className="font-mono text-xs">
              {selectedSegment?.segment_code}
            </DialogDescription>
          </DialogHeader>
          {selectedSegment && (
            <div className="flex-1 overflow-auto space-y-6 pr-2">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedSegment.description}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Segment Type</h4>
                    <Badge
                      variant={selectedSegment.segment_type === "EXCLUSION" ? "destructive" : "default"}
                    >
                      {selectedSegment.segment_type}
                    </Badge>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Applies To</h4>
                    <div className="flex gap-2 flex-wrap">
                      {selectedSegment.applies_to.map((entity) => (
                        <Badge key={entity} variant="secondary">
                          {entity}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Affected Metrics</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedSegment.affected_metrics.map((metric) => (
                        <Badge key={metric} variant="outline" className="text-xs">
                          {metric}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Auto Apply</h4>
                      <Badge variant={selectedSegment.auto_apply ? "default" : "outline"}>
                        {selectedSegment.auto_apply ? "Yes" : "No"}
                      </Badge>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-2">Status</h4>
                      <Badge variant={selectedSegment.is_active ? "default" : "outline"}>
                        {selectedSegment.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Rule Definition (JSON)</h4>
                  <div className="bg-muted rounded-lg p-4 overflow-auto max-h-[60vh]">
                    <pre className="text-xs font-mono whitespace-pre-wrap">
                      {JSON.stringify(selectedSegment.rules, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Segment Form Dialog */}
      <SegmentForm
        open={segmentFormOpen}
        onOpenChange={setSegmentFormOpen}
        onSave={handleSaveSegment}
        initialSegment={editingSegment || undefined}
        mode={editingSegment ? "edit" : "create"}
        availableMetrics={availableMetrics}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Segment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{segmentToDelete?.segment_name}&quot;?
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
      <AISegmentAssistant
        open={aiAssistantOpen}
        onOpenChange={setAiAssistantOpen}
        onGenerate={handleAIGenerate}
      />
    </div>
  );
}
