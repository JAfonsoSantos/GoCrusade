import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

const mockReports = [
  { name: "Continente Q1 2025", pacing: 95, spend: "€12,450", goal: "€25,000", trend: "up" },
  { name: "Wells Beauty", pacing: 88, spend: "€8,200", goal: "€18,500", trend: "up" },
  { name: "Zu Toys", pacing: 0, spend: "€0", goal: "€12,000", trend: "down" },
];

export default function Reports() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">Detailed performance reports</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pacing Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockReports.map((report) => (
              <div
                key={report.name}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div className="flex items-center gap-3">
                  {report.trend === "up" ? (
                    <TrendingUp className="h-5 w-5 text-success" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-destructive" />
                  )}
                  <div>
                    <div className="font-semibold">{report.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {report.spend} / {report.goal}
                    </div>
                  </div>
                </div>
                <Badge
                  variant={report.pacing >= 95 ? "default" : report.pacing >= 80 ? "secondary" : "destructive"}
                >
                  {report.pacing}% pacing
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Advertisers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Performance by advertiser account (data pending)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Best performing campaigns this month (data pending)</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
