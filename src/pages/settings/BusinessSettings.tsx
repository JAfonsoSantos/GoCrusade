import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Building2, UserPlus } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useBusinesses, useCreateBusiness } from "@/hooks/useBusinesses";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function BusinessSettings() {
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: businesses = [] } = useBusinesses();
  const createBusiness = useCreateBusiness();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  
  const [newBusinessData, setNewBusinessData] = useState({
    name: "",
    region: "EU",
    currency: "EUR",
    timezone: "Europe/Lisbon",
  });

  const handleCreateBusiness = async () => {
    if (!newBusinessData.name.trim()) {
      toast.error("Business name is required");
      return;
    }

    createBusiness.mutate({
      name: newBusinessData.name,
      region: newBusinessData.region,
      settings_json: {
        currency: newBusinessData.currency,
        timezone: newBusinessData.timezone,
      },
    }, {
      onSuccess: () => {
        setCreateModalOpen(false);
        setNewBusinessData({
          name: "",
          region: "EU",
          currency: "EUR",
          timezone: "Europe/Lisbon",
        });
      }
    });
  };

  const handleJoinRequest = () => {
    // This would typically send a request to an admin
    toast.info("Join request functionality coming soon");
    setJoinModalOpen(false);
  };

  if (profileLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Business Settings</h1>
          <p className="text-muted-foreground">Manage company configuration</p>
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  // No business - show creation options
  if (!profile?.business_id) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Business Settings</h1>
          <p className="text-muted-foreground">Get started by creating or joining a business</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setCreateModalOpen(true)}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building2 className="h-6 w-6 text-primary" />
                <CardTitle>Create New Business</CardTitle>
              </div>
              <CardDescription>
                Set up a new business account and invite your team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Create Business
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setJoinModalOpen(true)}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <UserPlus className="h-6 w-6 text-primary" />
                <CardTitle>Join Existing Business</CardTitle>
              </div>
              <CardDescription>
                Request to join an existing business account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                <UserPlus className="mr-2 h-4 w-4" />
                Request to Join
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Create Business Modal */}
        <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Business</DialogTitle>
              <DialogDescription>
                Set up your business account and start managing campaigns
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="business-name">Business Name *</Label>
                <Input
                  id="business-name"
                  value={newBusinessData.name}
                  onChange={(e) => setNewBusinessData({ ...newBusinessData, name: e.target.value })}
                  placeholder="e.g., Acme Retail"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="region">Data Region</Label>
                <Select
                  value={newBusinessData.region}
                  onValueChange={(value) => setNewBusinessData({ ...newBusinessData, region: value })}
                >
                  <SelectTrigger id="region">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EU">Europe</SelectItem>
                    <SelectItem value="US">United States</SelectItem>
                    <SelectItem value="ASIA">Asia Pacific</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={newBusinessData.currency}
                  onValueChange={(value) => setNewBusinessData({ ...newBusinessData, currency: value })}
                >
                  <SelectTrigger id="currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="JPY">JPY (¥)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select
                  value={newBusinessData.timezone}
                  onValueChange={(value) => setNewBusinessData({ ...newBusinessData, timezone: value })}
                >
                  <SelectTrigger id="timezone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Europe/Lisbon">Europe/Lisbon</SelectItem>
                    <SelectItem value="Europe/London">Europe/London</SelectItem>
                    <SelectItem value="America/New_York">America/New York</SelectItem>
                    <SelectItem value="America/Los_Angeles">America/Los Angeles</SelectItem>
                    <SelectItem value="Asia/Tokyo">Asia/Tokyo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateBusiness} disabled={createBusiness.isPending}>
                {createBusiness.isPending ? "Creating..." : "Create Business"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Join Business Modal */}
        <Dialog open={joinModalOpen} onOpenChange={setJoinModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Join Existing Business</DialogTitle>
              <DialogDescription>
                Request access to an existing business account
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="join-business">Select Business</Label>
                <Select>
                  <SelectTrigger id="join-business">
                    <SelectValue placeholder="Choose a business..." />
                  </SelectTrigger>
                  <SelectContent>
                    {businesses.map((business) => (
                      <SelectItem key={business.id} value={business.id}>
                        {business.name}
                      </SelectItem>
                    ))}
                    {businesses.length === 0 && (
                      <SelectItem value="none" disabled>No businesses available</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <p className="text-sm text-muted-foreground">
                Your request will be sent to the business administrators for approval.
              </p>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setJoinModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleJoinRequest}>
                Send Request
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Has business - show settings
  const business = profile.business;
  const settings = (business?.settings_json as any) || {};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Business Settings</h1>
        <p className="text-muted-foreground">Manage company configuration</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
          <CardDescription>Business details and branding</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Company Name</label>
            <p className="text-muted-foreground">{business?.name || 'Not set'}</p>
          </div>
          <div>
            <label className="text-sm font-medium">Data Region</label>
            <p className="text-muted-foreground">{business?.region || 'Not set'}</p>
          </div>
          <div>
            <label className="text-sm font-medium">Currency</label>
            <p className="text-muted-foreground">{settings.currency || 'Not set'}</p>
          </div>
          <div>
            <label className="text-sm font-medium">Timezone</label>
            <p className="text-muted-foreground">{settings.timezone || 'Not set'}</p>
          </div>
          <Button variant="outline">Edit Details</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Users & Roles</CardTitle>
              <CardDescription>Team members and permissions</CardDescription>
            </div>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Invite User
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            User management coming soon
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Salesforce Integration</CardTitle>
          <CardDescription>CRM sync preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Mirror Stages</div>
              <p className="text-sm text-muted-foreground">
                Use Salesforce opportunity stage names
              </p>
            </div>
            <Badge variant="secondary">Not configured</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
