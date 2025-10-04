import { create } from 'zustand';
import { Business } from '@/lib/types';

export type Workspace = Business;

type WorkspaceState = {
  current?: Workspace;
  setCurrent: (w: Workspace) => void;
};

const STORAGE_KEY = 'crusade-current-workspace';

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  current: undefined,
  
  setCurrent: (workspace: Workspace) => {
    set({ current: workspace });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workspace));
  },
}));
