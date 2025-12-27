# Sample Data for Metrics & Segmentation Prototype

This file contains realistic sample data for testing the metrics and segmentation UI prototype.

---

## 1. Sample Locations

```json
[
  {
    "location_id": "loc_chi_dc_01",
    "location_code": "CHI-DC-01",
    "name": "Chicago Distribution Center",
    "address1": "4500 Industrial Parkway",
    "address2": "Dock 15-20",
    "city": "Chicago",
    "state": "IL",
    "postal_code": "60609",
    "country_code": "US",
    "latitude": 41.8781,
    "longitude": -87.6298,
    "type": "WAREHOUSE"
  },
  {
    "location_id": "loc_atl_wh_03",
    "location_code": "ATL-WH-03",
    "name": "Atlanta Warehouse Facility",
    "address1": "2800 Commerce Boulevard",
    "address2": "Building B, Dock 5",
    "city": "Atlanta",
    "state": "GA",
    "postal_code": "30318",
    "country_code": "US",
    "latitude": 33.749,
    "longitude": -84.388,
    "type": "WAREHOUSE"
  },
  {
    "location_id": "loc_dal_fc_01",
    "location_code": "DAL-FC-01",
    "name": "Dallas Fulfillment Center",
    "address1": "1250 Logistics Drive",
    "city": "Dallas",
    "state": "TX",
    "postal_code": "75241",
    "country_code": "US",
    "latitude": 32.7767,
    "longitude": -96.7970,
    "type": "FULFILLMENT_CENTER"
  },
  {
    "location_id": "loc_lax_port_02",
    "location_code": "LAX-PORT-02",
    "name": "Los Angeles Port Terminal",
    "address1": "Berth 214, Terminal Island",
    "city": "Los Angeles",
    "state": "CA",
    "postal_code": "90731",
    "country_code": "US",
    "latitude": 33.7367,
    "longitude": -118.2707,
    "type": "PORT"
  },
  {
    "location_id": "loc_nyc_wh_05",
    "location_code": "NYC-WH-05",
    "name": "New Jersey Distribution Hub",
    "address1": "550 Distribution Way",
    "city": "Newark",
    "state": "NJ",
    "postal_code": "07114",
    "country_code": "US",
    "latitude": 40.7357,
    "longitude": -74.1724,
    "type": "WAREHOUSE"
  }
]
```

---

## 2. Sample Carriers

```json
[
  {
    "carrier_id": "carrier_xpo_001",
    "scac": "XPDL",
    "name": "XPO Logistics",
    "carrier_type": "ASSET",
    "contract_type": "CONTRACT_PRIMARY",
    "active": true
  },
  {
    "carrier_id": "carrier_sch_001",
    "scac": "SCHO",
    "name": "Schneider National",
    "carrier_type": "ASSET",
    "contract_type": "CONTRACT_PRIMARY",
    "active": true
  },
  {
    "carrier_id": "carrier_jbt_001",
    "scac": "JBTC",
    "name": "JB Hunt Transport",
    "carrier_type": "ASSET",
    "contract_type": "CONTRACT_PRIMARY",
    "active": true
  },
  {
    "carrier_id": "carrier_kwk_001",
    "scac": "KWKE",
    "name": "Knight-Swift Transportation",
    "carrier_type": "ASSET",
    "contract_type": "CONTRACT_BACKUP",
    "active": true
  },
  {
    "carrier_id": "carrier_odfl_001",
    "scac": "ODFL",
    "name": "Old Dominion Freight Line",
    "carrier_type": "ASSET",
    "contract_type": "CONTRACT_PRIMARY",
    "active": true
  }
]
```

---

## 3. Sample Loads (Shipments & Tenders)

