import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { seedDemoData } from '@/lib/seedDemoData';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2, Database } from 'lucide-react';

export function SeedDemoDataButton() {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleSeed = async () => {
    setLoading(true);
    try {
      const result = await seedDemoData();
      toast.success('Demo data created successfully!');
      console.log('Seeded data:', result);
      
      // Invalidate all queries to refetch with new data
      queryClient.invalidateQueries();
      
      // Reload the page to show new data
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create demo data');
      console.error('Seed error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Welcome to Crusade!
        </CardTitle>
        <CardDescription>
          Get started by creating demo data to explore the platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            This will create a sample business with properties, advertisers, campaigns, and flights
            so you can explore the features of Crusade.
          </p>
          <Button onClick={handleSeed} disabled={loading} size="lg" className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating demo data...
              </>
            ) : (
              <>
                <Database className="mr-2 h-4 w-4" />
                Create Demo Data
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}