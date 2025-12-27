# Product Requirements Document: Metrics & Segmentation Engine

## Executive Summary

This document defines a highly customizable metrics calculation and segmentation engine that allows shippers to define, calculate, and segment operational KPIs across loads, lanes, carriers, and locations. The system supports baseline metric definitions, custom formula building, segment-based exclusions, and a flexible API for querying metrics at various aggregation levels.

**Key Capabilities:**
- Pre-defined baseline metrics for common logistics KPIs
- Custom metric formula builder with visual UI
- Segment-based exclusion rules (e.g., exclude shipper-fault incidents from OTP)
- Entity-level metrics API (loads, lanes, carriers, locations)
- Flexible aggregation and filtering
- Complete audit trail of metric calculations

---

## 1. Baseline Metrics Definitions

### 1.1 On-Time Performance (OTP) Metrics

#### OTP - Exact
**Definition:** Percentage of stops where actual arrival was exactly on or before scheduled time.

**Formula:**
```
(Stops where actual_arrival <= scheduled_earliest) / (Total eligible stops) * 100
```

**Eligibility Rules:**
- Stop must have `actual.arrival` timestamp
- Stop must have `appointment.scheduled_earliest` timestamp
- Stop type: PICKUP only (default), configurable to include DELIVERY
- Exclude stops with `late_reason.responsible_party = 'SHIPPER'` (configurable)

**Grace Period:** None

---

#### OTP - 15 Minute Grace
**Definition:** Percentage of stops where actual arrival was within 15 minutes of scheduled time.

**Formula:**
```
(Stops where actual_arrival <= scheduled_earliest + 15 minutes) / (Total eligible stops) * 100
```

**Eligibility Rules:** Same as OTP - Exact

**Grace Period:** 15 minutes

---

#### OTP - 60 Minute Grace
**Definition:** Percentage of stops where actual arrival was within 60 minutes of scheduled time.

**Formula:**
```
(Stops where actual_arrival <= scheduled_earliest + 60 minutes) / (Total eligible stops) * 100
```

**Eligibility Rules:** Same as OTP - Exact

**Grace Period:** 60 minutes

---

#### OTP - Same Day
**Definition:** Percentage of stops where actual arrival occurred on the same calendar day as scheduled.

**Formula:**
```
(Stops where date(actual_arrival) = date(scheduled_earliest)) / (Total eligible stops) * 100
```

**Eligibility Rules:** Same as OTP - Exact

**Grace Period:** End of scheduled day

---

#### OTP - Original Schedule
**Definition:** Percentage of stops delivered on time compared to the original schedule (before any rescheduling).

**Formula:**
```
(Stops where actual_arrival <= original_earliest) / (Total eligible stops) * 100
```

**Eligibility Rules:**
- Stop must have `appointment.original_earliest` timestamp
- All other rules same as OTP - Exact

**Use Case:** Measures service against initial commitments, ignoring customer-initiated reschedules

---

### 1.2 On-Time Delivery (OTD) Metrics

Same structure as OTP metrics, but applied to DELIVERY stops only.

**Default Eligibility:**
- Stop type: DELIVERY only
- Exclude stops with `late_reason.responsible_party = 'SHIPPER'` or `'CUSTOMER'` (configurable)

---

### 1.3 Tender Acceptance Metrics

#### Tender Acceptance Rate
**Definition:** Percentage of tenders accepted by carriers.

**Formula:**
```
(Tenders with status = 'ACCEPTED') / (Total tenders with status IN ['ACCEPTED', 'REJECTED']) * 100
```

**Eligibility Rules:**
- Exclude tenders with `contract_type = 'CONTRACT_BACKUP'` (configurable)
- Exclude tenders where load was canceled before response
- Must have `tender.tendered_at` timestamp

---

#### Tender Response Time (Average)
**Definition:** Average time taken by carriers to respond to tender offers.

**Formula:**
```
AVG(accepted_at - tendered_at OR rejected_at - tendered_at)
```

**Eligibility Rules:**
- Must have either `accepted_at` or `rejected_at`
- Exclude tenders that expired without response

**Unit:** Hours (default), configurable to minutes/days

---

#### First Tender Acceptance Rate (FTAR)
**Definition:** Percentage of loads awarded on the first tender attempt.

**Formula:**
```
(Loads where first_tender_status = 'ACCEPTED') / (Total loads tendered) * 100
```

**Data Requirements:**
- Requires tender sequence tracking
- Only counts the first tender sent for each load

---

### 1.4 Cost Metrics

#### Cost Per Mile (CPM)
**Definition:** Total cost divided by length of haul.

**Formula:**
```
(SUM of all charges.line_items.amount) / length_of_haul.value
```

