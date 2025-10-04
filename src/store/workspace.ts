import { create } from 'zustand';

export type Workspace = {
  id: string;
  name: string;
  logoUrl?: string;
};

type WorkspaceState = {
  current?: Workspace;
  all: Workspace[];
  setCurrent: (w: Workspace) => void;
  seedDemo: () => void;
  hydrate: () => void;
};

const STORAGE_KEY = 'crusade-current-workspace';

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  current: undefined,
  all: [],
  
  setCurrent: (workspace: Workspace) => {
    set({ current: workspace });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workspace));
  },
  
  seedDemo: () => {
    const demoWorkspaces = [
      { id: '1', name: 'Kevel Demo' },
      { id: '2', name: 'AdTech Solutions' },
      { id: '3', name: 'Test Media Corp' },
    ];
    
    set(state => ({
      all: demoWorkspaces,
      current: state.current || demoWorkspaces[0],
    }));
  },
  
  hydrate: () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const workspace = JSON.parse(stored);
        set({ current: workspace });
      } catch (e) {
        console.error('Failed to parse stored workspace', e);
      }
    }
  },
}));
