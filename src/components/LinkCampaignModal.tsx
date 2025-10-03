import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useDemoStore } from "@/demo/DemoProvider";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

interface LinkCampaignModalProps {
  opportunityId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LinkCampaignModal({ opportunityId, open, onOpenChange }: LinkCampaignModalProps) {
  const { opportunities, campaigns, advertisers } = useDemoStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"existing" | "new">("existing");
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  if (!opportunityId) return null;

  const opportunity = opportunities.find((o) => o.id === opportunityId);
  if (!opportunity) return null;

  const advertiser = advertisers.find((a) => a.id === opportunity.advertiser_id);

  // Filter campaigns by advertiser and search term
  const filteredCampaigns = campaigns.filter((c) => {
    const matchesAdvertiser = c.advertiser_id === opportunity.advertiser_id;
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesAdvertiser && matchesSearch;
  });

  const handleLink = () => {
    if (mode === "existing" && selectedCampaignId) {
      // In a real app, this would create a campaign_opportunity link
      toast({
        title: "Campaign Linked",
        description: `Linked campaign to ${opportunity.name}`,
      });
      onOpenChange(false);
    } else if (mode === "new") {
      // Navigate to new campaign wizard with prefilled data
      navigate("/campaigns/new", {
        state: {
          prefill: {
            name: opportunity.name,
            advertiser_id: opportunity.advertiser_id,
            opportunity_id: opportunityId,
          },
        },
      });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Link Campaign</DialogTitle>
          <DialogDescription>
            Link an existing campaign or create a new one for {opportunity.name} ({advertiser?.name})
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <RadioGroup value={mode} onValueChange={(v) => setMode(v as "existing" | "new")}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="existing" id="existing" />
              <Label htmlFor="existing" className="cursor-pointer">
                Link to Existing Campaign
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="new" id="new" />
              <Label htmlFor="new" className="cursor-pointer">
                Create New Campaign
              </Label>
            </div>
          </RadioGroup>

          {mode === "existing" && (
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search campaigns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>

              <ScrollArea className="h-[300px] rounded-md border">
                <div className="p-4 space-y-2">
                  {filteredCampaigns.length > 0 ? (
                    filteredCampaigns.map((campaign) => (
                      <Card
                        key={campaign.id}
                        className={`cursor-pointer transition-colors ${
                          selectedCampaignId === campaign.id
                            ? "border-primary bg-primary/5"
                            : "hover:bg-muted/50"
                        }`}
                        onClick={() => setSelectedCampaignId(campaign.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="font-semibold">{campaign.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {advertiser?.name}
                              </div>
                            </div>
                            <Badge variant="outline">{campaign.status}</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No campaigns found for this advertiser</p>
                      <p className="text-sm mt-2">Try creating a new campaign instead</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          )}

          {mode === "new" && (
            <div className="border rounded-lg p-4 space-y-2">
              <p className="text-sm text-muted-foreground">
                A new campaign will be created with the following details:
              </p>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Name:</span>
                  <span className="text-sm">{opportunity.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Advertiser:</span>
                  <span className="text-sm">{advertiser?.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Amount:</span>
                  <span className="text-sm">€{opportunity.amount?.toLocaleString() || "—"}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                You'll be taken to the campaign wizard to complete the setup
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleLink}
            disabled={mode === "existing" && !selectedCampaignId}
          >
            {mode === "existing" ? "Link Campaign" : "Create Campaign"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
