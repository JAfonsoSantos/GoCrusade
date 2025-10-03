import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const mockAdvertisers = [
  { id: "1", name: "Sonae MC", industry: "Retail", opportunities: 3 },
  { id: "2", name: "Procter & Gamble", industry: "Consumer Goods", opportunities: 2 },
  { id: "3", name: "Mattel", industry: "Toys", opportunities: 1 },
];

export default function Advertisers() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Advertisers</h1>
          <p className="text-muted-foreground">Manage advertiser accounts</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Advertiser
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Advertisers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {mockAdvertisers.map((advertiser) => (
              <div
                key={advertiser.id}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div>
                  <div className="font-semibold">{advertiser.name}</div>
                  <div className="text-sm text-muted-foreground">{advertiser.industry}</div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {advertiser.opportunities} opportunities
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