```json
[
  {
    "load_id": "load_001",
    "load_type": "SHIPMENT",
    "load_status": "DELIVERED",
    "mode": "TRUCKLOAD",
    "equipment_type": "Dry Van 53'",
    "external_shipment_id": "SHIP-2024-08472",
    "external_tender_id": "TND-2024-08472-001",
    "carrier": {
      "carrier_id": "carrier_xpo_001",
      "scac": "XPDL",
      "name": "XPO Logistics"
    },
    "contract_type": "CONTRACT_PRIMARY",
    "length_of_haul": {
      "value": 715.3,
      "unit": "MILES"
    },
    "charges": {
      "line_items": [
        {"charge_type": "LINE_HAUL", "amount": {"currency": "USD", "value": 1850.00}},
        {"charge_type": "FUEL_SURCHARGE", "amount": {"currency": "USD", "value": 285.50}}
      ]
    },
    "tender": {
      "tendered_at": "2024-12-10T08:15:00Z",
      "accepted_at": "2024-12-10T09:42:00Z",
      "status": "ACCEPTED"
    },
    "stops": [
      {
        "stop_id": "stop_001_01",
        "sequence": 1,
        "stop_type": "PICKUP",
        "loading_type": "LIVE",
        "location": {
          "location_id": "loc_chi_dc_01",
          "location_code": "CHI-DC-01",
          "name": "Chicago Distribution Center",
          "city": "Chicago",
          "state": "IL"
        },
        "appointment": {
          "type": "APPOINTMENT",
          "scheduled_earliest": "2024-12-12T08:00:00Z",
          "scheduled_latest": "2024-12-12T08:00:00Z",
          "original_earliest": "2024-12-12T08:00:00Z",
          "original_latest": "2024-12-12T08:00:00Z"
        },
        "actual": {
          "arrival": "2024-12-12T07:52:00Z",
          "departure": "2024-12-12T09:15:00Z"
        },
        "late_reason": null
      },
      {
        "stop_id": "stop_001_02",
        "sequence": 2,
        "stop_type": "DELIVERY",
        "loading_type": "LIVE",
        "location": {
          "location_id": "loc_atl_wh_03",
          "location_code": "ATL-WH-03",
          "name": "Atlanta Warehouse Facility",
          "city": "Atlanta",
          "state": "GA"
        },
        "appointment": {
          "type": "WINDOW",
          "scheduled_earliest": "2024-12-13T14:00:00Z",
          "scheduled_latest": "2024-12-13T18:00:00Z",
          "original_earliest": "2024-12-13T14:00:00Z",
          "original_latest": "2024-12-13T18:00:00Z"
        },
        "actual": {
          "arrival": "2024-12-13T15:22:00Z",
          "departure": "2024-12-13T16:45:00Z"
        },
        "late_reason": null
      }
    ],
    "metadata": {
      "created_at": "2024-12-10T08:00:00Z",
      "is_test": false
    }
  },
  {
    "load_id": "load_002",
    "load_type": "SHIPMENT",
    "load_status": "DELIVERED",
    "mode": "TRUCKLOAD",
    "equipment_type": "Dry Van 53'",
    "external_shipment_id": "SHIP-2024-08473",
    "external_tender_id": "TND-2024-08473-001",
    "carrier": {
      "carrier_id": "carrier_sch_001",
      "scac": "SCHO",
      "name": "Schneider National"
    },
    "contract_type": "CONTRACT_PRIMARY",
    "length_of_haul": {
      "value": 715.3,
      "unit": "MILES"
    },
    "charges": {
      "line_items": [
        {"charge_type": "LINE_HAUL", "amount": {"currency": "USD", "value": 1925.00}},
        {"charge_type": "FUEL_SURCHARGE", "amount": {"currency": "USD", "value": 295.00}},
        {"charge_type": "DETENTION", "amount": {"currency": "USD", "value": 150.00}}
      ]
    },
    "tender": {
      "tendered_at": "2024-12-11T10:20:00Z",
      "accepted_at": "2024-12-11T11:05:00Z",
      "status": "ACCEPTED"
    },
    "stops": [
      {
        "stop_id": "stop_002_01",
        "sequence": 1,
        "stop_type": "PICKUP",
        "loading_type": "LIVE",
        "location": {
          "location_id": "loc_chi_dc_01",
          "location_code": "CHI-DC-01",
          "name": "Chicago Distribution Center",
          "city": "Chicago",
          "state": "IL"
        },
        "appointment": {
          "type": "APPOINTMENT",
          "scheduled_earliest": "2024-12-13T10:00:00Z",
          "scheduled_latest": "2024-12-13T10:00:00Z",
          "original_earliest": "2024-12-13T10:00:00Z",
          "original_latest": "2024-12-13T10:00:00Z"
        },
        "actual": {
          "arrival": "2024-12-13T11:15:00Z",
          "departure": "2024-12-13T13:45:00Z"
        },
        "late_reason": {
          "code": "SHIPPER_NOT_READY",
          "description": "Dock was not ready, freight still being staged",
          "responsible_party": "SHIPPER",
          "reported_at": "2024-12-13T11:15:00Z"
        }
      },
      {
        "stop_id": "stop_002_02",
        "sequence": 2,
        "stop_type": "DELIVERY",
        "loading_type": "LIVE",
        "location": {
          "location_id": "loc_atl_wh_03",
          "location_code": "ATL-WH-03",
          "name": "Atlanta Warehouse Facility",
          "city": "Atlanta",
          "state": "GA"
        },
        "appointment": {
          "type": "WINDOW",
          "scheduled_earliest": "2024-12-14T08:00:00Z",
          "scheduled_latest": "2024-12-14T12:00:00Z",
          "original_earliest": "2024-12-14T08:00:00Z",
          "original_latest": "2024-12-14T12:00:00Z"
        },
        "actual": {
          "arrival": "2024-12-14T09:30:00Z",
          "departure": "2024-12-14T10:15:00Z"
        },
        "late_reason": null
      }
    ],
    "metadata": {
      "created_at": "2024-12-11T10:00:00Z",
      "is_test": false
    }
  },
  {
    "load_id": "load_003",
    "load_type": "SHIPMENT",
    "load_status": "DELIVERED",
    "mode": "TRUCKLOAD",
    "equipment_type": "Dry Van 53'",
    "external_shipment_id": "SHIP-2024-08474",
    "external_tender_id": "TND-2024-08474-001",
    "carrier": {
      "carrier_id": "carrier_jbt_001",
      "scac": "JBTC",
      "name": "JB Hunt Transport"
    },
    "contract_type": "CONTRACT_PRIMARY",
    "length_of_haul": {
      "value": 715.3,
      "unit": "MILES"
    },
    "charges": {
      "line_items": [
        {"charge_type": "LINE_HAUL", "amount": {"currency": "USD", "value": 1875.00}},
        {"charge_type": "FUEL_SURCHARGE", "amount": {"currency": "USD", "value": 288.00}}
      ]
    },
    "tender": {
      "tendered_at": "2024-12-12T14:30:00Z",
      "accepted_at": "2024-12-12T15:15:00Z",
      "status": "ACCEPTED"
    },
    "stops": [
      {
        "stop_id": "stop_003_01",
        "sequence": 1,
        "stop_type": "PICKUP",
        "loading_type": "LIVE",
        "location": {
          "location_id": "loc_chi_dc_01",
          "location_code": "CHI-DC-01",
          "name": "Chicago Distribution Center",
          "city": "Chicago",
          "state": "IL"
        },
        "appointment": {
          "type": "APPOINTMENT",
          "scheduled_earliest": "2024-12-14T06:00:00Z",
          "scheduled_latest": "2024-12-14T06:00:00Z",
          "original_earliest": "2024-12-14T06:00:00Z",
          "original_latest": "2024-12-14T06:00:00Z"
        },
        "actual": {
          "arrival": "2024-12-14T06:18:00Z",
          "departure": "2024-12-14T07:30:00Z"
        },
        "late_reason": {
          "code": "TRAFFIC_DELAY",
          "description": "I-94 accident caused 18 minute delay",
          "responsible_party": "CARRIER",
          "reported_at": "2024-12-14T06:18:00Z"
        }
      },
      {
        "stop_id": "stop_003_02",
        "sequence": 2,
        "stop_type": "DELIVERY",
        "loading_type": "LIVE",
        "location": {
          "location_id": "loc_atl_wh_03",
          "location_code": "ATL-WH-03",
          "name": "Atlanta Warehouse Facility",
          "city": "Atlanta",
          "state": "GA"
        },
        "appointment": {
          "type": "WINDOW",
          "scheduled_earliest": "2024-12-15T10:00:00Z",
          "scheduled_latest": "2024-12-15T14:00:00Z",
          "original_earliest": "2024-12-15T10:00:00Z",
          "original_latest": "2024-12-15T14:00:00Z"
        },
        "actual": {
          "arrival": "2024-12-15T10:45:00Z",
          "departure": "2024-12-15T12:00:00Z"
        },
        "late_reason": null
      }
    ],
    "metadata": {
      "created_at": "2024-12-12T14:00:00Z",
      "is_test": false
    }
  },
  {
    "load_id": "load_004",
    "load_type": "TENDER",
    "load_status": "REJECTED",
    "mode": "TRUCKLOAD",
    "equipment_type": "Dry Van 53'",
    "external_tender_id": "TND-2024-08475-001",
    "carrier": {
      "carrier_id": "carrier_xpo_001",
      "scac": "XPDL",
      "name": "XPO Logistics"
    },
    "contract_type": "CONTRACT_PRIMARY",
    "length_of_haul": {
      "value": 715.3,
      "unit": "MILES"
    },
    "tender": {
      "tendered_at": "2024-12-13T09:00:00Z",
      "rejected_at": "2024-12-13T09:30:00Z",
      "status": "REJECTED",
      "rejection_reason": "No available trucks in pickup area"
    },
    "stops": [
      {
        "stop_id": "stop_004_01",
        "sequence": 1,
        "stop_type": "PICKUP",
        "loading_type": "LIVE",
        "location": {
          "location_id": "loc_chi_dc_01",
          "location_code": "CHI-DC-01",
          "name": "Chicago Distribution Center",
          "city": "Chicago",
          "state": "IL"
        },
        "appointment": {
          "type": "APPOINTMENT",
          "scheduled_earliest": "2024-12-15T08:00:00Z",
          "scheduled_latest": "2024-12-15T08:00:00Z"
        }
      },
      {
        "stop_id": "stop_004_02",
        "sequence": 2,
        "stop_type": "DELIVERY",
        "loading_type": "LIVE",
        "location": {
          "location_id": "loc_atl_wh_03",
          "location_code": "ATL-WH-03",
          "name": "Atlanta Warehouse Facility",
          "city": "Atlanta",
          "state": "GA"
        },
        "appointment": {
          "type": "WINDOW",
          "scheduled_earliest": "2024-12-16T10:00:00Z",
          "scheduled_latest": "2024-12-16T14:00:00Z"
        }
      }
    ],
    "metadata": {
      "created_at": "2024-12-13T08:45:00Z",
      "is_test": false
    }
  },
  {
    "load_id": "load_005",
    "load_type": "SHIPMENT",
    "load_status": "DELIVERED",
    "mode": "TRUCKLOAD",
    "equipment_type": "Dry Van 53'",
    "external_shipment_id": "SHIP-2024-08476",
    "external_tender_id": "TND-2024-08476-001",
    "carrier": {
      "carrier_id": "carrier_kwk_001",
      "scac": "KWKE",
      "name": "Knight-Swift Transportation"
    },
    "contract_type": "CONTRACT_BACKUP",
    "length_of_haul": {
      "value": 715.3,
      "unit": "MILES"
    },
    "charges": {
      "line_items": [
        {"charge_type": "LINE_HAUL", "amount": {"currency": "USD", "value": 2150.00}},
        {"charge_type": "FUEL_SURCHARGE", "amount": {"currency": "USD", "value": 330.00}}
      ]
    },
    "tender": {
      "tendered_at": "2024-12-13T10:15:00Z",
      "accepted_at": "2024-12-13T10:45:00Z",
      "status": "ACCEPTED"
    },
    "stops": [
      {
        "stop_id": "stop_005_01",
        "sequence": 1,
        "stop_type": "PICKUP",
        "loading_type": "LIVE",
        "location": {
          "location_id": "loc_chi_dc_01",
          "location_code": "CHI-DC-01",
          "name": "Chicago Distribution Center",
          "city": "Chicago",
          "state": "IL"
        },
        "appointment": {
          "type": "APPOINTMENT",
          "scheduled_earliest": "2024-12-15T08:00:00Z",
          "scheduled_latest": "2024-12-15T08:00:00Z",
          "original_earliest": "2024-12-15T08:00:00Z",
          "original_latest": "2024-12-15T08:00:00Z"
        },
        "actual": {
          "arrival": "2024-12-15T07:55:00Z",
          "departure": "2024-12-15T09:10:00Z"
        },
        "late_reason": null
      },
      {
        "stop_id": "stop_005_02",
        "sequence": 2,
        "stop_type": "DELIVERY",
        "loading_type": "LIVE",
        "location": {
          "location_id": "loc_atl_wh_03",
          "location_code": "ATL-WH-03",
          "name": "Atlanta Warehouse Facility",
          "city": "Atlanta",
          "state": "GA"
        },
        "appointment": {
          "type": "WINDOW",
          "scheduled_earliest": "2024-12-16T10:00:00Z",
          "scheduled_latest": "2024-12-16T14:00:00Z",
          "original_earliest": "2024-12-16T10:00:00Z",
          "original_latest": "2024-12-16T14:00:00Z"
        },
        "actual": {
          "arrival": "2024-12-16T11:20:00Z",
          "departure": "2024-12-16T12:35:00Z"
        },
        "late_reason": null
      }
    ],
    "metadata": {
      "created_at": "2024-12-13T10:00:00Z",
      "is_test": false
    }
  },
  {
    "load_id": "load_006",
    "load_type": "SHIPMENT",
    "load_status": "DELIVERED",
    "mode": "TRUCKLOAD",
    "equipment_type": "Dry Van 53'",
    "external_shipment_id": "SHIP-2024-08477",
    "external_tender_id": "TND-2024-08477-001",
    "carrier": {
      "carrier_id": "carrier_xpo_001",
      "scac": "XPDL",
      "name": "XPO Logistics"
    },
    "contract_type": "CONTRACT_PRIMARY",
    "length_of_haul": {
      "value": 1247.5,
      "unit": "MILES"
    },
    "charges": {
      "line_items": [
        {"charge_type": "LINE_HAUL", "amount": {"currency": "USD", "value": 3420.00}},
        {"charge_type": "FUEL_SURCHARGE", "amount": {"currency": "USD", "value": 412.00}}
      ]
    },
    "tender": {
      "tendered_at": "2024-12-15T10:15:00Z",
      "accepted_at": "2024-12-15T11:45:00Z",
      "status": "ACCEPTED"
    },
    "stops": [
      {
        "stop_id": "stop_006_01",
        "sequence": 1,
        "stop_type": "PICKUP",
        "loading_type": "LIVE",
        "location": {
          "location_id": "loc_chi_dc_01",
          "location_code": "CHI-DC-01",
          "name": "Chicago Distribution Center",
          "city": "Chicago",
          "state": "IL"
        },
        "appointment": {
          "type": "APPOINTMENT",
          "scheduled_earliest": "2024-12-17T06:00:00Z",
          "scheduled_latest": "2024-12-17T06:00:00Z",
          "original_earliest": "2024-12-17T06:00:00Z",
          "original_latest": "2024-12-17T06:00:00Z"
        },
        "actual": {
          "arrival": "2024-12-17T05:52:00Z",
          "departure": "2024-12-17T07:15:00Z"
        },
        "late_reason": null
      },
      {
        "stop_id": "stop_006_02",
        "sequence": 2,
        "stop_type": "DELIVERY",
        "loading_type": "DROP",
        "location": {
          "location_id": "loc_dal_fc_01",
          "location_code": "DAL-FC-01",
          "name": "Dallas Fulfillment Center",
          "city": "Dallas",
          "state": "TX"
        },
        "appointment": {
          "type": "WINDOW",
          "scheduled_earliest": "2024-12-18T14:00:00Z",
          "scheduled_latest": "2024-12-18T18:00:00Z",
          "original_earliest": "2024-12-18T14:00:00Z",
          "original_latest": "2024-12-18T18:00:00Z"
        },
        "actual": {
          "arrival": "2024-12-18T16:30:00Z",
          "departure": "2024-12-18T16:45:00Z"
        },
        "late_reason": null
      }
    ],
    "metadata": {
      "created_at": "2024-12-15T10:00:00Z",
      "is_test": false
    }
  },
  {
    "load_id": "load_007",
    "load_type": "SHIPMENT",
    "load_status": "DELIVERED",
    "mode": "TRUCKLOAD",
    "equipment_type": "Refrigerated 53'",
    "external_shipment_id": "SHIP-2024-08478",
    "external_tender_id": "TND-2024-08478-001",
    "carrier": {
      "carrier_id": "carrier_odfl_001",
      "scac": "ODFL",
      "name": "Old Dominion Freight Line"
    },
    "contract_type": "CONTRACT_PRIMARY",
    "length_of_haul": {
      "value": 2789.4,
      "unit": "MILES"
    },
    "charges": {
      "line_items": [
        {"charge_type": "LINE_HAUL", "amount": {"currency": "USD", "value": 7850.00}},
        {"charge_type": "FUEL_SURCHARGE", "amount": {"currency": "USD", "value": 945.00}}
      ]
    },
    "tender": {
      "tendered_at": "2024-12-16T08:00:00Z",
      "accepted_at": "2024-12-16T09:20:00Z",
      "status": "ACCEPTED"
    },
    "stops": [
      {
        "stop_id": "stop_007_01",
        "sequence": 1,
        "stop_type": "PICKUP",
        "loading_type": "LIVE",
        "location": {
          "location_id": "loc_lax_port_02",
          "location_code": "LAX-PORT-02",
          "name": "Los Angeles Port Terminal",
          "city": "Los Angeles",
          "state": "CA"
        },
        "appointment": {
          "type": "WINDOW",
          "scheduled_earliest": "2024-12-18T10:00:00Z",
          "scheduled_latest": "2024-12-18T16:00:00Z",
          "original_earliest": "2024-12-18T10:00:00Z",
          "original_latest": "2024-12-18T16:00:00Z"
        },
        "actual": {
          "arrival": "2024-12-18T13:45:00Z",
          "departure": "2024-12-18T15:30:00Z"
        },
        "late_reason": null
      },
      {
        "stop_id": "stop_007_02",
        "sequence": 2,
        "stop_type": "DELIVERY",
        "loading_type": "LIVE",
        "location": {
          "location_id": "loc_nyc_wh_05",
          "location_code": "NYC-WH-05",
          "name": "New Jersey Distribution Hub",
          "city": "Newark",
          "state": "NJ"
        },
        "appointment": {
          "type": "APPOINTMENT",
          "scheduled_earliest": "2024-12-22T08:00:00Z",
          "scheduled_latest": "2024-12-22T08:00:00Z",
          "original_earliest": "2024-12-22T08:00:00Z",
          "original_latest": "2024-12-22T08:00:00Z"
        },
        "actual": {
          "arrival": "2024-12-22T07:45:00Z",
          "departure": "2024-12-22T09:20:00Z"
        },
        "late_reason": null
      }
    ],
    "metadata": {
      "created_at": "2024-12-16T07:45:00Z",
      "is_test": false
    }
  },
  {
    "load_id": "load_008",
    "load_type": "SHIPMENT",
    "load_status": "DELIVERED",
    "mode": "TRUCKLOAD",
    "equipment_type": "Dry Van 53'",
    "external_shipment_id": "TEST-2024-00001",
    "external_tender_id": "TEST-TND-2024-00001",
    "carrier": {
      "carrier_id": "carrier_sch_001",
      "scac": "SCHO",
      "name": "Schneider National"
    },
    "contract_type": "CONTRACT_PRIMARY",
    "length_of_haul": {
      "value": 50.0,
      "unit": "MILES"
    },
    "charges": {
      "line_items": [
        {"charge_type": "LINE_HAUL", "amount": {"currency": "USD", "value": 200.00}},
        {"charge_type": "FUEL_SURCHARGE", "amount": {"currency": "USD", "value": 25.00}}
      ]
    },
    "tender": {
      "tendered_at": "2024-12-20T10:00:00Z",
      "accepted_at": "2024-12-20T10:15:00Z",
      "status": "ACCEPTED"
    },
    "stops": [
      {
        "stop_id": "stop_008_01",
        "sequence": 1,
        "stop_type": "PICKUP",
        "loading_type": "LIVE",
        "location": {
          "location_id": "loc_chi_dc_01",
          "location_code": "CHI-DC-01",
          "name": "Chicago Distribution Center",
          "city": "Chicago",
          "state": "IL"
        },
        "appointment": {
          "type": "APPOINTMENT",
          "scheduled_earliest": "2024-12-21T10:00:00Z",
          "scheduled_latest": "2024-12-21T10:00:00Z"
        },
        "actual": {
          "arrival": "2024-12-21T10:00:00Z",
          "departure": "2024-12-21T10:30:00Z"
        }
      },
      {
        "stop_id": "stop_008_02",
        "sequence": 2,
        "stop_type": "DELIVERY",
        "loading_type": "LIVE",
        "location": {
          "location_id": "loc_chi_dc_01",
          "location_code": "CHI-DC-01",
          "name": "Chicago Distribution Center",
          "city": "Chicago",
          "state": "IL"
        },
        "appointment": {
          "type": "WINDOW",
          "scheduled_earliest": "2024-12-21T12:00:00Z",
          "scheduled_latest": "2024-12-21T14:00:00Z"
        },
        "actual": {
          "arrival": "2024-12-21T12:15:00Z",
          "departure": "2024-12-21T12:45:00Z"
        }
      }
    ],
    "metadata": {
      "created_at": "2024-12-20T09:45:00Z",
      "is_test": true
    }
  }
]
```

