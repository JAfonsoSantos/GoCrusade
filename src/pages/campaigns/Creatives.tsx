import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Image as ImageIcon } from "lucide-react";

const mockCreatives = [
  { id: "1", name: "Banner Q1", size: "970x250", format: "image", campaign: "Continente Q1 2025" },
  { id: "2", name: "Mobile Ad", size: "320x50", format: "image", campaign: "Wells Beauty" },
  { id: "3", name: "Sidebar Promo", size: "300x250", format: "html", campaign: "Continente Q1 2025" },
];

export default function Creatives() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Creatives</h1>
          <p className="text-muted-foreground">Manage creative assets</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Upload Creative
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Creatives</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockCreatives.map((creative) => (
              <div key={creative.id} className="rounded-lg border p-4 space-y-3">
                <div className="flex h-32 items-center justify-center bg-muted rounded-lg">
                  <ImageIcon className="h-12 w-12 text-muted-foreground" />
                </div>
                <div>
                  <div className="font-semibold">{creative.name}</div>
                  <div className="text-sm text-muted-foreground">{creative.campaign}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{creative.size}</Badge>
                  <Badge variant="secondary">{creative.format}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
