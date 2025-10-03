import { useParams, Link } from 'react-router-dom';
import { useDemoStore } from '@/demo/DemoProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Play, Pause, Archive } from 'lucide-react';

export default function CampaignDetail() {
  const { id } = useParams<{ id: string }>();
  const { campaigns, flights, advertisers, properties, deliveryData } = useDemoStore();

  const campaign = campaigns.find((c) => c.id === id);
  const campaignFlights = flights.filter((f) => f.campaign_id === id);
  const advertiser = advertisers.find((a) => a.id === campaign?.advertiser_id);
  const property = properties.find((p) => p.id === campaign?.property_id);

  if (!campaign) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/campaigns">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Campaign not found</h1>
          </div>
        </div>
      </div>
    );
  }

  const statusColors = {
    draft: 'secondary',
    reserved: 'outline',
    ready: 'default',
    live: 'default',
    paused: 'secondary',
    completed: 'secondary',
    archived: 'secondary',
  } as const;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/campaigns">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">{campaign.name}</h1>
              <Badge variant={statusColors[campaign.status]}>{campaign.status}</Badge>
            </div>
            <p className="text-muted-foreground">
              {advertiser?.name} · {property?.name}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {campaign.status === 'live' && (
            <Button variant="outline">
              <Pause className="mr-2 h-4 w-4" />
              Pause
            </Button>
          )}
          {campaign.status === 'paused' && (
            <Button variant="outline">
              <Play className="mr-2 h-4 w-4" />
              Resume
            </Button>
          )}
          <Button variant="outline">
            <Archive className="mr-2 h-4 w-4" />
            Archive
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campaign.budget ? `€${campaign.budget.toLocaleString()}` : '—'}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Flights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaignFlights.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Impressions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">—</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">CTR</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">—</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="flights" className="space-y-4">
        <TabsList>
          <TabsTrigger value="flights">Flights</TabsTrigger>
          <TabsTrigger value="creatives">Creatives</TabsTrigger>
          <TabsTrigger value="delivery">Delivery</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="flights">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Flights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {campaignFlights.map((flight) => (
                  <div
                    key={flight.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{flight.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {flight.pricing_model} · {flight.always_on ? 'Always-On' : 'Scheduled'}
                      </p>
                    </div>
                    <Badge>{flight.priority}</Badge>
                  </div>
                ))}
                {campaignFlights.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No flights yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="creatives">
          <Card>
            <CardHeader>
              <CardTitle>Creatives</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">No creatives uploaded</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="delivery">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                Connect Kevel to view delivery data
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">No recent activity</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