---

## 4. Sample Calculated Metrics (Per Load)

```json
[
  {
    "load_id": "load_001",
    "metrics": {
      "cost_per_mile": 2.99,
      "linehaul_per_mile": 2.59,
      "fuel_per_mile": 0.40,
      "total_cost": 2135.50,
      "tender_response_hours": 1.45,
      "stop_metrics": [
        {
          "stop_id": "stop_001_01",
          "ot_exact": "ON_TIME",
          "ot_15min": "ON_TIME",
          "ot_60min": "ON_TIME",
          "ot_same_day": "ON_TIME",
          "dwell_time_minutes": 83
        },
        {
          "stop_id": "stop_001_02",
          "ot_exact": "ON_TIME",
          "ot_15min": "ON_TIME",
          "ot_60min": "ON_TIME",
          "ot_same_day": "ON_TIME",
          "dwell_time_minutes": 83
        }
      ]
    }
  },
  {
    "load_id": "load_002",
    "metrics": {
      "cost_per_mile": 3.32,
      "linehaul_per_mile": 2.69,
      "fuel_per_mile": 0.41,
      "accessorial_per_mile": 0.21,
      "total_cost": 2370.00,
      "tender_response_hours": 0.75,
      "stop_metrics": [
        {
          "stop_id": "stop_002_01",
          "ot_exact": "LATE",
          "ot_15min": "LATE",
          "ot_60min": "LATE",
          "ot_same_day": "ON_TIME",
          "dwell_time_minutes": 150,
          "late_reason": {
            "responsible_party": "SHIPPER",
            "code": "SHIPPER_NOT_READY"
          }
        },
        {
          "stop_id": "stop_002_02",
          "ot_exact": "ON_TIME",
          "ot_15min": "ON_TIME",
          "ot_60min": "ON_TIME",
          "ot_same_day": "ON_TIME",
          "dwell_time_minutes": 45
        }
      ]
    }
  },
  {
    "load_id": "load_003",
    "metrics": {
      "cost_per_mile": 3.02,
      "linehaul_per_mile": 2.62,
      "fuel_per_mile": 0.40,
      "total_cost": 2163.00,
      "tender_response_hours": 0.75,
      "stop_metrics": [
        {
          "stop_id": "stop_003_01",
          "ot_exact": "LATE",
          "ot_15min": "LATE",
          "ot_60min": "ON_TIME",
          "ot_same_day": "ON_TIME",
          "dwell_time_minutes": 72,
          "late_reason": {
            "responsible_party": "CARRIER",
            "code": "TRAFFIC_DELAY"
          }
        },
        {
          "stop_id": "stop_003_02",
          "ot_exact": "ON_TIME",
          "ot_15min": "ON_TIME",
          "ot_60min": "ON_TIME",
          "ot_same_day": "ON_TIME",
          "dwell_time_minutes": 75
        }
      ]
    }
  },
  {
    "load_id": "load_005",
    "metrics": {
      "cost_per_mile": 3.47,
      "linehaul_per_mile": 3.01,
      "fuel_per_mile": 0.46,
      "total_cost": 2480.00,
      "tender_response_hours": 0.50,
      "stop_metrics": [
        {
          "stop_id": "stop_005_01",
          "ot_exact": "ON_TIME",
          "ot_15min": "ON_TIME",
          "ot_60min": "ON_TIME",
          "ot_same_day": "ON_TIME",
          "dwell_time_minutes": 75
        },
        {
          "stop_id": "stop_005_02",
          "ot_exact": "ON_TIME",
          "ot_15min": "ON_TIME",
          "ot_60min": "ON_TIME",
          "ot_same_day": "ON_TIME",
          "dwell_time_minutes": 75
        }
      ]
    }
  },
  {
    "load_id": "load_006",
    "metrics": {
      "cost_per_mile": 3.07,
      "linehaul_per_mile": 2.74,
      "fuel_per_mile": 0.33,
      "total_cost": 3832.00,
      "tender_response_hours": 1.50,
      "stop_metrics": [
        {
          "stop_id": "stop_006_01",
          "ot_exact": "ON_TIME",
          "ot_15min": "ON_TIME",
          "ot_60min": "ON_TIME",
          "ot_same_day": "ON_TIME",
          "dwell_time_minutes": 83
        },
        {
          "stop_id": "stop_006_02",
          "ot_exact": "ON_TIME",
          "ot_15min": "ON_TIME",
          "ot_60min": "ON_TIME",
          "ot_same_day": "ON_TIME",
          "dwell_time_minutes": 15
        }
      ]
    }
  },
  {
    "load_id": "load_007",
    "metrics": {
      "cost_per_mile": 3.15,
      "linehaul_per_mile": 2.81,
      "fuel_per_mile": 0.34,
      "total_cost": 8795.00,
      "tender_response_hours": 1.33,
      "stop_metrics": [
        {
          "stop_id": "stop_007_01",
          "ot_exact": "ON_TIME",
          "ot_15min": "ON_TIME",
          "ot_60min": "ON_TIME",
          "ot_same_day": "ON_TIME",
          "dwell_time_minutes": 105
        },
        {
          "stop_id": "stop_007_02",
          "ot_exact": "ON_TIME",
          "ot_15min": "ON_TIME",
          "ot_60min": "ON_TIME",
          "ot_same_day": "ON_TIME",
          "dwell_time_minutes": 95
        }
      ]
    }
  }
]
```

