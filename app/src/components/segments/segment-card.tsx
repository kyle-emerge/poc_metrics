"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Edit, Copy, Trash2, Eye } from "lucide-react";
import type { Segment } from "@/types";

interface SegmentCardProps {
  segment: Segment;
  onEdit?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  onViewRules?: () => void;
  onToggleActive?: (active: boolean) => void;
}

export function SegmentCard({
  segment,
  onEdit,
  onDuplicate,
  onDelete,
  onViewRules,
  onToggleActive,
}: SegmentCardProps) {
  return (
    <Card className="group relative">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{segment.segment_name}</CardTitle>
            <CardDescription className="text-xs font-mono text-muted-foreground">
              {segment.segment_code}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={segment.is_active}
              onCheckedChange={onToggleActive}
            />
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onViewRules}>
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onEdit}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onDuplicate}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={onDelete}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{segment.description}</p>

        <div className="flex flex-wrap gap-2">
          <Badge
            variant={segment.segment_type === "EXCLUSION" ? "destructive" : "default"}
          >
            {segment.segment_type}
          </Badge>
          {segment.auto_apply && (
            <Badge variant="secondary">Auto-Apply</Badge>
          )}
          {!segment.is_active && (
            <Badge variant="outline">Inactive</Badge>
          )}
        </div>

        <div className="space-y-2">
          <div className="text-sm">
            <span className="text-muted-foreground">Applies to:</span>
            <div className="flex gap-1 mt-1">
              {segment.applies_to.map((entity) => (
                <Badge key={entity} variant="outline" className="text-xs">
                  {entity}
                </Badge>
              ))}
            </div>
          </div>

          <div className="text-sm">
            <span className="text-muted-foreground">Affects metrics:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {segment.affected_metrics.slice(0, 3).map((metric) => (
                <Badge key={metric} variant="outline" className="text-xs">
                  {metric}
                </Badge>
              ))}
              {segment.affected_metrics.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{segment.affected_metrics.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
