import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const integrations = [
  {
    id: "salesforce",
    name: "Salesforce",
    description: "CRM data sync for opportunities, advertisers, and contacts",
    status: "active",
    lastSync: "2 minutes ago",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg",
  },
  {
    id: "kevel",
    name: "Kevel",
    description: "Ad server integration for campaign delivery and inventory",
    status: "active",
    lastSync: "5 minutes ago",
    logo: "https://www.kevel.com/wp-content/uploads/2021/06/kevel-logo.svg",
  },
];

export default function Integrations() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
          <p className="text-muted-foreground">Connect and manage external services</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {integrations.map((integration) => (
          <Card key={integration.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-card border flex items-center justify-center">
                    <img 
                      src={integration.logo} 
                      alt={integration.name}
                      className="h-8 w-8 object-contain"
                    />
                  </div>
                  <div>
                    <CardTitle>{integration.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={integration.status === "active" ? "default" : "secondary"}>
                        {integration.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Last sync: {integration.lastSync}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <CardDescription>{integration.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button variant="outline" className="flex-1" asChild>
                <Link to={`/integrations/${integration.id}`}>
                  <Settings className="mr-2 h-4 w-4" />
                  Configure
                </Link>
              </Button>
              <Button variant="ghost" size="icon">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>How Integrations Work</CardTitle>
          <CardDescription>
            Crusade connects to your existing tools to automate data flow and reduce manual work
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold">Salesforce Integration</h4>
            <p className="text-sm text-muted-foreground">
              Syncs opportunities, advertisers, brands, and contacts bidirectionally. 
              Configure which fields to sync and set up automatic updates.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">Kevel Integration</h4>
            <p className="text-sm text-muted-foreground">
              Imports inventory (ad units), pushes campaigns and flights, and ingests delivery data. 
              Enable features like geo-targeting, frequency caps, and dayparting.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