---

## 5. Sample Lane Aggregated Metrics

```json
[
  {
    "lane": {
      "origin": {
        "location_id": "loc_chi_dc_01",
        "name": "Chicago Distribution Center",
        "city": "Chicago",
        "state": "IL"
      },
      "destination": {
        "location_id": "loc_atl_wh_03",
        "name": "Atlanta Warehouse Facility",
        "city": "Atlanta",
        "state": "GA"
      },
      "lane_code": "CHI-ATL"
    },
    "time_period": {
      "start": "2024-12-01T00:00:00Z",
      "end": "2024-12-31T23:59:59Z"
    },
    "metrics": {
      "volume": {
        "total_loads": 5,
        "shipments": 4,
        "tenders": 1
      },
      "cost": {
        "avg_cost_per_mile": 3.08,
        "min_cost_per_mile": 2.99,
        "max_cost_per_mile": 3.47,
        "cost_consistency_cv": 5.8,
        "total_spend": 11148.50,
        "currency": "USD"
      },
      "performance": {
        "otp_exact": 60.0,
        "otp_15min": 60.0,
        "otp_60min": 80.0,
        "otp_same_day": 100.0,
        "otd_exact": 100.0,
        "otd_15min": 100.0,
        "avg_dwell_time_pickup": 92.6,
        "avg_dwell_time_delivery": 68.0
      },
      "performance_excluding_shipper_fault": {
        "otp_exact": 75.0,
        "otp_15min": 75.0,
        "otp_60min": 100.0,
        "eligible_pickups": 4
      },
      "tender": {
        "acceptance_rate": 80.0,
        "avg_response_time_hours": 0.95,
        "ftar": 80.0
      }
    }
  },
  {
    "lane": {
      "origin": {
        "location_id": "loc_chi_dc_01",
        "name": "Chicago Distribution Center",
        "city": "Chicago",
        "state": "IL"
      },
      "destination": {
        "location_id": "loc_dal_fc_01",
        "name": "Dallas Fulfillment Center",
        "city": "Dallas",
        "state": "TX"
      },
      "lane_code": "CHI-DAL"
    },
    "time_period": {
      "start": "2024-12-01T00:00:00Z",
      "end": "2024-12-31T23:59:59Z"
    },
    "metrics": {
      "volume": {
        "total_loads": 1,
        "shipments": 1,
        "tenders": 0
      },
      "cost": {
        "avg_cost_per_mile": 3.07,
        "min_cost_per_mile": 3.07,
        "max_cost_per_mile": 3.07,
        "cost_consistency_cv": 0.0,
        "total_spend": 3832.00,
        "currency": "USD"
      },
      "performance": {
        "otp_exact": 100.0,
        "otp_15min": 100.0,
        "otp_60min": 100.0,
        "otd_exact": 100.0,
        "otd_15min": 100.0,
        "avg_dwell_time_pickup": 83,
        "avg_dwell_time_delivery": 15
      },
      "tender": {
        "acceptance_rate": 100.0,
        "avg_response_time_hours": 1.50,
        "ftar": 100.0
      }
    }
  },
  {
    "lane": {
      "origin": {
        "location_id": "loc_lax_port_02",
        "name": "Los Angeles Port Terminal",
        "city": "Los Angeles",
        "state": "CA"
      },
      "destination": {
        "location_id": "loc_nyc_wh_05",
        "name": "New Jersey Distribution Hub",
        "city": "Newark",
        "state": "NJ"
      },
      "lane_code": "LAX-NYC"
    },
    "time_period": {
      "start": "2024-12-01T00:00:00Z",
      "end": "2024-12-31T23:59:59Z"
    },
    "metrics": {
      "volume": {
        "total_loads": 1,
        "shipments": 1,
        "tenders": 0
      },
      "cost": {
        "avg_cost_per_mile": 3.15,
        "min_cost_per_mile": 3.15,
        "max_cost_per_mile": 3.15,
        "total_spend": 8795.00,
        "currency": "USD"
      },
      "performance": {
        "otp_exact": 100.0,
        "otp_15min": 100.0,
        "otp_60min": 100.0,
        "otd_exact": 100.0,
        "otd_15min": 100.0,
        "avg_dwell_time_pickup": 105,
        "avg_dwell_time_delivery": 95
      },
      "tender": {
        "acceptance_rate": 100.0,
        "avg_response_time_hours": 1.33,
        "ftar": 100.0
      }
    }
  }
]
```

