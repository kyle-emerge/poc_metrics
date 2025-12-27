import type { MetricDefinition } from '@/types';

export const metricDefinitions: MetricDefinition[] = [
  {
    metric_id: "metric_otp_exact",
    metric_code: "OTP_EXACT",
    metric_name: "On-Time Pickup - Exact",
    description: "Percentage of pickups where actual arrival was exactly on or before scheduled time",
    formula: {
      type: "percentage",
      numerator: {
        type: "count",
        filter: {
          type: "and",
          conditions: [
            { field: "stop_type", operator: "=", value: "PICKUP" },
            { field: "actual.arrival", operator: "<=", value: { field: "appointment.scheduled_earliest" } }
          ]
        }
      },
      denominator: {
        type: "count",
        filter: { field: "stop_type", operator: "=", value: "PICKUP" }
      }
    },
    return_type: "PERCENTAGE",
    unit: "%",
    precision: 1,
    is_baseline: true,
    category: "PERFORMANCE"
  },
  {
    metric_id: "metric_otp_15min",
    metric_code: "OTP_15MIN",
    metric_name: "On-Time Pickup - 15 Min Grace",
    description: "Percentage of pickups where actual arrival was within 15 minutes of scheduled time",
    formula: {
      type: "percentage",
      numerator: {
        type: "count",
        filter: {
          type: "and",
          conditions: [
            { field: "stop_type", operator: "=", value: "PICKUP" },
            { field: "actual.arrival", operator: "<=", value: { field: "appointment.scheduled_earliest", offset: 15, unit: "minutes" } }
          ]
        }
      },
      denominator: {
        type: "count",
        filter: { field: "stop_type", operator: "=", value: "PICKUP" }
      }
    },
    return_type: "PERCENTAGE",
    unit: "%",
    precision: 1,
    is_baseline: true,
    category: "PERFORMANCE"
  },
  {
    metric_id: "metric_otp_60min",
    metric_code: "OTP_60MIN",
    metric_name: "On-Time Pickup - 60 Min Grace",
    description: "Percentage of pickups where actual arrival was within 60 minutes of scheduled time",
    formula: {
      type: "percentage",
      numerator: {
        type: "count",
        filter: {
          type: "and",
          conditions: [
            { field: "stop_type", operator: "=", value: "PICKUP" },
            { field: "actual.arrival", operator: "<=", value: { field: "appointment.scheduled_earliest", offset: 60, unit: "minutes" } }
          ]
        }
      },
      denominator: {
        type: "count",
        filter: { field: "stop_type", operator: "=", value: "PICKUP" }
      }
    },
    return_type: "PERCENTAGE",
    unit: "%",
    precision: 1,
    is_baseline: true,
    category: "PERFORMANCE"
  },
  {
    metric_id: "metric_otd_exact",
    metric_code: "OTD_EXACT",
    metric_name: "On-Time Delivery - Exact",
    description: "Percentage of deliveries where actual arrival was exactly on or before scheduled time",
    formula: {
      type: "percentage",
      numerator: {
        type: "count",
        filter: {
          type: "and",
          conditions: [
            { field: "stop_type", operator: "=", value: "DELIVERY" },
            { field: "actual.arrival", operator: "<=", value: { field: "appointment.scheduled_earliest" } }
          ]
        }
      },
      denominator: {
        type: "count",
        filter: { field: "stop_type", operator: "=", value: "DELIVERY" }
      }
    },
    return_type: "PERCENTAGE",
    unit: "%",
    precision: 1,
    is_baseline: true,
    category: "PERFORMANCE"
  },
  {
    metric_id: "metric_otd_15min",
    metric_code: "OTD_15MIN",
    metric_name: "On-Time Delivery - 15 Min Grace",
    description: "Percentage of deliveries where actual arrival was within 15 minutes of scheduled time",
    formula: {
      type: "percentage",
      numerator: {
        type: "count",
        filter: {
          type: "and",
          conditions: [
            { field: "stop_type", operator: "=", value: "DELIVERY" },
            { field: "actual.arrival", operator: "<=", value: { field: "appointment.scheduled_earliest", offset: 15, unit: "minutes" } }
          ]
        }
      },
      denominator: {
        type: "count",
        filter: { field: "stop_type", operator: "=", value: "DELIVERY" }
      }
    },
    return_type: "PERCENTAGE",
    unit: "%",
    precision: 1,
    is_baseline: true,
    category: "PERFORMANCE"
  },
  {
    metric_id: "metric_cpm_all_in",
    metric_code: "CPM_ALL_IN",
    metric_name: "Cost Per Mile - All-In",
    description: "Total cost divided by length of haul",
    formula: {
      type: "division",
      numerator: {
        type: "sum",
        field: "charges.line_items.amount.value"
      },
      denominator: {
        type: "field",
        path: "length_of_haul.value"
      }
    },
    return_type: "CURRENCY",
    unit: "USD/MILE",
    precision: 2,
    is_baseline: true,
    category: "COST"
  },
  {
    metric_id: "metric_cpm_linehaul",
    metric_code: "CPM_LINEHAUL",
    metric_name: "Cost Per Mile - Linehaul Only",
    description: "Linehaul cost divided by length of haul",
    formula: {
      type: "division",
      numerator: {
        type: "sum",
        field: "charges.line_items.amount.value",
        filter: { field: "charge_type", operator: "=", value: "LINE_HAUL" }
      },
      denominator: {
        type: "field",
        path: "length_of_haul.value"
      }
    },
    return_type: "CURRENCY",
    unit: "USD/MILE",
    precision: 2,
    is_baseline: true,
    category: "COST"
  },
  {
    metric_id: "metric_tender_acceptance",
    metric_code: "TENDER_ACCEPTANCE_RATE",
    metric_name: "Tender Acceptance Rate",
    description: "Percentage of tenders accepted by carriers",
    formula: {
      type: "percentage",
      numerator: {
        type: "count",
        filter: { field: "tender.status", operator: "=", value: "ACCEPTED" }
      },
      denominator: {
        type: "count",
        filter: {
          type: "or",
          conditions: [
            { field: "tender.status", operator: "=", value: "ACCEPTED" },
            { field: "tender.status", operator: "=", value: "REJECTED" }
          ]
        }
      }
    },
    return_type: "PERCENTAGE",
    unit: "%",
    precision: 1,
    is_baseline: true,
    category: "TENDER"
  },
  {
    metric_id: "metric_tender_response_time",
    metric_code: "TENDER_RESPONSE_TIME",
    metric_name: "Average Tender Response Time",
    description: "Average time taken by carriers to respond to tender offers",
    formula: {
      type: "average",
      field: "tender_response_hours"
    },
    return_type: "DURATION",
    unit: "HOURS",
    precision: 2,
    is_baseline: true,
    category: "TENDER"
  },
  {
    metric_id: "metric_ftar",
    metric_code: "FTAR",
    metric_name: "First Tender Acceptance Rate",
    description: "Percentage of loads awarded on the first tender attempt",
    formula: {
      type: "percentage",
      numerator: {
        type: "count",
        filter: { field: "first_tender_status", operator: "=", value: "ACCEPTED" }
      },
      denominator: {
        type: "count",
        filter: { field: "tender.status", operator: "IS_NOT_NULL" }
      }
    },
    return_type: "PERCENTAGE",
    unit: "%",
    precision: 1,
    is_baseline: true,
    category: "TENDER"
  },
  {
    metric_id: "metric_avg_dwell_time",
    metric_code: "AVG_DWELL_TIME",
    metric_name: "Average Dwell Time",
    description: "Average time spent at stops from arrival to departure",
    formula: {
      type: "average",
      field: "dwell_time_minutes"
    },
    return_type: "DURATION",
    unit: "MINUTES",
    precision: 0,
    is_baseline: true,
    category: "DWELL"
  },
  {
    metric_id: "metric_cost_index",
    metric_code: "COST_INDEX",
    metric_name: "Cost Index",
    description: "Carrier's average cost compared to lane average",
    formula: {
      type: "division",
      numerator: {
        type: "field",
        path: "carrier_avg_cpm"
      },
      denominator: {
        type: "field",
        path: "lane_avg_cpm"
      },
      multiplier: 100
    },
    return_type: "DECIMAL",
    unit: "INDEX",
    precision: 1,
    is_baseline: true,
    category: "COST"
  }
];
