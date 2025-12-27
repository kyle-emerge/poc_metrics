import type { Carrier, CarrierMetrics } from '@/types';

export const carriers: Carrier[] = [
  {
    carrier_id: "carrier_xpo_001",
    scac: "XPDL",
    name: "XPO Logistics",
    carrier_type: "ASSET",
    contract_type: "CONTRACT_PRIMARY",
    active: true
  },
  {
    carrier_id: "carrier_sch_001",
    scac: "SCHO",
    name: "Schneider National",
    carrier_type: "ASSET",
    contract_type: "CONTRACT_PRIMARY",
    active: true
  },
  {
    carrier_id: "carrier_jbt_001",
    scac: "JBTC",
    name: "JB Hunt Transport",
    carrier_type: "ASSET",
    contract_type: "CONTRACT_PRIMARY",
    active: true
  },
  {
    carrier_id: "carrier_kwk_001",
    scac: "KWKE",
    name: "Knight-Swift Transportation",
    carrier_type: "ASSET",
    contract_type: "CONTRACT_BACKUP",
    active: true
  },
  {
    carrier_id: "carrier_odfl_001",
    scac: "ODFL",
    name: "Old Dominion Freight Line",
    carrier_type: "ASSET",
    contract_type: "CONTRACT_PRIMARY",
    active: true
  }
];

export const carrierMetrics: CarrierMetrics[] = [
  {
    carrier: {
      carrier_id: "carrier_xpo_001",
      scac: "XPDL",
      name: "XPO Logistics",
      carrier_type: "ASSET",
      contract_type: "CONTRACT_PRIMARY",
      active: true
    },
    time_period: {
      start: "2024-12-01T00:00:00Z",
      end: "2024-12-31T23:59:59Z"
    },
    metrics: {
      volume: {
        total_loads: 3,
        shipments: 2,
        total_tenders: 3
      },
      performance: {
        otp_exact: 100.0,
        otp_15min: 100.0,
        otp_60min: 100.0,
        otd_exact: 100.0,
        otd_15min: 100.0,
        avg_dwell_time: 80.3
      },
      tender: {
        acceptance_rate: 66.7,
        rejection_rate: 33.3,
        avg_response_time_hours: 1.37
      },
      cost: {
        avg_cost_per_mile: 3.04,
        cost_index: 98.7,
        total_spend: 5967.50,
        currency: "USD"
      }
    },
    lanes: [
      {
        lane_code: "CHI-ATL",
        load_count: 1,
        otp_exact: 100.0,
        avg_cpm: 2.99
      },
      {
        lane_code: "CHI-DAL",
        load_count: 1,
        otp_exact: 100.0,
        avg_cpm: 3.07
      }
    ]
  },
  {
    carrier: {
      carrier_id: "carrier_sch_001",
      scac: "SCHO",
      name: "Schneider National",
      carrier_type: "ASSET",
      contract_type: "CONTRACT_PRIMARY",
      active: true
    },
    time_period: {
      start: "2024-12-01T00:00:00Z",
      end: "2024-12-31T23:59:59Z"
    },
    metrics: {
      volume: {
        total_loads: 2,
        shipments: 2,
        total_tenders: 2
      },
      performance: {
        otp_exact: 50.0,
        otp_15min: 50.0,
        otp_60min: 50.0,
        otd_exact: 100.0,
        otd_15min: 100.0,
        avg_dwell_time: 97.5
      },
      performance_excluding_shipper_fault: {
        otp_exact: 100.0,
        otp_15min: 100.0,
        eligible_pickups: 1
      },
      tender: {
        acceptance_rate: 100.0,
        rejection_rate: 0.0,
        avg_response_time_hours: 0.75
      },
      cost: {
        avg_cost_per_mile: 3.32,
        cost_index: 107.8,
        total_spend: 2370.00,
        currency: "USD"
      }
    },
    lanes: [
      {
        lane_code: "CHI-ATL",
        load_count: 1,
        otp_exact: 0.0,
        otp_exact_excluding_shipper_fault: 100.0,
        avg_cpm: 3.32
      }
    ]
  },
  {
    carrier: {
      carrier_id: "carrier_jbt_001",
      scac: "JBTC",
      name: "JB Hunt Transport",
      carrier_type: "ASSET",
      contract_type: "CONTRACT_PRIMARY",
      active: true
    },
    time_period: {
      start: "2024-12-01T00:00:00Z",
      end: "2024-12-31T23:59:59Z"
    },
    metrics: {
      volume: {
        total_loads: 1,
        shipments: 1,
        total_tenders: 1
      },
      performance: {
        otp_exact: 0.0,
        otp_15min: 0.0,
        otp_60min: 100.0,
        otd_exact: 100.0,
        otd_15min: 100.0,
        avg_dwell_time: 73.5
      },
      tender: {
        acceptance_rate: 100.0,
        rejection_rate: 0.0,
        avg_response_time_hours: 0.75
      },
      cost: {
        avg_cost_per_mile: 3.02,
        cost_index: 98.1,
        total_spend: 2163.00,
        currency: "USD"
      }
    },
    lanes: [
      {
        lane_code: "CHI-ATL",
        load_count: 1,
        otp_exact: 0.0,
        avg_cpm: 3.02
      }
    ]
  },
  {
    carrier: {
      carrier_id: "carrier_kwk_001",
      scac: "KWKE",
      name: "Knight-Swift Transportation",
      carrier_type: "ASSET",
      contract_type: "CONTRACT_BACKUP",
      active: true
    },
    time_period: {
      start: "2024-12-01T00:00:00Z",
      end: "2024-12-31T23:59:59Z"
    },
    metrics: {
      volume: {
        total_loads: 1,
        shipments: 1,
        total_tenders: 1
      },
      performance: {
        otp_exact: 100.0,
        otp_15min: 100.0,
        otp_60min: 100.0,
        otd_exact: 100.0,
        otd_15min: 100.0,
        avg_dwell_time: 75.0
      },
      tender: {
        acceptance_rate: 100.0,
        rejection_rate: 0.0,
        avg_response_time_hours: 0.50
      },
      cost: {
        avg_cost_per_mile: 3.47,
        cost_index: 112.7,
        total_spend: 2480.00,
        currency: "USD"
      }
    },
    lanes: [
      {
        lane_code: "CHI-ATL",
        load_count: 1,
        otp_exact: 100.0,
        avg_cpm: 3.47
      }
    ],
    notes: "Backup carrier - higher rates"
  },
  {
    carrier: {
      carrier_id: "carrier_odfl_001",
      scac: "ODFL",
      name: "Old Dominion Freight Line",
      carrier_type: "ASSET",
      contract_type: "CONTRACT_PRIMARY",
      active: true
    },
    time_period: {
      start: "2024-12-01T00:00:00Z",
      end: "2024-12-31T23:59:59Z"
    },
    metrics: {
      volume: {
        total_loads: 1,
        shipments: 1,
        total_tenders: 1
      },
      performance: {
        otp_exact: 100.0,
        otp_15min: 100.0,
        otp_60min: 100.0,
        otd_exact: 100.0,
        otd_15min: 100.0,
        avg_dwell_time: 100.0
      },
      tender: {
        acceptance_rate: 100.0,
        rejection_rate: 0.0,
        avg_response_time_hours: 1.33
      },
      cost: {
        avg_cost_per_mile: 3.15,
        cost_index: 102.3,
        total_spend: 8795.00,
        currency: "USD"
      }
    },
    lanes: [
      {
        lane_code: "LAX-NYC",
        load_count: 1,
        otp_exact: 100.0,
        avg_cpm: 3.15
      }
    ]
  }
];
