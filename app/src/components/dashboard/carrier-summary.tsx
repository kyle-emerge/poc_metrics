"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { CarrierMetrics } from "@/types";

interface CarrierSummaryProps {
  carriers: CarrierMetrics[];
}

export function CarrierSummary({ carriers }: CarrierSummaryProps) {
  const getOTPColor = (value: number) => {
    if (value >= 90) return "text-green-600";
    if (value >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  const getCostIndexColor = (value: number) => {
    if (value <= 100) return "text-green-600";
    if (value <= 110) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Carrier Performance Summary</CardTitle>
        <CardDescription>
          Top carriers by volume with key performance indicators
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Carrier</TableHead>
              <TableHead className="text-right">Loads</TableHead>
              <TableHead className="text-right">OTP Exact</TableHead>
              <TableHead className="text-right">Acceptance</TableHead>
              <TableHead className="text-right">Avg CPM</TableHead>
              <TableHead className="text-right">Cost Index</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {carriers.map((carrier) => (
              <TableRow key={carrier.carrier.carrier_id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{carrier.carrier.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {carrier.carrier.scac}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant="secondary">{carrier.metrics.volume.total_loads}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <span className={getOTPColor(carrier.metrics.performance.otp_exact)}>
                    {carrier.metrics.performance.otp_exact.toFixed(1)}%
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Progress
                      value={carrier.metrics.tender.acceptance_rate}
                      className="w-16 h-2"
                    />
                    <span className="text-sm">
                      {carrier.metrics.tender.acceptance_rate.toFixed(0)}%
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  ${carrier.metrics.cost.avg_cost_per_mile.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  <span className={getCostIndexColor(carrier.metrics.cost.cost_index)}>
                    {carrier.metrics.cost.cost_index.toFixed(1)}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
