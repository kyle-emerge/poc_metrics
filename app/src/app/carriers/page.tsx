"use client";

import { useState } from "react";
import { Search, TrendingUp, TrendingDown, Minus, DollarSign, Clock, Package, Truck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
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
import { carrierMetrics } from "@/data";
import type { CarrierMetrics } from "@/types";

export default function CarriersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCarrier, setSelectedCarrier] = useState<CarrierMetrics | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const filteredCarriers = carrierMetrics.filter((carrier) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      carrier.carrier.name.toLowerCase().includes(searchLower) ||
      carrier.carrier.scac.toLowerCase().includes(searchLower)
    );
  });

  const getPerformanceColor = (value: number) => {
    if (value >= 90) return "text-green-600";
    if (value >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  const getCostIndexColor = (value: number) => {
    if (value <= 100) return "text-green-600";
    if (value <= 110) return "text-yellow-600";
    return "text-red-600";
  };

  const getCostIndexIcon = (value: number) => {
    if (value < 100) return <TrendingDown className="h-4 w-4 text-green-600" />;
    if (value > 100) return <TrendingUp className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const handleViewDetails = (carrier: CarrierMetrics) => {
    setSelectedCarrier(carrier);
    setDetailsOpen(true);
  };

  // Calculate summary stats
  const totalLoads = carrierMetrics.reduce((sum, c) => sum + c.metrics.volume.total_loads, 0);
  const avgOTP = carrierMetrics.reduce((sum, c) => sum + c.metrics.performance.otp_exact, 0) / carrierMetrics.length;
  const avgAcceptance = carrierMetrics.reduce((sum, c) => sum + c.metrics.tender.acceptance_rate, 0) / carrierMetrics.length;
  const totalSpend = carrierMetrics.reduce((sum, c) => sum + c.metrics.cost.total_spend, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Carriers</h1>
        <p className="text-muted-foreground">
          View carrier performance scorecards and lane-level metrics
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by carrier name or SCAC..."
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
              Active Carriers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{carrierMetrics.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Loads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLoads}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg OTP
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgOTP.toFixed(1)}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Spend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalSpend / 1000).toFixed(1)}K</div>
          </CardContent>
        </Card>
      </div>

      {/* Carrier Scorecards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredCarriers.map((carrier) => (
          <Card
            key={carrier.carrier.carrier_id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleViewDetails(carrier)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{carrier.carrier.name}</CardTitle>
                  <CardDescription className="font-mono">
                    {carrier.carrier.scac}
                  </CardDescription>
                </div>
                <Badge
                  variant={
                    carrier.carrier.contract_type === "CONTRACT_PRIMARY"
                      ? "default"
                      : "secondary"
                  }
                >
                  {carrier.carrier.contract_type === "CONTRACT_PRIMARY"
                    ? "Primary"
                    : "Backup"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">OTP Exact</div>
                  <div
                    className={`text-xl font-bold ${getPerformanceColor(
                      carrier.metrics.performance.otp_exact
                    )}`}
                  >
                    {carrier.metrics.performance.otp_exact.toFixed(1)}%
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">OTD Exact</div>
                  <div
                    className={`text-xl font-bold ${getPerformanceColor(
                      carrier.metrics.performance.otd_exact
                    )}`}
                  >
                    {carrier.metrics.performance.otd_exact.toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* Tender Acceptance */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Tender Acceptance</span>
                  <span>{carrier.metrics.tender.acceptance_rate.toFixed(0)}%</span>
                </div>
                <Progress value={carrier.metrics.tender.acceptance_rate} className="h-2" />
              </div>

              {/* Cost Metrics */}
              <div className="flex items-center justify-between pt-2 border-t">
                <div>
                  <div className="text-sm text-muted-foreground">Avg CPM</div>
                  <div className="font-semibold">
                    ${carrier.metrics.cost.avg_cost_per_mile.toFixed(2)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getCostIndexIcon(carrier.metrics.cost.cost_index)}
                  <div
                    className={`font-semibold ${getCostIndexColor(
                      carrier.metrics.cost.cost_index
                    )}`}
                  >
                    {carrier.metrics.cost.cost_index.toFixed(1)}
                  </div>
                </div>
              </div>

              {/* Volume */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {carrier.metrics.volume.total_loads} loads
                </span>
                <span className="text-muted-foreground">
                  ${carrier.metrics.cost.total_spend.toLocaleString()} spend
                </span>
              </div>

              {/* Notes */}
              {carrier.notes && (
                <div className="text-xs text-muted-foreground italic border-t pt-2">
                  {carrier.notes}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Carrier Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              {selectedCarrier?.carrier.name}
            </DialogTitle>
            <DialogDescription>
              SCAC: {selectedCarrier?.carrier.scac} |{" "}
              {selectedCarrier?.carrier.contract_type === "CONTRACT_PRIMARY"
                ? "Primary Contract"
                : "Backup Contract"}
            </DialogDescription>
          </DialogHeader>
          {selectedCarrier && (
            <div className="space-y-6">
              {/* Summary Stats */}
              <div className="grid grid-cols-4 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Package className="h-4 w-4" />
                    Total Loads
                  </div>
                  <div className="text-2xl font-bold mt-1">
                    {selectedCarrier.metrics.volume.total_loads}
                  </div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    Total Spend
                  </div>
                  <div className="text-2xl font-bold mt-1">
                    ${selectedCarrier.metrics.cost.total_spend.toLocaleString()}
                  </div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    Avg CPM
                  </div>
                  <div className="text-2xl font-bold mt-1">
                    ${selectedCarrier.metrics.cost.avg_cost_per_mile.toFixed(2)}
                  </div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    Avg Response
                  </div>
                  <div className="text-2xl font-bold mt-1">
                    {selectedCarrier.metrics.tender.avg_response_time_hours.toFixed(1)}h
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">On-Time Performance</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">OTP Exact</span>
                      <span
                        className={`font-semibold ${getPerformanceColor(
                          selectedCarrier.metrics.performance.otp_exact
                        )}`}
                      >
                        {selectedCarrier.metrics.performance.otp_exact.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">OTP 15min</span>
                      <span
                        className={`font-semibold ${getPerformanceColor(
                          selectedCarrier.metrics.performance.otp_15min
                        )}`}
                      >
                        {selectedCarrier.metrics.performance.otp_15min.toFixed(1)}%
                      </span>
                    </div>
                    {selectedCarrier.metrics.performance.otp_60min !== undefined && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">OTP 60min</span>
                        <span
                          className={`font-semibold ${getPerformanceColor(
                            selectedCarrier.metrics.performance.otp_60min
                          )}`}
                        >
                          {selectedCarrier.metrics.performance.otp_60min.toFixed(1)}%
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">OTD Exact</span>
                      <span
                        className={`font-semibold ${getPerformanceColor(
                          selectedCarrier.metrics.performance.otd_exact
                        )}`}
                      >
                        {selectedCarrier.metrics.performance.otd_exact.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">OTD 15min</span>
                      <span
                        className={`font-semibold ${getPerformanceColor(
                          selectedCarrier.metrics.performance.otd_15min
                        )}`}
                      >
                        {selectedCarrier.metrics.performance.otd_15min.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Tender Metrics</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Acceptance Rate</span>
                      <span className="font-semibold">
                        {selectedCarrier.metrics.tender.acceptance_rate.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Rejection Rate</span>
                      <span className="font-semibold text-red-600">
                        {selectedCarrier.metrics.tender.rejection_rate.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Avg Response Time</span>
                      <span className="font-semibold">
                        {selectedCarrier.metrics.tender.avg_response_time_hours.toFixed(2)} hrs
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Cost Index</span>
                      <span
                        className={`font-semibold ${getCostIndexColor(
                          selectedCarrier.metrics.cost.cost_index
                        )}`}
                      >
                        {selectedCarrier.metrics.cost.cost_index.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Segment-Adjusted Performance */}
              {selectedCarrier.metrics.performance_excluding_shipper_fault && (
                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <h4 className="font-semibold mb-3">
                    Performance (Excluding Shipper Fault)
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">OTP Exact</div>
                      <div className="text-xl font-bold text-blue-600">
                        {selectedCarrier.metrics.performance_excluding_shipper_fault.otp_exact.toFixed(
                          1
                        )}
                        %
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">OTP 15min</div>
                      <div className="text-xl font-bold text-blue-600">
                        {selectedCarrier.metrics.performance_excluding_shipper_fault.otp_15min.toFixed(
                          1
                        )}
                        %
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Eligible Pickups</div>
                      <div className="text-xl font-bold">
                        {selectedCarrier.metrics.performance_excluding_shipper_fault.eligible_pickups}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Lane Performance */}
              <div>
                <h4 className="font-semibold mb-3">Lane Performance</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Lane</TableHead>
                      <TableHead className="text-right">Loads</TableHead>
                      <TableHead className="text-right">OTP Exact</TableHead>
                      <TableHead className="text-right">Avg CPM</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedCarrier.lanes.map((lane) => (
                      <TableRow key={lane.lane_code}>
                        <TableCell className="font-medium">{lane.lane_code}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant="secondary">{lane.load_count}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={getPerformanceColor(lane.otp_exact)}>
                            {lane.otp_exact.toFixed(1)}%
                          </span>
                          {lane.otp_exact_excluding_shipper_fault !== undefined && (
                            <span className="text-xs text-blue-600 ml-1">
                              ({lane.otp_exact_excluding_shipper_fault.toFixed(0)}%*)
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          ${lane.avg_cpm.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <p className="text-xs text-muted-foreground mt-2">
                  * Excluding shipper fault delays
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
