import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const mockBrands = [
  { id: "1", name: "Continente", advertiser: "Sonae MC", status: "active" },
  { id: "2", name: "Gillette", advertiser: "P&G", status: "active" },
  { id: "3", name: "Barbie", advertiser: "Mattel", status: "active" },
];

export default function Brands() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Brands</h1>
        <p className="text-muted-foreground">View brand catalog</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Brands</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {mockBrands.map((brand) => (
              <div
                key={brand.id}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div>
                  <div className="font-semibold">{brand.name}</div>
                  <div className="text-sm text-muted-foreground">{brand.advertiser}</div>
                </div>
                <Badge>{brand.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
