import { useParams, Link } from "react-router-dom";
import { useDemoStore } from "@/demo/DemoProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Building2, Package, Users, Target } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdvertiserDetail() {
  const { id } = useParams<{ id: string }>();
  const { advertisers, brands, contacts, opportunities, campaigns } = useDemoStore();
  
  const advertiser = advertisers.find(a => a.id === id);
  const advertiserBrands = brands.filter(b => b.advertiser_id === id);
  const advertiserContacts = contacts.filter(c => c.advertiser_id === id);
  const advertiserOpps = opportunities.filter(o => o.advertiser_id === id);
  const advertiserCampaigns = campaigns.filter(c => c.advertiser_id === id);

  if (!advertiser) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link to="/pipeline/advertisers">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Advertisers
            </Link>
          </Button>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Advertiser not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link to="/pipeline/advertisers">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Advertisers
          </Link>
        </Button>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Building2 className="h-8 w-8 text-primary" />
            {advertiser.name}
          </h1>
          {advertiser.parent_name && (
            <p className="text-muted-foreground mt-1">Part of {advertiser.parent_name}</p>
          )}
        </div>
        {advertiser.sf_id && (
          <Badge variant="outline">Synced with Salesforce</Badge>
        )}
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Brands</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{advertiserBrands.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contacts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{advertiserContacts.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Opportunities</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{advertiserOpps.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Campaigns</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{advertiserCampaigns.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="brands" className="w-full">
        <TabsList>
          <TabsTrigger value="brands">Brands ({advertiserBrands.length})</TabsTrigger>
          <TabsTrigger value="contacts">Contacts ({advertiserContacts.length})</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunities ({advertiserOpps.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="brands" className="space-y-4">
          {advertiserBrands.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No brands found
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {advertiserBrands.map(brand => (
                <Card key={brand.id}>
                  <CardHeader>
                    <CardTitle className="text-base">{brand.name}</CardTitle>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="contacts" className="space-y-4">
          {advertiserContacts.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No contacts found
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {advertiserContacts.map(contact => (
                <Card key={contact.id}>
                  <CardHeader>
                    <CardTitle className="text-base">{contact.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{contact.email}</p>
                    {contact.title && <p className="text-sm text-muted-foreground">{contact.title}</p>}
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="opportunities" className="space-y-4">
          {advertiserOpps.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No opportunities found
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {advertiserOpps.map(opp => (
                <Card key={opp.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{opp.name}</CardTitle>
                      <Badge>{opp.stage}</Badge>
                    </div>
                    {opp.amount && (
                      <p className="text-sm text-muted-foreground">${opp.amount.toLocaleString()}</p>
                    )}
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