**Variations:**
- **Linehaul CPM:** Only LINE_HAUL charges
- **All-In CPM:** All charge types
- **Fuel CPM:** Only FUEL_SURCHARGE charges
- **Accessorial CPM:** All charges except LINE_HAUL and FUEL_SURCHARGE

**Eligibility Rules:**
- Must have `length_of_haul` > 0
- Currency must match (default: USD)

---

#### Average Cost Per Load
**Definition:** Average total cost across loads.

**Formula:**
```
SUM(charges.line_items.amount) / COUNT(loads)
```

**Segmentation Options:**
- By mode (TRUCKLOAD, LTL, PARCEL)
- By equipment type
- By lane
- By carrier

---

### 1.5 Dwell Time Metrics

#### Average Dwell Time
**Definition:** Average time spent at stops from arrival to departure.

**Formula:**
```
AVG(actual.departure - actual.arrival)
```

**Unit:** Minutes (default)

**Eligibility Rules:**
- Must have both `actual.arrival` and `actual.departure`
- Configurable stop types (PICKUP, DELIVERY, or both)

---

#### Dwell Time - Normalized
**Definition:** Dwell time adjusted for typical facility processing times.

**Formula:**
```
actual_dwell_time - facility_baseline_dwell_time
```

**Use Case:** Identifies outlier locations or unusual delays

---

### 1.6 Service Level Metrics

#### In-Full Delivery Rate
**Definition:** Percentage of loads delivered without shortages or damage.

**Formula:**
```
(Loads without shortage/damage claims) / (Total delivered loads) * 100
```

**Data Requirements:**
- Requires claims/exception tracking
- Integration with exception management system

---

#### On-Time and In-Full (OTIF)
**Definition:** Percentage of loads meeting both on-time and in-full criteria.

**Formula:**
```
(Loads with OTD = ON_TIME AND no exceptions) / (Total loads) * 100
```

**Standard:** Industry benchmark is 95%+

---

### 1.7 Lane Metrics

#### Lane Volume
**Definition:** Number of loads in a specific lane over a time period.

**Formula:**
```
COUNT(loads WHERE origin_location = X AND destination_location = Y)
```

**Aggregation Levels:**
- Facility-to-facility (most granular)
- City-to-city
- State-to-state
- Region-to-region

---

#### Lane Cost Consistency
**Definition:** Coefficient of variation in lane costs.

**Formula:**
```
STDDEV(cost_per_mile) / AVG(cost_per_mile) * 100
```

**Interpretation:**
- < 10%: Highly consistent
- 10-25%: Moderate variation
- > 25%: High variation (investigate)

---

### 1.8 Carrier Performance Metrics

#### Carrier On-Time Percentage
**Definition:** OTP for a specific carrier across all loads.

**Formula:**
```
(Stops on time for carrier) / (Total stops for carrier) * 100
```

**Segmentation:**
- By lane
- By equipment type
- By time period

---

#### Carrier Tender Acceptance Rate
**Definition:** Percentage of tenders accepted by a specific carrier.

**Formula:**
```
(Accepted tenders) / (Total tenders to carrier) * 100
```

---

#### Carrier Cost Index
**Definition:** Carrier's average cost compared to lane average.

**Formula:**
```
(Carrier avg CPM on lane) / (Lane avg CPM for all carriers) * 100
```

**Interpretation:**
- 100 = At market average
- < 100 = Below average (more cost-effective)
- > 100 = Above average (premium pricing)

---

## 2. Formula Builder System

### 2.1 Formula Builder Architecture

The formula builder allows users to create custom metrics using a visual interface with drag-and-drop components.

#### Formula Components

**1. Fields (Numeric)**
- Load fields: `length_of_haul`, `total_charges`, `tender_response_time`
- Stop fields: `dwell_time_minutes`, `miles_from_previous_stop`
- Charge fields: `line_haul_amount`, `fuel_surcharge_amount`
- Custom calculated fields

**2. Operators**
- Arithmetic: `+`, `-`, `*`, `/`, `%`
- Comparison: `=`, `!=`, `>`, `<`, `>=`, `<=`
- Logical: `AND`, `OR`, `NOT`
- Aggregations: `SUM`, `AVG`, `COUNT`, `MIN`, `MAX`, `STDDEV`

**3. Functions**
- Date: `DATE_DIFF`, `DATE_PART`, `DATE_TRUNC`
- String: `CONCAT`, `SUBSTRING`, `UPPER`, `LOWER`
- Conditional: `IF`, `CASE`, `COALESCE`
- Mathematical: `ROUND`, `CEIL`, `FLOOR`, `ABS`

**4. Constants**
- Numbers: `1`, `2.5`, `100`
- Strings: `"DELIVERED"`, `"ON_TIME"`
- Dates: `TODAY()`, `NOW()`, `DATE('2024-01-01')`

