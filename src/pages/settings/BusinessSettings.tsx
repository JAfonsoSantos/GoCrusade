import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

const mockUsers = [
  { name: "John Doe", email: "john@example.com", role: "Admin" },
  { name: "Jane Smith", email: "jane@example.com", role: "Sales" },
  { name: "Bob Johnson", email: "bob@example.com", role: "Ad Ops" },
];

export default function BusinessSettings() {
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
            <p className="text-muted-foreground">Kevel Demo</p>
          </div>
          <div>
            <label className="text-sm font-medium">Currency</label>
            <p className="text-muted-foreground">EUR (€)</p>
          </div>
          <div>
            <label className="text-sm font-medium">Timezone</label>
            <p className="text-muted-foreground">Europe/Lisbon</p>
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
          <div className="space-y-2">
            {mockUsers.map((user) => (
              <div
                key={user.email}
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <div>
                  <div className="font-semibold">{user.name}</div>
                  <div className="text-sm text-muted-foreground">{user.email}</div>
                </div>
                <Badge>{user.role}</Badge>
              </div>
            ))}
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
            <Badge variant="secondary">Off</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
