import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

const mockAdUnits = [
  { id: "1", name: "Homepage Leaderboard", size: "970x250", property: "continente.pt", iab: "Leaderboard" },
  { id: "2", name: "Sidebar Rectangle", size: "300x250", property: "continente.pt", iab: "Medium Rectangle" },
  { id: "3", name: "Mobile Banner", size: "320x50", property: "continente.pt", iab: "Mobile Banner" },
  { id: "4", name: "Category Top", size: "728x90", property: "wells.pt", iab: "Leaderboard" },
  { id: "5", name: "Product Sidebar", size: "300x600", property: "wells.pt", iab: "Half Page" },
];

export default function AdUnits() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ad Units</h1>
          <p className="text-muted-foreground">Individual advertising placements</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Ad Unit
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Ad Units</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {mockAdUnits.map((unit) => (
              <div
                key={unit.id}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
              >
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
