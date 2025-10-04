import { Search, Rocket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { NavMenu } from './NavMenu';
import { NotificationsBell } from '@/components/header/NotificationsBell';
import { UserAvatarMenu } from '@/components/header/UserAvatarMenu';
import { useWorkspaceStore } from '@/store/workspace';

export function AppHeader() {
  const navigate = useNavigate();
  const currentWorkspace = useWorkspaceStore(state => state.current);

  const handleSearchClick = () => {
    // Trigger command palette (⌘K)
    const event = new KeyboardEvent('keydown', {
      key: 'k',
      metaKey: true,
      bubbles: true,
    });
    document.dispatchEvent(event);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 w-full items-center justify-between px-6">
        {/* Left: Logo + Crusade + Navigation */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Rocket className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">Crusade</span>
          </button>
          
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

        {/* Right: Search, Notifications, User */}
        <div className="flex items-center gap-2">
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
    </header>
  );
}
