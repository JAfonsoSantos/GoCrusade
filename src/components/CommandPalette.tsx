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
  Kanban
} from 'lucide-react';

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { campaigns, flights, opportunities, advertisers, contacts } = useDemoStore();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleSelect = (callback: () => void) => {
    setOpen(false);
    callback();
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        <CommandGroup heading="Quick Actions">
          <CommandItem onSelect={() => handleSelect(() => navigate('/campaigns/new'))}>
            <Plus className="mr-2 h-4 w-4" />
            <span>New Campaign</span>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect(() => navigate('/pipeline'))}>
            <Plus className="mr-2 h-4 w-4" />
            <span>New Deal</span>
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
  );
}
