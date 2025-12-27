"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Send, Loader2, CheckCircle2, ArrowRight } from "lucide-react";
import type { MetricDefinition, MetricFormula } from "@/types";

interface AIMetricAssistantProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerate: (metric: Partial<MetricDefinition>) => void;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  generatedMetric?: Partial<MetricDefinition>;
}

// Example prompts to help users get started
const examplePrompts = [
  "Create a metric for on-time pickup percentage to original appointment",
  "I need a metric to track tender acceptance rate for primary contracts only",
  "Calculate average dwell time at delivery locations",
  "Track cost per mile excluding fuel surcharges",
  "Measure on-time delivery percentage excluding customer delays",
];

// Pattern matching for metric generation (simulated AI)
function generateMetricFromPrompt(prompt: string): Partial<MetricDefinition> | null {
  const lowerPrompt = prompt.toLowerCase();

  // On-time pickup patterns
  if (
    (lowerPrompt.includes("on-time") || lowerPrompt.includes("otp") || lowerPrompt.includes("on time")) &&
    lowerPrompt.includes("pickup")
  ) {
    const isOriginal = lowerPrompt.includes("original");
    const excludeShipper = lowerPrompt.includes("exclud") && lowerPrompt.includes("shipper");

    const formula: MetricFormula = {
      type: "percentage",
      numerator: {
        type: "aggregation",
        function: "COUNT",
        field: "stops",
        filter: {
          type: "and",
          conditions: [
            {
              field: "actual.arrival",
              operator: "<=",
              value_type: "field",
              value_field: isOriginal ? "appointment.original_earliest" : "appointment.scheduled_earliest",
              value: isOriginal ? "$appointment.original_earliest" : "$appointment.scheduled_earliest",
            },
            { field: "stop_type", operator: "=", value: "PICKUP", value_type: "static" },
            ...(excludeShipper
              ? [{ field: "late_reason.responsible_party", operator: "!=", value: "SHIPPER", value_type: "static" as const }]
              : []),
          ],
        },
      },
      denominator: {
        type: "aggregation",
        function: "COUNT",
        field: "stops",
        filter: {
          type: "and",
          conditions: [
            { field: "stop_type", operator: "=", value: "PICKUP", value_type: "static" },
            ...(excludeShipper
              ? [{ field: "late_reason.responsible_party", operator: "!=", value: "SHIPPER", value_type: "static" as const }]
              : []),
          ],
        },
      },
    };

    return {
      metric_name: `On-Time Pickup ${isOriginal ? "(Original Appt)" : ""} ${excludeShipper ? "Excl. Shipper" : ""}`.trim(),
      metric_code: `OTP${isOriginal ? "_ORIG" : ""}${excludeShipper ? "_NO_SHIPPER" : ""}`,
      description: `Percentage of pickups arriving on time ${isOriginal ? "compared to original appointment" : "compared to scheduled appointment"}${excludeShipper ? ", excluding shipper-caused delays" : ""}`,
      formula,
      return_type: "PERCENTAGE",
      unit: "%",
      precision: 1,
      category: "PERFORMANCE",
      is_baseline: false,
    };
  }

  // On-time delivery patterns
  if (
    (lowerPrompt.includes("on-time") || lowerPrompt.includes("otd") || lowerPrompt.includes("on time")) &&
    lowerPrompt.includes("deliver")
  ) {
    const excludeCustomer = lowerPrompt.includes("exclud") && lowerPrompt.includes("customer");

    const formula: MetricFormula = {
      type: "percentage",
      numerator: {
        type: "aggregation",
        function: "COUNT",
        field: "stops",
        filter: {
          type: "and",
          conditions: [
            {
              field: "actual.arrival",
              operator: "<=",
              value_type: "field",
              value_field: "appointment.scheduled_latest",
              value: "$appointment.scheduled_latest",
            },
            { field: "stop_type", operator: "=", value: "DELIVERY", value_type: "static" },
            ...(excludeCustomer
              ? [{ field: "late_reason.responsible_party", operator: "!=", value: "CUSTOMER", value_type: "static" as const }]
              : []),
          ],
        },
      },
      denominator: {
        type: "aggregation",
        function: "COUNT",
        field: "stops",
        filter: {
          type: "and",
          conditions: [
            { field: "stop_type", operator: "=", value: "DELIVERY", value_type: "static" },
            ...(excludeCustomer
              ? [{ field: "late_reason.responsible_party", operator: "!=", value: "CUSTOMER", value_type: "static" as const }]
              : []),
          ],
        },
      },
    };

    return {
      metric_name: `On-Time Delivery ${excludeCustomer ? "Excl. Customer" : ""}`.trim(),
      metric_code: `OTD${excludeCustomer ? "_NO_CUSTOMER" : ""}`,
      description: `Percentage of deliveries arriving on time${excludeCustomer ? ", excluding customer-caused delays" : ""}`,
      formula,
      return_type: "PERCENTAGE",
      unit: "%",
      precision: 1,
      category: "PERFORMANCE",
      is_baseline: false,
    };
  }

  // Tender acceptance rate
  if (lowerPrompt.includes("tender") && (lowerPrompt.includes("accept") || lowerPrompt.includes("rate"))) {
    const primaryOnly = lowerPrompt.includes("primary");

    const formula: MetricFormula = {
      type: "percentage",
      numerator: {
        type: "aggregation",
        function: "COUNT",
        field: "tenders",
        filter: {
          type: "and",
          conditions: [
            { field: "status", operator: "=", value: "ACCEPTED", value_type: "static" },
            ...(primaryOnly
              ? [{ field: "contract_type", operator: "=", value: "CONTRACT_PRIMARY", value_type: "static" as const }]
              : []),
          ],
        },
      },
      denominator: {
        type: "aggregation",
        function: "COUNT",
        field: "tenders",
        filter: primaryOnly
          ? { field: "contract_type", operator: "=", value: "CONTRACT_PRIMARY", value_type: "static" }
          : { field: "", operator: "=", value: "", value_type: "static" },
      },
    };

    return {
      metric_name: `Tender Acceptance Rate ${primaryOnly ? "(Primary Only)" : ""}`.trim(),
      metric_code: `TAR${primaryOnly ? "_PRIMARY" : ""}`,
      description: `Percentage of tenders accepted${primaryOnly ? " for primary contracts only" : ""}`,
      formula,
      return_type: "PERCENTAGE",
      unit: "%",
      precision: 1,
      category: "TENDER",
      is_baseline: false,
    };
  }

  // Dwell time
  if (lowerPrompt.includes("dwell")) {
    const isDelivery = lowerPrompt.includes("deliver");
    const isPickup = lowerPrompt.includes("pickup");

    const formula: MetricFormula = {
      type: "average",
      field: "dwell_time_minutes",
      filter: isDelivery
        ? { field: "stop_type", operator: "=", value: "DELIVERY", value_type: "static" }
        : isPickup
          ? { field: "stop_type", operator: "=", value: "PICKUP", value_type: "static" }
          : undefined,
    };

    return {
      metric_name: `Average Dwell Time ${isDelivery ? "(Delivery)" : isPickup ? "(Pickup)" : ""}`.trim(),
      metric_code: `AVG_DWELL${isDelivery ? "_DEL" : isPickup ? "_PU" : ""}`,
      description: `Average dwell time in minutes${isDelivery ? " at delivery locations" : isPickup ? " at pickup locations" : ""}`,
      formula,
      return_type: "DURATION",
      unit: "min",
      precision: 0,
      category: "DWELL",
      is_baseline: false,
    };
  }

  // Cost per mile
  if (lowerPrompt.includes("cost") && lowerPrompt.includes("mile")) {
    const excludeFuel = lowerPrompt.includes("exclud") && lowerPrompt.includes("fuel");

    const formula: MetricFormula = {
      type: "division",
      numerator: {
        type: "aggregation",
        function: "SUM",
        field: "charges.line_items",
        filter: excludeFuel
          ? { field: "charge_type", operator: "!=", value: "FUEL_SURCHARGE", value_type: "static" }
          : { field: "", operator: "=", value: "", value_type: "static" },
      },
      denominator: {
        type: "aggregation",
        function: "SUM",
        field: "loads",
        filter: { field: "length_of_haul.value", operator: ">", value: 0, value_type: "static" },
      },
    };

    return {
      metric_name: `Cost Per Mile ${excludeFuel ? "(Excl. Fuel)" : ""}`.trim(),
      metric_code: `CPM${excludeFuel ? "_NO_FUEL" : ""}`,
      description: `Average cost per mile${excludeFuel ? " excluding fuel surcharges" : ""}`,
      formula,
      return_type: "CURRENCY",
      unit: "USD",
      precision: 2,
      category: "COST",
      is_baseline: false,
    };
  }

  return null;
}