---

## 6. Sample Carrier Aggregated Metrics

```json
[
  {
    "carrier": {
      "carrier_id": "carrier_xpo_001",
      "scac": "XPDL",
      "name": "XPO Logistics"
    },
    "time_period": {
      "start": "2024-12-01T00:00:00Z",
      "end": "2024-12-31T23:59:59Z"
    },
    "metrics": {
      "volume": {
        "total_loads": 3,
        "shipments": 2,
        "total_tenders": 3
      },
      "performance": {
        "otp_exact": 100.0,
        "otp_15min": 100.0,
        "otp_60min": 100.0,
        "otd_exact": 100.0,
        "otd_15min": 100.0,
        "avg_dwell_time": 80.3
      },
      "tender": {
        "acceptance_rate": 66.7,
        "rejection_rate": 33.3,
        "avg_response_time_hours": 1.37
      },
      "cost": {
        "avg_cost_per_mile": 3.04,
        "cost_index": 98.7,
        "total_spend": 5967.50,
        "currency": "USD"
      }
    },
    "lanes": [
      {
        "lane_code": "CHI-ATL",
        "load_count": 1,
        "otp_exact": 100.0,
        "avg_cpm": 2.99
      },
      {
        "lane_code": "CHI-DAL",
        "load_count": 1,
        "otp_exact": 100.0,
        "avg_cpm": 3.07
      }
    ]
  },
  {
    "carrier": {
      "carrier_id": "carrier_sch_001",
      "scac": "SCHO",
      "name": "Schneider National"
    },
    "time_period": {
      "start": "2024-12-01T00:00:00Z",
      "end": "2024-12-31T23:59:59Z"
    },
    "metrics": {
      "volume": {
        "total_loads": 2,
        "shipments": 2,
        "total_tenders": 2
      },
      "performance": {
        "otp_exact": 50.0,
        "otp_15min": 50.0,
        "otp_60min": 50.0,
        "otd_exact": 100.0,
        "otd_15min": 100.0,
        "avg_dwell_time": 97.5
      },
      "performance_excluding_shipper_fault": {
        "otp_exact": 100.0,
        "otp_15min": 100.0,
        "eligible_pickups": 1
      },
      "tender": {
        "acceptance_rate": 100.0,
        "rejection_rate": 0.0,
        "avg_response_time_hours": 0.75
      },
      "cost": {
        "avg_cost_per_mile": 3.32,
        "cost_index": 107.8,
        "total_spend": 2370.00,
        "currency": "USD"
      }
    },
    "lanes": [
      {
        "lane_code": "CHI-ATL",
        "load_count": 1,
        "otp_exact": 0.0,
        "otp_exact_excluding_shipper_fault": 100.0,
        "avg_cpm": 3.32
      }
    ]
  },
  {
    "carrier": {
      "carrier_id": "carrier_jbt_001",
      "scac": "JBTC",
      "name": "JB Hunt Transport"
    },
    "time_period": {
      "start": "2024-12-01T00:00:00Z",
      "end": "2024-12-31T23:59:59Z"
    },
    "metrics": {
      "volume": {
        "total_loads": 1,
        "shipments": 1,
        "total_tenders": 1
      },
      "performance": {
        "otp_exact": 0.0,
        "otp_15min": 0.0,
        "otp_60min": 100.0,
        "otd_exact": 100.0,
        "otd_15min": 100.0,
        "avg_dwell_time": 73.5
      },
      "tender": {
        "acceptance_rate": 100.0,
        "rejection_rate": 0.0,
        "avg_response_time_hours": 0.75
      },
      "cost": {
        "avg_cost_per_mile": 3.02,
        "cost_index": 98.1,
        "total_spend": 2163.00,
        "currency": "USD"
      }
    },
    "lanes": [
      {
        "lane_code": "CHI-ATL",
        "load_count": 1,
        "otp_exact": 0.0,
        "avg_cpm": 3.02
      }
    ]
  },
  {
    "carrier": {
      "carrier_id": "carrier_kwk_001",
      "scac": "KWKE",
      "name": "Knight-Swift Transportation"
    },
    "time_period": {
      "start": "2024-12-01T00:00:00Z",
      "end": "2024-12-31T23:59:59Z"
    },
    "metrics": {
      "volume": {
        "total_loads": 1,
        "shipments": 1,
        "total_tenders": 1
      },
      "performance": {
        "otp_exact": 100.0,
        "otp_15min": 100.0,
        "otp_60min": 100.0,
        "otd_exact": 100.0,
        "otd_15min": 100.0,
        "avg_dwell_time": 75.0
      },
      "tender": {
        "acceptance_rate": 100.0,
        "rejection_rate": 0.0,
        "avg_response_time_hours": 0.50
      },
      "cost": {
        "avg_cost_per_mile": 3.47,
        "cost_index": 112.7,
        "total_spend": 2480.00,
        "currency": "USD"
      }
    },
    "lanes": [
      {
        "lane_code": "CHI-ATL",
        "load_count": 1,
        "otp_exact": 100.0,
        "avg_cpm": 3.47
      }
    ],
    "notes": "Backup carrier - higher rates"
  },
  {
    "carrier": {
      "carrier_id": "carrier_odfl_001",
      "scac": "ODFL",
      "name": "Old Dominion Freight Line"
    },
    "time_period": {
      "start": "2024-12-01T00:00:00Z",
      "end": "2024-12-31T23:59:59Z"
    },
    "metrics": {
      "volume": {
        "total_loads": 1,
        "shipments": 1,
        "total_tenders": 1
      },
      "performance": {
        "otp_exact": 100.0,
        "otp_15min": 100.0,
        "otp_60min": 100.0,
        "otd_exact": 100.0,
        "otd_15min": 100.0,
        "avg_dwell_time": 100.0
      },
      "tender": {
        "acceptance_rate": 100.0,
        "rejection_rate": 0.0,
        "avg_response_time_hours": 1.33
      },
      "cost": {
        "avg_cost_per_mile": 3.15,
        "cost_index": 102.3,
        "total_spend": 8795.00,
        "currency": "USD"
      }
    },
    "lanes": [
      {
        "lane_code": "LAX-NYC",
        "load_count": 1,
        "otp_exact": 100.0,
        "avg_cpm": 3.15
      }
    ]
  }
]
```

