import type { Location } from '@/types';

export const locations: Location[] = [
  {
    location_id: "loc_chi_dc_01",
    location_code: "CHI-DC-01",
    name: "Chicago Distribution Center",
    address1: "4500 Industrial Parkway",
    address2: "Dock 15-20",
    city: "Chicago",
    state: "IL",
    postal_code: "60609",
    country_code: "US",
    latitude: 41.8781,
    longitude: -87.6298,
    type: "WAREHOUSE"
  },
  {
    location_id: "loc_atl_wh_03",
    location_code: "ATL-WH-03",
    name: "Atlanta Warehouse Facility",
    address1: "2800 Commerce Boulevard",
    address2: "Building B, Dock 5",
    city: "Atlanta",
    state: "GA",
    postal_code: "30318",
    country_code: "US",
    latitude: 33.749,
    longitude: -84.388,
    type: "WAREHOUSE"
  },
  {
    location_id: "loc_dal_fc_01",
    location_code: "DAL-FC-01",
    name: "Dallas Fulfillment Center",
    address1: "1250 Logistics Drive",
    city: "Dallas",
    state: "TX",
    postal_code: "75241",
    country_code: "US",
    latitude: 32.7767,
    longitude: -96.7970,
    type: "FULFILLMENT_CENTER"
  },
  {
    location_id: "loc_lax_port_02",
    location_code: "LAX-PORT-02",
    name: "Los Angeles Port Terminal",
    address1: "Berth 214, Terminal Island",
    city: "Los Angeles",
    state: "CA",
    postal_code: "90731",
    country_code: "US",
    latitude: 33.7367,
    longitude: -118.2707,
    type: "PORT"
  },
  {
    location_id: "loc_nyc_wh_05",
    location_code: "NYC-WH-05",
    name: "New Jersey Distribution Hub",
    address1: "550 Distribution Way",
    city: "Newark",
    state: "NJ",
    postal_code: "07114",
    country_code: "US",
    latitude: 40.7357,
    longitude: -74.1724,
    type: "WAREHOUSE"
  }
];