---

### 2.2 Formula Builder Data Model

```json
{
  "metric_id": "uuid",
  "metric_name": "Custom Cost Per Delivered Stop",
  "metric_code": "CPM_DELIVERED_STOP",
  "description": "Total cost divided by number of delivered stops",
  "formula": {
    "type": "division",
    "numerator": {
      "type": "aggregation",
      "function": "SUM",
      "field": "charges.line_items.amount"
    },
    "denominator": {
      "type": "aggregation",
      "function": "COUNT",
      "field": "stops",
      "filter": {
        "type": "comparison",
        "field": "stop_type",
        "operator": "=",
        "value": "DELIVERY"
      }
    }
  },
  "return_type": "DECIMAL",
  "unit": "USD",
  "precision": 2,
  "eligibility_segment_ids": ["seg_001", "seg_002"],
  "created_by": "user_id",
  "created_at": "2024-12-15T10:00:00Z",
  "is_active": true
}
```

---

### 2.3 Formula Builder UI Components

#### Visual Formula Editor

**Component Tree View:**
```
📊 Custom Cost Per Delivered Stop
├─ ➗ Division
│  ├─ 📈 SUM
│  │  └─ 💰 charges.line_items.amount
│  └─ 🔢 COUNT
│     └─ 📍 stops
│        └─ 🔍 Filter: stop_type = "DELIVERY"
```

**Properties Panel:**
- Metric name and code
- Description
- Return type (Number, Percentage, Currency, Duration)
- Unit of measurement
- Decimal precision
- Eligibility segments

**Formula Validation:**
- Real-time syntax checking
- Type compatibility validation
- Sample calculation preview
- Test against historical data

---

### 2.4 Formula Examples

#### Example 1: Fuel Cost as Percentage of Total

```json
{
  "metric_name": "Fuel Cost Percentage",
  "formula": {
    "type": "multiplication",
    "left": {
      "type": "division",
      "numerator": {
        "type": "aggregation",
        "function": "SUM",
        "field": "charges.line_items.amount",
        "filter": {
          "type": "comparison",
          "field": "charges.line_items.charge_type",
          "operator": "=",
          "value": "FUEL_SURCHARGE"
        }
      },
      "denominator": {
        "type": "aggregation",
        "function": "SUM",
        "field": "charges.line_items.amount"
      }
    },
    "right": {
      "type": "constant",
      "value": 100
    }
  },
  "return_type": "PERCENTAGE"
}
```

---

#### Example 2: Average Miles Between Stops

```json
{
  "metric_name": "Avg Miles Between Stops",
  "formula": {
    "type": "division",
    "numerator": {
      "type": "field",
      "path": "length_of_haul.value"
    },
    "denominator": {
      "type": "subtraction",
      "left": {
        "type": "aggregation",
        "function": "COUNT",
        "field": "stops"
      },
      "right": {
        "type": "constant",
        "value": 1
      }
    }
  }
}
```

---

#### Example 3: On-Time Performance with Custom Grace Period

```json
{
  "metric_name": "OTP - Custom 30min Grace",
  "formula": {
    "type": "multiplication",
    "left": {
      "type": "division",
      "numerator": {
        "type": "aggregation",
        "function": "COUNT",
        "field": "stops",
        "filter": {
          "type": "logical",
          "operator": "AND",
          "conditions": [
            {
              "type": "comparison",
              "field": "actual.arrival",
              "operator": "<=",
              "value": {
                "type": "function",
                "name": "DATE_ADD",
                "args": [
                  {"type": "field", "path": "appointment.scheduled_earliest"},
                  {"type": "interval", "value": 30, "unit": "MINUTES"}
                ]
              }
            },
            {
              "type": "comparison",
              "field": "stop_type",
              "operator": "=",
              "value": "PICKUP"
            }
          ]
        }
      },
      "denominator": {
        "type": "aggregation",
        "function": "COUNT",
        "field": "stops",
        "filter": {
          "type": "comparison",
          "field": "stop_type",
          "operator": "=",
          "value": "PICKUP"
        }
      }
    },
    "right": {
      "type": "constant",
      "value": 100
    }
  }
}
```

---

## 3. Segmentation System

### 3.1 Segment Definition

Segments define which transactions should be included or excluded from metric calculations.

#### Segment Data Model

