import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdUnits() {
  const { data: adUnits = [], isLoading } = useQuery({
    queryKey: ['ad_units'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ad_unit')
        .select(`
          *,
          property:property(name)
        `)
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

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
          <CardTitle>All Ad Units ({adUnits.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : adUnits.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No ad units found. Create one to get started.
            </div>
          ) : (
            <div className="space-y-2">
              {adUnits.map((unit: any) => (
                <div
                  key={unit.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <div className="font-semibold">{unit.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {unit.property?.name || 'Unknown property'}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{unit.width}×{unit.height}</Badge>
                    {unit.iab_standard && <Badge variant="secondary">IAB Standard</Badge>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
