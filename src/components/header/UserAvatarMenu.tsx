import { useState } from 'react';
import { User, Settings, Building2, Plug, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { SwitchWorkspaceModal } from '@/components/modals/SwitchWorkspaceModal';
import { useWorkspaceStore } from '@/store/workspace';
import { getInitials, getAvatarColor } from '@/utils/user';

export function UserAvatarMenu() {
  const navigate = useNavigate();
  const [switchModalOpen, setSwitchModalOpen] = useState(false);
  const [showSwitchPill, setShowSwitchPill] = useState(false);
  const currentWorkspace = useWorkspaceStore(state => state.current);
  
  // Mock user data
  const userName = 'John Doe';
  const userEmail = 'john.doe@example.com';
  
  const handleLogout = () => {
    // TODO: Implement actual logout logic
    console.log('Logout clicked');
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarFallback className={getAvatarColor(userName)}>
                <span className="text-white text-sm font-medium">
                  {getInitials(userName)}
                </span>
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">{userName}</p>
              <p className="text-xs text-muted-foreground">{userEmail}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={() => navigate('/settings/personal')}>
            <User className="mr-2 h-4 w-4" />
            {userName} Settings
          </DropdownMenuItem>
          
          <DropdownMenuItem
            onMouseEnter={() => setShowSwitchPill(true)}
            onMouseLeave={() => setShowSwitchPill(false)}
            onClick={(e) => {
              e.preventDefault();
              navigate('/settings/business');
            }}
            className="justify-between"
          >
            <div className="flex items-center">
              <Building2 className="mr-2 h-4 w-4" />
              {currentWorkspace?.name} Settings
            </div>
            {showSwitchPill && (
              <Badge
                variant="secondary"
                className="ml-2 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setSwitchModalOpen(true);
                }}
              >
                Switch
              </Badge>
            )}
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => navigate('/integrations')}>
            <Plug className="mr-2 h-4 w-4" />
            Integrations
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={handleLogout} className="text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <SwitchWorkspaceModal open={switchModalOpen} onOpenChange={setSwitchModalOpen} />
    </>
  );
}
