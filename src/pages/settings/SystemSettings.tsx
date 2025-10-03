import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { supabaseEnabled } from "@/lib/supabase";
import { resendEnabled, fromEmail, sendTestEmail } from "@/lib/email";
import { useDemoStore } from "@/demo/DemoProvider";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, XCircle, Mail, Database, Loader2, RotateCcw } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function SystemSettings() {
  const { toast } = useToast();
  const { resetDemoData } = useDemoStore();
  const [testEmail, setTestEmail] = useState("");
  const [sending, setSending] = useState(false);

  const handleResetDemoData = () => {
    resetDemoData();
    toast({
      title: "Demo Data Reset",
      description: "All data has been reset to the original demo state",
    });
  };

  const handleSendTestEmail = async () => {
    if (!testEmail.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(testEmail)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setSending(true);
    try {
      const result = await sendTestEmail({
        to: testEmail,
        subject: "Crusade Test Email",
        body: `
          <h1>Test Email from Crusade</h1>
          <p>This is a test email to verify your email configuration.</p>
          <p>If you're seeing this, your email integration is working!</p>
          <p><strong>Sent at:</strong> ${new Date().toLocaleString()}</p>
        `,
      });

      if (result.success) {
        toast({
          title: "Test Email Sent",
          description: result.message,
        });
      } else {
        toast({
          title: "Failed to Send",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send test email",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
        <p className="text-muted-foreground">Integration status and system configuration</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Integration Status</CardTitle>
          <CardDescription>Current state of external service integrations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Supabase Status */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${supabaseEnabled ? 'bg-green-100' : 'bg-muted'}`}>
                <Database className={`h-5 w-5 ${supabaseEnabled ? 'text-green-600' : 'text-muted-foreground'}`} />
              </div>
              <div>
                <div className="font-semibold">Supabase (Database)</div>
                <div className="text-sm text-muted-foreground">
                  {supabaseEnabled ? 'Connected and ready' : 'Not configured (demo mode)'}
                </div>
              </div>
            </div>
            <Badge variant={supabaseEnabled ? "default" : "secondary"}>
              {supabaseEnabled ? (
                <>
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  Connected
                </>
              ) : (
                <>
                  <XCircle className="mr-1 h-3 w-3" />
                  Demo Mode
                </>
              )}
            </Badge>
          </div>

          {/* Resend Status */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${resendEnabled ? 'bg-green-100' : 'bg-muted'}`}>
                <Mail className={`h-5 w-5 ${resendEnabled ? 'text-green-600' : 'text-muted-foreground'}`} />
              </div>
              <div>
                <div className="font-semibold">Resend (Email)</div>
                <div className="text-sm text-muted-foreground">
                  {resendEnabled ? `Configured (${fromEmail})` : 'Not configured (console logging)'}
                </div>
              </div>
            </div>
            <Badge variant={resendEnabled ? "default" : "secondary"}>
              {resendEnabled ? (
                <>
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  Configured
                </>
              ) : (
                <>
                  <XCircle className="mr-1 h-3 w-3" />
                  Demo Mode
                </>
              )}
            </Badge>
          </div>

          {!supabaseEnabled && !resendEnabled && (
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Demo Mode:</strong> The app is running with demo data. To enable live integrations,
                add the required environment variables to your <code className="bg-background px-1 py-0.5 rounded">.env</code> file.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Test Email</CardTitle>
          <CardDescription>
            Send a test email to verify your email configuration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="test-email">Recipient Email</Label>
            <Input
              id="test-email"
              type="email"
              placeholder="your@email.com"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
            />
          </div>

          <Button onClick={handleSendTestEmail} disabled={sending}>
            {sending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Send Test Email
              </>
            )}
          </Button>

          {!resendEnabled && (
            <p className="text-xs text-muted-foreground">
              Note: Email will be logged to console in demo mode. Check the browser console to see the email details.
            </p>
          )}

          {resendEnabled && (
            <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
              <p className="text-xs text-amber-800">
                ⚠️ <strong>Security Warning:</strong> Resend API key detected in frontend code.
                For production, move email sending to a Supabase Edge Function.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Environment Variables</CardTitle>
          <CardDescription>Required configuration for integrations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm font-mono">
            <div className="flex items-center justify-between p-2 bg-muted rounded">
              <code>VITE_SUPABASE_URL</code>
              <Badge variant={supabaseEnabled ? "default" : "secondary"}>
                {supabaseEnabled ? "Set" : "Not Set"}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-muted rounded">
              <code>VITE_SUPABASE_ANON_KEY</code>
              <Badge variant={supabaseEnabled ? "default" : "secondary"}>
                {supabaseEnabled ? "Set" : "Not Set"}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-muted rounded">
              <code>VITE_RESEND_API_KEY</code>
              <Badge variant={resendEnabled ? "default" : "secondary"}>
                {resendEnabled ? "Set" : "Not Set"}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-muted rounded">
              <code>VITE_FROM_EMAIL</code>
              <Badge variant={fromEmail !== 'hello@gocrusade.local' ? "default" : "secondary"}>
                {fromEmail !== 'hello@gocrusade.local' ? "Set" : "Default"}
              </Badge>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-4">
            See <code className="bg-muted px-1 py-0.5 rounded">.env.example</code> for configuration template.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Demo Data</CardTitle>
          <CardDescription>Reset all data to original demo state</CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset Demo Data
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset Demo Data?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will delete all your changes and restore the original demo data.
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleResetDemoData}>
                  Reset Data
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <p className="text-xs text-muted-foreground mt-4">
            Resets campaigns, flights, opportunities, advertisers, brands, contacts, and all related data.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