---

## 7. Sample Metric Definitions

```json
[
  {
    "metric_id": "metric_otp_exact",
    "metric_code": "OTP_EXACT",
    "metric_name": "On-Time Pickup - Exact",
    "description": "Percentage of pickups where actual arrival was exactly on or before scheduled time",
    "formula": {
      "type": "percentage",
      "numerator": {
        "type": "count",
        "filter": {
          "type": "and",
          "conditions": [
            {"field": "stop_type", "operator": "=", "value": "PICKUP"},
            {"field": "actual.arrival", "operator": "<=", "value": {"field": "appointment.scheduled_earliest"}}
          ]
        }
      },
      "denominator": {
        "type": "count",
        "filter": {"field": "stop_type", "operator": "=", "value": "PICKUP"}
      }
    },
    "return_type": "PERCENTAGE",
    "unit": "%",
    "precision": 1,
    "is_baseline": true,
    "category": "PERFORMANCE"
  },
  {
    "metric_id": "metric_cpm_all_in",
    "metric_code": "CPM_ALL_IN",
    "metric_name": "Cost Per Mile - All-In",
    "description": "Total cost divided by length of haul",
    "formula": {
      "type": "division",
      "numerator": {
        "type": "sum",
        "field": "charges.line_items.amount.value"
      },
      "denominator": {
        "type": "field",
        "path": "length_of_haul.value"
      }
    },
    "return_type": "DECIMAL",
    "unit": "USD/MILE",
    "precision": 2,
    "is_baseline": true,
    "category": "COST"
  },
  {
    "metric_id": "metric_tender_acceptance",
    "metric_code": "TENDER_ACCEPTANCE_RATE",
    "metric_name": "Tender Acceptance Rate",
    "description": "Percentage of tenders accepted by carriers",
    "formula": {
      "type": "percentage",
      "numerator": {
        "type": "count",
        "filter": {"field": "tender.status", "operator": "=", "value": "ACCEPTED"}
      },
      "denominator": {
        "type": "count",
        "filter": {
          "type": "or",
          "conditions": [
            {"field": "tender.status", "operator": "=", "value": "ACCEPTED"},
            {"field": "tender.status", "operator": "=", "value": "REJECTED"}
          ]
        }
      }
    },
    "return_type": "PERCENTAGE",
    "unit": "%",
    "precision": 1,
    "is_baseline": true,
    "category": "TENDER"
  }
]
```