```json
{
  "segment_id": "uuid",
  "segment_name": "OTP Eligible - No Shipper Fault",
  "segment_code": "OTP_NO_SHIPPER_FAULT",
  "description": "Excludes stops where shipper was at fault",
  "segment_type": "EXCLUSION",
  "applies_to": ["stops"],
  "affected_metrics": ["OTP_EXACT", "OTP_15MIN", "OTP_60MIN"],
  "rules": {
    "operator": "AND",
    "conditions": [
      {
        "field": "late_reason.responsible_party",
        "operator": "!=",
        "value": "SHIPPER"
      },
      {
        "field": "actual.arrival",
        "operator": "IS_NOT_NULL",
        "value": null
      }
    ]
  },
  "auto_apply": true,
  "is_active": true,
  "created_by": "user_id",
  "created_at": "2024-12-15T10:00:00Z"
}
```

---

### 3.2 Pre-Defined Segments

#### Segment: No Shipper Fault (Stops)
**Purpose:** Exclude stops where delays were shipper's responsibility

**Rules:**
```json
{
  "operator": "OR",
  "conditions": [
    {"field": "late_reason.responsible_party", "operator": "!=", "value": "SHIPPER"},
    {"field": "late_reason", "operator": "IS_NULL"}
  ]
}
```

**Affects:** OTP, OTD metrics

---

#### Segment: No Customer Fault (Stops)
**Purpose:** Exclude stops where delays were customer's responsibility

**Rules:**
```json
{
  "field": "late_reason.responsible_party",
  "operator": "!=",
  "value": "CUSTOMER"
}
```

**Affects:** OTD metrics

---

#### Segment: Primary Contract Only (Loads)
**Purpose:** Exclude backup/spot loads from contract compliance metrics

**Rules:**
```json
{
  "field": "contract_type",
  "operator": "=",
  "value": "CONTRACT_PRIMARY"
}
```

**Affects:** Tender acceptance, cost variance metrics

---

#### Segment: No Test Loads (Loads)
**Purpose:** Exclude test/trial loads from operational metrics

**Rules:**
```json
{
  "operator": "OR",
  "conditions": [
    {"field": "metadata.is_test", "operator": "!=", "value": true},
    {"field": "metadata.is_test", "operator": "IS_NULL"}
  ]
}
```

**Affects:** All metrics

---

#### Segment: Force Majeure Exclusion (Stops)
**Purpose:** Exclude delays due to force majeure events

**Rules:**
```json
{
  "field": "late_reason.code",
  "operator": "!=",
  "value": "FORCE_MAJEURE"
}
```

**Affects:** OTP, OTD, dwell time metrics

---

#### Segment: Weather Exclusion (Stops)
**Purpose:** Exclude weather-related delays

**Rules:**
```json
{
  "field": "late_reason.code",
  "operator": "!=",
  "value": "WEATHER_DELAY"
}
```

**Affects:** OTP, OTD metrics

---

#### Segment: No Contract Backup (Loads)
**Purpose:** Exclude backup tenders from acceptance rate calculations

**Rules:**
```json
{
  "field": "contract_type",
  "operator": "!=",
  "value": "CONTRACT_BACKUP"
}
```

**Affects:** Tender acceptance metrics

---

### 3.3 Transaction-Level Overrides

Users can override segment rules at the transaction level.

#### Override Data Model

```json
{
  "override_id": "uuid",
  "entity_id": "stop_id or load_id",
  "entity_type": "STOP | LOAD | TENDER",
  "segment_id": "uuid",
  "override_action": "INCLUDE | EXCLUDE",
  "reason": "Shipper acknowledged fault, should not impact carrier rating",
  "applied_by": "user_id",
  "applied_at": "2024-12-15T14:30:00Z",
  "effective_from": "2024-12-15T00:00:00Z",
  "effective_to": null
}
```

---

### 3.4 Segment Management UI

#### Segment Builder Interface

**Step 1: Basic Information**
- Segment name
- Segment code (auto-generated)
- Description
- Applies to (Loads, Stops, Tenders, Carriers)
- Segment type (Inclusion, Exclusion)

**Step 2: Rule Definition**
- Visual rule builder (similar to formula builder)
- Field selection from entity schema
- Operator selection
- Value input (with type validation)
- AND/OR grouping

**Step 3: Metric Association**
- Select which metrics this segment affects
- Preview impacted records
- Estimate metric value changes

**Step 4: Auto-Apply Settings**
- Enable/disable automatic application
- Set effective date range
- Configure notifications

---

### 3.5 Segment Application Logic

**Processing Order:**
1. Load base data (loads, stops, tenders)
2. Apply segment inclusion rules (filter IN)
3. Apply segment exclusion rules (filter OUT)
4. Apply transaction-level overrides
5. Calculate metrics on final dataset

