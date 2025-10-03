import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

export default function Forecast() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Forecast</h1>
        <p className="text-muted-foreground">Predict future performance</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent mb-4">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <CardTitle>Connect Data Sources</CardTitle>
          <CardDescription>
            To enable forecasting capabilities, you need to connect your data sources and enable 
            delivery data ingestion from Kevel.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link to="/integrations">Configure Integrations</Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>What You'll Get</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <div className="font-semibold">Revenue Forecasting</div>
            <p className="text-sm text-muted-foreground">
              Predict revenue based on historical performance and current pacing
            </p>
          </div>
          <div>
            <div className="font-semibold">Capacity Planning</div>
            <p className="text-sm text-muted-foreground">
              Understand available inventory and optimal pricing
            </p>
          </div>
          <div>
            <div className="font-semibold">Trend Analysis</div>
            <p className="text-sm text-muted-foreground">
              Identify patterns and seasonal trends in your data
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
