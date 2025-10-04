import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, List } from "lucide-react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useDemoStore } from "@/demo/DemoProvider";
import { Gantt, Task, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import { FlightDrawer } from "@/features/flights/FlightDrawer";
import { CampaignDrawer } from "@/features/campaigns/CampaignDrawer";
import { Flight, Campaign } from "@/lib/types";
import { calculatePacing, getPacingColor } from "@/lib/pacing";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { openCampaignTab } from "@/lib/openInTab";

const ROW_HEIGHT = 44;
const LIST_WIDTH = "240px";
const COL_WIDTH = 64;
const FONT_SIZE = "12";

export default function Campaigns() {
  const navigate = useNavigate();
  const { campaigns, flights, advertisers, deliveryData } = useDemoStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [flightDrawerOpen, setFlightDrawerOpen] = useState(false);
  const [campaignDrawerOpen, setCampaignDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Month);
  const [filterAdvertiser, setFilterAdvertiser] = useState<string>("all");
  const [expandedCampaignIds, setExpandedCampaignIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  // Auto-open flight drawer from URL query param
  useEffect(() => {
    const flightId = searchParams.get('flight');
    if (flightId) {
      const flight = flights.find(f => f.id === flightId);
      if (flight) {
        setSelectedFlight(flight);
        setFlightDrawerOpen(true);
      }
    }
  }, [searchParams, flights]);

  // Initialize all campaigns as expanded
  useEffect(() => {
    setExpandedCampaignIds(new Set(campaigns.map(c => c.id)));
  }, [campaigns]);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Filter campaigns and flights
  const filteredCampaigns = filterAdvertiser === "all"
    ? campaigns
    : campaigns.filter((c) => c.advertiser_id === filterAdvertiser);

  // Build Gantt tasks with proper campaign span calculation
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const newTasks: Task[] = [];
    
    filteredCampaigns.forEach((campaign) => {
      const campaignFlights = flights.filter((f) => f.campaign_id === campaign.id);
      
      if (campaignFlights.length === 0) return;

      // Calculate campaign span from earliest start to latest end across all flights
      const flightStarts = campaignFlights.map(f => 
        f.start_at ? new Date(f.start_at).getTime() : Date.now()
      );
      const flightEnds = campaignFlights.map(f => {
        if (f.always_on) return Date.now() + 90 * 24 * 60 * 60 * 1000;
        return f.end_at ? new Date(f.end_at).getTime() : Date.now() + 30 * 24 * 60 * 60 * 1000;
      });

      const campaignStart = new Date(Math.min(...flightStarts));
      const campaignEnd = new Date(Math.max(...flightEnds));

      // Campaign task (parent) - use expandedCampaignIds to determine hideChildren
      newTasks.push({
        id: campaign.id,
        name: campaign.name,
        start: campaignStart,
        end: campaignEnd,
        type: "project",
        progress: 0,
        hideChildren: !expandedCampaignIds.has(campaign.id),
        styles: {
          backgroundColor: "#93c5fd",
          backgroundSelectedColor: "#60a5fa",
          progressColor: "#60a5fa",
          progressSelectedColor: "#1d4ed8",
        },
      });

      // Flight tasks (children)
      campaignFlights.forEach((flight) => {
        const flightDelivery = deliveryData.filter((d) => d.flight_id === flight.id);
        const pacing = calculatePacing(flight, flightDelivery);
        const barColor = getPacingColor(pacing.health);

        const start = flight.start_at ? new Date(flight.start_at) : new Date();
        const end = flight.always_on
          ? new Date(start.getTime() + 90 * 24 * 60 * 60 * 1000)
          : flight.end_at
          ? new Date(flight.end_at)
          : new Date(start.getTime() + 30 * 24 * 60 * 60 * 1000);

        newTasks.push({
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
            progressColor: barColor,
            progressSelectedColor: barColor,
          },
        });
      });
    });

    setTasks(newTasks);
  }, [filteredCampaigns, flights, deliveryData, expandedCampaignIds]);

  // Toggle expand/collapse for campaign (caret only)
  const toggleProject = (task: Task) => {
    setExpandedCampaignIds(prev => {
      const next = new Set(prev);
      if (next.has(task.id)) {
        next.delete(task.id);
      } else {
        next.add(task.id);
      }
      return next;
    });
  };

  // Handle bar clicks - flight opens drawer, campaign opens in new tab
  const handleTaskSelect = (task: Task, isSelected: boolean) => {
    if (!task) return;
    
    if (task.type === "project") {
      // Clicking campaign bar opens campaign in new tab
      const campaign = campaigns.find((c) => c.id === task.id);
      if (campaign) {
        openCampaignTab(campaign.id, campaign.name);
        navigate(`/campaigns/${campaign.id}`);
      }
      return;
    }
    
    if (task.type === "task") {
      // Clicking flight bar opens FlightDrawer
      const flight = flights.find((f) => f.id === task.id);
      if (flight) {
        setSelectedFlight(flight);
        setFlightDrawerOpen(true);
        setSearchParams({ flight: flight.id });
      }
    }
  };

  const handleFlightDrawerClose = (open: boolean) => {
    setFlightDrawerOpen(open);
    if (!open) {
      setSearchParams({});
    }
  };

  return (
    <ErrorBoundary fallbackMessage="Unable to load campaigns timeline. Please try reloading the page.">
    <div className="space-y-6 ganttPageRoot">
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
          <div className="mb-4" role="status" aria-live="polite" aria-atomic="true">
            <p className="text-sm text-muted-foreground">
              Scroll horizontally to see more months
            </p>
          </div>
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : tasks.length > 0 ? (
            <div className="ganttScrollContainer">
              <div className="gantt-wrapper">
                <Gantt
                  tasks={tasks}
                  viewMode={viewMode}
                  onSelect={handleTaskSelect}
                  onExpanderClick={toggleProject}
                  columnWidth={COL_WIDTH}
                  listCellWidth={LIST_WIDTH}
                  rowHeight={ROW_HEIGHT}
                  barCornerRadius={3}
                  fontSize={FONT_SIZE}
                  ganttHeight={400}
                />
              </div>
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
        open={flightDrawerOpen}
        onOpenChange={handleFlightDrawerClose}
      />

      <CampaignDrawer
        campaign={selectedCampaign}
        open={campaignDrawerOpen}
        onOpenChange={setCampaignDrawerOpen}
      />
    </div>
    </ErrorBoundary>
  );
}
