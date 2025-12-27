"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calculator,
  Filter,
  Hash,
  Percent,
  ChevronDown,
  ChevronRight,
  Link2,
  Type,
} from "lucide-react";
import type { MetricFormula } from "@/types";

interface FormulaBuilderProps {
  formula: MetricFormula;
  onChange: (formula: MetricFormula) => void;
}

// Available fields for formulas - expanded with more options
const availableFields = {
  load: [
    { value: "length_of_haul.value", label: "Length of Haul (miles)", type: "number" },
    { value: "charges.total", label: "Total Charges", type: "number" },
    { value: "charges.line_items.amount.value", label: "Charge Amount", type: "number" },
    { value: "tender.response_time", label: "Tender Response Time", type: "number" },
    { value: "contract_type", label: "Contract Type", type: "string" },
    { value: "mode", label: "Mode", type: "string" },
    { value: "equipment_type", label: "Equipment Type", type: "string" },
    { value: "load_status", label: "Load Status", type: "string" },
  ],
  stop: [
    { value: "actual.arrival", label: "Actual Arrival", type: "datetime" },
    { value: "actual.departure", label: "Actual Departure", type: "datetime" },
    { value: "appointment.scheduled_earliest", label: "Scheduled Earliest", type: "datetime" },
    { value: "appointment.scheduled_latest", label: "Scheduled Latest", type: "datetime" },
    { value: "appointment.original_earliest", label: "Original Earliest", type: "datetime" },
    { value: "appointment.original_latest", label: "Original Latest", type: "datetime" },
    { value: "dwell_time_minutes", label: "Dwell Time (minutes)", type: "number" },
    { value: "stop_type", label: "Stop Type", type: "string" },
    { value: "loading_type", label: "Loading Type", type: "string" },
    { value: "sequence", label: "Stop Sequence", type: "number" },
  ],
  charge: [
    { value: "charge_type", label: "Charge Type", type: "string" },
    { value: "amount.value", label: "Amount", type: "number" },
    { value: "amount.currency", label: "Currency", type: "string" },
  ],
  tender: [
    { value: "status", label: "Tender Status", type: "string" },
    { value: "tendered_at", label: "Tendered At", type: "datetime" },
    { value: "accepted_at", label: "Accepted At", type: "datetime" },
    { value: "rejected_at", label: "Rejected At", type: "datetime" },
    { value: "rejection_reason", label: "Rejection Reason", type: "string" },
  ],
  late_reason: [
    { value: "late_reason.responsible_party", label: "Responsible Party", type: "string" },
    { value: "late_reason.code", label: "Late Reason Code", type: "string" },
    { value: "late_reason.description", label: "Late Reason Description", type: "string" },
  ],
  location: [
    { value: "location.state", label: "Location State", type: "string" },
    { value: "location.city", label: "Location City", type: "string" },
    { value: "location.type", label: "Location Type", type: "string" },
  ],
};

// Predefined values for common fields
const predefinedValues: Record<string, { value: string; label: string }[]> = {
  stop_type: [
    { value: "PICKUP", label: "Pickup" },
    { value: "DELIVERY", label: "Delivery" },
  ],
  loading_type: [
    { value: "LIVE", label: "Live" },
    { value: "DROP", label: "Drop" },
  ],
  contract_type: [
    { value: "CONTRACT_PRIMARY", label: "Primary Contract" },
    { value: "CONTRACT_BACKUP", label: "Backup Contract" },
  ],
  mode: [
    { value: "TRUCKLOAD", label: "Truckload" },
    { value: "LTL", label: "LTL" },
    { value: "PARCEL", label: "Parcel" },
  ],
  load_status: [
    { value: "DELIVERED", label: "Delivered" },
    { value: "IN_TRANSIT", label: "In Transit" },
    { value: "REJECTED", label: "Rejected" },
    { value: "PENDING", label: "Pending" },
  ],
  status: [
    { value: "ACCEPTED", label: "Accepted" },
    { value: "REJECTED", label: "Rejected" },
    { value: "PENDING", label: "Pending" },
  ],
  "late_reason.responsible_party": [
    { value: "SHIPPER", label: "Shipper" },
    { value: "CARRIER", label: "Carrier" },
    { value: "CUSTOMER", label: "Customer" },
    { value: "FORCE_MAJEURE", label: "Force Majeure" },
  ],
  charge_type: [
    { value: "LINE_HAUL", label: "Line Haul" },
    { value: "FUEL_SURCHARGE", label: "Fuel Surcharge" },
    { value: "DETENTION", label: "Detention" },
    { value: "ACCESSORIAL", label: "Accessorial" },
  ],
  "location.type": [
    { value: "WAREHOUSE", label: "Warehouse" },
    { value: "FULFILLMENT_CENTER", label: "Fulfillment Center" },
    { value: "PORT", label: "Port" },
    { value: "DISTRIBUTION_CENTER", label: "Distribution Center" },
  ],
};

