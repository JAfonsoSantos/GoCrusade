import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { useDemoStore } from '@/demo/DemoProvider';
import { 
  Megaphone, 
  Target, 
  Users, 
  Building2, 
  Contact, 
  Home, 
  Package, 
  BarChart, 
  Settings, 
  Link2, 
  Plus,
  Kanban,
  RefreshCw,
  HelpCircle
} from 'lucide-react';
import { ShortcutsModal } from './ShortcutsModal';
import { NewOpportunityModal } from './NewOpportunityModal';
import { useToast } from '@/hooks/use-toast';

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [newOppOpen, setNewOppOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { campaigns, flights, opportunities, advertisers, contacts } = useDemoStore();

  useEffect(() => {
    let gPressed = false;
    let gTimeout: NodeJS.Timeout;

    const down = (e: KeyboardEvent) => {
      // Command palette
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
        return;
      }

      // Shortcuts help
      if (e.key === '?' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        setShortcutsOpen(true);
        return;
      }

      // G navigation
      if (e.key === 'g' && !gPressed) {
        gPressed = true;
        gTimeout = setTimeout(() => {
          gPressed = false;
        }, 1000);
        return;
      }

      if (gPressed) {
        e.preventDefault();
        gPressed = false;
        clearTimeout(gTimeout);

        switch (e.key) {
          case 'h':
            navigate('/');
            break;
          case 'p':
            navigate('/pipeline');
            break;
          case 'c':
            navigate('/campaigns');
            break;
          case 'i':
            navigate('/integrations');
            break;
        }
      }
    };

    document.addEventListener('keydown', down);
    return () => {
      document.removeEventListener('keydown', down);
      clearTimeout(gTimeout);
    };
  }, [navigate]);

  const handleSelect = (callback: () => void) => {
    setOpen(false);
    callback();
  };

  const handleManualSync = (integration: string) => {
    toast({
      title: `${integration} sync started`,
      description: "Manual sync in progress...",
    });
  };

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          
          <CommandGroup heading="Quick Actions">
            <CommandItem onSelect={() => handleSelect(() => navigate('/campaigns/new'))}>
              <Plus className="mr-2 h-4 w-4" />
              <span>New Campaign</span>
            </CommandItem>
            <CommandItem onSelect={() => handleSelect(() => setNewOppOpen(true))}>
              <Plus className="mr-2 h-4 w-4" />
              <span>New Opportunity</span>
            </CommandItem>
            <CommandItem onSelect={() => handleSelect(() => setShortcutsOpen(true))}>
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>Keyboard Shortcuts</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

        <CommandGroup heading="Navigate">
          <CommandItem onSelect={() => handleSelect(() => navigate('/'))}>
            <Home className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect(() => navigate('/pipeline'))}>
            <Kanban className="mr-2 h-4 w-4" />
            <span>Pipeline</span>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect(() => navigate('/campaigns'))}>
            <Megaphone className="mr-2 h-4 w-4" />
            <span>Campaigns</span>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect(() => navigate('/inventory'))}>
            <Package className="mr-2 h-4 w-4" />
            <span>Inventory</span>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect(() => navigate('/insights'))}>
            <BarChart className="mr-2 h-4 w-4" />
            <span>Insights</span>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect(() => navigate('/pipeline/advertisers'))}>
            <Building2 className="mr-2 h-4 w-4" />
            <span>Advertisers</span>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect(() => navigate('/pipeline/brands'))}>
            <Package className="mr-2 h-4 w-4" />
            <span>Brands</span>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect(() => navigate('/pipeline/contacts'))}>
            <Contact className="mr-2 h-4 w-4" />
            <span>Contacts</span>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect(() => navigate('/integrations'))}>
            <Link2 className="mr-2 h-4 w-4" />
            <span>Integrations</span>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect(() => navigate('/settings'))}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => handleSelect(() => handleManualSync('Salesforce'))}>
            <RefreshCw className="mr-2 h-4 w-4" />
            <span>Manual Sync - Salesforce</span>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect(() => handleManualSync('Kevel'))}>
            <RefreshCw className="mr-2 h-4 w-4" />
            <span>Manual Sync - Kevel</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />
        
        <CommandGroup heading="Campaigns">
          {campaigns.slice(0, 5).map((campaign) => (
            <CommandItem
              key={campaign.id}
              onSelect={() => handleSelect(() => navigate(`/campaigns`))}
            >
              <Megaphone className="mr-2 h-4 w-4" />
              <span>{campaign.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Opportunities">
          {opportunities.slice(0, 3).map((opp) => (
            <CommandItem
              key={opp.id}
              onSelect={() => handleSelect(() => navigate('/pipeline'))}
            >
              <Target className="mr-2 h-4 w-4" />
              <span>{opp.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Advertisers">
          {advertisers.slice(0, 3).map((adv) => (
            <CommandItem
              key={adv.id}
              onSelect={() => handleSelect(() => navigate('/pipeline/advertisers'))}
            >
              <Building2 className="mr-2 h-4 w-4" />
              <span>{adv.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>

    <ShortcutsModal open={shortcutsOpen} onOpenChange={setShortcutsOpen} />
    <NewOpportunityModal open={newOppOpen} onOpenChange={setNewOppOpen} />
  </>
  );
}
