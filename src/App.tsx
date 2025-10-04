import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AppLayout } from "@/components/layout/AppLayout";
import { CommandPalette } from "@/components/CommandPalette";
import { useTabsStore } from "@/store/tabs";
import { AuthProvider, ProtectedRoute } from "@/lib/auth";
import Auth from "./pages/Auth";
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
import AdvertiserDetail from "./pages/pipeline/AdvertiserDetail";
import BrandDetail from "./pages/pipeline/BrandDetail";
import ContactDetail from "./pages/pipeline/ContactDetail";
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
import SalesforcePage from "./pages/integrations/SalesforcePage";
import KevelPage from "./pages/integrations/KevelPage";
import TestEmail from "./pages/integrations/TestEmail";
import PersonalSettings from "./pages/settings/PersonalSettings";
import BusinessSettings from "./pages/settings/BusinessSettings";
import SystemSettings from "./pages/settings/SystemSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function TabSync() {
  const location = useLocation();
  const tabs = useTabsStore(state => state.tabs);
  const activeId = useTabsStore(state => state.activeId);
  const switchTab = useTabsStore(state => state.switchTab);
  
  useEffect(() => {
    const matchingTab = tabs.find(t => t.path === location.pathname);
    
    if (matchingTab) {
      // Only switch if it's not already the active tab
      if (matchingTab.id !== activeId) {
        switchTab(matchingTab.id);
      }
    } else {
      // Switch to home only if not already on home
      if (activeId !== "home") {
        switchTab("home");
      }
    }
  }, [location.pathname]); // Only depend on pathname to avoid loops
  
  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <TabSync />
            <Routes>
              {/* Public route */}
              <Route path="/auth" element={<Auth />} />
              
              {/* Protected routes */}
              <Route path="/" element={<ProtectedRoute><AppLayout><Home /></AppLayout></ProtectedRoute>} />
            
              {/* Pipeline routes */}
              <Route path="/pipeline" element={<ProtectedRoute><AppLayout><Pipeline /></AppLayout></ProtectedRoute>} />
              <Route path="/pipeline/advertisers" element={<ProtectedRoute><AppLayout><Advertisers /></AppLayout></ProtectedRoute>} />
              <Route path="/pipeline/advertisers/:id" element={<ProtectedRoute><AppLayout><AdvertiserDetail /></AppLayout></ProtectedRoute>} />
              <Route path="/pipeline/brands" element={<ProtectedRoute><AppLayout><Brands /></AppLayout></ProtectedRoute>} />
              <Route path="/pipeline/brands/:id" element={<ProtectedRoute><AppLayout><BrandDetail /></AppLayout></ProtectedRoute>} />
              <Route path="/pipeline/contacts" element={<ProtectedRoute><AppLayout><Contacts /></AppLayout></ProtectedRoute>} />
              <Route path="/pipeline/contacts/:id" element={<ProtectedRoute><AppLayout><ContactDetail /></AppLayout></ProtectedRoute>} />
            
              {/* Campaign routes */}
              <Route path="/campaigns" element={<ProtectedRoute><AppLayout><Campaigns /></AppLayout></ProtectedRoute>} />
              <Route path="/campaigns/list" element={<ProtectedRoute><AppLayout><CampaignsList /></AppLayout></ProtectedRoute>} />
              <Route path="/campaigns/:id" element={<ProtectedRoute><AppLayout><CampaignDetail /></AppLayout></ProtectedRoute>} />
              <Route path="/campaigns/creatives" element={<ProtectedRoute><AppLayout><Creatives /></AppLayout></ProtectedRoute>} />
              <Route path="/campaigns/new" element={<ProtectedRoute><AppLayout><NewCampaign /></AppLayout></ProtectedRoute>} />
            
              {/* Inventory routes */}
              <Route path="/inventory" element={<ProtectedRoute><AppLayout><Inventory /></AppLayout></ProtectedRoute>} />
              <Route path="/inventory/properties" element={<ProtectedRoute><AppLayout><Properties /></AppLayout></ProtectedRoute>} />
              <Route path="/inventory/ad-units" element={<ProtectedRoute><AppLayout><AdUnits /></AppLayout></ProtectedRoute>} />
            
              {/* Insights routes */}
              <Route path="/insights" element={<ProtectedRoute><AppLayout><Insights /></AppLayout></ProtectedRoute>} />
              <Route path="/insights/reports" element={<ProtectedRoute><AppLayout><Reports /></AppLayout></ProtectedRoute>} />
              <Route path="/insights/forecast" element={<ProtectedRoute><AppLayout><Forecast /></AppLayout></ProtectedRoute>} />
            
              {/* Integrations routes */}
              <Route path="/integrations" element={<ProtectedRoute><AppLayout><Integrations /></AppLayout></ProtectedRoute>} />
              <Route path="/integrations/salesforce" element={<ProtectedRoute><AppLayout><SalesforcePage /></AppLayout></ProtectedRoute>} />
              <Route path="/integrations/kevel" element={<ProtectedRoute><AppLayout><KevelPage /></AppLayout></ProtectedRoute>} />
            
              {/* Settings routes */}
              <Route path="/settings" element={<ProtectedRoute><AppLayout><Settings /></AppLayout></ProtectedRoute>} />
              <Route path="/settings/personal" element={<ProtectedRoute><AppLayout><PersonalSettings /></AppLayout></ProtectedRoute>} />
              <Route path="/settings/business" element={<ProtectedRoute><AppLayout><BusinessSettings /></AppLayout></ProtectedRoute>} />
              <Route path="/settings/system" element={<ProtectedRoute><AppLayout><SystemSettings /></AppLayout></ProtectedRoute>} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
