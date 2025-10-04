import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from "next-themes";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/lib/auth";
import { Skeleton } from "@/components/ui/skeleton";

export default function PersonalSettings() {
  const { theme, setTheme } = useTheme();
  const { data: profile, isLoading } = useProfile();
  const { user } = useAuth();
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Personal Settings</h1>
        <p className="text-muted-foreground">Manage your profile and preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <>
              <div>
                <label className="text-sm font-medium">Full Name</label>
                <Skeleton className="h-5 w-48 mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <Skeleton className="h-5 w-64 mt-1" />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="text-sm font-medium">Full Name</label>
                <p className="text-muted-foreground">
                  {profile?.name || user?.user_metadata?.name || 'Not set'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <p className="text-muted-foreground">
                  {profile?.email || user?.email || 'Not set'}
                </p>
              </div>
            </>
          )}
          <Button variant="outline">Edit Profile</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>Password and authentication settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Password</div>
              <p className="text-sm text-muted-foreground">Last changed 3 months ago</p>
            </div>
            <Button variant="outline">Change Password</Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Two-Factor Authentication</div>
              <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
            </div>
            <Badge variant="secondary">Not enabled</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>Language, theme, and timezone settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="language">Language</Label>
              <p className="text-sm text-muted-foreground">Choose your preferred language</p>
            </div>
            <Select defaultValue="en">
              <SelectTrigger className="w-[180px]" id="language">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="pt">Português</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="theme">Theme</Label>
              <p className="text-sm text-muted-foreground">Toggle between light and dark mode</p>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="theme-switch" className="text-sm text-muted-foreground">
                {theme === 'dark' ? 'Dark' : 'Light'}
              </Label>
              <Switch
                id="theme-switch"
                checked={theme === 'dark'}
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="timezone">Timezone</Label>
              <p className="text-sm text-muted-foreground">Your local timezone</p>
            </div>
            <Select defaultValue="europe-lisbon">
              <SelectTrigger className="w-[180px]" id="timezone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="europe-lisbon">Europe/Lisbon</SelectItem>
                <SelectItem value="europe-london">Europe/London</SelectItem>
                <SelectItem value="america-new-york">America/New York</SelectItem>
                <SelectItem value="asia-tokyo">Asia/Tokyo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
