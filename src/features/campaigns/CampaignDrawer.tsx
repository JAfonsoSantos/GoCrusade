import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDemoStore } from "@/demo/DemoProvider";
import { Campaign } from "@/lib/types";
import { Calendar, DollarSign, Target, BarChart3, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { openCampaignTab } from "@/lib/openInTab";

interface CampaignDrawerProps {
  campaign: Campaign | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CampaignDrawer({ campaign, open, onOpenChange }: CampaignDrawerProps) {
  const navigate = useNavigate();
  const { flights, advertisers, properties, deliveryData } = useDemoStore();
  
  if (!campaign) return null;

  const advertiser = advertisers.find(a => a.id === campaign.advertiser_id);
  const property = properties.find(p => p.id === campaign.property_id);
  const campaignFlights = flights.filter(f => f.campaign_id === campaign.id);
  
  // Calculate aggregated stats from flights
  const totalDelivery = campaignFlights.reduce((acc, flight) => {
    const flightData = deliveryData.filter(d => d.flight_id === flight.id);
    const impressions = flightData.reduce((sum, d) => sum + (d.imps || 0), 0);
    const clicks = flightData.reduce((sum, d) => sum + (d.clicks || 0), 0);
    const spend = flightData.reduce((sum, d) => sum + (d.spend || 0), 0);
    
    return {
      impressions: acc.impressions + impressions,
      clicks: acc.clicks + clicks,
      spend: acc.spend + spend,
    };
  }, { impressions: 0, clicks: 0, spend: 0 });

  const ctr = totalDelivery.impressions > 0 
    ? ((totalDelivery.clicks / totalDelivery.impressions) * 100).toFixed(2) 
    : '0.00';

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader>
          <DrawerTitle className="text-2xl">{campaign.name}</DrawerTitle>
          <DrawerDescription>
            {advertiser?.name} • {property?.name}
          </DrawerDescription>
        </DrawerHeader>

        <div className="overflow-y-auto px-6 pb-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="flights">Flights ({campaignFlights.length})</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Status</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <Badge variant={
                      campaign.status === 'live' ? 'default' :
                      campaign.status === 'ready' ? 'secondary' :
                      campaign.status === 'paused' ? 'outline' : 'secondary'
                    }>
                      {campaign.status}
                    </Badge>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Budget</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ${campaign.budget?.toLocaleString() || '0'}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Flights</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{campaignFlights.length}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Property</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm font-medium">{property?.name}</div>
                  </CardContent>
                </Card>
              </div>

              {campaign.sf_id && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Salesforce Integration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Salesforce ID: <code className="text-xs">{campaign.sf_id}</code>
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="flights" className="space-y-3">
              {campaignFlights.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No flights in this campaign</p>
              ) : (
                campaignFlights.map((flight) => {
                  const flightData = deliveryData.filter(d => d.flight_id === flight.id);
                  const impressions = flightData.reduce((sum, d) => sum + (d.imps || 0), 0);
                  
                  return (
                    <Card key={flight.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">{flight.name}</CardTitle>
                          <Badge variant="outline">{flight.pricing_model}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="text-sm space-y-1">
                        <p className="text-muted-foreground">
                          {flight.start_at && format(new Date(flight.start_at), 'MMM d, yyyy')}
                          {flight.always_on ? ' → Always On' : flight.end_at && ` - ${format(new Date(flight.end_at), 'MMM d, yyyy')}`}
                        </p>
                        <p>Delivered: <span className="font-semibold">{impressions.toLocaleString()}</span> impressions</p>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Impressions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalDelivery.impressions.toLocaleString()}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Clicks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalDelivery.clicks.toLocaleString()}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">CTR</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{ctr}%</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Spend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${totalDelivery.spend.toLocaleString()}</div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="border-t p-6 flex justify-between gap-2">
          <Button 
            variant="outline"
            onClick={() => {
              openCampaignTab(campaign.id, campaign.name);
              navigate(`/campaigns/${campaign.id}`);
              onOpenChange(false);
            }}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            View Full Details
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
