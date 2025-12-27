export * from './locations';
export * from './carriers';
export * from './lanes';
export * from './metrics';
export * from './segments';

// Dashboard KPI Summary Data
export const dashboardKPIs = {
  period: {
    start: "2024-12-01T00:00:00Z",
    end: "2024-12-31T23:59:59Z",
    label: "December 2024"
  },
  summary: {
    total_loads: 7,
    total_shipments: 6,
    total_tenders: 8,
    total_spend: 23775.50,
    total_miles: 6149.1,
    carriers_used: 5,
    lanes_active: 3
  },
  performance: {
    otp_exact: 71.4,
    otp_exact_previous: 68.2,
    otp_15min: 71.4,
    otp_60min: 85.7,
    otd_exact: 100.0,
    otd_exact_previous: 96.5,
    otd_15min: 100.0
  },
  tender: {
    acceptance_rate: 87.5,
    acceptance_rate_previous: 82.3,
    avg_response_time: 0.98,
    ftar: 87.5
  },
  cost: {
    avg_cpm: 3.09,
    avg_cpm_previous: 3.15,
    total_spend: 23775.50,
    linehaul_spend: 19270.00,
    fuel_spend: 2580.50,
    accessorial_spend: 150.00
  },
  dwell: {
    avg_pickup: 89.7,
    avg_delivery: 60.6,
    avg_overall: 75.2
  }
};

// Trend data for charts
export const trendData = {
  otp: [
    { date: "2024-12-01", otp_exact: 65.0, otp_15min: 72.0, otp_60min: 88.0 },
    { date: "2024-12-08", otp_exact: 68.5, otp_15min: 75.0, otp_60min: 90.0 },
    { date: "2024-12-15", otp_exact: 72.0, otp_15min: 78.0, otp_60min: 92.0 },
    { date: "2024-12-22", otp_exact: 74.5, otp_15min: 80.0, otp_60min: 88.0 },
    { date: "2024-12-27", otp_exact: 71.4, otp_15min: 71.4, otp_60min: 85.7 }
  ],
  cost: [
    { date: "2024-12-01", avg_cpm: 3.25, linehaul_cpm: 2.75, fuel_cpm: 0.42 },
    { date: "2024-12-08", avg_cpm: 3.18, linehaul_cpm: 2.70, fuel_cpm: 0.40 },
    { date: "2024-12-15", avg_cpm: 3.10, linehaul_cpm: 2.65, fuel_cpm: 0.38 },
    { date: "2024-12-22", avg_cpm: 3.05, linehaul_cpm: 2.62, fuel_cpm: 0.36 },
    { date: "2024-12-27", avg_cpm: 3.09, linehaul_cpm: 2.68, fuel_cpm: 0.35 }
  ],
  volume: [
    { date: "2024-12-01", loads: 1 },
    { date: "2024-12-08", loads: 2 },
    { date: "2024-12-15", loads: 2 },
    { date: "2024-12-22", loads: 1 },
    { date: "2024-12-27", loads: 1 }
  ],
  tender: [
    { date: "2024-12-01", acceptance_rate: 80.0, response_time: 1.2 },
    { date: "2024-12-08", acceptance_rate: 85.0, response_time: 1.0 },
    { date: "2024-12-15", acceptance_rate: 90.0, response_time: 0.9 },
    { date: "2024-12-22", acceptance_rate: 88.0, response_time: 0.8 },
    { date: "2024-12-27", acceptance_rate: 87.5, response_time: 0.98 }
  ]
};
