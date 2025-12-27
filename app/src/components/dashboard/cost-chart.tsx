"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface CostChartProps {
  data: Array<{
    date: string;
    avg_cpm: number;
    linehaul_cpm: number;
    fuel_cpm: number;
  }>;
}

export function CostChart({ data }: CostChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cost Per Mile Trend</CardTitle>
        <CardDescription>
          Breakdown of cost components over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                }}
                className="text-xs"
              />
              <YAxis
                domain={[0, 4]}
                tickFormatter={(value) => `$${value.toFixed(2)}`}
                className="text-xs"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                labelFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  });
                }}
                formatter={(value) => [`$${(typeof value === 'number' ? value.toFixed(2) : value)}/mi`]}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="fuel_cpm"
                name="Fuel"
                stackId="1"
                stroke="hsl(47 96% 53%)"
                fill="hsl(47 96% 53% / 0.6)"
              />
              <Area
                type="monotone"
                dataKey="linehaul_cpm"
                name="Linehaul"
                stackId="1"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary) / 0.6)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