const operators = [
  { value: "=", label: "equals (=)" },
  { value: "!=", label: "not equals (!=)" },
  { value: ">", label: "greater than (>)" },
  { value: ">=", label: "greater than or equal (>=)" },
  { value: "<", label: "less than (<)" },
  { value: "<=", label: "less than or equal (<=)" },
  { value: "IS_NULL", label: "is null" },
  { value: "IS_NOT_NULL", label: "is not null" },
  { value: "IN", label: "in list" },
  { value: "NOT_IN", label: "not in list" },
];

const aggregationFunctions = [
  { value: "COUNT", label: "Count", icon: Hash },
  { value: "SUM", label: "Sum", icon: Calculator },
  { value: "AVG", label: "Average", icon: Calculator },
  { value: "MIN", label: "Minimum", icon: Calculator },
  { value: "MAX", label: "Maximum", icon: Calculator },
];

const formulaTypes = [
  { value: "percentage", label: "Percentage (Numerator / Denominator × 100)", icon: Percent },
  { value: "division", label: "Division (Numerator / Denominator)", icon: Calculator },
  { value: "average", label: "Average of Field", icon: Calculator },
  { value: "sum", label: "Sum of Field", icon: Calculator },
  { value: "count", label: "Count", icon: Hash },
];

interface FilterCondition {
  field: string;
  operator: string;
  value: string | number | boolean;
  value_type?: "static" | "field"; // New: indicates if value is a static value or field reference
  value_field?: string; // New: the field to compare against when value_type is "field"
}

interface AggregationBlock {
  type: string;
  function: string;
  field: string;
  filter?: {
    type?: string;
    conditions?: FilterCondition[];
    field?: string;
    operator?: string;
    value?: string | number | boolean;
    value_type?: "static" | "field";
    value_field?: string;
  };
}

