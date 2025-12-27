import type { Segment, TransactionOverride } from '@/types';

export const segments: Segment[] = [
  {
    segment_id: "seg_no_shipper_fault",
    segment_code: "NO_SHIPPER_FAULT",
    segment_name: "Exclude Shipper Fault",
    description: "Excludes stops where delays were the shipper's responsibility",
    segment_type: "EXCLUSION",
    applies_to: ["STOP"],
    affected_metrics: ["OTP_EXACT", "OTP_15MIN", "OTP_60MIN"],
    rules: {
      type: "or",
      operator: "OR",
      conditions: [
        { field: "late_reason.responsible_party", operator: "!=", value: "SHIPPER" },
        { field: "late_reason", operator: "IS_NULL" }
      ]
    },
    auto_apply: true,
    is_active: true,
    created_by: "system",
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    segment_id: "seg_no_customer_fault",
    segment_code: "NO_CUSTOMER_FAULT",
    segment_name: "Exclude Customer Fault",
    description: "Excludes stops where delays were the customer's responsibility",
    segment_type: "EXCLUSION",
    applies_to: ["STOP"],
    affected_metrics: ["OTD_EXACT", "OTD_15MIN"],
    rules: {
      type: "or",
      operator: "OR",
      conditions: [
        { field: "late_reason.responsible_party", operator: "!=", value: "CUSTOMER" },
        { field: "late_reason", operator: "IS_NULL" }
      ]
    },
    auto_apply: true,
    is_active: true,
    created_by: "system",
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    segment_id: "seg_no_test_loads",
    segment_code: "NO_TEST_LOADS",
    segment_name: "Exclude Test Loads",
    description: "Excludes test/trial loads from operational metrics",
    segment_type: "EXCLUSION",
    applies_to: ["LOAD"],
    affected_metrics: ["ALL"],
    rules: {
      type: "or",
      operator: "OR",
      conditions: [
        { field: "metadata.is_test", operator: "!=", value: true },
        { field: "metadata.is_test", operator: "IS_NULL" }
      ]
    },
    auto_apply: true,
    is_active: true,
    created_by: "system",
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    segment_id: "seg_no_contract_backup",
    segment_code: "NO_CONTRACT_BACKUP",
    segment_name: "Exclude Contract Backup",
    description: "Excludes backup tenders from acceptance rate calculations",
    segment_type: "EXCLUSION",
    applies_to: ["LOAD"],
    affected_metrics: ["TENDER_ACCEPTANCE_RATE"],
    rules: {
      field: "contract_type",
      operator: "!=",
      value: "CONTRACT_BACKUP"
    },
    auto_apply: true,
    is_active: true,
    created_by: "system",
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    segment_id: "seg_weather_exclusion",
    segment_code: "WEATHER_EXCLUSION",
    segment_name: "Exclude Weather Delays",
    description: "Excludes weather-related delays from on-time metrics",
    segment_type: "EXCLUSION",
    applies_to: ["STOP"],
    affected_metrics: ["OTP_EXACT", "OTP_15MIN", "OTP_60MIN", "OTD_EXACT", "OTD_15MIN"],
    rules: {
      field: "late_reason.code",
      operator: "!=",
      value: "WEATHER_DELAY"
    },
    auto_apply: false,
    is_active: true,
    created_by: "system",
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    segment_id: "seg_force_majeure",
    segment_code: "FORCE_MAJEURE_EXCLUSION",
    segment_name: "Exclude Force Majeure",
    description: "Excludes delays due to force majeure events",
    segment_type: "EXCLUSION",
    applies_to: ["STOP"],
    affected_metrics: ["OTP_EXACT", "OTP_15MIN", "OTP_60MIN", "OTD_EXACT", "OTD_15MIN"],
    rules: {
      field: "late_reason.code",
      operator: "!=",
      value: "FORCE_MAJEURE"
    },
    auto_apply: false,
    is_active: true,
    created_by: "system",
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    segment_id: "seg_primary_contract_only",
    segment_code: "PRIMARY_CONTRACT_ONLY",
    segment_name: "Primary Contract Only",
    description: "Includes only primary contract loads for contract compliance metrics",
    segment_type: "INCLUSION",
    applies_to: ["LOAD"],
    affected_metrics: ["TENDER_ACCEPTANCE_RATE", "CPM_ALL_IN"],
    rules: {
      field: "contract_type",
      operator: "=",
      value: "CONTRACT_PRIMARY"
    },
    auto_apply: false,
    is_active: true,
    created_by: "system",
    created_at: "2024-01-01T00:00:00Z"
  }
];

export const transactionOverrides: TransactionOverride[] = [
  {
    override_id: "override_001",
    entity_id: "stop_002_01",
    entity_type: "STOP",
    segment_id: "seg_no_shipper_fault",
    override_action: "EXCLUDE",
    reason: "Although marked as shipper fault, carrier could have communicated better about the delay",
    applied_by: "user_kyle_001",
    applied_at: "2024-12-14T10:30:00Z",
    effective_from: "2024-12-13T00:00:00Z",
    effective_to: null
  },
  {
    override_id: "override_002",
    entity_id: "load_008",
    entity_type: "LOAD",
    segment_id: "seg_no_test_loads",
    override_action: "EXCLUDE",
    reason: "This was a test load for new TMS integration",
    applied_by: "user_kyle_001",
    applied_at: "2024-12-21T15:00:00Z",
    effective_from: "2024-12-21T00:00:00Z",
    effective_to: null
  }
];
