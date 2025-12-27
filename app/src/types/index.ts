// Location Types
export interface Location {
  location_id: string;
  location_code: string;
  name: string;
  address1?: string;
  address2?: string;
  city: string;
  state: string;
  postal_code?: string;
  country_code?: string;
  latitude?: number;
  longitude?: number;
  type: 'WAREHOUSE' | 'FULFILLMENT_CENTER' | 'PORT' | 'DISTRIBUTION_CENTER';
}

// Carrier Types
export interface Carrier {
  carrier_id: string;
  scac: string;
  name: string;
  carrier_type: 'ASSET' | 'BROKER';
  contract_type: 'CONTRACT_PRIMARY' | 'CONTRACT_BACKUP';
  active: boolean;
}

// Charge Types
export interface ChargeLineItem {
  charge_type: 'LINE_HAUL' | 'FUEL_SURCHARGE' | 'DETENTION' | 'ACCESSORIAL';
  amount: {
    currency: string;
    value: number;
  };
}

export interface Charges {
  line_items: ChargeLineItem[];
}

// Appointment Types
export interface Appointment {
  type: 'APPOINTMENT' | 'WINDOW';
  scheduled_earliest: string;
  scheduled_latest: string;
  original_earliest?: string;
  original_latest?: string;
}

// Actual Times
export interface ActualTimes {
  arrival: string;
  departure: string;
}

// Late Reason
export interface LateReason {
  code: string;
  description: string;
  responsible_party: 'SHIPPER' | 'CARRIER' | 'CUSTOMER' | 'FORCE_MAJEURE';
  reported_at: string;
}

// Stop Types
export interface Stop {
  stop_id: string;
  sequence: number;
  stop_type: 'PICKUP' | 'DELIVERY';
  loading_type: 'LIVE' | 'DROP';
  location: Location;
  appointment: Appointment;
  actual?: ActualTimes;
  late_reason?: LateReason | null;
}

// Tender Types
export interface Tender {
  tendered_at: string;
  accepted_at?: string;
  rejected_at?: string;
  status: 'ACCEPTED' | 'REJECTED' | 'PENDING';
  rejection_reason?: string;
}

// Load Types
export interface Load {
  load_id: string;
  load_type: 'SHIPMENT' | 'TENDER';
  load_status: 'DELIVERED' | 'IN_TRANSIT' | 'REJECTED' | 'PENDING';
  mode: 'TRUCKLOAD' | 'LTL' | 'PARCEL';
  equipment_type: string;
  external_shipment_id?: string;
  external_tender_id?: string;
  carrier: {
    carrier_id: string;
    scac: string;
    name: string;
  };
  contract_type: 'CONTRACT_PRIMARY' | 'CONTRACT_BACKUP';
  length_of_haul: {
    value: number;
    unit: string;
  };
  charges?: Charges;
  tender: Tender;
  stops: Stop[];
  metadata: {
    created_at: string;
    is_test: boolean;
  };
}

// Stop Metrics
export interface StopMetrics {
  stop_id: string;
  ot_exact: 'ON_TIME' | 'LATE';
  ot_15min: 'ON_TIME' | 'LATE';
  ot_60min: 'ON_TIME' | 'LATE';
  ot_same_day: 'ON_TIME' | 'LATE';
  dwell_time_minutes: number;
  late_reason?: {
    responsible_party: string;
    code: string;
  };
}

// Calculated Load Metrics
export interface LoadMetrics {
  load_id: string;
  metrics: {
    cost_per_mile: number;
    linehaul_per_mile: number;
    fuel_per_mile: number;
    accessorial_per_mile?: number;
    total_cost: number;
    tender_response_hours: number;
    stop_metrics: StopMetrics[];
  };
}

// Lane Types
export interface Lane {
  origin: Location;
  destination: Location;
  lane_code: string;
}

