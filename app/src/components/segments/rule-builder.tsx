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
import { Plus, X, GitBranch, Filter } from "lucide-react";
import type { SegmentRule } from "@/types";

interface RuleBuilderProps {
  rules: SegmentRule;
  onChange: (rules: SegmentRule) => void;
  appliesTo: string[];
}

// Available fields based on entity type
const fieldsByEntity: Record<string, { value: string; label: string; type: string }[]> = {
  LOAD: [
    { value: "contract_type", label: "Contract Type", type: "select" },
    { value: "load_type", label: "Load Type", type: "select" },
    { value: "load_status", label: "Load Status", type: "select" },
    { value: "mode", label: "Mode", type: "select" },
    { value: "equipment_type", label: "Equipment Type", type: "text" },
    { value: "metadata.is_test", label: "Is Test Load", type: "boolean" },
    { value: "carrier.scac", label: "Carrier SCAC", type: "text" },
    { value: "length_of_haul.value", label: "Length of Haul (miles)", type: "number" },
  ],
  STOP: [
    { value: "stop_type", label: "Stop Type", type: "select" },
    { value: "loading_type", label: "Loading Type", type: "select" },
    { value: "late_reason", label: "Late Reason", type: "null_check" },
    { value: "late_reason.responsible_party", label: "Responsible Party", type: "select" },
    { value: "late_reason.code", label: "Late Reason Code", type: "text" },
    { value: "dwell_time_minutes", label: "Dwell Time (minutes)", type: "number" },
    { value: "location.state", label: "Location State", type: "text" },
    { value: "location.type", label: "Location Type", type: "select" },
  ],
  TENDER: [
    { value: "tender.status", label: "Tender Status", type: "select" },
    { value: "tender.rejection_reason", label: "Rejection Reason", type: "text" },
  ],
};

const fieldValues: Record<string, { value: string; label: string }[]> = {
  contract_type: [
    { value: "CONTRACT_PRIMARY", label: "Primary Contract" },
    { value: "CONTRACT_BACKUP", label: "Backup Contract" },
  ],
  load_type: [
    { value: "SHIPMENT", label: "Shipment" },
    { value: "TENDER", label: "Tender" },
  ],
  load_status: [
    { value: "DELIVERED", label: "Delivered" },
    { value: "IN_TRANSIT", label: "In Transit" },
    { value: "REJECTED", label: "Rejected" },
    { value: "PENDING", label: "Pending" },
  ],
  mode: [
    { value: "TRUCKLOAD", label: "Truckload" },
    { value: "LTL", label: "LTL" },
    { value: "PARCEL", label: "Parcel" },
  ],
  stop_type: [
    { value: "PICKUP", label: "Pickup" },
    { value: "DELIVERY", label: "Delivery" },
  ],
  loading_type: [
    { value: "LIVE", label: "Live" },
    { value: "DROP", label: "Drop" },
  ],
  "late_reason.responsible_party": [
    { value: "SHIPPER", label: "Shipper" },
    { value: "CARRIER", label: "Carrier" },
    { value: "CUSTOMER", label: "Customer" },
    { value: "FORCE_MAJEURE", label: "Force Majeure" },
  ],
  "location.type": [
    { value: "WAREHOUSE", label: "Warehouse" },
    { value: "FULFILLMENT_CENTER", label: "Fulfillment Center" },
    { value: "PORT", label: "Port" },
    { value: "DISTRIBUTION_CENTER", label: "Distribution Center" },
  ],
  "tender.status": [
    { value: "ACCEPTED", label: "Accepted" },
    { value: "REJECTED", label: "Rejected" },
    { value: "PENDING", label: "Pending" },
  ],
};

const operators = [
  { value: "=", label: "equals (=)" },
  { value: "!=", label: "not equals (!=)" },
  { value: ">", label: "greater than (>)" },
  { value: ">=", label: "greater or equal (>=)" },
  { value: "<", label: "less than (<)" },
  { value: "<=", label: "less or equal (<=)" },
  { value: "IS_NULL", label: "is null" },
  { value: "IS_NOT_NULL", label: "is not null" },
  { value: "IN", label: "in list" },
  { value: "NOT_IN", label: "not in list" },
];

