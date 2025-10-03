import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
  { id: "1", date: "2025-10-03 14:23", recordsIn: 45, recordsOut: 32, errors: 0, duration: "2.3s" },
  { id: "2", date: "2025-10-03 14:08", recordsIn: 38, recordsOut: 28, errors: 1, duration: "1.9s" },
  { id: "3", date: "2025-10-03 13:53", recordsIn: 52, recordsOut: 41, errors: 0, duration: "2.8s" },
  { id: "4", date: "2025-10-03 13:38", recordsIn: 29, recordsOut: 22, errors: 0, duration: "1.5s" },
];

export default function SalesforcePage() {
  const [isConnected, setIsConnected] = useState(true);
  const [syncFrequency, setSyncFrequency] = useState("15");
  const [fieldMappings, setFieldMappings] = useState({
    accountName: "advertiser.name",
    contactEmail: "contact.email",
    opportunityStage: "opportunity.stage",
  });
  const { toast } = useToast();

  const handleConnect = () => {
    setIsConnected(true);
    toast({
      title: "Connected to Salesforce",
      description: "Integration is now active",
    });
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    toast({
      title: "Disconnected from Salesforce",
      description: "Integration has been paused",
    });
  };

  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Salesforce integration settings updated successfully",
    });
  };

  const handleManualSync = () => {
    toast({
      title: "Sync started",
      description: "Manual sync in progress...",
    });
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
          <h1 className="text-3xl font-bold tracking-tight">Salesforce Integration</h1>
          <p className="text-muted-foreground">CRM data sync for opportunities, advertisers, and contacts</p>
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
              <CardDescription>Manage your Salesforce connection</CardDescription>
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
                        Last sync: 2 minutes ago
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {isConnected
                      ? "Connected to Salesforce Production instance"
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
              <CardTitle>About Salesforce Integration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Features</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>Bidirectional sync of Accounts, Contacts, and Opportunities</li>
                  <li>Field mapping with direction control (SF→Crusade, Crusade→SF, or both)</li>
                  <li>Automatic stage mirroring for pipeline consistency</li>
                  <li>Real-time or scheduled sync (5-60 min intervals)</li>
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
              <CardDescription>Configure how Salesforce integrates with Crusade</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="instance">Instance Type</Label>
                <Select defaultValue="production">
                  <SelectTrigger id="instance">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="production">Production</SelectItem>
                    <SelectItem value="sandbox">Sandbox</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="frequency">Sync Frequency</Label>
                <Select value={syncFrequency} onValueChange={setSyncFrequency}>
                  <SelectTrigger id="frequency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">Every 5 minutes</SelectItem>
                    <SelectItem value="15">Every 15 minutes</SelectItem>
                    <SelectItem value="30">Every 30 minutes</SelectItem>
                    <SelectItem value="60">Every hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Field Mapping</CardTitle>
              <CardDescription>Map Salesforce fields to Crusade objects</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="account">Account → Advertiser</Label>
                <Input
                  id="account"
                  value={fieldMappings.accountName}
                  onChange={(e) =>
                    setFieldMappings({ ...fieldMappings, accountName: e.target.value })
                  }
                  placeholder="e.g., advertiser.name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact">Contact → Contact</Label>
                <Input
                  id="contact"
                  value={fieldMappings.contactEmail}
                  onChange={(e) =>
                    setFieldMappings({ ...fieldMappings, contactEmail: e.target.value })
                  }
                  placeholder="e.g., contact.email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="opportunity">Opportunity → Campaign</Label>
                <Input
                  id="opportunity"
                  value={fieldMappings.opportunityStage}
                  onChange={(e) =>
                    setFieldMappings({ ...fieldMappings, opportunityStage: e.target.value })
                  }
                  placeholder="e.g., opportunity.stage"
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
                  <CardDescription>View past synchronization runs</CardDescription>
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
