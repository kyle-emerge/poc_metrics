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
import type { Segment, SegmentRule } from "@/types";

interface AISegmentAssistantProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerate: (segment: Partial<Segment>) => void;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  generatedSegment?: Partial<Segment>;
}

// Example prompts to help users get started
const examplePrompts = [
  "Exclude stops where the shipper caused the delay",
  "Only include primary contract loads",
  "Exclude test loads from all metrics",
  "Filter out weather-related delays",
  "Exclude backup contract tenders from acceptance rate",
];

// Pattern matching for segment generation (simulated AI)
function generateSegmentFromPrompt(prompt: string): Partial<Segment> | null {
  const lowerPrompt = prompt.toLowerCase();

  // Shipper fault exclusion
  if (
    lowerPrompt.includes("shipper") &&
    (lowerPrompt.includes("exclude") || lowerPrompt.includes("fault") || lowerPrompt.includes("delay"))
  ) {
    const rules: SegmentRule = {
      type: "or",
      operator: "OR",
      conditions: [
        { field: "late_reason.responsible_party", operator: "!=", value: "SHIPPER" },
        { field: "late_reason", operator: "IS_NULL" },
      ],
    };

    return {
      segment_name: "Exclude Shipper Fault",
      segment_code: "NO_SHIPPER_FAULT",
      description: "Excludes stops where delays were the shipper's responsibility",
      segment_type: "EXCLUSION",
      applies_to: ["STOP"],
      affected_metrics: ["OTP_EXACT", "OTP_15MIN", "OTP_60MIN"],
      rules,
      auto_apply: true,
      is_active: true,
    };
  }

  // Customer fault exclusion
  if (
    lowerPrompt.includes("customer") &&
    (lowerPrompt.includes("exclude") || lowerPrompt.includes("fault") || lowerPrompt.includes("delay"))
  ) {
    const rules: SegmentRule = {
      type: "or",
      operator: "OR",
      conditions: [
        { field: "late_reason.responsible_party", operator: "!=", value: "CUSTOMER" },
        { field: "late_reason", operator: "IS_NULL" },
      ],
    };

    return {
      segment_name: "Exclude Customer Fault",
      segment_code: "NO_CUSTOMER_FAULT",
      description: "Excludes stops where delays were the customer's responsibility",
      segment_type: "EXCLUSION",
      applies_to: ["STOP"],
      affected_metrics: ["OTD_EXACT", "OTD_15MIN"],
      rules,
      auto_apply: true,
      is_active: true,
    };
  }

  // Carrier fault exclusion
  if (
    lowerPrompt.includes("carrier") &&
    (lowerPrompt.includes("exclude") || lowerPrompt.includes("fault") || lowerPrompt.includes("delay"))
  ) {
    const rules: SegmentRule = {
      type: "or",
      operator: "OR",
      conditions: [
        { field: "late_reason.responsible_party", operator: "!=", value: "CARRIER" },
        { field: "late_reason", operator: "IS_NULL" },
      ],
    };

    return {
      segment_name: "Exclude Carrier Fault",
      segment_code: "NO_CARRIER_FAULT",
      description: "Excludes stops where delays were the carrier's responsibility",
      segment_type: "EXCLUSION",
      applies_to: ["STOP"],
      affected_metrics: ["OTP_EXACT", "OTP_15MIN", "OTD_EXACT", "OTD_15MIN"],
      rules,
      auto_apply: false,
      is_active: true,
    };
  }

  // Primary contract only
  if (lowerPrompt.includes("primary") && lowerPrompt.includes("contract")) {
    const isInclusion = lowerPrompt.includes("only") || lowerPrompt.includes("include");

    const rules: SegmentRule = {
      field: "contract_type",
      operator: isInclusion ? "=" : "!=",
      value: "CONTRACT_PRIMARY",
    };

    return {
      segment_name: isInclusion ? "Primary Contract Only" : "Exclude Primary Contract",
      segment_code: isInclusion ? "PRIMARY_ONLY" : "NO_PRIMARY",
      description: isInclusion
        ? "Includes only primary contract loads"
        : "Excludes primary contract loads",
      segment_type: isInclusion ? "INCLUSION" : "EXCLUSION",
      applies_to: ["LOAD"],
      affected_metrics: ["TENDER_ACCEPTANCE_RATE", "CPM_ALL_IN"],
      rules,
      auto_apply: false,
      is_active: true,
    };
  }

  // Backup contract exclusion
  if (lowerPrompt.includes("backup") && lowerPrompt.includes("contract")) {
    const rules: SegmentRule = {
      field: "contract_type",
      operator: "!=",
      value: "CONTRACT_BACKUP",
    };

    return {
      segment_name: "Exclude Backup Contract",
      segment_code: "NO_BACKUP",
      description: "Excludes backup contract loads from calculations",
      segment_type: "EXCLUSION",
      applies_to: ["LOAD"],
      affected_metrics: ["TENDER_ACCEPTANCE_RATE"],
      rules,
      auto_apply: true,
      is_active: true,
    };
  }

  // Test loads exclusion
  if (lowerPrompt.includes("test") && (lowerPrompt.includes("load") || lowerPrompt.includes("exclude"))) {
    const rules: SegmentRule = {
      type: "or",
      operator: "OR",
      conditions: [
        { field: "metadata.is_test", operator: "!=", value: true },
        { field: "metadata.is_test", operator: "IS_NULL" },
      ],
    };

    return {
      segment_name: "Exclude Test Loads",
      segment_code: "NO_TEST_LOADS",
      description: "Excludes test/trial loads from operational metrics",
      segment_type: "EXCLUSION",
      applies_to: ["LOAD"],
      affected_metrics: ["ALL"],
      rules,
      auto_apply: true,
      is_active: true,
    };
  }

  // Weather delays
  if (lowerPrompt.includes("weather")) {
    const rules: SegmentRule = {
      field: "late_reason.code",
      operator: "!=",
      value: "WEATHER_DELAY",
    };

    return {
      segment_name: "Exclude Weather Delays",
      segment_code: "NO_WEATHER",
      description: "Excludes weather-related delays from on-time metrics",
      segment_type: "EXCLUSION",
      applies_to: ["STOP"],
      affected_metrics: ["OTP_EXACT", "OTP_15MIN", "OTP_60MIN", "OTD_EXACT", "OTD_15MIN"],
      rules,
      auto_apply: false,
      is_active: true,
    };
  }

  // Force majeure
  if (lowerPrompt.includes("force majeure") || (lowerPrompt.includes("force") && lowerPrompt.includes("majeure"))) {
    const rules: SegmentRule = {
      field: "late_reason.responsible_party",
      operator: "!=",
      value: "FORCE_MAJEURE",
    };

    return {
      segment_name: "Exclude Force Majeure",
      segment_code: "NO_FORCE_MAJEURE",
      description: "Excludes delays caused by force majeure events",
      segment_type: "EXCLUSION",
      applies_to: ["STOP"],
      affected_metrics: ["OTP_EXACT", "OTP_15MIN", "OTD_EXACT", "OTD_15MIN"],
      rules,
      auto_apply: false,
      is_active: true,
    };
  }

  // Pickup only
  if (lowerPrompt.includes("pickup") && (lowerPrompt.includes("only") || lowerPrompt.includes("include"))) {
    const rules: SegmentRule = {
      field: "stop_type",
      operator: "=",
      value: "PICKUP",
    };

    return {
      segment_name: "Pickups Only",
      segment_code: "PICKUP_ONLY",
      description: "Includes only pickup stops in calculations",
      segment_type: "INCLUSION",
      applies_to: ["STOP"],
      affected_metrics: ["OTP_EXACT", "OTP_15MIN", "AVG_DWELL_PICKUP"],
      rules,
      auto_apply: false,
      is_active: true,
    };
  }

  // Delivery only
  if (lowerPrompt.includes("delivery") && (lowerPrompt.includes("only") || lowerPrompt.includes("include"))) {
    const rules: SegmentRule = {
      field: "stop_type",
      operator: "=",
      value: "DELIVERY",
    };

    return {
      segment_name: "Deliveries Only",
      segment_code: "DELIVERY_ONLY",
      description: "Includes only delivery stops in calculations",
      segment_type: "INCLUSION",
      applies_to: ["STOP"],
      affected_metrics: ["OTD_EXACT", "OTD_15MIN", "AVG_DWELL_DELIVERY"],
      rules,
      auto_apply: false,
      is_active: true,
    };
  }

  // Live loads only
  if (lowerPrompt.includes("live") && (lowerPrompt.includes("load") || lowerPrompt.includes("only"))) {
    const rules: SegmentRule = {
      field: "loading_type",
      operator: "=",
      value: "LIVE",
    };

    return {
      segment_name: "Live Loads Only",
      segment_code: "LIVE_ONLY",
      description: "Includes only live loading stops (excludes drop trailers)",
      segment_type: "INCLUSION",
      applies_to: ["STOP"],
      affected_metrics: ["AVG_DWELL_TIME"],
      rules,
      auto_apply: false,
      is_active: true,
    };
  }

  // Drop trailer exclusion
  if (lowerPrompt.includes("drop") && (lowerPrompt.includes("trailer") || lowerPrompt.includes("exclude"))) {
    const rules: SegmentRule = {
      field: "loading_type",
      operator: "!=",
      value: "DROP",
    };

    return {
      segment_name: "Exclude Drop Trailers",
      segment_code: "NO_DROP",
      description: "Excludes drop trailer stops from dwell time calculations",
      segment_type: "EXCLUSION",
      applies_to: ["STOP"],
      affected_metrics: ["AVG_DWELL_TIME"],
      rules,
      auto_apply: false,
      is_active: true,
    };
  }

  return null;
}

