import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, ExternalLink, Play, Power, PowerOff } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface SyncHistoryRecord {
  id: string;
  date: string;
  recordsIn: number;
  recordsOut: number;
  errors: number;
  duration: string;
}

const mockSyncHistory: SyncHistoryRecord[] = [
  { id: "1", date: "2025-10-03 14:25", recordsIn: 128, recordsOut: 15, errors: 0, duration: "4.2s" },
  { id: "2", date: "2025-10-03 13:25", recordsIn: 115, recordsOut: 12, errors: 0, duration: "3.8s" },
  { id: "3", date: "2025-10-03 12:25", recordsIn: 142, recordsOut: 18, errors: 1, duration: "5.1s" },
  { id: "4", date: "2025-10-03 11:25", recordsIn: 98, recordsOut: 9, errors: 0, duration: "3.2s" },
];

export default function KevelPage() {
  const [isConnected, setIsConnected] = useState(true);
  const [syncFrequency, setSyncFrequency] = useState("60");
  const [enabledFeatures, setEnabledFeatures] = useState({
    geoTargeting: true,
    frequencyCaps: true,
    deviceTargeting: false,
    keywordTargeting: true,
  });
  const { toast } = useToast();

  const handleConnect = () => {
    setIsConnected(true);
    toast({
      title: "Connected to Kevel",
      description: "Integration is now active",
    });
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    toast({
      title: "Disconnected from Kevel",
      description: "Integration has been paused",
    });
  };

  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Kevel integration settings updated successfully",
    });
  };

  const handleManualSync = () => {
    toast({
      title: "Sync started",
      description: "Manual delivery ingest in progress...",
    });
  };

  const handleFeatureToggle = (feature: keyof typeof enabledFeatures) => {
    setEnabledFeatures({ ...enabledFeatures, [feature]: !enabledFeatures[feature] });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/integrations">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kevel Integration</h1>
          <p className="text-muted-foreground">Ad server integration for campaign delivery and inventory</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="history">Sync History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Connection Status</CardTitle>
              <CardDescription>Manage your Kevel connection</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={isConnected ? "default" : "secondary"}>
                      {isConnected ? "Active" : "Paused"}
                    </Badge>
                    {isConnected && (
                      <span className="text-sm text-muted-foreground">
                        Last sync: 5 minutes ago
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {isConnected
                      ? "Connected to Kevel Network ID: 12345"
                      : "Integration is currently disconnected"}
                  </p>
                </div>
                {isConnected ? (
                  <Button variant="destructive" onClick={handleDisconnect}>
                    <PowerOff className="mr-2 h-4 w-4" />
                    Disconnect
                  </Button>
                ) : (
                  <Button onClick={handleConnect}>
                    <Power className="mr-2 h-4 w-4" />
                    Connect
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>About Kevel Integration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Features</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>Import inventory (ad units and sizes) from your Kevel account</li>
                  <li>Push campaigns and flights to Kevel for delivery</li>
                  <li>Ingest delivery data (impressions, clicks, conversions, spend)</li>
                  <li>Enable advanced targeting: geo, keywords, frequency caps, device</li>
                  <li>Adaptive forms showing only fields you actively use</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Resources</h4>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Documentation
                  </Button>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    API Reference
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure how Kevel integrates with Crusade</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <Input
                  id="api-key"
                  type="password"
                  defaultValue="••••••••••••••••"
                  placeholder="Enter Kevel API key"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="network">Network ID</Label>
                <Input id="network" defaultValue="12345" placeholder="Enter Network ID" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="frequency">Delivery Ingest Frequency</Label>
                <Select value={syncFrequency} onValueChange={setSyncFrequency}>
                  <SelectTrigger id="frequency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">Every 30 minutes</SelectItem>
                    <SelectItem value="60">Every hour</SelectItem>
                    <SelectItem value="180">Every 3 hours</SelectItem>
                    <SelectItem value="360">Every 6 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Feature Configuration</CardTitle>
              <CardDescription>Enable or disable advanced targeting features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="geo">Geo Targeting</Label>
                  <p className="text-sm text-muted-foreground">Target flights by country, region, or city</p>
                </div>
                <Switch
                  id="geo"
                  checked={enabledFeatures.geoTargeting}
                  onCheckedChange={() => handleFeatureToggle("geoTargeting")}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="freq">Frequency Caps</Label>
                  <p className="text-sm text-muted-foreground">Limit ad impressions per user</p>
                </div>
                <Switch
                  id="freq"
                  checked={enabledFeatures.frequencyCaps}
                  onCheckedChange={() => handleFeatureToggle("frequencyCaps")}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="device">Device Targeting</Label>
                  <p className="text-sm text-muted-foreground">Target by device type (mobile, desktop, tablet)</p>
                </div>
                <Switch
                  id="device"
                  checked={enabledFeatures.deviceTargeting}
                  onCheckedChange={() => handleFeatureToggle("deviceTargeting")}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="keyword">Keyword Targeting</Label>
                  <p className="text-sm text-muted-foreground">Target by page keywords</p>
                </div>
                <Switch
                  id="keyword"
                  checked={enabledFeatures.keywordTargeting}
                  onCheckedChange={() => handleFeatureToggle("keywordTargeting")}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline">Cancel</Button>
            <Button onClick={handleSaveSettings}>Save Settings</Button>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Sync History</CardTitle>
                  <CardDescription>View past delivery data ingests</CardDescription>
                </div>
                <Button size="sm" onClick={handleManualSync}>
                  <Play className="mr-2 h-4 w-4" />
                  Manual Sync
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Records In</TableHead>
                    <TableHead className="text-right">Records Out</TableHead>
                    <TableHead className="text-right">Errors</TableHead>
                    <TableHead className="text-right">Duration</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockSyncHistory.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.date}</TableCell>
                      <TableCell className="text-right">{record.recordsIn}</TableCell>
                      <TableCell className="text-right">{record.recordsOut}</TableCell>
                      <TableCell className="text-right">
                        {record.errors > 0 ? (
                          <Badge variant="destructive">{record.errors}</Badge>
                        ) : (
                          <span className="text-muted-foreground">0</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {record.duration}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
