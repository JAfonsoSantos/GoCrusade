import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, BarChart3, Target } from "lucide-react";
import { Link } from "react-router-dom";

const reportCards = [
  {
    title: "Pacing Overview",
    description: "Campaign delivery and spend analysis",
    icon: TrendingUp,
    link: "/insights/reports",
  },
  {
    title: "Top Advertisers",
    description: "Performance by advertiser account",
    icon: Target,
    link: "/insights/reports",
  },
  {
    title: "Top Campaigns",
    description: "Best performing campaigns this month",
    icon: BarChart3,
    link: "/insights/reports",
  },
];

export default function Insights() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Insights</h1>
          <p className="text-muted-foreground">Analytics and performance reports</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {reportCards.map((card) => (
          <Link key={card.title} to={card.link}>
            <Card className="group cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent mb-4">
                  <card.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle>{card.title}</CardTitle>
                <CardDescription>{card.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Button variant="outline" asChild className="h-auto py-6">
          <Link to="/insights/reports" className="flex flex-col items-start gap-2">
            <BarChart3 className="h-5 w-5" />
            <span className="font-semibold">Reports</span>
            <span className="text-xs text-muted-foreground">View detailed performance reports</span>
          </Link>
        </Button>
        <Button variant="outline" asChild className="h-auto py-6">
          <Link to="/insights/forecast" className="flex flex-col items-start gap-2">
            <TrendingUp className="h-5 w-5" />
            <span className="font-semibold">Forecast</span>
            <span className="text-xs text-muted-foreground">Predict future performance</span>
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Connect Data Sources</CardTitle>
          <CardDescription>
            To enable advanced insights and forecasting, connect your data sources in integrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link to="/integrations">Configure Integrations</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