export function RuleBuilder({ rules, onChange, appliesTo }: RuleBuilderProps) {
  const [ruleType, setRuleType] = useState<"simple" | "compound">(
    rules.conditions ? "compound" : "simple"
  );

  // Get available fields based on what entities the segment applies to
  const availableFields = appliesTo.flatMap((entity) => fieldsByEntity[entity] || []);

  const getFieldType = (fieldValue: string) => {
    const field = availableFields.find((f) => f.value === fieldValue);
    return field?.type || "text";
  };

  const updateSimpleRule = (updates: Partial<SegmentRule>) => {
    onChange({
      ...rules,
      ...updates,
    });
  };

  const switchToCompound = (logicalOperator: "AND" | "OR") => {
    const currentCondition: SegmentRule = rules.field
      ? { field: rules.field, operator: rules.operator, value: rules.value }
      : { field: "", operator: "=", value: "" };

    onChange({
      type: logicalOperator.toLowerCase(),
      operator: logicalOperator,
      conditions: [currentCondition, { field: "", operator: "=", value: "" }],
    });
    setRuleType("compound");
  };

  const switchToSimple = () => {
    const firstCondition = rules.conditions?.[0];
    onChange({
      field: firstCondition?.field || "",
      operator: firstCondition?.operator || "=",
      value: firstCondition?.value || "",
    });
    setRuleType("simple");
  };

  const updateCondition = (index: number, updates: Partial<SegmentRule>) => {
    if (!rules.conditions) return;
    const newConditions = [...rules.conditions];
    newConditions[index] = { ...newConditions[index], ...updates };
    onChange({
      ...rules,
      conditions: newConditions,
    });
  };

  const addCondition = () => {
    if (!rules.conditions) return;
    onChange({
      ...rules,
      conditions: [...rules.conditions, { field: "", operator: "=", value: "" }],
    });
  };

  const removeCondition = (index: number) => {
    if (!rules.conditions || rules.conditions.length <= 2) return;
    const newConditions = rules.conditions.filter((_, i) => i !== index);
    onChange({
      ...rules,
      conditions: newConditions,
    });
  };

  const updateLogicalOperator = (operator: "AND" | "OR") => {
    onChange({
      ...rules,
      type: operator.toLowerCase(),
      operator: operator,
    });
  };

  const renderValueInput = (
    fieldValue: string,
    currentValue: unknown,
    onUpdate: (value: unknown) => void,
    operator: string
  ) => {
    // No value input needed for null checks
    if (operator === "IS_NULL" || operator === "IS_NOT_NULL") {
      return null;
    }

    const fieldType = getFieldType(fieldValue);
    const selectOptions = fieldValues[fieldValue];

    if (selectOptions) {
      return (
        <Select
          value={currentValue?.toString() || undefined}
          onValueChange={onUpdate}
        >
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Select value" />
          </SelectTrigger>
          <SelectContent>
            {selectOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    if (fieldType === "boolean") {
      return (
        <Select
          value={currentValue?.toString() || undefined}
          onValueChange={(v) => onUpdate(v === "true")}
        >
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Select value" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">True</SelectItem>
            <SelectItem value="false">False</SelectItem>
          </SelectContent>
        </Select>
      );
    }

    if (fieldType === "number") {
      return (
        <Input
          type="number"
          className="h-9"
          placeholder="Enter value"
          value={currentValue?.toString() || ""}
          onChange={(e) => onUpdate(parseFloat(e.target.value) || 0)}
        />
      );
    }

    return (
      <Input
        className="h-9"
        placeholder="Enter value"
        value={currentValue?.toString() || ""}
        onChange={(e) => onUpdate(e.target.value)}
      />
    );
  };

  const renderConditionRow = (
    condition: SegmentRule,
    index: number,
    isCompound: boolean
  ) => (
    <div
      key={index}
      className={`grid gap-2 ${isCompound ? "grid-cols-[1fr_1fr_1fr_auto]" : "grid-cols-3"} items-end`}
    >
      <div>
        <Label className="text-xs">Field</Label>
        <Select
          value={condition.field || undefined}
          onValueChange={(value) =>
            isCompound
              ? updateCondition(index, { field: value, value: "" })
              : updateSimpleRule({ field: value, value: "" })
          }
        >
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Select field" />
          </SelectTrigger>
          <SelectContent>
            {appliesTo.map((entity) => (
              <div key={entity}>
                <div className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase">
                  {entity}
                </div>
                {(fieldsByEntity[entity] || []).map((field) => (
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
          value={condition.operator || "="}
          onValueChange={(value) =>
            isCompound
              ? updateCondition(index, { operator: value })
              : updateSimpleRule({ operator: value })
          }
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
        {renderValueInput(
          condition.field || "",
          condition.value,
          (value) =>
            isCompound
              ? updateCondition(index, { value })
              : updateSimpleRule({ value }),
          condition.operator || "="
        ) || <div className="h-9 flex items-center text-sm text-muted-foreground">N/A</div>}
      </div>
      {isCompound && (
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={() => removeCondition(index)}
          disabled={rules.conditions?.length === 2}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Rule Type Toggle */}
      <div className="flex items-center gap-4">
        <Label>Rule Type</Label>
        <div className="flex gap-2">
          <Button
            variant={ruleType === "simple" ? "default" : "outline"}
            size="sm"
            onClick={switchToSimple}
          >
            <Filter className="h-4 w-4 mr-2" />
            Simple
          </Button>
          <Button
            variant={ruleType === "compound" ? "default" : "outline"}
            size="sm"
            onClick={() => switchToCompound("AND")}
          >
            <GitBranch className="h-4 w-4 mr-2" />
            Compound
          </Button>
        </div>
      </div>

      {appliesTo.length === 0 && (
        <div className="text-center py-8 text-muted-foreground border rounded-lg">
          Please select at least one entity type (Load, Stop, or Tender) to build rules.
        </div>
      )}

      {appliesTo.length > 0 && (
        <>
          {/* Simple Rule */}
          {ruleType === "simple" && (
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Rule Condition
                </CardTitle>
              </CardHeader>
              <CardContent>
                {renderConditionRow(rules, 0, false)}
              </CardContent>
            </Card>
          )}

          {/* Compound Rule */}
          {ruleType === "compound" && rules.conditions && (
            <Card>
              <CardHeader className="py-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <GitBranch className="h-4 w-4" />
                    Compound Rule
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Label className="text-xs">Logical Operator:</Label>
                    <Select
                      value={rules.operator}
                      onValueChange={(v) => updateLogicalOperator(v as "AND" | "OR")}
                    >
                      <SelectTrigger className="w-24 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AND">AND</SelectItem>
                        <SelectItem value="OR">OR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {rules.conditions.map((condition, index) => (
                  <div key={index}>
                    {index > 0 && (
                      <div className="flex justify-center py-2">
                        <Badge variant="secondary">{rules.operator}</Badge>
                      </div>
                    )}
                    {renderConditionRow(condition, index, true)}
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={addCondition}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Condition
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Rule Preview */}
      <Card className="bg-slate-50 dark:bg-slate-900">
        <CardHeader className="py-3">
          <CardTitle className="text-sm">Rule Preview (JSON)</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs font-mono overflow-x-auto p-2 bg-white dark:bg-slate-800 rounded">
            {JSON.stringify(rules, null, 2)}
          </pre>
        </CardContent>
      </Card>

      {/* Help Text */}
      <div className="text-xs text-muted-foreground space-y-1">
        <p>
          <strong>Simple rules</strong> filter based on a single condition.
        </p>
        <p>
          <strong>Compound rules</strong> combine multiple conditions with AND/OR logic.
        </p>
        <p>
          <strong>Example:</strong> To exclude shipper-fault delays, use field
          &quot;late_reason.responsible_party&quot; with operator &quot;!=&quot; and value &quot;SHIPPER&quot;.
        </p>
      </div>
    </div>
  );
}
