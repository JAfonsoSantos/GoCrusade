import { Flight, AdUnit } from '@/lib/types';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useDemoStore } from '@/demo/DemoProvider';

interface FlightDrawerProps {
  flight: Flight | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (updates: Partial<Flight>) => void;
}

export function FlightDrawer({ flight, open, onOpenChange, onSave }: FlightDrawerProps) {
  const { adUnits } = useDemoStore();

  if (!flight) return null;

  const adUnit = adUnits.find((au) => au.id === flight.ad_unit_id);

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader>
          <DrawerTitle>{flight.name}</DrawerTitle>
          <DrawerDescription>
            {flight.pricing_model} · {adUnit ? `${adUnit.width}×${adUnit.height}` : 'Ad Unit'}
          </DrawerDescription>
        </DrawerHeader>

        <div className="overflow-y-auto px-4 pb-4">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="targeting">Targeting</TabsTrigger>
              <TabsTrigger value="caps">Caps</TabsTrigger>
              <TabsTrigger value="creatives">Creatives</TabsTrigger>
              <TabsTrigger value="delivery">Delivery</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Flight Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Ad Unit</Label>
                    <Select value={flight.ad_unit_id}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {adUnits.map((au) => (
                          <SelectItem key={au.id} value={au.id}>
                            {au.name} ({au.width}×{au.height})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch checked={flight.always_on} />
                    <Label>Always-On</Label>
                  </div>

                  {!flight.always_on && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Start Date</Label>
                        <Input type="date" value={flight.start_at || ''} />
                      </div>
                      <div className="space-y-2">
                        <Label>End Date</Label>
                        <Input type="date" value={flight.end_at || ''} />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Pricing Model</Label>
                      <Select value={flight.pricing_model}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CPM">CPM</SelectItem>
                          <SelectItem value="CPC">CPC</SelectItem>
                          <SelectItem value="CPA">CPA</SelectItem>
                          <SelectItem value="FLAT">FLAT</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Rate</Label>
                      <Input type="number" value={flight.rate} step="0.01" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Goal Type</Label>
                      <Select value={flight.goal_type}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="IMPRESSIONS">Impressions</SelectItem>
                          <SelectItem value="CLICKS">Clicks</SelectItem>
                          <SelectItem value="CONVERSIONS">Conversions</SelectItem>
                          <SelectItem value="SPEND">Spend</SelectItem>
                          <SelectItem value="none">None</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {flight.goal_type !== 'none' && (
                      <div className="space-y-2">
                        <Label>Goal Amount</Label>
                        <Input type="number" value={flight.goal_amount || ''} />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select value={flight.priority}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="house">House</SelectItem>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="sponsorship">Sponsorship</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Timezone</Label>
                    <Select value={flight.timezone}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Europe/Lisbon">Europe/Lisbon</SelectItem>
                        <SelectItem value="Europe/London">Europe/London</SelectItem>
                        <SelectItem value="America/New_York">America/New_York</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="targeting" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Targeting Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Targeting features are enabled via the Kevel Feature Picker. Connect Kevel to configure geo-targeting, keywords, device/OS, and dayparting.
                  </p>
                  <div className="space-y-2">
                    <Label>Geo Targeting</Label>
                    <Input placeholder="Countries, regions, cities..." disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Keywords</Label>
                    <Input placeholder="Add keywords..." disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Device/OS</Label>
                    <Input placeholder="Select devices or operating systems..." disabled />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="caps" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Frequency Caps</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Impressions per User</Label>
                      <Input type="number" placeholder="3" />
                    </div>
                    <div className="space-y-2">
                      <Label>Time Window</Label>
                      <Select defaultValue="1d">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1h">1 hour</SelectItem>
                          <SelectItem value="1d">1 day</SelectItem>
                          <SelectItem value="7d">7 days</SelectItem>
                          <SelectItem value="30d">30 days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="creatives" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Associated Creatives</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Upload or link creatives for this flight. Must match ad unit size {adUnit ? `${adUnit.width}×${adUnit.height}` : ''}.
                  </p>
                  <Button variant="outline" className="w-full">Add Creative</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="delivery" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Impressions</p>
                      <p className="text-2xl font-bold">—</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Clicks</p>
                      <p className="text-2xl font-bold">—</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">CTR</p>
                      <p className="text-2xl font-bold">—</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Spend</p>
                      <p className="text-2xl font-bold">—</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Connect Kevel delivery ingest to see real-time stats
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={() => onOpenChange(false)}>
              Save Changes
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
