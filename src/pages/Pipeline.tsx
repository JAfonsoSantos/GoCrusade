import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const mockStages = [
  "Prospecting",
  "Qualification",
  "Proposal",
  "Negotiation",
  "Closed Won",
  "Closed Lost",
];

const mockOpportunities = [
  {
    id: "1",
    name: "Continente Q1 Campaign",
    amount: "€25,000",
    closeDate: "2025-01-15",
    advertiser: "Sonae MC",
    stage: "Proposal",
    probability: 60,
  },
  {
    id: "2",
    name: "Wells Summer Promotion",
    amount: "€18,500",
    closeDate: "2025-02-01",
    advertiser: "Procter & Gamble",
    stage: "Negotiation",
    probability: 75,
  },
  {
    id: "3",
    name: "Zu Back to School",
    amount: "€12,000",
    closeDate: "2025-01-28",
    advertiser: "Mattel",
    stage: "Qualification",
    probability: 40,
  },
];

export default function Pipeline() {
  const [view, setView] = useState<"kanban" | "list">("kanban");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pipeline</h1>
          <p className="text-muted-foreground">Manage your sales opportunities</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Opportunity
        </Button>
      </div>

      <Tabs value={view} onValueChange={(v) => setView(v as "kanban" | "list")}>
        <TabsList>
          <TabsTrigger value="kanban">Kanban</TabsTrigger>
          <TabsTrigger value="list">List</TabsTrigger>
        </TabsList>

        <TabsContent value="kanban" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {mockStages.map((stage) => (
              <div key={stage} className="space-y-3">
                <div className="font-semibold text-sm flex items-center justify-between">
                  <span>{stage}</span>
                  <Badge variant="secondary">
                    {mockOpportunities.filter((o) => o.stage === stage).length}
                  </Badge>
                </div>
                <div className="space-y-2">
                  {mockOpportunities
                    .filter((opp) => opp.stage === stage)
                    .map((opp) => (
                      <Card key={opp.id} className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardHeader className="p-4">
                          <CardTitle className="text-sm">{opp.name}</CardTitle>
                          <CardDescription className="text-xs">{opp.advertiser}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-primary">{opp.amount}</span>
                            <Badge variant="outline">{opp.probability}%</Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">{opp.closeDate}</div>
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline" className="flex-1">
                              Link Campaign
                            </Button>
                            <Button size="sm" variant="ghost">
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>All Opportunities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {mockOpportunities.map((opp) => (
                  <div
                    key={opp.id}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <div className="font-semibold">{opp.name}</div>
                      <div className="text-sm text-muted-foreground">{opp.advertiser}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge>{opp.stage}</Badge>
                      <div className="text-right">
                        <div className="font-semibold">{opp.amount}</div>
                        <div className="text-xs text-muted-foreground">{opp.closeDate}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid gap-4 md:grid-cols-3">
        <Button variant="outline" asChild className="h-auto py-4">
          <Link to="/pipeline/advertisers" className="flex flex-col items-start gap-2">
            <span className="font-semibold">Advertisers</span>
            <span className="text-xs text-muted-foreground">Manage advertiser accounts</span>
          </Link>
        </Button>
        <Button variant="outline" asChild className="h-auto py-4">
          <Link to="/pipeline/brands" className="flex flex-col items-start gap-2">
            <span className="font-semibold">Brands</span>
            <span className="text-xs text-muted-foreground">View brand catalog</span>
          </Link>
        </Button>
        <Button variant="outline" asChild className="h-auto py-4">
          <Link to="/pipeline/contacts" className="flex flex-col items-start gap-2">
            <span className="font-semibold">Contacts</span>
            <span className="text-xs text-muted-foreground">Manage contact list</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