**Example SQL Pattern:**
```sql
WITH base_stops AS (
  SELECT * FROM stops
  WHERE load_status = 'DELIVERED'
),
segmented_stops AS (
  SELECT s.*
  FROM base_stops s
  LEFT JOIN segment_exclusions se ON (
    se.segment_id = 'seg_no_shipper_fault'
    AND se.entity_type = 'STOP'
    AND (
      (s.late_reason_responsible_party = 'SHIPPER')
      OR (se.rule_match_function(s))
    )
  )
  LEFT JOIN transaction_overrides o ON (
    o.entity_id = s.stop_id
    AND o.entity_type = 'STOP'
    AND o.segment_id = 'seg_no_shipper_fault'
  )
  WHERE (
    se.segment_id IS NULL  -- Not excluded by segment
    OR o.override_action = 'INCLUDE'  -- Or manually included
  )
  AND NOT (o.override_action = 'EXCLUDE')  -- And not manually excluded
)
SELECT 
  COUNT(*) FILTER (WHERE actual_arrival <= scheduled_earliest) * 100.0 / COUNT(*) as otp_exact
FROM segmented_stops
WHERE stop_type = 'PICKUP';
```

---

## 4. Metrics API

### 4.1 API Endpoints

#### Get Load Metrics
```
GET /api/v1/loads/{load_id}/metrics
```

**Response:**
```json
{
  "load_id": "uuid",
  "load_type": "SHIPMENT",
  "metrics": {
    "cost_per_mile": {
      "value": 2.74,
      "unit": "USD/MILE",
      "calculation_timestamp": "2024-12-27T10:00:00Z",
      "segments_applied": ["seg_no_test_loads"]
    },
    "tender_response_time": {
      "value": 2.5,
      "unit": "HOURS",
      "calculation_timestamp": "2024-12-27T10:00:00Z"
    },
    "stop_metrics": [
      {
        "stop_id": "uuid",
        "sequence": 1,
        "stop_type": "PICKUP",
        "metrics": {
          "ot_exact": "ON_TIME",
          "ot_15min": "ON_TIME",
          "ot_60min": "ON_TIME",
          "dwell_time_minutes": 83,
          "segments_applied": ["seg_no_shipper_fault"]
        }
      }
    ]
  }
}
```

---

#### Get Lane Metrics
```
GET /api/v1/lanes/metrics
```

**Query Parameters:**
- `origin_location_id` (required)
- `destination_location_id` (required)
- `start_date` (required)
- `end_date` (required)
- `mode` (optional: TRUCKLOAD, LTL)
- `equipment_type` (optional)
- `segment_ids` (optional: comma-separated)

**Response:**
```json
{
  "lane": {
    "origin": {
      "location_id": "uuid",
      "name": "Chicago Distribution Center",
      "city": "Chicago",
      "state": "IL"
    },
    "destination": {
      "location_id": "uuid",
      "name": "Atlanta Warehouse",
      "city": "Atlanta",
      "state": "GA"
    }
  },
  "time_period": {
    "start": "2024-10-01T00:00:00Z",
    "end": "2024-12-31T23:59:59Z"
  },
  "metrics": {
    "volume": {
      "total_loads": 247,
      "shipments": 235,
      "tenders": 12
    },
    "cost": {
      "avg_cost_per_mile": 2.68,
      "min_cost_per_mile": 2.15,
      "max_cost_per_mile": 3.42,
      "cost_consistency_cv": 12.3,
      "total_spend": 827450.00,
      "currency": "USD"
    },
    "performance": {
      "otp_exact": 87.2,
      "otp_15min": 92.5,
      "otp_60min": 96.1,
      "otd_exact": 84.3,
      "otd_15min": 91.8,
      "avg_dwell_time_pickup": 72,
      "avg_dwell_time_delivery": 95
    },
    "tender": {
      "acceptance_rate": 89.5,
      "avg_response_time_hours": 3.2,
      "ftar": 76.3
    }
  },
  "segments_applied": ["seg_no_shipper_fault", "seg_no_test_loads"],
  "calculation_timestamp": "2024-12-27T10:00:00Z"
}
```

---

#### Get Carrier Metrics
```
GET /api/v1/carriers/{carrier_id}/metrics
```

**Query Parameters:**
- `start_date` (required)
- `end_date` (required)
- `lane_id` (optional: filter to specific lane)
- `mode` (optional)
- `segment_ids` (optional)