---

## 8. Sample Segment Definitions

```json
[
  {
    "segment_id": "seg_no_shipper_fault",
    "segment_code": "NO_SHIPPER_FAULT",
    "segment_name": "Exclude Shipper Fault",
    "description": "Excludes stops where delays were the shipper's responsibility",
    "segment_type": "EXCLUSION",
    "applies_to": ["STOP"],
    "affected_metrics": ["OTP_EXACT", "OTP_15MIN", "OTP_60MIN"],
    "rules": {
      "type": "or",
      "conditions": [
        {"field": "late_reason.responsible_party", "operator": "!=", "value": "SHIPPER"},
        {"field": "late_reason", "operator": "IS_NULL"}
      ]
    },
    "auto_apply": true,
    "is_active": true
  },
  {
    "segment_id": "seg_no_test_loads",
    "segment_code": "NO_TEST_LOADS",
    "segment_name": "Exclude Test Loads",
    "description": "Excludes test/trial loads from operational metrics",
    "segment_type": "EXCLUSION",
    "applies_to": ["LOAD"],
    "affected_metrics": ["ALL"],
    "rules": {
      "type": "or",
      "conditions": [
        {"field": "metadata.is_test", "operator": "!=", "value": true},
        {"field": "metadata.is_test", "operator": "IS_NULL"}
      ]
    },
    "auto_apply": true,
    "is_active": true
  },
  {
    "segment_id": "seg_no_contract_backup",
    "segment_code": "NO_CONTRACT_BACKUP",
    "segment_name": "Exclude Contract Backup",
    "description": "Excludes backup tenders from acceptance rate calculations",
    "segment_type": "EXCLUSION",
    "applies_to": ["LOAD"],
    "affected_metrics": ["TENDER_ACCEPTANCE_RATE"],
    "rules": {
      "field": "contract_type",
      "operator": "!=",
      "value": "CONTRACT_BACKUP"
    },
    "auto_apply": true,
    "is_active": true
  },
  {
    "segment_id": "seg_weather_exclusion",
    "segment_code": "WEATHER_EXCLUSION",
    "segment_name": "Exclude Weather Delays",
    "description": "Excludes weather-related delays from on-time metrics",
    "segment_type": "EXCLUSION",
    "applies_to": ["STOP"],
    "affected_metrics": ["OTP_EXACT", "OTP_15MIN", "OTP_60MIN", "OTD_EXACT", "OTD_15MIN"],
    "rules": {
      "field": "late_reason.code",
      "operator": "!=",
      "value": "WEATHER_DELAY"
    },
    "auto_apply": false,
    "is_active": true
  }
]
```

