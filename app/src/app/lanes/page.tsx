"use client";

import { useState } from "react";
import { Search, ArrowRight, TrendingUp, TrendingDown, DollarSign, Clock, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { laneMetrics } from "@/data";
import type { LaneMetrics } from "@/types";

export default function LanesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLane, setSelectedLane] = useState<LaneMetrics | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const filteredLanes = laneMetrics.filter((lane) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      lane.lane.lane_code.toLowerCase().includes(searchLower) ||
      lane.lane.origin.city.toLowerCase().includes(searchLower) ||
      lane.lane.destination.city.toLowerCase().includes(searchLower) ||
      lane.lane.origin.state.toLowerCase().includes(searchLower) ||
      lane.lane.destination.state.toLowerCase().includes(searchLower)
    );
  });

  const getPerformanceColor = (value: number) => {
    if (value >= 90) return "text-green-600";
    if (value >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  const handleViewDetails = (lane: LaneMetrics) => {
    setSelectedLane(lane);
    setDetailsOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Lanes</h1>
        <p className="text-muted-foreground">
          Analyze performance and cost metrics by origin-destination lane
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by city, state, or lane code..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8"
        />
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Lanes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{laneMetrics.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Volume
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {laneMetrics.reduce((sum, l) => sum + l.metrics.volume.total_loads, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg OTP (Exact)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(
                laneMetrics.reduce((sum, l) => sum + l.metrics.performance.otp_exact, 0) /
                laneMetrics.length
              ).toFixed(1)}%
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg CPM
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(
                laneMetrics.reduce((sum, l) => sum + l.metrics.cost.avg_cost_per_mile, 0) /
                laneMetrics.length
              ).toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lanes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lane Performance</CardTitle>
          <CardDescription>
            Click on a lane to view detailed metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lane</TableHead>
                <TableHead className="text-right">Volume</TableHead>
                <TableHead className="text-right">OTP Exact</TableHead>
                <TableHead className="text-right">OTD Exact</TableHead>
                <TableHead className="text-right">Acceptance</TableHead>
                <TableHead className="text-right">Avg CPM</TableHead>
                <TableHead className="text-right">Total Spend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLanes.map((lane) => (
                <TableRow
                  key={lane.lane.lane_code}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleViewDetails(lane)}
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {lane.lane.origin.city}, {lane.lane.origin.state}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {lane.lane.origin.name}
                        </span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {lane.lane.destination.city}, {lane.lane.destination.state}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {lane.lane.destination.name}
                        </span>
                      </div>
                    </div>
                    <Badge variant="outline" className="mt-1 text-xs">
                      {lane.lane.lane_code}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="secondary">{lane.metrics.volume.total_loads}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={getPerformanceColor(lane.metrics.performance.otp_exact)}>
                      {lane.metrics.performance.otp_exact.toFixed(1)}%
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={getPerformanceColor(lane.metrics.performance.otd_exact)}>
                      {lane.metrics.performance.otd_exact.toFixed(1)}%
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Progress
                        value={lane.metrics.tender.acceptance_rate}
                        className="w-16 h-2"
                      />
                      <span className="text-sm">
                        {lane.metrics.tender.acceptance_rate.toFixed(0)}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    ${lane.metrics.cost.avg_cost_per_mile.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    ${lane.metrics.cost.total_spend.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Lane Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedLane?.lane.origin.city}, {selectedLane?.lane.origin.state}
              <ArrowRight className="h-4 w-4" />
              {selectedLane?.lane.destination.city}, {selectedLane?.lane.destination.state}
            </DialogTitle>
            <DialogDescription>
              Lane: {selectedLane?.lane.lane_code}
            </DialogDescription>
          </DialogHeader>
          {selectedLane && (
            <div className="space-y-6">
              {/* Volume & Cost */}
              <div className="grid grid-cols-4 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Package className="h-4 w-4" />
                    Total Loads
                  </div>
                  <div className="text-2xl font-bold mt-1">
                    {selectedLane.metrics.volume.total_loads}
                  </div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    Total Spend
                  </div>
                  <div className="text-2xl font-bold mt-1">
                    ${selectedLane.metrics.cost.total_spend.toLocaleString()}
                  </div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    Avg CPM
                  </div>
                  <div className="text-2xl font-bold mt-1">
                    ${selectedLane.metrics.cost.avg_cost_per_mile.toFixed(2)}
                  </div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <TrendingUp className="h-4 w-4" />
                    Cost CV
                  </div>
                  <div className="text-2xl font-bold mt-1">
                    {selectedLane.metrics.cost.cost_consistency_cv.toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div>
                <h4 className="font-semibold mb-3">Performance Metrics</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">OTP Exact</span>
                      <span className={getPerformanceColor(selectedLane.metrics.performance.otp_exact)}>
                        {selectedLane.metrics.performance.otp_exact.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">OTP 15min</span>
                      <span className={getPerformanceColor(selectedLane.metrics.performance.otp_15min)}>
                        {selectedLane.metrics.performance.otp_15min.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">OTP 60min</span>
                      <span className={getPerformanceColor(selectedLane.metrics.performance.otp_60min)}>
                        {selectedLane.metrics.performance.otp_60min.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">OTD Exact</span>
                      <span className={getPerformanceColor(selectedLane.metrics.performance.otd_exact)}>
                        {selectedLane.metrics.performance.otd_exact.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">OTD 15min</span>
                      <span className={getPerformanceColor(selectedLane.metrics.performance.otd_15min)}>
                        {selectedLane.metrics.performance.otd_15min.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Tender Acceptance</span>
                      <span>{selectedLane.metrics.tender.acceptance_rate.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dwell Times */}
              <div>
                <h4 className="font-semibold mb-3">Dwell Times</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted rounded-lg flex items-center gap-4">
                    <Clock className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Avg Pickup Dwell</div>
                      <div className="text-xl font-bold">
                        {selectedLane.metrics.performance.avg_dwell_time_pickup} min
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-muted rounded-lg flex items-center gap-4">
                    <Clock className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Avg Delivery Dwell</div>
                      <div className="text-xl font-bold">
                        {selectedLane.metrics.performance.avg_dwell_time_delivery} min
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Segment-Adjusted Performance */}
              {selectedLane.metrics.performance_excluding_shipper_fault && (
                <div>
                  <h4 className="font-semibold mb-3">
                    Performance (Excluding Shipper Fault)
                  </h4>
                  <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">OTP Exact</div>
                        <div className="text-xl font-bold text-blue-600">
                          {selectedLane.metrics.performance_excluding_shipper_fault.otp_exact.toFixed(1)}%
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">OTP 15min</div>
                        <div className="text-xl font-bold text-blue-600">
                          {selectedLane.metrics.performance_excluding_shipper_fault.otp_15min.toFixed(1)}%
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Eligible Pickups</div>
                        <div className="text-xl font-bold">
                          {selectedLane.metrics.performance_excluding_shipper_fault.eligible_pickups}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
