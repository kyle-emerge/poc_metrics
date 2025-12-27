import {
  Clock,
  DollarSign,
  Package,
  TrendingUp,
  Truck,
  CheckCircle,
} from "lucide-react";
import { KPICard } from "@/components/dashboard/kpi-card";
import { PerformanceChart } from "@/components/dashboard/performance-chart";
import { CostChart } from "@/components/dashboard/cost-chart";
import { CarrierSummary } from "@/components/dashboard/carrier-summary";
import { dashboardKPIs, trendData, carrierMetrics } from "@/data";

export default function DashboardPage() {
  const { summary, performance, tender, cost, dwell } = dashboardKPIs;

  // Calculate trends
  const otpTrend = performance.otp_exact > performance.otp_exact_previous ? "up" : "down";
  const otdTrend = performance.otd_exact > performance.otd_exact_previous ? "up" : "down";
  const tenderTrend =
    tender.acceptance_rate > tender.acceptance_rate_previous ? "up" : "down";
  const costTrend = cost.avg_cpm < cost.avg_cpm_previous ? "up" : "down";

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your logistics performance metrics for December 2024
        </p>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="On-Time Pickup (Exact)"
          value={performance.otp_exact.toFixed(1)}
          unit="%"
          change={performance.otp_exact - performance.otp_exact_previous}
          changeLabel="vs last period"
          trend={otpTrend}
          icon={<Clock className="h-4 w-4" />}
        />
        <KPICard
          title="On-Time Delivery (Exact)"
          value={performance.otd_exact.toFixed(1)}
          unit="%"
          change={performance.otd_exact - performance.otd_exact_previous}
          changeLabel="vs last period"
          trend={otdTrend}
          icon={<CheckCircle className="h-4 w-4" />}
        />
        <KPICard
          title="Tender Acceptance Rate"
          value={tender.acceptance_rate.toFixed(1)}
          unit="%"
          change={tender.acceptance_rate - tender.acceptance_rate_previous}
          changeLabel="vs last period"
          trend={tenderTrend}
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <KPICard
          title="Average Cost Per Mile"
          value={`$${cost.avg_cpm.toFixed(2)}`}
          change={((cost.avg_cpm - cost.avg_cpm_previous) / cost.avg_cpm_previous) * 100}
          changeLabel="vs last period"
          trend={costTrend}
          icon={<DollarSign className="h-4 w-4" />}
        />
      </div>

      {/* Secondary KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Loads"
          value={summary.total_loads}
          icon={<Package className="h-4 w-4" />}
        />
        <KPICard
          title="Total Spend"
          value={`$${(summary.total_spend / 1000).toFixed(1)}K`}
          icon={<DollarSign className="h-4 w-4" />}
        />
        <KPICard
          title="Active Carriers"
          value={summary.carriers_used}
          icon={<Truck className="h-4 w-4" />}
        />
        <KPICard
          title="Avg Dwell Time"
          value={dwell.avg_overall.toFixed(0)}
          unit="min"
          icon={<Clock className="h-4 w-4" />}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        <PerformanceChart data={trendData.otp} />
        <CostChart data={trendData.cost} />
      </div>

      {/* Carrier Summary Table */}
      <CarrierSummary carriers={carrierMetrics} />
    </div>
  );
}