**Response:**
```json
{
  "carrier": {
    "carrier_id": "uuid",
    "scac": "XPDL",
    "name": "XPO Logistics"
  },
  "time_period": {
    "start": "2024-10-01T00:00:00Z",
    "end": "2024-12-31T23:59:59Z"
  },
  "metrics": {
    "volume": {
      "total_loads": 1847,
      "total_tenders": 2165
    },
    "performance": {
      "otp_exact": 91.3,
      "otp_15min": 95.7,
      "otd_exact": 88.9,
      "otd_15min": 94.2,
      "avg_dwell_time": 78
    },
    "tender": {
      "acceptance_rate": 85.3,
      "rejection_rate": 14.7,
      "avg_response_time_hours": 2.8
    },
    "cost": {
      "avg_cost_per_mile": 2.92,
      "cost_index": 108.9,
      "total_spend": 5423890.00,
      "currency": "USD"
    }
  },
  "top_lanes": [
    {
      "origin": "Chicago, IL",
      "destination": "Atlanta, GA",
      "load_count": 247,
      "otp_exact": 93.1,
      "avg_cpm": 2.68
    }
  ],
  "segments_applied": ["seg_no_shipper_fault"],
  "calculation_timestamp": "2024-12-27T10:00:00Z"
}
```

---

#### Query Custom Metrics
```
POST /api/v1/metrics/query
```

**Request:**
```json
{
  "metric_ids": ["metric_001", "metric_002"],
  "entity_type": "LOAD",
  "filters": {
    "load_status": "DELIVERED",
    "mode": "TRUCKLOAD",
    "date_range": {
      "start": "2024-10-01T00:00:00Z",
      "end": "2024-12-31T23:59:59Z"
    }
  },
  "group_by": ["carrier_id", "lane"],
  "segment_ids": ["seg_no_test_loads"],
  "include_breakdowns": true
}
```

**Response:**
```json
{
  "results": [
    {
      "group_key": {
        "carrier_id": "uuid",
        "lane": "CHI-ATL"
      },
      "metrics": {
        "metric_001": {
          "value": 2.74,
          "unit": "USD/MILE"
        },
        "metric_002": {
          "value": 91.3,
          "unit": "PERCENTAGE"
        }
      },
      "entity_count": 247
    }
  ],
  "segments_applied": ["seg_no_test_loads"],
  "calculation_timestamp": "2024-12-27T10:00:00Z"
}
```

---

### 4.2 Bulk Metrics Calculation

For scheduled reporting and analytics, bulk calculation endpoints:

```
POST /api/v1/metrics/calculate-bulk
```

**Request:**
```json
{
  "calculation_job_name": "Weekly Carrier Scorecard",
  "metric_ids": ["otp_exact", "otd_15min", "acceptance_rate"],
  "entity_type": "CARRIER",
  "entity_ids": ["carrier_001", "carrier_002"],
  "time_period": {
    "start": "2024-12-01T00:00:00Z",
    "end": "2024-12-31T23:59:59Z"
  },
  "segment_ids": ["seg_no_shipper_fault"],
  "output_format": "JSON",
  "delivery": {
    "type": "S3",
    "bucket": "metrics-exports",
    "key": "weekly-scorecards/2024-W52.json"
  }
}
```

---

### 4.3 Real-Time Metric Streaming

For dashboard updates and alerting:

```
WebSocket: wss://api.emerge.com/v1/metrics/stream
```

**Subscribe Message:**
```json
{
  "action": "subscribe",
  "metric_ids": ["otp_exact"],
  "entity_type": "CARRIER",
  "entity_ids": ["carrier_001"],
  "update_frequency": "5_MINUTES"
}
```

**Stream Message:**
```json
{
  "event": "metric_update",
  "timestamp": "2024-12-27T10:05:00Z",
  "entity_type": "CARRIER",
  "entity_id": "carrier_001",
  "metric_id": "otp_exact",
  "value": 91.5,
  "previous_value": 91.3,
  "change": 0.2
}
```

---

## 5. Technical Implementation

### 5.1 Data Architecture

#### Metrics Storage

