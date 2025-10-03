import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { useDemoStore } from "@/demo/DemoProvider";
import { useState } from "react";

export default function Advertisers() {
  const { advertisers, opportunities } = useDemoStore();
  const [search, setSearch] = useState("");

  const filteredAdvertisers = advertisers.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

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
          <div className="relative mt-2">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search advertisers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredAdvertisers.map((advertiser) => {
              const oppCount = opportunities.filter((o) => o.advertiser_id === advertiser.id).length;
              return (
                <div
                  key={advertiser.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div>
                    <div className="font-semibold">{advertiser.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {advertiser.parent_name || "No parent account"}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">{oppCount} opportunities</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
