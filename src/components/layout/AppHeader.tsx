import { Search, Rocket, ChevronDown, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { NavMenu } from './NavMenu';
import { NotificationsBell } from '@/components/header/NotificationsBell';
import { UserAvatarMenu } from '@/components/header/UserAvatarMenu';
import { useWorkspaceStore } from '@/store/workspace';
import { useProfile } from '@/hooks/useProfile';
import { useProperties } from '@/hooks/useProperties';
import { useState } from 'react';
import { SwitchWorkspaceModal } from '../modals/SwitchWorkspaceModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

export function AppHeader() {
  const navigate = useNavigate();
  const { data: profile } = useProfile();
  const { data: properties } = useProperties();
  const [switchModalOpen, setSwitchModalOpen] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);

  const handleSearchClick = () => {
    // Trigger command palette (⌘K)
    const event = new KeyboardEvent('keydown', {
      key: 'k',
      metaKey: true,
      bubbles: true,
    });
    document.dispatchEvent(event);
  };

  const selectedProperty = properties?.find(p => p.id === selectedPropertyId);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 w-full items-center justify-between px-6">
        {/* Left: Logo + Crusade + Business/Property Switchers + Navigation */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Rocket className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">Crusade</span>
          </button>

          <Separator orientation="vertical" className="h-6" />
          
          {/* Business Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1">
                <span className="font-medium">{profile?.business?.name || 'Select Business'}</span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => setSwitchModalOpen(true)}>
                Switch Business
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Property Switcher */}
          {properties && properties.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1">
                  <span className="text-muted-foreground">
                    {selectedProperty?.name || 'All Properties'}
                  </span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => setSelectedPropertyId(null)}>
                  All Properties
                </DropdownMenuItem>
                <Separator className="my-1" />
                {properties.map((property) => (
                  <DropdownMenuItem
                    key={property.id}
                    onClick={() => setSelectedPropertyId(property.id)}
                  >
                    {property.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Separator orientation="vertical" className="h-6" />
          
          <nav className="flex items-center gap-1">
            <NavMenu
              title="Pipeline"
              href="/pipeline"
              items={[
                { label: 'Opportunities', href: '/pipeline' },
                { label: 'Advertisers', href: '/pipeline/advertisers' },
                { label: 'Brands', href: '/pipeline/brands' },
                { label: 'Contacts', href: '/pipeline/contacts' },
              ]}
            />
            
            <NavMenu
              title="Campaigns"
              href="/campaigns"
              items={[
                { label: 'Timeline', href: '/campaigns' },
                { label: 'List', href: '/campaigns/list' },
                { label: 'Creatives', href: '/campaigns/creatives' },
              ]}
            />
            
            <NavMenu
              title="Inventory"
              href="/inventory"
              items={[
                { label: 'Properties', href: '/inventory/properties' },
                { label: 'Ad Units', href: '/inventory/ad-units' },
              ]}
            />
            
            <NavMenu
              title="Insights"
              href="/insights"
              items={[
                { label: 'Reports', href: '/insights/reports' },
                { label: 'Forecast', href: '/insights/forecast' },
              ]}
            />
          </nav>
        </div>

        {/* Right: Sync Status, Search, Notifications, User */}
        <div className="flex items-center gap-2">
          {/* Sync Status Pills */}
          <div className="hidden md:flex items-center gap-2">
            <Badge variant="outline" className="gap-1.5">
              <CheckCircle2 className="h-3 w-3 text-green-500" />
              <span className="text-xs">Salesforce</span>
            </Badge>
            <Badge variant="outline" className="gap-1.5">
              <CheckCircle2 className="h-3 w-3 text-green-500" />
              <span className="text-xs">Kevel</span>
            </Badge>
          </div>
          
          <Separator orientation="vertical" className="h-6 hidden md:block" />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSearchClick}
            className="gap-2 text-muted-foreground"
          >
            <Search className="h-4 w-4" />
            <span className="hidden md:inline">Search...</span>
            <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium opacity-100 md:inline-flex">
              <span>⌘</span>K
            </kbd>
          </Button>
          
          <NotificationsBell />
          
          <Separator orientation="vertical" className="h-6" />
          
          <UserAvatarMenu />
        </div>
      </div>
      
      <SwitchWorkspaceModal open={switchModalOpen} onOpenChange={setSwitchModalOpen} />
    </header>
  );
}
