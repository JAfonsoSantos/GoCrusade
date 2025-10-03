import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AppLayout } from "@/components/layout/AppLayout";
import { CommandPalette } from "@/components/CommandPalette";
import Home from "./pages/Home";
import Pipeline from "./pages/Pipeline";
import Campaigns from "./pages/Campaigns";
import Inventory from "./pages/Inventory";
import Insights from "./pages/Insights";
import Integrations from "./pages/Integrations";
import Settings from "./pages/Settings";
import Advertisers from "./pages/pipeline/Advertisers";
import Brands from "./pages/pipeline/Brands";
import Contacts from "./pages/pipeline/Contacts";
import CampaignsList from "./pages/campaigns/CampaignsList";
import CampaignDetail from "./pages/campaigns/CampaignDetail";
import NewCampaign from "./pages/campaigns/NewCampaign";
import Creatives from "./pages/campaigns/Creatives";
import Properties from "./pages/inventory/Properties";
import AdUnits from "./pages/inventory/AdUnits";
import Reports from "./pages/insights/Reports";
import Forecast from "./pages/insights/Forecast";
import SalesforceIntegration from "./pages/integrations/SalesforceIntegration";
import KevelIntegration from "./pages/integrations/KevelIntegration";
import TestEmail from "./pages/integrations/TestEmail";
import PersonalSettings from "./pages/settings/PersonalSettings";
import BusinessSettings from "./pages/settings/BusinessSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppLayout><Home /></AppLayout>} />
            
            {/* Pipeline routes */}
            <Route path="/pipeline" element={<AppLayout><Pipeline /></AppLayout>} />
            <Route path="/pipeline/advertisers" element={<AppLayout><Advertisers /></AppLayout>} />
            <Route path="/pipeline/brands" element={<AppLayout><Brands /></AppLayout>} />
            <Route path="/pipeline/contacts" element={<AppLayout><Contacts /></AppLayout>} />
            
            {/* Campaign routes */}
            <Route path="/campaigns" element={<AppLayout><Campaigns /></AppLayout>} />
            <Route path="/campaigns/list" element={<AppLayout><CampaignsList /></AppLayout>} />
            <Route path="/campaigns/creatives" element={<AppLayout><Creatives /></AppLayout>} />
            <Route path="/campaigns/new" element={<AppLayout><NewCampaign /></AppLayout>} />
            
            {/* Inventory routes */}
            <Route path="/inventory" element={<AppLayout><Inventory /></AppLayout>} />
            <Route path="/inventory/properties" element={<AppLayout><Properties /></AppLayout>} />
            <Route path="/inventory/ad-units" element={<AppLayout><AdUnits /></AppLayout>} />
            
            {/* Insights routes */}
            <Route path="/insights" element={<AppLayout><Insights /></AppLayout>} />
            <Route path="/insights/reports" element={<AppLayout><Reports /></AppLayout>} />
            <Route path="/insights/forecast" element={<AppLayout><Forecast /></AppLayout>} />
            
            {/* Integrations routes */}
            <Route path="/integrations" element={<AppLayout><Integrations /></AppLayout>} />
            
            {/* Settings routes */}
            <Route path="/settings" element={<AppLayout><Settings /></AppLayout>} />
            <Route path="/settings/personal" element={<AppLayout><PersonalSettings /></AppLayout>} />
            <Route path="/settings/business" element={<AppLayout><BusinessSettings /></AppLayout>} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
