import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDemoStore } from "@/demo/DemoProvider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Flight, Creative, CampaignStatus } from "@/lib/types";

export default function NewCampaign() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const advertisers = useDemoStore((state) => state.advertisers);
  const brands = useDemoStore((state) => state.brands);
  const properties = useDemoStore((state) => state.properties);
  const adUnits = useDemoStore((state) => state.adUnits);
  const opportunities = useDemoStore((state) => state.opportunities);
  const addCampaign = useDemoStore((state) => state.addCampaign);
  const addFlight = useDemoStore((state) => state.addFlight);
  const addCreative = useDemoStore((state) => state.addCreative);

  const [step, setStep] = useState(1);
  const [campaignData, setCampaignData] = useState({
    name: "",
    advertiserId: "",
    brandId: "",
    propertyId: "",
    budget: "",
    owner: "Demo User",
    status: "draft" as CampaignStatus,
  });

  const [flights, setFlights] = useState<
    Partial<Flight & { tempId: string; adUnitName: string }>[]
  >([]);
  const [creatives, setCreatives] = useState<Partial<Creative & { tempId: string }>[]>([]);
  const [selectedOpportunities, setSelectedOpportunities] = useState<string[]>([]);

  const handleNext = () => {
    if (step === 1 && (!campaignData.name || !campaignData.advertiserId || !campaignData.propertyId)) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    if (step === 3 && flights.length === 0) {
      toast({
        title: "No flights",
        description: "Add at least one flight to continue",
        variant: "destructive",
      });
      return;
    }
    setStep(step + 1);
  };

  const handleBack = () => setStep(step - 1);

  const handleCreate = () => {
    const campaignId = `camp-${Date.now()}`;
    
    addCampaign({
      id: campaignId,
      business_id: "demo-business-1",
      advertiser_id: campaignData.advertiserId,
      property_id: campaignData.propertyId,
      name: campaignData.name,
      status: campaignData.status,
      budget: campaignData.budget ? parseFloat(campaignData.budget) : undefined,
      owner: campaignData.owner,
    });

    flights.forEach((flight, idx) => {
      addFlight({
        id: `flight-${Date.now()}-${idx}`,
        campaign_id: campaignId,
        ad_unit_id: flight.ad_unit_id || adUnits[0]?.id || "",
        name: flight.name || `Flight ${idx + 1}`,
        start_at: flight.start_at,
        end_at: flight.end_at,
        always_on: flight.always_on || false,
        pricing_model: flight.pricing_model || "CPM",
        rate: flight.rate || 0,
        goal_type: flight.goal_type || "IMPRESSIONS",
        goal_amount: flight.goal_amount,
        priority: flight.priority || "standard",
        timezone: flight.timezone || "Europe/Lisbon",
      });
    });

    creatives.forEach((creative, idx) => {
      addCreative({
        id: `creative-${Date.now()}-${idx}`,
        campaign_id: campaignId,
        name: creative.name || `Creative ${idx + 1}`,
        type: creative.type || "image",
        url: creative.url || "",
        width: creative.width,
        height: creative.height,
      });
    });

    toast({
      title: "Campaign created",
      description: `${campaignData.name} has been created successfully`,
    });

    navigate("/campaigns");
  };

  const addNewFlight = () => {
    setFlights([
      ...flights,
      {
        tempId: `temp-${Date.now()}`,
        name: `Flight ${flights.length + 1}`,
        ad_unit_id: adUnits[0]?.id,
        adUnitName: adUnits[0]?.name || "",
        pricing_model: "CPM",
        rate: 5.0,
        goal_type: "IMPRESSIONS",
        goal_amount: 100000,
        priority: "standard",
        always_on: false,
        timezone: "Europe/Lisbon",
      },
    ]);
  };

  const addNewCreative = () => {
    setCreatives([
      ...creatives,
      {
        tempId: `temp-${Date.now()}`,
        name: `Creative ${creatives.length + 1}`,
        type: "image",
        url: "https://placeholder.svg",
        width: 300,
        height: 250,
      },
    ]);
  };

  const selectedBrands = brands.filter((b) => b.advertiser_id === campaignData.advertiserId);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/campaigns">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">New Campaign</h1>
          <p className="text-muted-foreground">Create a new advertising campaign</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Campaign Wizard</CardTitle>
          <CardDescription>Step {step} of 5</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step Indicators */}
          <div className="space-y-4">
            {[
              { num: 1, label: "Basics" },
              { num: 2, label: "Link Opportunities" },
              { num: 3, label: "Flights" },
              { num: 4, label: "Creatives" },
              { num: 5, label: "Review & Create" },
            ].map((s) => (
              <div key={s.num} className="flex items-center gap-3">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full font-semibold ${
                    step === s.num
                      ? "bg-primary text-primary-foreground"
                      : step > s.num
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step > s.num ? <Check className="h-4 w-4" /> : s.num}
                </div>
                <span
                  className={
                    step === s.num ? "font-semibold" : step > s.num ? "text-primary" : "text-muted-foreground"
                  }
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          {/* Step 1: Basics */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Campaign Name *</Label>
                <Input
                  id="name"
                  value={campaignData.name}
                  onChange={(e) => setCampaignData({ ...campaignData, name: e.target.value })}
                  placeholder="e.g. Summer Campaign 2025"
                />
              </div>
              <div>
                <Label htmlFor="advertiser">Advertiser *</Label>
                <Select
                  value={campaignData.advertiserId}
                  onValueChange={(v) =>
                    setCampaignData({ ...campaignData, advertiserId: v, brandId: "" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select advertiser" />
                  </SelectTrigger>
                  <SelectContent>
                    {advertisers.map((adv) => (
                      <SelectItem key={adv.id} value={adv.id}>
                        {adv.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="brand">Brand</Label>
                <Select
                  value={campaignData.brandId}
                  onValueChange={(v) => setCampaignData({ ...campaignData, brandId: v })}
                  disabled={!campaignData.advertiserId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select brand (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedBrands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="property">Property *</Label>
                <Select
                  value={campaignData.propertyId}
                  onValueChange={(v) => setCampaignData({ ...campaignData, propertyId: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select property" />
                  </SelectTrigger>
                  <SelectContent>
                    {properties.map((prop) => (
                      <SelectItem key={prop.id} value={prop.id}>
                        {prop.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="budget">Budget (€)</Label>
                <Input
                  id="budget"
                  type="number"
                  value={campaignData.budget}
                  onChange={(e) => setCampaignData({ ...campaignData, budget: e.target.value })}
                  placeholder="e.g. 50000"
                />
              </div>
            </div>
          )}

          {/* Step 2: Opportunities */}
          {step === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Link this campaign to existing opportunities (optional)
              </p>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {opportunities
                  .filter((o) => o.advertiser_id === campaignData.advertiserId)
                  .map((opp) => (
                    <div key={opp.id} className="flex items-center gap-2 p-3 border rounded">
                      <input
                        type="checkbox"
                        checked={selectedOpportunities.includes(opp.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedOpportunities([...selectedOpportunities, opp.id]);
                          } else {
                            setSelectedOpportunities(
                              selectedOpportunities.filter((id) => id !== opp.id)
                            );
                          }
                        }}
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-sm">{opp.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {opp.stage} • €{opp.amount?.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Step 3: Flights */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Add flights to this campaign</p>
                <Button onClick={addNewFlight} size="sm">
                  Add Flight
                </Button>
              </div>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {flights.map((flight, idx) => (
                  <div key={flight.tempId} className="p-3 border rounded space-y-2">
                    <Input
                      placeholder="Flight name"
                      value={flight.name}
                      onChange={(e) => {
                        const updated = [...flights];
                        updated[idx].name = e.target.value;
                        setFlights(updated);
                      }}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Select
                        value={flight.ad_unit_id}
                        onValueChange={(v) => {
                          const updated = [...flights];
                          updated[idx].ad_unit_id = v;
                          updated[idx].adUnitName =
                            adUnits.find((au) => au.id === v)?.name || "";
                          setFlights(updated);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Ad Unit" />
                        </SelectTrigger>
                        <SelectContent>
                          {adUnits.map((au) => (
                            <SelectItem key={au.id} value={au.id}>
                              {au.name} ({au.width}x{au.height})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select
                        value={flight.pricing_model}
                        onValueChange={(v: any) => {
                          const updated = [...flights];
                          updated[idx].pricing_model = v;
                          setFlights(updated);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CPM">CPM</SelectItem>
                          <SelectItem value="CPC">CPC</SelectItem>
                          <SelectItem value="CPA">CPA</SelectItem>
                          <SelectItem value="FLAT">FLAT</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setFlights(flights.filter((f) => f.tempId !== flight.tempId))}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Creatives */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Add creatives (optional)</p>
                <Button onClick={addNewCreative} size="sm">
                  Add Creative
                </Button>
              </div>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {creatives.map((creative, idx) => (
                  <div key={creative.tempId} className="p-3 border rounded space-y-2">
                    <Input
                      placeholder="Creative name"
                      value={creative.name}
                      onChange={(e) => {
                        const updated = [...creatives];
                        updated[idx].name = e.target.value;
                        setCreatives(updated);
                      }}
                    />
                    <Input
                      placeholder="URL"
                      value={creative.url}
                      onChange={(e) => {
                        const updated = [...creatives];
                        updated[idx].url = e.target.value;
                        setCreatives(updated);
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setCreatives(creatives.filter((c) => c.tempId !== creative.tempId))
                      }
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Review */}
          {step === 5 && (
            <div className="space-y-4">
              <h3 className="font-semibold">Review Campaign</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-semibold">Name:</span> {campaignData.name}
                </div>
                <div>
                  <span className="font-semibold">Advertiser:</span>{" "}
                  {advertisers.find((a) => a.id === campaignData.advertiserId)?.name}
                </div>
                <div>
                  <span className="font-semibold">Property:</span>{" "}
                  {properties.find((p) => p.id === campaignData.propertyId)?.name}
                </div>
                <div>
                  <span className="font-semibold">Budget:</span> €
                  {campaignData.budget || "—"}
                </div>
                <div>
                  <span className="font-semibold">Flights:</span> {flights.length}
                </div>
                <div>
                  <span className="font-semibold">Creatives:</span> {creatives.length}
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-2 pt-4">
            {step > 1 && (
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            )}
            {step < 5 ? (
              <Button onClick={handleNext}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleCreate}>
                <Check className="mr-2 h-4 w-4" />
                Create Campaign
              </Button>
            )}
            <Button variant="outline" asChild>
              <Link to="/campaigns">Cancel</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