---

## 9. Sample Transaction Overrides

```json
[
  {
    "override_id": "override_001",
    "entity_id": "stop_002_01",
    "entity_type": "STOP",
    "segment_id": "seg_no_shipper_fault",
    "override_action": "EXCLUDE",
    "reason": "Although marked as shipper fault, carrier could have communicated better about the delay",
    "applied_by": "user_kyle_001",
    "applied_at": "2024-12-14T10:30:00Z",
    "effective_from": "2024-12-13T00:00:00Z",
    "effective_to": null
  },
  {
    "override_id": "override_002",
    "entity_id": "load_008",
    "entity_type": "LOAD",
    "segment_id": "seg_no_test_loads",
    "override_action": "EXCLUDE",
    "reason": "This was a test load for new TMS integration",
    "applied_by": "user_kyle_001",
    "applied_at": "2024-12-21T15:00:00Z",
    "effective_from": "2024-12-21T00:00:00Z",
    "effective_to": null
  }
]
```

---

## 10. UI State Examples

### Dashboard Filters State

```json
{
  "date_range": {
    "start": "2024-12-01T00:00:00Z",
    "end": "2024-12-31T23:59:59Z",
    "preset": "THIS_MONTH"
  },
  "mode": ["TRUCKLOAD"],
  "equipment_type": ["Dry Van 53'"],
  "carrier_ids": ["carrier_xpo_001", "carrier_sch_001"],
  "lane_codes": ["CHI-ATL"],
  "segment_ids": ["seg_no_shipper_fault", "seg_no_test_loads"],
  "include_backup_contracts": false
}
```

### Formula Builder State

```json
{
  "formula_name": "Fuel Cost Percentage",
  "current_node": {
    "id": "node_001",
    "type": "MULTIPLICATION",
    "left": {
      "id": "node_002",
      "type": "DIVISION",
      "numerator": {
        "id": "node_003",
        "type": "SUM",
        "field": "charges.line_items.amount",
        "filter": {
          "field": "charges.line_items.charge_type",
          "operator": "=",
          "value": "FUEL_SURCHARGE"
        }
      },
      "denominator": {
        "id": "node_004",
        "type": "SUM",
        "field": "charges.line_items.amount"
      }
    },
    "right": {
      "id": "node_005",
      "type": "CONSTANT",
      "value": 100
    }
  },
  "return_type": "PERCENTAGE",
  "unit": "%",
  "precision": 1
}
```

---

## Notes for FE Implementation

1. **Date Handling**: All dates are in ISO 8601 format with UTC timezone
2. **Metric Calculations**: The calculated metrics show both raw values and consider segment applications
3. **Null Handling**: Missing data (like late_reason when on-time) should be handled gracefully
4. **Segment Application**: Show visual indicators when segments are applied to metrics
5. **Override Display**: Clearly mark overridden transactions with badges/icons
6. **Cost Formatting**: Always show currency symbol and 2 decimal places
7. **Percentage Formatting**: Show 1 decimal place for percentages (e.g., 91.3%)
8. **Time Formatting**: Use relative time for recent events (e.g., "2 hours ago")
