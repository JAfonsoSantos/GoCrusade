import { create } from 'zustand';

export type Notification = {
  id: string;
  type: 'message' | 'alert' | 'approval';
  title: string;
  description?: string;
  href?: string;
  createdAt: string;
  read: boolean;
};

type NotificationsState = {
  items: Notification[];
  unreadCount: number;
  markAllRead: () => void;
  markRead: (id: string) => void;
  add: (n: Notification) => void;
  seedDemo: () => void;
};

export const useNotificationsStore = create<NotificationsState>((set, get) => ({
  items: [],
  
  get unreadCount() {
    return get().items.filter(n => !n.read).length;
  },
  
  markAllRead: () => set(state => ({
    items: state.items.map(n => ({ ...n, read: true }))
  })),
  
  markRead: (id: string) => set(state => ({
    items: state.items.map(n => n.id === id ? { ...n, read: true } : n)
  })),
  
  add: (notification: Notification) => set(state => ({
    items: [notification, ...state.items]
  })),
  
  seedDemo: () => set({
    items: [
      {
        id: '1',
        type: 'message',
        title: 'New comment on Continente Q1 2025',
        description: 'Ad Ops team added a note about pacing adjustments',
        href: '/campaigns/1',
        createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        read: false,
      },
      {
        id: '2',
        type: 'alert',
        title: 'Campaign Pacing at Risk – Pingo Doce Spring Push',
        description: 'Currently at 78% of expected delivery',
        href: '/campaigns/2',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        read: false,
      },
      {
        id: '3',
        type: 'approval',
        title: 'Creative pending approval – Billboard Hero',
        description: 'New creative uploaded by advertiser',
        href: '/campaigns/creatives',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        read: true,
      },
      {
        id: '4',
        type: 'message',
        title: 'Salesforce sync completed',
        description: '47 opportunities updated successfully',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        read: true,
      },
    ]
  }),
}));
