import { useState, useEffect } from 'react';
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
import { Badge } from '@/components/ui/badge';
import { useDemoStore } from '@/demo/DemoProvider';
import { useToast } from '@/hooks/use-toast';
import { Save, Trash2, ExternalLink } from 'lucide-react';
import { calculatePacing } from '@/lib/pacing';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface FlightDrawerProps {
  flight: Flight | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FlightDrawer({ flight, open, onOpenChange }: FlightDrawerProps) {
  const { adUnits, updateFlight, deleteFlight, deliveryData } = useDemoStore();
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<Flight>>({});
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    if (flight) {
      setFormData(flight);
    }
  }, [flight]);

  if (!flight) return null;

  const adUnit = adUnits.find((au) => au.id === flight.ad_unit_id);

  const handleSave = () => {
    if (!formData.ad_unit_id || !formData.pricing_model || !formData.goal_type) {
      toast({
        title: 'Validation Error',
        description: 'Please fill all required fields',
        variant: 'destructive',
      });
      return;
    }

    updateFlight(flight.id, formData);
    toast({
      title: 'Flight Updated',
      description: `${formData.name} has been saved`,
    });
    onOpenChange(false);
  };

  const handleDelete = () => {
    deleteFlight(flight.id);
    toast({
      title: 'Flight Deleted',
      description: `${flight.name} has been removed`,
    });
    setShowDeleteDialog(false);
    onOpenChange(false);
  };

  const flightDelivery = deliveryData.filter((d) => d.flight_id === flight.id);
  const totalImps = flightDelivery.reduce((sum, d) => sum + d.imps, 0);
  const totalClicks = flightDelivery.reduce((sum, d) => sum + d.clicks, 0);
  const totalSpend = flightDelivery.reduce((sum, d) => sum + d.spend, 0);
  const totalConvs = flightDelivery.reduce((sum, d) => sum + d.convs, 0);
  const ctr = totalImps > 0 ? ((totalClicks / totalImps) * 100).toFixed(2) : '0';
  
  const pacing = calculatePacing(flight, flightDelivery);
  const pacingHealthColor = pacing.health === 'green' ? 'bg-green-500' : pacing.health === 'amber' ? 'bg-amber-500' : 'bg-red-500';

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader>
            <div className="flex items-start justify-between">
              <div>
                <DrawerTitle>{formData.name || flight.name}</DrawerTitle>
                <DrawerDescription>
                  {formData.pricing_model || flight.pricing_model} · {adUnit ? `${adUnit.width}×${adUnit.height}` : 'Ad Unit'}
                </DrawerDescription>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" disabled>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Edit in Kevel
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Connect Kevel to enable</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
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
                      <Label>Flight Name *</Label>
                      <Input
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Ad Unit *</Label>
                      <Select
                        value={formData.ad_unit_id}
                        onValueChange={(v) => setFormData({ ...formData, ad_unit_id: v })}
                      >
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
                      <Switch
                        checked={formData.always_on || false}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, always_on: checked, end_at: checked ? undefined : formData.end_at })
                        }
                      />
                      <Label>Always-On (no end date)</Label>
                    </div>

                    {!formData.always_on && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Start Date</Label>
                          <Input
                            type="date"
                            value={formData.start_at || ''}
                            onChange={(e) => setFormData({ ...formData, start_at: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>End Date</Label>
                          <Input
                            type="date"
                            value={formData.end_at || ''}
                            onChange={(e) => setFormData({ ...formData, end_at: e.target.value })}
                          />
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Pricing Model *</Label>
                        <Select
                          value={formData.pricing_model}
                          onValueChange={(v: any) => setFormData({ ...formData, pricing_model: v })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="CPM">CPM</SelectItem>
                            <SelectItem value="CPC">CPC</SelectItem>
                            <SelectItem value="CPA">CPA</SelectItem>
                            <SelectItem value="FLAT">Flat Fee</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Rate (€) *</Label>
                        <Input
                          type="number"
                          value={formData.rate || 0}
                          step="0.01"
                          onChange={(e) => setFormData({ ...formData, rate: parseFloat(e.target.value) })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Goal Type *</Label>
                        <Select
                          value={formData.goal_type}
                          onValueChange={(v: any) => setFormData({ ...formData, goal_type: v })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="IMPRESSIONS">Impressions</SelectItem>
                            <SelectItem value="CLICKS">Clicks</SelectItem>
                            <SelectItem value="CONVERSIONS">Conversions</SelectItem>
                            <SelectItem value="SPEND">Spend</SelectItem>
                            <SelectItem value="none">None (Goal-only)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {formData.goal_type !== 'none' && (
                        <div className="space-y-2">
                          <Label>Goal Amount</Label>
                          <Input
                            type="number"
                            value={formData.goal_amount || ''}
                            onChange={(e) => setFormData({ ...formData, goal_amount: parseInt(e.target.value) })}
                          />
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Priority</Label>
                      <Select
                        value={formData.priority}
                        onValueChange={(v: any) => setFormData({ ...formData, priority: v })}
                      >
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
                      <Select
                        value={formData.timezone}
                        onValueChange={(v) => setFormData({ ...formData, timezone: v })}
                      >
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
                      Enable targeting via the Kevel Feature Picker integration. These fields will be available once Kevel is connected.
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
                      <Input placeholder="Desktop, Mobile, iOS, Android..." disabled />
                    </div>
                    <div className="space-y-2">
                      <Label>Audience Segments</Label>
                      <Input placeholder="Select audience..." disabled />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="caps" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Frequency & Daily Caps</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Set daily impression caps and frequency caps per user.
                    </p>
                    <div className="space-y-2">
                      <Label>Daily Impression Cap</Label>
                      <Input
                        type="number"
                        placeholder="e.g., 100000"
                        value={(formData.freq_cap_json as any)?.dailyCap || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            freq_cap_json: { ...(formData.freq_cap_json as any), dailyCap: parseInt(e.target.value) },
                          })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Impressions per User</Label>
                        <Input
                          type="number"
                          placeholder="3"
                          value={(formData.freq_cap_json as any)?.count || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              freq_cap_json: { ...(formData.freq_cap_json as any), count: parseInt(e.target.value) },
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Time Window</Label>
                        <Select
                          value={(formData.freq_cap_json as any)?.window || '1d'}
                          onValueChange={(v) =>
                            setFormData({
                              ...formData,
                              freq_cap_json: { ...(formData.freq_cap_json as any), window: v },
                            })
                          }
                        >
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
                      Upload or link creatives for this flight. Creatives must match ad unit size{' '}
                      {adUnit ? `${adUnit.width}×${adUnit.height}` : ''}.
                    </p>
                    <Button variant="outline" className="w-full">
                      Add Creative
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="delivery" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Delivery Stats</CardTitle>
                      <Badge className={`${pacingHealthColor} text-white`}>
                        {pacing.health === 'green' ? 'On Pace' : pacing.health === 'amber' ? 'At Risk' : 'Behind'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Pacing</span>
                        <span className="font-medium">{pacing.percentage.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Delivered</span>
                        <span className="font-medium">{pacing.delivered.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Goal</span>
                        <span className="font-medium">{pacing.expected.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="border-t pt-4 mt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Impressions</p>
                          <p className="text-2xl font-bold">{totalImps.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Clicks</p>
                          <p className="text-2xl font-bold">{totalClicks.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">CTR</p>
                          <p className="text-2xl font-bold">{ctr}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Spend</p>
                          <p className="text-2xl font-bold">€{totalSpend.toLocaleString()}</p>
                        </div>
                        {totalConvs > 0 && (
                          <div>
                            <p className="text-sm text-muted-foreground">Conversions</p>
                            <p className="text-2xl font-bold">{totalConvs.toLocaleString()}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {flightDelivery.length === 0 && (
                      <p className="text-xs text-muted-foreground">
                        No delivery data yet. Connect Kevel delivery ingest to see real-time stats.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex justify-between gap-2 mt-4">
              <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Archive
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive Flight?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove {flight.name} from the campaign. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Archive</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
