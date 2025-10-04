import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Tab = {
  id: string;           // ex: path único
  title: string;        // ex: "Continente Q1 2025"
  path: string;         // router path
  icon?: string;        // opcional: "campaign", "flight", etc.
  pinned?: boolean;     // para o future (além do Home)
  createdAt: number;
  isActive: boolean;
};

type TabsState = {
  tabs: Tab[];
  activeId: string;
  lastClosed?: Tab;
  openTab: (tab: Omit<Tab, "createdAt" | "isActive">) => void;
  closeTab: (id: string) => void;
  closeOthers: (id: string) => void;
  closeRight: (id: string) => void;
  switchTab: (id: string) => void;
  reopenLastClosed: () => void;
  ensureHome: (homeTitle: string, homePath: string) => void;
};

const HOME_ID = "home";

export const useTabsStore = create<TabsState>()(
  persist(
    (set, get) => ({
      tabs: [],
      activeId: HOME_ID,
      lastClosed: undefined,

      ensureHome: (homeTitle, homePath) => {
        const { tabs } = get();
        if (!tabs.find(t => t.id === HOME_ID)) {
          set({
            tabs: [
              {
                id: HOME_ID,
                title: homeTitle,
                path: homePath,
                icon: "home",
                pinned: true,
                createdAt: Date.now(),
                isActive: true,
              },
            ],
            activeId: HOME_ID,
          });
        }
      },

      openTab: (tabInput) => {
        const { tabs } = get();
        // se já existe pelo path/id, só ativa
        const existing = tabs.find(t => t.id === tabInput.id || t.path === tabInput.path);
        if (existing) {
          set({
            tabs: tabs.map(t => ({ ...t, isActive: t.id === existing.id })),
            activeId: existing.id,
          });
          return;
        }
        // limite de 12 abas (Home + 11)
        const nonHome = tabs.filter(t => t.id !== HOME_ID);
        const trimmed = nonHome.length >= 11 ? tabs.filter(t => t.id === HOME_ID).concat(nonHome.slice(1)) : tabs;

        const newTab: Tab = {
          ...tabInput,
          createdAt: Date.now(),
          isActive: true,
        };
        set({
          tabs: trimmed.map(t => ({ ...t, isActive: false })).concat(newTab),
          activeId: newTab.id,
        });
      },

      closeTab: (id) => {
        if (id === HOME_ID) return;
        const { tabs, activeId } = get();
        const idx = tabs.findIndex(t => t.id === id);
        if (idx === -1) return;

        const closed = tabs[idx];
        const nextTabs = tabs.filter(t => t.id !== id);

        // decidir próxima ativa
        let nextActiveId = activeId;
        if (activeId === id) {
          const prev = nextTabs[idx - 1] ?? nextTabs[idx] ?? nextTabs[0] ?? { id: HOME_ID };
          nextActiveId = prev.id;
        }

        set({
          tabs: nextTabs.map(t => ({ ...t, isActive: t.id === nextActiveId })),
          activeId: nextActiveId,
          lastClosed: closed,
        });
      },

      closeOthers: (id) => {
        const { tabs } = get();
        const keep = tabs.filter(t => t.id === HOME_ID || t.id === id);
        set({
          tabs: keep.map(t => ({ ...t, isActive: t.id === id })),
          activeId: id,
        });
      },

      closeRight: (id) => {
        const { tabs } = get();
        const idx = tabs.findIndex(t => t.id === id);
        const keep = tabs.filter((_, i) => i <= idx || _.id === HOME_ID);
        set({
          tabs: keep.map(t => ({ ...t, isActive: t.id === id })),
          activeId: id,
        });
      },

      switchTab: (id) => {
        const { tabs } = get();
        if (!tabs.find(t => t.id === id)) return;
        set({
          tabs: tabs.map(t => ({ ...t, isActive: t.id === id })),
          activeId: id,
        });
      },

      reopenLastClosed: () => {
        const { lastClosed, tabs } = get();
        if (!lastClosed) return;
        const exists = tabs.find(t => t.id === lastClosed.id);
        if (exists) return;
        set({
          tabs: tabs.map(t => ({ ...t, isActive: false })).concat({ ...lastClosed, isActive: true }),
          activeId: lastClosed.id,
          lastClosed: undefined,
        });
      },
    }),
    { name: "crusade.tabs.v1" }
  )
);
