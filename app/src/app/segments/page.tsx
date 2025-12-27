"use client";

import { useState } from "react";
import { Plus, Search, Filter } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { SegmentCard } from "@/components/segments/segment-card";
import { segments, transactionOverrides } from "@/data";
import type { Segment } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function SegmentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedSegment, setSelectedSegment] = useState<Segment | null>(null);
  const [rulesViewerOpen, setRulesViewerOpen] = useState(false);

  const filteredSegments = segments.filter((segment) => {
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

  const handleViewRules = (segment: Segment) => {
    setSelectedSegment(segment);
    setRulesViewerOpen(true);
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
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Segment
        </Button>
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
                    onEdit={() => console.log("Edit", segment.segment_id)}
                    onDuplicate={() => console.log("Duplicate", segment.segment_id)}
                    onDelete={() => console.log("Delete", segment.segment_id)}
                    onToggleActive={(active) =>
                      console.log("Toggle", segment.segment_id, active)
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
                    onEdit={() => console.log("Edit", segment.segment_id)}
                    onDuplicate={() => console.log("Duplicate", segment.segment_id)}
                    onDelete={() => console.log("Delete", segment.segment_id)}
                    onToggleActive={(active) =>
                      console.log("Toggle", segment.segment_id, active)
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
                  const segment = segments.find(
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedSegment?.segment_name}</DialogTitle>
            <DialogDescription className="font-mono text-xs">
              {selectedSegment?.segment_code}
            </DialogDescription>
          </DialogHeader>
          {selectedSegment && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Description</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedSegment.description}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Rule Definition</h4>
                <div className="bg-muted rounded-lg p-4 overflow-x-auto">
                  <pre className="text-xs font-mono">
                    {JSON.stringify(selectedSegment.rules, null, 2)}
                  </pre>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Applies To</h4>
                  <div className="flex gap-2">
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
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
