import { useState } from 'react';
import { Check, Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useWorkspaceStore, Workspace } from '@/store/workspace';
import { useBusinesses } from '@/hooks/useBusinesses';

interface SwitchWorkspaceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SwitchWorkspaceModal({ open, onOpenChange }: SwitchWorkspaceModalProps) {
  const [search, setSearch] = useState('');
  const { current, setCurrent } = useWorkspaceStore();
  const { data: businesses = [] } = useBusinesses();

  const filtered = businesses.filter(w =>
    w.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (workspace: Workspace) => {
    setCurrent(workspace);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Switch Workspace</DialogTitle>
          <DialogDescription>
            Select a workspace to switch to
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search workspaces..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <div className="space-y-1 max-h-[300px] overflow-y-auto">
            {filtered.map((workspace) => (
              <Button
                key={workspace.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-2",
                  current?.id === workspace.id && "bg-muted"
                )}
                onClick={() => handleSelect(workspace)}
              >
                <Check
                  className={cn(
                    "h-4 w-4",
                    current?.id === workspace.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {workspace.name}
              </Button>
            ))}
            
            {filtered.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">
                No workspaces found
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
