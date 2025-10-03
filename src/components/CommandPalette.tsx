import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { useDemoStore } from '@/demo/DemoProvider';
import { Megaphone, Target, Users, Building2, Contact } from 'lucide-react';

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
      <CommandInput placeholder="Search campaigns, flights, opportunities..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        <CommandGroup heading="Campaigns">
          {campaigns.map((campaign) => (
            <CommandItem
              key={campaign.id}
              onSelect={() => handleSelect(() => navigate(`/campaigns/${campaign.id}`))}
            >
              <Megaphone className="mr-2 h-4 w-4" />
              <span>{campaign.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Flights">
          {flights.map((flight) => (
            <CommandItem
              key={flight.id}
              onSelect={() => handleSelect(() => navigate(`/campaigns`))}
            >
              <Megaphone className="mr-2 h-4 w-4 opacity-50" />
              <span>{flight.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Opportunities">
          {opportunities.map((opp) => (
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

        <CommandGroup heading="Contacts">
          {contacts.slice(0, 3).map((contact) => (
            <CommandItem
              key={contact.id}
              onSelect={() => handleSelect(() => navigate('/pipeline/contacts'))}
            >
              <Contact className="mr-2 h-4 w-4" />
              <span>{contact.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