export function AISegmentAssistant({ open, onOpenChange, onGenerate }: AISegmentAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I can help you create segments using natural language. Describe the filtering rules you need, and I'll generate the segment definition for you.\n\nFor example, you could say:\n- \"Exclude stops where the shipper caused the delay\"\n- \"Only include primary contract loads\"\n- \"Filter out weather-related delays\"",
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

    const generatedSegment = generateSegmentFromPrompt(userMessage);

    if (generatedSegment) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `I've generated a segment definition based on your request:\n\n**${generatedSegment.segment_name}**\n\n${generatedSegment.description}\n\nClick "Use This Segment" to open the editor with these values pre-filled, where you can review and customize it further.`,
          generatedSegment,
        },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I couldn't understand that request. Could you try rephrasing? Here are some things I can help with:\n\n- Excluding delays by responsible party (shipper, carrier, customer)\n- Filtering by contract type (primary, backup)\n- Excluding test loads\n- Weather or force majeure exclusions\n- Stop type filters (pickup, delivery)\n- Loading type filters (live, drop)\n\nTry being specific about what you want to include or exclude.",
        },
      ]);
    }

    setIsLoading(false);
  };

  const handleUseSegment = (segment: Partial<Segment>) => {
    onGenerate(segment);
    onOpenChange(false);
    // Reset conversation
    setMessages([
      {
        role: "assistant",
        content:
          "Hi! I can help you create segments using natural language. Describe the filtering rules you need, and I'll generate the segment definition for you.",
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
            AI Segment Builder
          </SheetTitle>
          <SheetDescription>
            Describe the segment rules you want to create in plain English
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
                    {message.generatedSegment && (
                      <div className="mt-3 space-y-2">
                        <Card className="bg-background">
                          <CardContent className="p-3 space-y-2">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                              <span className="font-medium text-sm">
                                {message.generatedSegment.segment_name}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              <Badge
                                variant={
                                  message.generatedSegment.segment_type === "EXCLUSION"
                                    ? "destructive"
                                    : "default"
                                }
                                className="text-xs"
                              >
                                {message.generatedSegment.segment_type}
                              </Badge>
                              {message.generatedSegment.applies_to?.map((entity) => (
                                <Badge key={entity} variant="outline" className="text-xs">
                                  {entity}
                                </Badge>
                              ))}
                            </div>
                            <pre className="text-[10px] font-mono bg-muted p-2 rounded overflow-x-auto max-h-32">
                              {JSON.stringify(message.generatedSegment.rules, null, 2)}
                            </pre>
                          </CardContent>
                        </Card>
                        <Button
                          size="sm"
                          className="w-full"
                          onClick={() => handleUseSegment(message.generatedSegment!)}
                        >
                          Use This Segment
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
              placeholder="Describe the segment rules you want to create..."
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
              Generate Segment
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
