import { useParams, Link } from "react-router-dom";
import { useDemoStore } from "@/demo/DemoProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Package, Building2, Target } from "lucide-react";

export default function BrandDetail() {
  const { id } = useParams<{ id: string }>();
  const { brands, advertisers, campaigns } = useDemoStore();
  
  const brand = brands.find(b => b.id === id);
  const advertiser = brand ? advertisers.find(a => a.id === brand.advertiser_id) : null;
  const brandCampaigns = campaigns.filter(c => {
    // In real app, would have brand_id on campaigns
    // For now, link via advertiser
    return c.advertiser_id === brand?.advertiser_id;
  });

  if (!brand) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link to="/pipeline/brands">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Brands
            </Link>
          </Button>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Brand not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link to="/pipeline/brands">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Brands
          </Link>
        </Button>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Package className="h-8 w-8 text-primary" />
            {brand.name}
          </h1>
          {advertiser && (
            <p className="text-muted-foreground mt-1">
              Owned by <Link to={`/pipeline/advertisers/${advertiser.id}`} className="underline">{advertiser.name}</Link>
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Parent Advertiser</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-medium">{advertiser?.name || "—"}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Related Campaigns</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{brandCampaigns.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Related Campaigns ({brandCampaigns.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {brandCampaigns.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No campaigns found</p>
          ) : (
            <div className="space-y-3">
              {brandCampaigns.map(campaign => (
                <Card key={campaign.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{campaign.name}</CardTitle>
                      <Badge>{campaign.status}</Badge>
                    </div>
                    {campaign.budget && (
                      <p className="text-sm text-muted-foreground">${campaign.budget.toLocaleString()}</p>
                    )}
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