export function AIMetricAssistant({ open, onOpenChange, onGenerate }: AIMetricAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I can help you create metrics using natural language. Describe what you want to measure, and I'll generate the metric definition for you.\n\nFor example, you could say:\n- \"Create a metric for on-time pickup percentage\"\n- \"I need to track tender acceptance rate\"\n- \"Calculate average dwell time at deliveries\"",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const generatedMetric = generateMetricFromPrompt(userMessage);

    if (generatedMetric) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `I've generated a metric definition based on your request:\n\n**${generatedMetric.metric_name}**\n\n${generatedMetric.description}\n\nClick "Use This Metric" to open the editor with these values pre-filled, where you can review and customize it further.`,
          generatedMetric,
        },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I couldn't understand that request. Could you try rephrasing? Here are some things I can help with:\n\n- On-time pickup/delivery metrics\n- Tender acceptance rates\n- Dwell time calculations\n- Cost per mile metrics\n\nTry being specific about what you want to measure and any filters or exclusions.",
        },
      ]);
    }

    setIsLoading(false);
  };

  const handleUseMetric = (metric: Partial<MetricDefinition>) => {
    onGenerate(metric);
    onOpenChange(false);
    // Reset conversation
    setMessages([
      {
        role: "assistant",
        content:
          "Hi! I can help you create metrics using natural language. Describe what you want to measure, and I'll generate the metric definition for you.",
      },
    ]);
  };

  const handleExampleClick = (example: string) => {
    setInput(example);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            AI Metric Builder
          </SheetTitle>
          <SheetDescription>
            Describe the metric you want to create in plain English
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 flex flex-col min-h-0 mt-4">
          {/* Messages */}
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4 pb-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg p-3 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    {message.generatedMetric && (
                      <div className="mt-3 space-y-2">
                        <Card className="bg-background">
                          <CardContent className="p-3 space-y-2">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                              <span className="font-medium text-sm">
                                {message.generatedMetric.metric_name}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              <Badge variant="outline" className="text-xs">
                                {message.generatedMetric.category}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {message.generatedMetric.return_type}
                              </Badge>
                            </div>
                            <pre className="text-[10px] font-mono bg-muted p-2 rounded overflow-x-auto max-h-32">
                              {JSON.stringify(message.generatedMetric.formula, null, 2)}
                            </pre>
                          </CardContent>
                        </Card>
                        <Button
                          size="sm"
                          className="w-full"
                          onClick={() => handleUseMetric(message.generatedMetric!)}
                        >
                          Use This Metric
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-3">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Example Prompts */}
          {messages.length <= 1 && (
            <div className="py-3 border-t">
              <p className="text-xs text-muted-foreground mb-2">Try one of these:</p>
              <div className="flex flex-wrap gap-1">
                {examplePrompts.slice(0, 3).map((example, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-xs h-auto py-1 px-2"
                    onClick={() => handleExampleClick(example)}
                  >
                    {example.length > 40 ? example.substring(0, 40) + "..." : example}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="border-t pt-4 space-y-2">
            <Textarea
              placeholder="Describe the metric you want to create..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              rows={3}
              className="resize-none"
            />
            <Button onClick={handleSubmit} disabled={!input.trim() || isLoading} className="w-full">
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              Generate Metric
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