**metrics_definitions** table
```sql
CREATE TABLE metrics_definitions (
  metric_id UUID PRIMARY KEY,
  metric_code VARCHAR(100) UNIQUE NOT NULL,
  metric_name VARCHAR(255) NOT NULL,
  description TEXT,
  formula JSONB NOT NULL,
  return_type VARCHAR(50),
  unit VARCHAR(50),
  precision INTEGER,
  is_baseline BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(user_id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

**segments** table
```sql
CREATE TABLE segments (
  segment_id UUID PRIMARY KEY,
  segment_code VARCHAR(100) UNIQUE NOT NULL,
  segment_name VARCHAR(255) NOT NULL,
  description TEXT,
  segment_type VARCHAR(20) CHECK (segment_type IN ('INCLUSION', 'EXCLUSION')),
  applies_to VARCHAR(50)[] NOT NULL, -- ['LOAD', 'STOP', 'TENDER']
  rules JSONB NOT NULL,
  auto_apply BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(user_id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

**metric_segment_associations** table
```sql
CREATE TABLE metric_segment_associations (
  association_id UUID PRIMARY KEY,
  metric_id UUID REFERENCES metrics_definitions(metric_id),
  segment_id UUID REFERENCES segments(segment_id),
  is_required BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(metric_id, segment_id)
);
```

---

**transaction_overrides** table
```sql
CREATE TABLE transaction_overrides (
  override_id UUID PRIMARY KEY,
  entity_id UUID NOT NULL,
  entity_type VARCHAR(20) NOT NULL, -- 'LOAD', 'STOP', 'TENDER'
  segment_id UUID REFERENCES segments(segment_id),
  override_action VARCHAR(20) CHECK (override_action IN ('INCLUDE', 'EXCLUDE')),
  reason TEXT,
  applied_by UUID REFERENCES users(user_id),
  applied_at TIMESTAMP DEFAULT NOW(),
  effective_from TIMESTAMP,
  effective_to TIMESTAMP,
  INDEX idx_entity_lookup (entity_id, entity_type)
);
```

---

**calculated_metrics** table (materialized cache)
```sql
CREATE TABLE calculated_metrics (
  calculation_id UUID PRIMARY KEY,
  metric_id UUID REFERENCES metrics_definitions(metric_id),
  entity_type VARCHAR(20) NOT NULL,
  entity_id UUID NOT NULL,
  value DECIMAL(20, 4),
  unit VARCHAR(50),
  segments_applied UUID[],
  calculation_timestamp TIMESTAMP DEFAULT NOW(),
  valid_until TIMESTAMP,
  INDEX idx_entity_metric (entity_id, entity_type, metric_id),
  INDEX idx_calculation_time (calculation_timestamp)
);
```

---

### 5.2 Calculation Engine

#### Processing Pipeline

**Step 1: Data Retrieval**
- Query base entities (loads, stops, tenders)
- Apply date range filters
- Apply entity filters (mode, equipment, carrier)

**Step 2: Segment Application**
- Load active segments for requested metrics
- Evaluate segment rules against entities
- Apply transaction-level overrides
- Generate filtered dataset

**Step 3: Metric Calculation**
- Parse formula AST (Abstract Syntax Tree)
- Execute calculations
- Handle NULL/UNKNOWN values
- Apply precision rules

**Step 4: Result Aggregation**
- Group by dimensions if requested
- Calculate aggregated metrics
- Generate comparison deltas

**Step 5: Caching**
- Store in calculated_metrics table
- Set TTL based on data volatility
- Tag with applied segments for cache invalidation

---

### 5.3 Performance Optimizations

**1. Pre-calculated Stop Metrics**
- Store common stop metrics (OTP variants, dwell time) at ingestion
- Denormalize into `stops` table for fast retrieval
- Update only when recalculation needed

**2. Materialized Views**
- Lane-level metrics (updated daily)
- Carrier scorecards (updated hourly)
- Location performance (updated daily)

**3. Segment Result Caching**
- Cache segment evaluation results
- Invalidate on segment rule changes
- Invalidate on transaction override additions

**4. Query Optimization**
- Partition tables by date
- Index on common filter fields
- Use covering indexes for metric queries

---

### 5.4 Validation & Audit

#### Calculation Validation

**Sanity Checks:**
- Percentages must be 0-100
- Costs must be non-negative
- Dwell times must be positive
- Response times must be positive

**Confidence Scoring:**
```json
{
  "metric_value": 91.3,
  "confidence": {
    "score": 0.95,
    "factors": {
      "sample_size": "HIGH",
      "data_completeness": 0.98,
      "data_quality": 0.94,
      "segment_coverage": 0.96
    }
  }
}
```

**Audit Trail:**
```sql
CREATE TABLE metric_calculation_audit (
  audit_id UUID PRIMARY KEY,
  calculation_id UUID REFERENCES calculated_metrics(calculation_id),
  metric_id UUID,
  entity_id UUID,
  formula_used JSONB,
  segments_applied UUID[],
  input_data_snapshot JSONB,
  calculation_steps JSONB,
  calculated_by VARCHAR(100), -- 'system' or user_id
  calculated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 6. User Interface Requirements

### 6.1 Metrics Dashboard

**Views:**
1. **Overview Dashboard**
   - High-level KPIs (OTP, OTD, Tender Acceptance)
   - Trend charts (7-day, 30-day, 90-day)
   - Comparison to previous periods
   - Alert notifications

2. **Lane Analysis**
   - Lane volume heatmap
   - Cost variance by lane
   - Performance by lane
   - Carrier distribution

3. **Carrier Scorecards**
   - Tabular view of all carriers
   - Sort by any metric
   - Drill down to lane-level performance
   - Historical trend charts

4. **Custom Metrics**
   - User-created metrics display
   - Formula preview
   - Edit/clone functionality

---

### 6.2 Formula Builder UI

**Interface Components:**

1. **Canvas Area**
   - Drag-and-drop components
   - Visual formula tree
   - Connection lines between operations
   - Color-coded by operation type

2. **Component Palette**
   - Fields (organized by entity)
   - Operators
   - Functions
   - Constants

3. **Properties Panel**
   - Component-specific settings
   - Type information
   - Validation messages
   - Help text

4. **Test Panel**
   - Sample data input
   - Calculation preview
   - Step-by-step execution trace
   - Historical test cases

---

### 6.3 Segment Manager UI

**Interface Components:**

1. **Segment List View**
   - All segments with status
   - Affected metrics count
   - Last applied timestamp
   - Active/inactive toggle

2. **Segment Builder**
   - Rule builder (similar to formula builder)
   - Metric association selector
   - Preview impacted records
   - Estimated metric changes

3. **Override Manager**
   - Search/filter transactions
   - Bulk override actions
   - Override history
   - Audit trail

4. **Impact Analysis**
   - Before/after metric comparison
   - Affected entity counts
   - Visualization of changes
   - Export reports

---

## 7. Integration Points

### 7.1 Data Ingestion

**Load Creation Webhook:**
- Trigger metric calculations on load creation
- Calculate and store shipment-level metrics
- Calculate and store stop-level metrics
- Invalidate lane/carrier metric caches

**Load Update Webhook:**
- Recalculate affected metrics
- Update materialized views
- Send metric change notifications

---

### 7.2 External Systems

**TMS Integration:**
- Pull load/tender data
- Push calculated metrics back
- Sync segment rules
- Real-time metric updates

**BI Tools Integration:**
- SQL views for Tableau/PowerBI
- REST API for custom dashboards
- Scheduled metric exports
- Webhook notifications for metric changes

---

## 8. Success Metrics

### 8.1 System Performance

- API response time < 200ms (p95)
- Metric calculation time < 5s for single entity
- Bulk calculation throughput > 1000 loads/second
- Cache hit rate > 90%

---

### 8.2 User Adoption

- Active custom metrics created
- Segments defined per customer
- API calls per day
- Dashboard views per user per day

---

### 8.3 Business Impact

- Reduction in manual metric calculation time
- Improved data consistency across teams
- Faster identification of performance issues
- Better carrier performance visibility

---

## 9. Implementation Phases

### Phase 1: Foundation (Weeks 1-4)
- ✅ Baseline metrics implementation
- ✅ Basic segment system
- ✅ Load/lane/carrier metrics APIs
- ✅ Simple dashboard UI

### Phase 2: Customization (Weeks 5-8)
- ✅ Formula builder backend
- ✅ Formula builder UI
- ✅ Advanced segment rules
- ✅ Transaction override system

### Phase 3: Scale & Optimize (Weeks 9-12)
- ✅ Caching layer
- ✅ Materialized views
- ✅ Bulk calculation jobs
- ✅ Real-time streaming

### Phase 4: Advanced Features (Weeks 13-16)
- ✅ Predictive metrics
- ✅ Anomaly detection
- ✅ Auto-segmentation suggestions
- ✅ Advanced analytics

---

## 10. Open Questions & Decisions Needed

1. **Historical Recalculation:** Should changing a segment or metric definition trigger recalculation of historical data?

2. **Metric Versioning:** How do we version metric definitions when formulas change?

3. **Conflict Resolution:** What happens when transaction overrides conflict with segment rules?

4. **Performance vs. Flexibility:** Where do we draw the line on formula complexity for real-time calculations?

5. **Multi-Tenancy:** How do we handle metric definitions shared across multiple shippers vs. private metrics?

---

## Appendix A: Metric Naming Conventions

**Pattern:** `{category}_{subcategory}_{variant}`

Examples:
- `otp_pickup_exact`
- `otp_pickup_15min`
- `otd_delivery_60min`
- `cost_linehaul_per_mile`
- `tender_acceptance_rate`

---

## Appendix B: API Rate Limits

- Public API: 100 requests/minute per API key
- Bulk calculation: 10 jobs/hour per customer
- WebSocket streams: 5 concurrent connections per API key

---

## Appendix C: Glossary

**OTP (On-Time Pickup):** Percentage of pickup stops completed on time
**OTD (On-Time Delivery):** Percentage of delivery stops completed on time
**CPM (Cost Per Mile):** Cost divided by distance traveled
**FTAR (First Tender Acceptance Rate):** Percentage of loads awarded on first tender
**Dwell Time:** Time spent at a stop from arrival to departure
**Segment:** Rule-based filter for metric eligibility
**Override:** Manual exception to segment rules for specific transactions

---

## Document Control

**Version:** 1.0
**Last Updated:** December 27, 2024
**Owner:** Product Team
**Reviewers:** Engineering, Data Science, Customer Success
**Status:** Draft for Review
