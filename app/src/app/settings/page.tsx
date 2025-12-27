"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Configure your metrics engine preferences
        </p>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>
            Configure general application preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select defaultValue="utc">
                <SelectTrigger id="timezone">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="utc">UTC</SelectItem>
                  <SelectItem value="est">Eastern Time (ET)</SelectItem>
                  <SelectItem value="cst">Central Time (CT)</SelectItem>
                  <SelectItem value="mst">Mountain Time (MT)</SelectItem>
                  <SelectItem value="pst">Pacific Time (PT)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select defaultValue="usd">
                <SelectTrigger id="currency">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usd">USD ($)</SelectItem>
                  <SelectItem value="cad">CAD ($)</SelectItem>
                  <SelectItem value="mxn">MXN ($)</SelectItem>
                  <SelectItem value="eur">EUR (&euro;)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date-format">Date Format</Label>
            <Select defaultValue="mdy">
              <SelectTrigger id="date-format" className="w-[200px]">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Metric Defaults */}
      <Card>
        <CardHeader>
          <CardTitle>Metric Defaults</CardTitle>
          <CardDescription>
            Default settings for metric calculations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label>Auto-apply Shipper Fault Segment</Label>
              <p className="text-sm text-muted-foreground">
                Automatically exclude shipper-fault delays from OTP calculations
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label>Auto-apply Test Load Segment</Label>
              <p className="text-sm text-muted-foreground">
                Automatically exclude test loads from all metrics
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label>Include Backup Contracts in Tender Metrics</Label>
              <p className="text-sm text-muted-foreground">
                Include CONTRACT_BACKUP tenders in acceptance rate calculations
              </p>
            </div>
            <Switch />
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="default-grace">Default OTP Grace Period</Label>
              <div className="flex gap-2">
                <Input
                  id="default-grace"
                  type="number"
                  defaultValue="15"
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground self-center">
                  minutes
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cache-ttl">Metric Cache TTL</Label>
              <div className="flex gap-2">
                <Input
                  id="cache-ttl"
                  type="number"
                  defaultValue="5"
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground self-center">
                  minutes
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Settings */}
      <Card>
        <CardHeader>
          <CardTitle>API Configuration</CardTitle>
          <CardDescription>
            Configure API access and rate limits
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="api-key">API Key</Label>
            <div className="flex gap-2">
              <Input
                id="api-key"
                type="password"
                value="sk_live_xxxxxxxxxxxxxxxxx"
                readOnly
                className="font-mono"
              />
              <Button variant="outline">Regenerate</Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Use this key to authenticate API requests
            </p>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>API Rate Limit</Label>
              <p className="text-xl font-semibold">100 requests/min</p>
              <p className="text-sm text-muted-foreground">
                Contact support to increase limits
              </p>
            </div>
            <div className="space-y-2">
              <Label>Bulk Calculation Limit</Label>
              <p className="text-xl font-semibold">10 jobs/hour</p>
              <p className="text-sm text-muted-foreground">
                Maximum concurrent bulk calculation jobs
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button>Save Settings</Button>
      </div>
    </div>
  );
}
