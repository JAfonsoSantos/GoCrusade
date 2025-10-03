import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

const mockCampaigns = [
  {
    id: "1",
    name: "Continente Q1 2025",
    advertiser: "Sonae MC",
    status: "active",
    spend: "€12,450",
    goal: "€25,000",
    flights: 3,
  },
  {
    id: "2",
    name: "Wells Beauty Campaign",
    advertiser: "P&G",
    status: "active",
    spend: "€8,200",
    goal: "€18,500",
    flights: 2,
  },
];

export default function CampaignsList() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campaign List</h1>
          <p className="text-muted-foreground">View all campaigns in table format</p>
        </div>
        <Button asChild>
          <Link to="/campaigns/new">
            <Plus className="mr-2 h-4 w-4" />
            New Campaign
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {mockCampaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div>
                  <div className="font-semibold">{campaign.name}</div>
                  <div className="text-sm text-muted-foreground">{campaign.advertiser}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {campaign.spend} / {campaign.goal}
                    </div>
                    <div className="text-xs text-muted-foreground">{campaign.flights} flights</div>
                  </div>
                  <Badge>{campaign.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
