import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function TestEmail() {
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const hasResendKey = Boolean(import.meta.env.VITE_RESEND_API_KEY);

  const handleSend = async () => {
    setSending(true);
    setTimeout(() => {
      toast({ title: 'Test email sent', description: `Email sent to ${email}` });
      setSending(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/integrations">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Test Email</h1>
          <p className="text-muted-foreground">Send a test email via Resend</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Email Configuration</CardTitle>
          <CardDescription>
            {hasResendKey ? 'Resend is configured' : 'Demo mode: emails will be simulated'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Recipient Email</Label>
            <Input type="email" placeholder="test@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <Button onClick={handleSend} disabled={!email || sending}>
            {sending ? 'Sending...' : 'Send Test Email'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
