import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Building2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account and business preferences</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Link to="/settings/personal">
          <Card className="group cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1">
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent mb-4">
                <User className="h-6 w-6 text-white" />
              </div>
              <CardTitle>Personal Settings</CardTitle>
              <CardDescription>
                Profile, security, connections, and preferences
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/settings/business">
          <Card className="group cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1">
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-purple-600 mb-4">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <CardTitle>Business Settings</CardTitle>
              <CardDescription>
                Company info, users & roles, properties, and configuration
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
}