// Lane Metrics
export interface LaneMetrics {
  lane: Lane;
  time_period: {
    start: string;
    end: string;
  };
  metrics: {
    volume: {
      total_loads: number;
      shipments: number;
      tenders: number;
    };
    cost: {
      avg_cost_per_mile: number;
      min_cost_per_mile: number;
      max_cost_per_mile: number;
      cost_consistency_cv: number;
      total_spend: number;
      currency: string;
    };
    performance: {
      otp_exact: number;
      otp_15min: number;
      otp_60min: number;
      otp_same_day?: number;
      otd_exact: number;
      otd_15min: number;
      avg_dwell_time_pickup: number;
      avg_dwell_time_delivery: number;
    };
    performance_excluding_shipper_fault?: {
      otp_exact: number;
      otp_15min: number;
      otp_60min?: number;
      eligible_pickups: number;
    };
    tender: {
      acceptance_rate: number;
      avg_response_time_hours: number;
      ftar: number;
    };
  };
}

// Carrier Lane Performance
export interface CarrierLanePerformance {
  lane_code: string;
  load_count: number;
  otp_exact: number;
  otp_exact_excluding_shipper_fault?: number;
  avg_cpm: number;
}

// Carrier Metrics
export interface CarrierMetrics {
  carrier: Carrier;
  time_period: {
    start: string;
    end: string;
  };
  metrics: {
    volume: {
      total_loads: number;
      shipments: number;
      total_tenders: number;
    };
    performance: {
      otp_exact: number;
      otp_15min: number;
      otp_60min?: number;
      otd_exact: number;
      otd_15min: number;
      avg_dwell_time: number;
    };
    performance_excluding_shipper_fault?: {
      otp_exact: number;
      otp_15min: number;
      eligible_pickups: number;
    };
    tender: {
      acceptance_rate: number;
      rejection_rate: number;
      avg_response_time_hours: number;
    };
    cost: {
      avg_cost_per_mile: number;
      cost_index: number;
      total_spend: number;
      currency: string;
    };
  };
  lanes: CarrierLanePerformance[];
  notes?: string;
}

// Metric Definition Types
export interface MetricFormula {
  type: string;
  [key: string]: unknown;
}

export interface MetricDefinition {
  metric_id: string;
  metric_code: string;
  metric_name: string;
  description: string;
  formula: MetricFormula;
  return_type: 'PERCENTAGE' | 'DECIMAL' | 'INTEGER' | 'CURRENCY' | 'DURATION';
  unit: string;
  precision: number;
  is_baseline: boolean;
  category: 'PERFORMANCE' | 'COST' | 'TENDER' | 'DWELL' | 'SERVICE';
  is_active?: boolean;
  created_by?: string;
  created_at?: string;
}

// Segment Types
export interface SegmentRule {
  type?: string;
  field?: string;
  operator: string;
  value?: unknown;
  conditions?: SegmentRule[];
}

export interface Segment {
  segment_id: string;
  segment_code: string;
  segment_name: string;
  description: string;
  segment_type: 'INCLUSION' | 'EXCLUSION';
  applies_to: ('LOAD' | 'STOP' | 'TENDER')[];
  affected_metrics: string[];
  rules: SegmentRule;
  auto_apply: boolean;
  is_active: boolean;
  created_by?: string;
  created_at?: string;
}

// Transaction Override Types
export interface TransactionOverride {
  override_id: string;
  entity_id: string;
  entity_type: 'LOAD' | 'STOP' | 'TENDER';
  segment_id: string;
  override_action: 'INCLUDE' | 'EXCLUDE';
  reason: string;
  applied_by: string;
  applied_at: string;
  effective_from: string;
  effective_to: string | null;
}

// Dashboard Filter State
export interface DashboardFilters {
  date_range: {
    start: string;
    end: string;
    preset?: string;
  };
  mode: string[];
  equipment_type: string[];
  carrier_ids: string[];
  lane_codes: string[];
  segment_ids: string[];
  include_backup_contracts: boolean;
}

// KPI Card Types
export interface KPIData {
  label: string;
  value: number;
  unit: string;
  change?: number;
  changeLabel?: string;
  trend?: 'up' | 'down' | 'neutral';
}
