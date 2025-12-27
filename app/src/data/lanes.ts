import type { LaneMetrics } from '@/types';

export const laneMetrics: LaneMetrics[] = [
  {
    lane: {
      origin: {
        location_id: "loc_chi_dc_01",
        location_code: "CHI-DC-01",
        name: "Chicago Distribution Center",
        city: "Chicago",
        state: "IL",
        type: "WAREHOUSE"
      },
      destination: {
        location_id: "loc_atl_wh_03",
        location_code: "ATL-WH-03",
        name: "Atlanta Warehouse Facility",
        city: "Atlanta",
        state: "GA",
        type: "WAREHOUSE"
      },
      lane_code: "CHI-ATL"
    },
    time_period: {
      start: "2024-12-01T00:00:00Z",
      end: "2024-12-31T23:59:59Z"
    },
    metrics: {
      volume: {
        total_loads: 5,
        shipments: 4,
        tenders: 1
      },
      cost: {
        avg_cost_per_mile: 3.08,
        min_cost_per_mile: 2.99,
        max_cost_per_mile: 3.47,
        cost_consistency_cv: 5.8,
        total_spend: 11148.50,
        currency: "USD"
      },
      performance: {
        otp_exact: 60.0,
        otp_15min: 60.0,
        otp_60min: 80.0,
        otp_same_day: 100.0,
        otd_exact: 100.0,
        otd_15min: 100.0,
        avg_dwell_time_pickup: 92.6,
        avg_dwell_time_delivery: 68.0
      },
      performance_excluding_shipper_fault: {
        otp_exact: 75.0,
        otp_15min: 75.0,
        otp_60min: 100.0,
        eligible_pickups: 4
      },
      tender: {
        acceptance_rate: 80.0,
        avg_response_time_hours: 0.95,
        ftar: 80.0
      }
    }
  },
  {
    lane: {
      origin: {
        location_id: "loc_chi_dc_01",
        location_code: "CHI-DC-01",
        name: "Chicago Distribution Center",
        city: "Chicago",
        state: "IL",
        type: "WAREHOUSE"
      },
      destination: {
        location_id: "loc_dal_fc_01",
        location_code: "DAL-FC-01",
        name: "Dallas Fulfillment Center",
        city: "Dallas",
        state: "TX",
        type: "FULFILLMENT_CENTER"
      },
      lane_code: "CHI-DAL"
    },
    time_period: {
      start: "2024-12-01T00:00:00Z",
      end: "2024-12-31T23:59:59Z"
    },
    metrics: {
      volume: {
        total_loads: 1,
        shipments: 1,
        tenders: 0
      },
      cost: {
        avg_cost_per_mile: 3.07,
        min_cost_per_mile: 3.07,
        max_cost_per_mile: 3.07,
        cost_consistency_cv: 0.0,
        total_spend: 3832.00,
        currency: "USD"
      },
      performance: {
        otp_exact: 100.0,
        otp_15min: 100.0,
        otp_60min: 100.0,
        otd_exact: 100.0,
        otd_15min: 100.0,
        avg_dwell_time_pickup: 83,
        avg_dwell_time_delivery: 15
      },
      tender: {
        acceptance_rate: 100.0,
        avg_response_time_hours: 1.50,
        ftar: 100.0
      }
    }
  },
  {
    lane: {
      origin: {
        location_id: "loc_lax_port_02",
        location_code: "LAX-PORT-02",
        name: "Los Angeles Port Terminal",
        city: "Los Angeles",
        state: "CA",
        type: "PORT"
      },
      destination: {
        location_id: "loc_nyc_wh_05",
        location_code: "NYC-WH-05",
        name: "New Jersey Distribution Hub",
        city: "Newark",
        state: "NJ",
        type: "WAREHOUSE"
      },
      lane_code: "LAX-NYC"
    },
    time_period: {
      start: "2024-12-01T00:00:00Z",
      end: "2024-12-31T23:59:59Z"
    },
    metrics: {
      volume: {
        total_loads: 1,
        shipments: 1,
        tenders: 0
      },
      cost: {
        avg_cost_per_mile: 3.15,
        min_cost_per_mile: 3.15,
        max_cost_per_mile: 3.15,
        cost_consistency_cv: 0.0,
        total_spend: 8795.00,
        currency: "USD"
      },
      performance: {
        otp_exact: 100.0,
        otp_15min: 100.0,
        otp_60min: 100.0,
        otd_exact: 100.0,
        otd_15min: 100.0,
        avg_dwell_time_pickup: 105,
        avg_dwell_time_delivery: 95
      },
      tender: {
        acceptance_rate: 100.0,
        avg_response_time_hours: 1.33,
        ftar: 100.0
      }
    }
  }
];
