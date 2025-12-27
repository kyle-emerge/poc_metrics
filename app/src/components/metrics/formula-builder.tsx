"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Plus,
  X,
  Calculator,
  Filter,
  Hash,
  Clock,
  DollarSign,
  Percent,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import type { MetricFormula } from "@/types";

interface FormulaBuilderProps {
  formula: MetricFormula;
  onChange: (formula: MetricFormula) => void;
}

// Available fields for formulas
const availableFields = {
  load: [
    { value: "length_of_haul.value", label: "Length of Haul (miles)" },
    { value: "charges.line_items.amount.value", label: "Charge Amount" },
    { value: "tender.response_time", label: "Tender Response Time" },
  ],
  stop: [
    { value: "actual.arrival", label: "Actual Arrival" },
    { value: "actual.departure", label: "Actual Departure" },
    { value: "appointment.scheduled_earliest", label: "Scheduled Earliest" },
    { value: "appointment.scheduled_latest", label: "Scheduled Latest" },
    { value: "dwell_time_minutes", label: "Dwell Time (minutes)" },
    { value: "stop_type", label: "Stop Type" },
  ],
  charge: [
    { value: "charge_type", label: "Charge Type" },
    { value: "amount.value", label: "Amount" },
  ],
  tender: [
    { value: "status", label: "Tender Status" },
    { value: "tendered_at", label: "Tendered At" },
    { value: "accepted_at", label: "Accepted At" },
    { value: "rejected_at", label: "Rejected At" },
  ],
  late_reason: [
    { value: "late_reason.responsible_party", label: "Responsible Party" },
    { value: "late_reason.code", label: "Late Reason Code" },
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
            filter: { field: "", operator: "=", value: "" },
          },
          denominator: {
            type: "aggregation",
            function: "COUNT",
            field: "stops",
            filter: { field: "", operator: "=", value: "" },
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
          filter: { field: "", operator: "=", value: "" },
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
      <div className="grid grid-cols-3 gap-2">
        <div>
          <Label className="text-xs">Field</Label>
          <Select
            value={filter?.field || undefined}
            onValueChange={(value) => onUpdate({ field: value })}
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
                      {field.label}
                    </SelectItem>
                  ))}
                </div>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
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
        <div>
          <Label className="text-xs">Value</Label>
          <Input
            className="h-9"
            placeholder="Value"
            value={filter?.value?.toString() || ""}
            onChange={(e) => onUpdate({ value: e.target.value })}
          />
        </div>
      </div>
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
                      .filter((f) => !f.value.includes("type") && !f.value.includes("status"))
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
      <div className="text-xs text-muted-foreground space-y-1">
        <p>
          <strong>Tip:</strong> Use filters to specify which records should be
          included in the calculation.
        </p>
        <p>
          Example: To calculate OTP for pickups only, set the filter to
          &quot;stop_type = PICKUP&quot;
        </p>
      </div>
    </div>
  );
}
