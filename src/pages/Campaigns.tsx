import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, List, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const mockCampaigns = [
  {
    id: "1",
    name: "Continente Q1 2025",
    advertiser: "Sonae MC",
    flights: 3,
    status: "active",
    spend: "€12,450",
    goal: "€25,000",
    pacing: 95,
    startDate: "2025-01-01",
    endDate: "2025-03-31",
  },
  {
    id: "2",
    name: "Wells Beauty Campaign",
    advertiser: "P&G",
    flights: 2,
    status: "active",
    spend: "€8,200",
    goal: "€18,500",
    pacing: 88,
    startDate: "2025-01-15",
    endDate: "2025-02-28",
  },
  {
    id: "3",
    name: "Zu Toys Promotion",
    advertiser: "Mattel",
    flights: 1,
    status: "paused",
    spend: "€0",
    goal: "€12,000",
    pacing: 0,
    startDate: "2025-02-01",
    endDate: "2025-02-29",
  },
];

const getPacingColor = (pacing: number) => {
  if (pacing >= 95) return "bg-pacing-good";
  if (pacing >= 80) return "bg-pacing-warning";
  return "bg-pacing-danger";
};

export default function Campaigns() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
          <p className="text-muted-foreground">Manage and monitor your advertising campaigns</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/campaigns/list">
              <List className="mr-2 h-4 w-4" />
              List View
            </Link>
          </Button>
          <Button asChild>
            <Link to="/campaigns/new">
              <Plus className="mr-2 h-4 w-4" />
              New Campaign
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Timeline</CardTitle>
              <CardDescription>Visual overview of campaign schedules and performance</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Month</Button>
              <Button variant="outline" size="sm">Quarter</Button>
              <Button variant="outline" size="sm">Custom</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockCampaigns.map((campaign) => (
              <div key={campaign.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-3 w-3 rounded-full ${getPacingColor(campaign.pacing)}`} />
                    <div>
                      <div className="font-semibold">{campaign.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {campaign.advertiser} · {campaign.flights} flights
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-medium">{campaign.spend} / {campaign.goal}</div>
                      <div className="text-xs text-muted-foreground">
                        {campaign.startDate} → {campaign.endDate}
                      </div>
                    </div>
                    <Badge variant={campaign.status === "active" ? "default" : "secondary"}>
                      {campaign.status}
                    </Badge>
                  </div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getPacingColor(campaign.pacing)} transition-all`}
                    style={{ width: `${Math.min(campaign.pacing, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Button variant="outline" asChild className="h-auto py-6">
          <Link to="/campaigns/list" className="flex flex-col items-start gap-2">
            <List className="h-5 w-5" />
            <span className="font-semibold">Campaign List</span>
            <span className="text-xs text-muted-foreground">View all campaigns in a table</span>
          </Link>
        </Button>
        <Button variant="outline" asChild className="h-auto py-6">
          <Link to="/campaigns/creatives" className="flex flex-col items-start gap-2">
            <Calendar className="h-5 w-5" />
            <span className="font-semibold">Creatives</span>
            <span className="text-xs text-muted-foreground">Manage creative assets</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