export function FormulaBuilder({ formula, onChange }: FormulaBuilderProps) {
  const [expandedSections, setExpandedSections] = useState({
    numerator: true,
    denominator: true,
    field: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const updateFormulaType = (type: string) => {
    let newFormula: MetricFormula;

    switch (type) {
      case "percentage":
      case "division":
        newFormula = {
          type,
          numerator: {
            type: "aggregation",
            function: "COUNT",
            field: "stops",
            filter: { field: "", operator: "=", value: "", value_type: "static" },
          },
          denominator: {
            type: "aggregation",
            function: "COUNT",
            field: "stops",
            filter: { field: "", operator: "=", value: "", value_type: "static" },
          },
        };
        break;
      case "average":
      case "sum":
        newFormula = {
          type,
          field: "",
        };
        break;
      case "count":
        newFormula = {
          type: "aggregation",
          function: "COUNT",
          field: "loads",
          filter: { field: "", operator: "=", value: "", value_type: "static" },
        };
        break;
      default:
        newFormula = formula;
    }

    onChange(newFormula);
  };

  const updateNumerator = (updates: Partial<AggregationBlock>) => {
    onChange({
      ...formula,
      numerator: {
        ...(formula.numerator as AggregationBlock),
        ...updates,
      },
    });
  };

  const updateDenominator = (updates: Partial<AggregationBlock>) => {
    onChange({
      ...formula,
      denominator: {
        ...(formula.denominator as AggregationBlock),
        ...updates,
      },
    });
  };

  const updateNumeratorFilter = (updates: Partial<FilterCondition>) => {
    const currentNumerator = formula.numerator as AggregationBlock;
    onChange({
      ...formula,
      numerator: {
        ...currentNumerator,
        filter: {
          ...currentNumerator.filter,
          ...updates,
        },
      },
    });
  };

  const updateDenominatorFilter = (updates: Partial<FilterCondition>) => {
    const currentDenominator = formula.denominator as AggregationBlock;
    onChange({
      ...formula,
      denominator: {
        ...currentDenominator,
        filter: {
          ...currentDenominator.filter,
          ...updates,
        },
      },
    });
  };

  // Get field info to determine its type
  const getFieldInfo = (fieldPath: string) => {
    for (const fields of Object.values(availableFields)) {
      const field = fields.find((f) => f.value === fieldPath);
      if (field) return field;
    }
    return null;
  };

  // Check if operator requires a value
  const operatorRequiresValue = (operator: string) => {
    return !["IS_NULL", "IS_NOT_NULL"].includes(operator);
  };

  const renderValueInput = (
    filter: FilterCondition | undefined,
    onUpdate: (updates: Partial<FilterCondition>) => void
  ) => {
    const operator = filter?.operator || "=";
    const valueType = filter?.value_type || "static";
    const fieldPath = filter?.field || "";
    const fieldInfo = getFieldInfo(fieldPath);
    const predefinedOptions = predefinedValues[fieldPath];

    // No value input for null checks
    if (!operatorRequiresValue(operator)) {
      return (
        <div className="h-9 flex items-center text-sm text-muted-foreground italic">
          No value needed
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {/* Value Type Selector */}
        <Tabs
          value={valueType}
          onValueChange={(v) =>
            onUpdate({
              value_type: v as "static" | "field",
              value: v === "field" ? "" : filter?.value || "",
              value_field: v === "field" ? filter?.value_field || "" : undefined,
            })
          }
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 h-8">
            <TabsTrigger value="static" className="text-xs gap-1">
              <Type className="h-3 w-3" />
              Static
            </TabsTrigger>
            <TabsTrigger value="field" className="text-xs gap-1">
              <Link2 className="h-3 w-3" />
              Field
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Value Input based on type */}
        {valueType === "static" ? (
          // Static value input
          predefinedOptions ? (
            <Select
              value={filter?.value?.toString() || undefined}
              onValueChange={(value) => onUpdate({ value })}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Select value" />
              </SelectTrigger>
              <SelectContent>
                {predefinedOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : fieldInfo?.type === "number" ? (
            <Input
              type="number"
              className="h-9"
              placeholder="Enter number"
              value={filter?.value?.toString() || ""}
              onChange={(e) => onUpdate({ value: parseFloat(e.target.value) || 0 })}
            />
          ) : fieldInfo?.type === "datetime" ? (
            <Input
              type="datetime-local"
              className="h-9"
              value={filter?.value?.toString() || ""}
              onChange={(e) => onUpdate({ value: e.target.value })}
            />
          ) : (
            <Input
              className="h-9"
              placeholder="Enter value"
              value={filter?.value?.toString() || ""}
              onChange={(e) => onUpdate({ value: e.target.value })}
            />
          )
        ) : (
          // Field reference selector
          <Select
            value={filter?.value_field || undefined}
            onValueChange={(value) => onUpdate({ value_field: value, value: `$${value}` })}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Select field to compare" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(availableFields).map(([group, fields]) => (
                <div key={group}>
                  <div className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase">
                    {group}
                  </div>
                  {fields.map((field) => (
                    <SelectItem key={field.value} value={field.value}>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px] px-1">
                          {field.type}
                        </Badge>
                        {field.label}
                      </div>
                    </SelectItem>
                  ))}
                </div>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    );
  };

  const renderFilterBuilder = (
    filter: FilterCondition | undefined,
    onUpdate: (updates: Partial<FilterCondition>) => void,
    label: string
  ) => (
    <div className="space-y-3 p-3 bg-muted/50 rounded-lg">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="space-y-1">
          <Label className="text-xs">Field</Label>
          <Select
            value={filter?.field || undefined}
            onValueChange={(value) => onUpdate({ field: value, value: "", value_field: undefined })}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Select field" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(availableFields).map(([group, fields]) => (
                <div key={group}>
                  <div className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase">
                    {group}
                  </div>
                  {fields.map((field) => (
                    <SelectItem key={field.value} value={field.value}>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px] px-1">
                          {field.type}
                        </Badge>
                        {field.label}
                      </div>
                    </SelectItem>
                  ))}
                </div>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Operator</Label>
          <Select
            value={filter?.operator || "="}
            onValueChange={(value) => onUpdate({ operator: value })}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Operator" />
            </SelectTrigger>
            <SelectContent>
              {operators.map((op) => (
                <SelectItem key={op.value} value={op.value}>
                  {op.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Value</Label>
          {renderValueInput(filter, onUpdate)}
        </div>
      </div>

      {/* Show comparison summary when field reference is used */}
      {filter?.value_type === "field" && filter?.field && filter?.value_field && (
        <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-950 rounded border border-blue-200 dark:border-blue-800">
          <p className="text-xs text-blue-700 dark:text-blue-300">
            <strong>Comparison:</strong> {filter.field} {filter.operator} {filter.value_field}
          </p>
        </div>
      )}
    </div>
  );

  const renderAggregationBuilder = (
    block: AggregationBlock | undefined,
    onUpdate: (updates: Partial<AggregationBlock>) => void,
    onFilterUpdate: (updates: Partial<FilterCondition>) => void,
    title: string,
    sectionKey: "numerator" | "denominator"
  ) => (
    <Card>
      <CardHeader
        className="py-3 cursor-pointer"
        onClick={() => toggleSection(sectionKey)}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            {expandedSections[sectionKey] ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
            {title}
          </CardTitle>
          {block?.function && (
            <Badge variant="secondary" className="text-xs">
              {block.function}({block.field || "..."})
            </Badge>
          )}
        </div>
      </CardHeader>
      {expandedSections[sectionKey] && (
        <CardContent className="space-y-4 pt-0">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs">Aggregation Function</Label>
              <Select
                value={block?.function || "COUNT"}
                onValueChange={(value) => onUpdate({ function: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select function" />
                </SelectTrigger>
                <SelectContent>
                  {aggregationFunctions.map((fn) => (
                    <SelectItem key={fn.value} value={fn.value}>
                      <div className="flex items-center gap-2">
                        <fn.icon className="h-4 w-4" />
                        {fn.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Entity</Label>
              <Select
                value={block?.field || "stops"}
                onValueChange={(value) => onUpdate({ field: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select entity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="loads">Loads</SelectItem>
                  <SelectItem value="stops">Stops</SelectItem>
                  <SelectItem value="tenders">Tenders</SelectItem>
                  <SelectItem value="charges.line_items">Charge Line Items</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {renderFilterBuilder(
            block?.filter as FilterCondition,
            onFilterUpdate,
            "Filter Condition (WHERE)"
          )}
        </CardContent>
      )}
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Formula Type Selection */}
      <div className="space-y-2">
        <Label>Formula Type</Label>
        <div className="grid grid-cols-2 gap-2">
          {formulaTypes.map((type) => (
            <Button
              key={type.value}
              variant={formula.type === type.value ? "default" : "outline"}
              className="justify-start h-auto py-3"
              onClick={() => updateFormulaType(type.value)}
            >
              <type.icon className="h-4 w-4 mr-2" />
              <div className="text-left">
                <div className="font-medium">{type.label.split(" (")[0]}</div>
                <div className="text-xs opacity-70">
                  {type.label.includes("(") ? type.label.split(" (")[1].replace(")", "") : ""}
                </div>
              </div>
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Formula Builder based on type */}
      {(formula.type === "percentage" || formula.type === "division") && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calculator className="h-4 w-4" />
            <span>
              Result = Numerator ÷ Denominator
              {formula.type === "percentage" && " × 100"}
            </span>
          </div>

          {renderAggregationBuilder(
            formula.numerator as AggregationBlock,
            updateNumerator,
            updateNumeratorFilter,
            "Numerator",
            "numerator"
          )}

          <div className="flex justify-center">
            <Badge variant="outline" className="text-lg px-4">
              ÷
            </Badge>
          </div>

          {renderAggregationBuilder(
            formula.denominator as AggregationBlock,
            updateDenominator,
            updateDenominatorFilter,
            "Denominator",
            "denominator"
          )}

          {formula.type === "percentage" && (
            <div className="flex justify-center">
              <Badge variant="outline" className="text-lg px-4">
                × 100
              </Badge>
            </div>
          )}
        </div>
      )}

      {(formula.type === "average" || formula.type === "sum") && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calculator className="h-4 w-4" />
            <span>
              Result = {formula.type === "average" ? "AVG" : "SUM"}(Field)
            </span>
          </div>

          <div className="space-y-2">
            <Label>Field to {formula.type === "average" ? "Average" : "Sum"}</Label>
            <Select
              value={(formula.field as string) || undefined}
              onValueChange={(value) => onChange({ ...formula, field: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select field" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(availableFields).map(([group, fields]) => (
                  <div key={group}>
                    <div className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase">
                      {group}
                    </div>
                    {fields
                      .filter((f) => f.type === "number")
                      .map((field) => (
                        <SelectItem key={field.value} value={field.value}>
                          {field.label}
                        </SelectItem>
                      ))}
                  </div>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Formula Preview */}
      <Card className="bg-slate-50 dark:bg-slate-900">
        <CardHeader className="py-3">
          <CardTitle className="text-sm">Formula Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs font-mono overflow-x-auto p-2 bg-white dark:bg-slate-800 rounded">
            {JSON.stringify(formula, null, 2)}
          </pre>
        </CardContent>
      </Card>

      {/* Help Text */}
      <div className="text-xs text-muted-foreground space-y-2">
        <p>
          <strong>Tip:</strong> Use filters to specify which records should be
          included in the calculation.
        </p>
        <p>
          <strong>Static values:</strong> Compare a field to a fixed value (e.g., stop_type = PICKUP)
        </p>
        <p>
          <strong>Field references:</strong> Compare a field to another field (e.g., actual.arrival &lt;= appointment.original_earliest for OTP to original appointment)
        </p>
        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950 rounded border border-blue-200 dark:border-blue-800">
          <p className="font-medium text-blue-800 dark:text-blue-200 mb-1">Example: On-Time Pickup to Original Appointment</p>
          <ul className="list-disc list-inside text-blue-700 dark:text-blue-300 space-y-1">
            <li>Numerator: COUNT(stops) WHERE actual.arrival &lt;= appointment.original_earliest AND stop_type = PICKUP</li>
            <li>Denominator: COUNT(stops) WHERE stop_type = PICKUP</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
