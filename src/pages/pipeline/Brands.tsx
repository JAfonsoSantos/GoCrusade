import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useDemoStore } from "@/demo/DemoProvider";
import { useState } from "react";

export default function Brands() {
  const { brands, advertisers } = useDemoStore();
  const [search, setSearch] = useState("");

  const filteredBrands = brands.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Brands</h1>
        <p className="text-muted-foreground">View brand catalog</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Brands</CardTitle>
          <div className="relative mt-2">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search brands..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredBrands.map((brand) => {
              const advertiser = advertisers.find((a) => a.id === brand.advertiser_id);
              return (
                <div
                  key={brand.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div>
                    <div className="font-semibold">{brand.name}</div>
                    <div className="text-sm text-muted-foreground">{advertiser?.name || "Unknown"}</div>
                  </div>
                  <Badge>active</Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
