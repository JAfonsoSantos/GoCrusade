import { MessageSquare, AlertTriangle, CheckCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useNotificationsStore, Notification } from '@/store/notifications';

const iconMap = {
  message: MessageSquare,
  alert: AlertTriangle,
  approval: CheckCircle,
};

const colorMap = {
  message: 'text-blue-500',
  alert: 'text-amber-500',
  approval: 'text-green-500',
};

function NotificationItem({ notification }: { notification: Notification }) {
  const navigate = useNavigate();
  const markRead = useNotificationsStore(state => state.markRead);
  
  const Icon = iconMap[notification.type];
  const iconColor = colorMap[notification.type];

  const handleClick = () => {
    markRead(notification.id);
    if (notification.href) {
      navigate(notification.href);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "w-full text-left p-4 hover:bg-muted/50 transition-colors",
        !notification.read && "bg-muted/30 font-medium"
      )}
    >
      <div className="flex gap-3">
        <Icon className={cn("h-5 w-5 flex-shrink-0 mt-0.5", iconColor)} />
        <div className="flex-1 min-w-0">
          <p className={cn(
            "text-sm",
            !notification.read && "font-semibold"
          )}>
            {notification.title}
          </p>
          {notification.description && (
            <p className="text-sm text-muted-foreground mt-1">
              {notification.description}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
          </p>
        </div>
        {!notification.read && (
          <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-2" />
        )}
      </div>
    </button>
  );
}

export function NotificationsPanel() {
  const items = useNotificationsStore(state => state.items);
  const markAllRead = useNotificationsStore(state => state.markAllRead);
  const unreadCount = useNotificationsStore(state => state.unreadCount);

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between p-4 pb-2">
        <h3 className="font-semibold">Notifications</h3>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={markAllRead}
            className="h-auto p-1 text-xs"
          >
            Mark all as read
          </Button>
        )}
      </div>
      
      <Separator />
      
      <ScrollArea className="h-[420px]">
        {items.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
            No notifications
          </div>
        ) : (
          <div className="divide-y">
            {items.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
