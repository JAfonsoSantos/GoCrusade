import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Link as LinkIcon, TrendingUp, Target, Megaphone, DollarSign, Eye, MousePointer } from "lucide-react";
import { Link } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { SeedDemoDataButton } from "@/components/SeedDemoDataButton";

export default function Home() {
  const { data: profile, isLoading } = useProfile();
  
  // Show seed data button if user has no business
  if (!isLoading && !profile?.business_id) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome to Crusade</h1>
          <p className="text-muted-foreground">Let's get you started with some demo data.</p>
        </div>
        <SeedDemoDataButton />
      </div>
    );
  }

  const kpis = [
    { label: "Active Ad Units", value: "24", icon: Target, trend: "+3 this week" },
    { label: "Active Campaigns", value: "12", icon: Megaphone, trend: "2 ending soon" },
    { label: "Total Spend", value: "€45.2K", icon: DollarSign, trend: "+18% vs last month" },
    { label: "Impressions", value: "2.4M", icon: Eye, trend: "+12% vs goal" },
    { label: "CTR", value: "1.8%", icon: MousePointer, trend: "Above avg 1.5%" },
    { label: "Integrations", value: "2/2", icon: LinkIcon, trend: "All synced" },
  ];

  const onboardingCards = [
    {
      title: "Get Started",
      description: "Create your first campaign and start driving results",
      icon: Zap,
      link: "/campaigns/new",
      gradient: "from-primary to-accent",
    },
    {
      title: "Integrate",
      description: "Connect Salesforce and Kevel to automate your workflow",
      icon: LinkIcon,
      link: "/integrations",
      gradient: "from-accent to-purple-600",
    },
    {
      title: "Optimize",
      description: "View insights and optimize campaign performance",
      icon: TrendingUp,
      link: "/insights/reports",
      gradient: "from-success to-emerald-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-muted-foreground">Here's what's happening with your campaigns today.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {onboardingCards.map((card) => (
          <Link key={card.title} to={card.link}>
            <Card className="group cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1">
              <CardHeader>
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${card.gradient} mb-4`}>
                  <card.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="flex items-center justify-between">
                  {card.title}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </CardTitle>
                <CardDescription>{card.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Key Metrics</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {kpis.map((kpi) => (
            <Card key={kpi.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{kpi.label}</CardTitle>
                <kpi.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{kpi.trend}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks to manage your campaigns</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button asChild>
            <Link to="/campaigns/new">New Campaign</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/pipeline">View Pipeline</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/inventory/ad-units">Manage Inventory</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/insights/reports">View Reports</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
