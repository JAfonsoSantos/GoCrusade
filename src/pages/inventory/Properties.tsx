import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

const mockProperties = [
  { id: "1", name: "continente.pt", slug: "continente", adUnits: 12 },
  { id: "2", name: "wells.pt", slug: "wells", adUnits: 8 },
  { id: "3", name: "zu.pt", slug: "zu", adUnits: 6 },
];

export default function Properties() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Properties</h1>
          <p className="text-muted-foreground">Websites and platforms where ads are displayed</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Property
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {mockProperties.map((property) => (
              <div
                key={property.id}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div>
                  <div className="font-semibold">{property.name}</div>
                  <div className="text-sm text-muted-foreground">Slug: {property.slug}</div>
                </div>
                <Badge variant="secondary">{property.adUnits} ad units</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
