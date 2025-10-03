import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDemoStore } from "@/demo/DemoProvider";
import { useToast } from "@/hooks/use-toast";
import { Opportunity, OpportunityStage } from "@/lib/types";

interface NewOpportunityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewOpportunityModal({ open, onOpenChange }: NewOpportunityModalProps) {
  const { advertisers, addOpportunity } = useDemoStore();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    advertiserId: "",
    amount: "",
    closeDate: "",
    owner: "Demo User",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newOpportunity: Opportunity = {
      id: `opp-${Date.now()}`,
      business_id: "demo-business-1",
      advertiser_id: formData.advertiserId,
      name: formData.name,
      stage: "Prospecting" as OpportunityStage,
      amount: parseFloat(formData.amount) || undefined,
      close_date: formData.closeDate || undefined,
      owner: formData.owner,
    };

    addOpportunity(newOpportunity);

    toast({
      title: "Opportunity created",
      description: `${formData.name} has been added to the pipeline`,
    });

    onOpenChange(false);
    setFormData({
      name: "",
      advertiserId: "",
      amount: "",
      closeDate: "",
      owner: "Demo User",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>New Opportunity</DialogTitle>
          <DialogDescription>Create a new deal in your pipeline</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Opportunity Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Q4 Campaign Deal"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="advertiser">Advertiser *</Label>
            <Select
              value={formData.advertiserId}
              onValueChange={(value) => setFormData({ ...formData, advertiserId: value })}
              required
            >
              <SelectTrigger id="advertiser">
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

          <div className="space-y-2">
            <Label htmlFor="amount">Amount (€)</Label>
            <Input
              id="amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="50000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="closeDate">Expected Close Date</Label>
            <Input
              id="closeDate"
              type="date"
              value={formData.closeDate}
              onChange={(e) => setFormData({ ...formData, closeDate: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Opportunity</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
