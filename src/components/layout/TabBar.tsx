import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTabsStore } from "@/store/tabs";
import { useDemoStore } from "@/demo/DemoProvider";
import { X, MoreVertical, Home, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { getPageInfo } from "@/lib/getPageInfo";
import { toast } from "@/hooks/use-toast";

type Props = {
  homeTitle?: string;    // default: "Home"
  homePath?: string;     // default: "/"
};

export default function TabBar({ homeTitle = "Home", homePath = "/" }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const { tabs, activeId, ensureHome, closeTab, switchTab, closeOthers, closeRight, reopenLastClosed, openTab } = useTabsStore();
  const demoStore = useDemoStore();
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureHome(homeTitle, homePath);
  }, [ensureHome, homeTitle, homePath]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;
      // Ctrl/Cmd+W
      if (meta && e.key.toLowerCase() === "w") {
        e.preventDefault();
        if (activeId !== "home") closeTab(activeId);
      }
      // Ctrl/Cmd+Shift+T
      if (meta && e.shiftKey && e.key.toLowerCase() === "t") {
        e.preventDefault();
        reopenLastClosed();
      }
      // Ctrl/Cmd+PageUp / PageDown
      if (meta && (e.key === "PageUp" || e.key === "PageDown")) {
        e.preventDefault();
        const idx = tabs.findIndex(t => t.id === activeId);
        const nextIdx = e.key === "PageDown" ? Math.min(tabs.length - 1, idx + 1) : Math.max(0, idx - 1);
        switchTab(tabs[nextIdx].id);
        navigate(tabs[nextIdx].path);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [tabs, activeId, closeTab, reopenLastClosed, switchTab, navigate]);

  // Remove auto-navigation - let TabSync handle URL syncing instead
  // to avoid circular updates between navigation and tab switching

  const go = (id: string, path: string) => {
    // Navigate first, then let TabSync handle the tab switch
    // This prevents double updates
    if (window.location.pathname !== path) {
      navigate(path);
    } else {
      // If already on this path, just switch the tab
      switchTab(id);
    }
  };

  const handleAddTab = () => {
    const pageInfo = getPageInfo(location.pathname, demoStore);
    
    if (!pageInfo.canCreateTab) {
      toast({
        title: "Cannot open tab",
        description: "This page cannot be opened in a tab",
        variant: "destructive"
      });
      return;
    }
    
    // Check if tab already exists for this path
    const existingTab = tabs.find(t => t.path === location.pathname);
    if (existingTab) {
      switchTab(existingTab.id);
      toast({
        title: "Switched to existing tab",
        description: `Switched to "${existingTab.title}"`
      });
      return;
    }
    
    // Create new tab
    openTab({
      id: pageInfo.id!,
      title: pageInfo.title!,
      path: location.pathname,
      icon: pageInfo.icon
    });
    toast({
      title: "Tab opened",
      description: `Opened "${pageInfo.title}" in new tab`
    });
  };

  return (
    <div className="sticky top-[56px] z-40 bg-background border-b border-border">
      <div className="flex items-center gap-2 px-2 py-1">
        <button
          className="p-1 rounded hover:bg-muted transition-base"
          onClick={() => scrollerRef.current?.scrollBy({ left: -200, behavior: "smooth" })}
          aria-label="Scroll left"
        >
          <ChevronLeft size={16} />
        </button>
        <div
          ref={scrollerRef}
          className="flex-1 flex items-center gap-1 overflow-x-auto no-scrollbar"
        >
          {tabs.map((t) => {
            const isActive = t.id === activeId;
            return (
              <div
                key={t.id}
                className={`group relative flex items-center max-w-[240px] shrink-0 rounded-full border px-3 py-1 text-sm cursor-pointer transition-base
                ${isActive ? "bg-slate-900 text-white border-slate-900" : "bg-card text-foreground border-border hover:bg-muted"}`}
                onClick={(e) => {
                  // middle-click fecha
                  if ((e as any).button === 1) return;
                  go(t.id, t.path);
                }}
                onMouseUp={(e) => {
                  if (e.button === 1 && t.id !== "home") {
                    // middle click
                    e.preventDefault();
                    closeTab(t.id);
                  }
                }}
              >
                {t.id === "home" ? <Home size={14} className="mr-2" /> : null}
                <span className="truncate">{t.title}</span>
                {t.id !== "home" && (
                  <button
                    className={`ml-2 p-0.5 rounded ${isActive ? "hover:bg-white/20" : "hover:bg-muted-foreground/10"}`}
                    onClick={(e) => { e.stopPropagation(); closeTab(t.id); }}
                    aria-label="Close tab"
                  >
                    <X size={14} />
                  </button>
                )}
                <div className="relative">
                  <button
                    className={`ml-1 p-0.5 rounded ${isActive ? "hover:bg-white/20" : "hover:bg-muted-foreground/10"}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      const m = (e.currentTarget.nextSibling as HTMLDivElement);
                      m?.classList.toggle("hidden");
                    }}
                    aria-label="More"
                  >
                    <MoreVertical size={14} />
                  </button>
                  <div className="hidden absolute top-7 right-0 w-40 rounded-md border border-border bg-popover shadow-lg z-50">
                    <button className="w-full text-left px-3 py-2 hover:bg-muted text-sm" onClick={() => closeOthers(t.id)}>Close others</button>
                    <button className="w-full text-left px-3 py-2 hover:bg-muted text-sm" onClick={() => closeRight(t.id)}>Close to the right</button>
                    <button className="w-full text-left px-3 py-2 hover:bg-muted text-sm" onClick={() => reopenLastClosed()}>Reopen last closed</button>
                  </div>
                </div>
              </div>
            );
          })}
          <button
            className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full border border-border hover:bg-muted cursor-pointer transition-base sticky right-0 ml-2 bg-background"
            onClick={handleAddTab}
            aria-label="Open current page in new tab"
            title="Open current page in new tab"
          >
            <Plus size={14} />
          </button>
        </div>
        <button
          className="p-1 rounded hover:bg-muted transition-base"
          onClick={() => scrollerRef.current?.scrollBy({ left: 200, behavior: "smooth" })}
          aria-label="Scroll right"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
