import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, List } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useDemoStore } from "@/demo/DemoProvider";
import { Gantt, Task, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import { FlightDrawer } from "@/features/flights/FlightDrawer";
import { Flight } from "@/lib/types";
import { calculatePacing, getPacingColor } from "@/lib/pacing";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

export default function Campaigns() {
  const { campaigns, flights, advertisers, deliveryData } = useDemoStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Month);
  const [filterAdvertiser, setFilterAdvertiser] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  // Auto-open drawer from URL query param
  useEffect(() => {
    const flightId = searchParams.get('flight');
    if (flightId) {
      const flight = flights.find(f => f.id === flightId);
      if (flight) {
        setSelectedFlight(flight);
        setDrawerOpen(true);
      }
    }
  }, [searchParams, flights]);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Filter campaigns and flights
  const filteredCampaigns = filterAdvertiser === "all"
    ? campaigns
    : campaigns.filter((c) => c.advertiser_id === filterAdvertiser);

  // Build Gantt tasks
  const tasks: Task[] = [];
  
  filteredCampaigns.forEach((campaign) => {
    const campaignFlights = flights.filter((f) => f.campaign_id === campaign.id);
    
    if (campaignFlights.length === 0) return;

    // Campaign task (parent)
    const campaignStart = campaignFlights.reduce((earliest, f) => {
      const fStart = f.start_at ? new Date(f.start_at) : new Date();
      return fStart < earliest ? fStart : earliest;
    }, new Date(campaignFlights[0].start_at || new Date()));

    const campaignEnd = campaignFlights.reduce((latest, f) => {
      if (f.always_on) return latest;
      const fEnd = f.end_at ? new Date(f.end_at) : new Date();
      return fEnd > latest ? fEnd : latest;
    }, new Date(campaignFlights[0].end_at || new Date()));

    tasks.push({
      id: campaign.id,
      name: campaign.name,
      start: campaignStart,
      end: campaignEnd,
      type: "project",
      progress: 0,
      hideChildren: false,
      styles: {
        backgroundColor: "hsl(var(--primary))",
        backgroundSelectedColor: "hsl(var(--primary))",
      },
    });

    // Flight tasks (children)
    campaignFlights.forEach((flight) => {
      const flightDelivery = deliveryData.filter((d) => d.flight_id === flight.id);

      const pacing = calculatePacing(flight, flightDelivery);
      const barColor = getPacingColor(pacing.health);

      const start = flight.start_at ? new Date(flight.start_at) : new Date();
      const end = flight.always_on
        ? new Date(start.getTime() + 90 * 24 * 60 * 60 * 1000) // 90 days for display
        : flight.end_at
        ? new Date(flight.end_at)
        : new Date(start.getTime() + 30 * 24 * 60 * 60 * 1000);

      tasks.push({
        id: flight.id,
        name: `${flight.name} • ${flight.pricing_model} • ${pacing.delivered.toLocaleString()} delivered`,
        start,
        end,
        type: "task",
        progress: pacing.percentage,
        project: campaign.id,
        styles: {
          backgroundColor: barColor,
          backgroundSelectedColor: barColor,
          progressColor: "hsl(var(--primary))",
          progressSelectedColor: "hsl(var(--primary))",
        },
      });
    });
  });

  const handleTaskClick = (task: Task) => {
    if (task.type === "task") {
      const flight = flights.find((f) => f.id === task.id);
      if (flight) {
        setSelectedFlight(flight);
        setDrawerOpen(true);
        setSearchParams({ flight: flight.id });
      }
    }
  };

  const handleDrawerClose = (open: boolean) => {
    setDrawerOpen(open);
    if (!open) {
      setSearchParams({});
    }
  };

  return (
    <ErrorBoundary fallbackMessage="Unable to load campaigns timeline. Please try reloading the page.">
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
          <p className="text-muted-foreground">Timeline view of campaigns and flights</p>
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
              <CardTitle>Gantt Timeline</CardTitle>
              <CardDescription>
                Campaign delivery and pacing • Green (on pace) • Amber (at risk) • Red (behind)
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={filterAdvertiser} onValueChange={setFilterAdvertiser}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Advertisers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Advertisers</SelectItem>
                  {advertisers.map((adv) => (
                    <SelectItem key={adv.id} value={adv.id}>
                      {adv.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ViewMode.Day}>Day</SelectItem>
                  <SelectItem value={ViewMode.Week}>Week</SelectItem>
                  <SelectItem value={ViewMode.Month}>Month</SelectItem>
                  <SelectItem value={ViewMode.Year}>Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : tasks.length > 0 ? (
            <div className="overflow-x-auto">
              <Gantt
                tasks={tasks}
                viewMode={viewMode}
                onClick={handleTaskClick}
                columnWidth={viewMode === ViewMode.Month ? 60 : 40}
                listCellWidth="200px"
                ganttHeight={400}
              />
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No campaigns to display</p>
              <Button asChild className="mt-4">
                <Link to="/campaigns/new">Create Your First Campaign</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <FlightDrawer
        flight={selectedFlight}
        open={drawerOpen}
        onOpenChange={handleDrawerClose}
      />
    </div>
    </ErrorBoundary>
  );
}
