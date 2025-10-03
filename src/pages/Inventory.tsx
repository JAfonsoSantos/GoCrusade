import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

const mockAdUnits = [
  { id: "1", name: "Homepage Leaderboard", size: "970x250", property: "continente.pt", iab: "Leaderboard" },
  { id: "2", name: "Sidebar Rectangle", size: "300x250", property: "continente.pt", iab: "Medium Rectangle" },
  { id: "3", name: "Mobile Banner", size: "320x50", property: "continente.pt", iab: "Mobile Banner" },
  { id: "4", name: "Category Top", size: "728x90", property: "wells.pt", iab: "Leaderboard" },
];

export default function Inventory() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
          <p className="text-muted-foreground">Manage properties and ad units</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Properties</CardTitle>
            <CardDescription>Websites and platforms where ads are displayed</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/inventory/properties">
                <Plus className="mr-2 h-4 w-4" />
                Manage Properties
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ad Units</CardTitle>
            <CardDescription>Individual advertising placements</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/inventory/ad-units">
                <Plus className="mr-2 h-4 w-4" />
                Manage Ad Units
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Ad Units</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockAdUnits.map((unit) => (
              <div key={unit.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <div className="font-semibold">{unit.name}</div>
                  <div className="text-sm text-muted-foreground">{unit.property}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{unit.size}</Badge>
                  <Badge variant="secondary">{unit.iab}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
