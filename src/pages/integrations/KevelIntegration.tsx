import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

const steps = ['Connect', 'Inventory Sync', 'Feature Picker', 'Entity Mapping', 'Schedule'];

export default function KevelIntegration() {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/integrations">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Kevel Integration</h1>
          <p className="text-muted-foreground">Configure ad server integration</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  index <= currentStep ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}
              >
                {index < currentStep ? <CheckCircle2 className="h-5 w-5" /> : <span>{index + 1}</span>}
              </div>
              <span className="mt-2 text-sm font-medium">{step}</span>
            </div>
            {index < steps.length - 1 && <div className="mx-4 h-0.5 w-16 bg-border" />}
          </div>
        ))}
      </div>

      {currentStep === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Connect to Kevel</CardTitle>
            <CardDescription>Enter your Kevel API credentials</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>API Key</Label>
              <Input type="password" placeholder="Enter your Kevel API key" />
            </div>
            <div className="space-y-2">
              <Label>Network IDs (comma-separated)</Label>
              <Input placeholder="1,2,3" />
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Feature Picker</CardTitle>
            <CardDescription>Enable targeting features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {['Geo Targeting', 'Keywords', 'Frequency Cap', 'Device/OS', 'Dayparting'].map((feature) => (
              <div key={feature} className="flex items-center justify-between">
                <Label>{feature}</Label>
                <Switch />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} disabled={currentStep === 0}>
          Previous
        </Button>
        <Button onClick={() => currentStep < steps.length - 1 && setCurrentStep(currentStep + 1)}>
          {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
        </Button>
      </div>
    </div>
  );
}
