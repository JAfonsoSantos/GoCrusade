import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTabsStore } from "@/store/tabs";
import { useDemoStore } from "@/demo/DemoProvider";
import { X, Home, ChevronLeft, ChevronRight, Plus, Pin, RotateCw } from "lucide-react";
import { getPageInfo } from "@/lib/getPageInfo";
import { toast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Props = {
  homeTitle?: string;    // default: "Home"
  homePath?: string;     // default: "/"
};

export default function TabBar({ homeTitle = "Home", homePath = "/" }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const { tabs, activeId, ensureHome, closeTab, switchTab, closeOthers, closeRight, reopenLastClosed, openTab, renameTab, duplicateTab, pinTab, reloadTab } = useTabsStore();
  const demoStore = useDemoStore();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

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
    
    // Always create new tab (allow duplicates like Chrome)
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

  const handleRename = (id: string, currentTitle: string) => {
    setEditingId(id);
    setEditTitle(currentTitle);
  };

  const saveRename = (id: string) => {
    if (editTitle.trim()) {
      renameTab(id, editTitle.trim());
    }
    setEditingId(null);
    setEditTitle("");
  };

  const handleReload = (id: string, path: string) => {
    reloadTab(id);
    navigate(path);
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
            const isEditing = editingId === t.id;
            const isPinned = t.pinned || t.id === "home";
            
            return (
              <div
                key={t.id}
                className={`group relative flex items-center ${isPinned ? 'max-w-[180px]' : 'max-w-[240px]'} shrink-0 rounded-full border px-3 py-1 text-sm cursor-pointer transition-base
                ${isActive ? "bg-slate-900 text-white border-slate-900" : "bg-card text-foreground border-border hover:bg-muted"}`}
                onClick={(e) => {
                  if ((e as any).button === 1) return;
                  go(t.id, t.path);
                }}
                onMouseUp={(e) => {
                  if (e.button === 1 && !isPinned) {
                    e.preventDefault();
                    closeTab(t.id);
                  }
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  if (t.id !== "home") {
                    handleRename(t.id, t.title);
                  }
                }}
              >
                {t.id === "home" ? <Home size={14} className="mr-2" /> : null}
                {isPinned && t.id !== "home" && <Pin size={12} className="mr-2" />}
                
                {isEditing ? (
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onBlur={() => saveRename(t.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveRename(t.id);
                      if (e.key === "Escape") { setEditingId(null); setEditTitle(""); }
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-transparent border-none outline-none text-inherit w-full"
                    autoFocus
                  />
                ) : (
                  <span className="truncate">{t.title}</span>
                )}
                
                {!isPinned && !isEditing && (
                  <button
                    className={`ml-2 p-0.5 rounded ${isActive ? "hover:bg-white/20" : "hover:bg-muted-foreground/10"}`}
                    onClick={(e) => { e.stopPropagation(); closeTab(t.id); }}
                    aria-label="Close tab"
                  >
                    <X size={14} />
                  </button>
                )}
                
                {!isEditing && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        className={`ml-1 p-0.5 rounded ${isActive ? "hover:bg-white/20" : "hover:bg-muted-foreground/10"}`}
                        onClick={(e) => e.stopPropagation()}
                        aria-label="More options"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="5" r="1" />
                          <circle cx="12" cy="12" r="1" />
                          <circle cx="12" cy="19" r="1" />
                        </svg>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => handleReload(t.id, t.path)}>
                        <RotateCw size={14} className="mr-2" />
                        Reload
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => duplicateTab(t.id)}>
                        <Plus size={14} className="mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      {t.id !== "home" && (
                        <DropdownMenuItem onClick={() => pinTab(t.id)}>
                          <Pin size={14} className="mr-2" />
                          {t.pinned ? "Unpin" : "Pin"}
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => handleRename(t.id, t.title)}>
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {!isPinned && (
                        <DropdownMenuItem onClick={() => closeTab(t.id)}>
                          <X size={14} className="mr-2" />
                          Close
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => closeOthers(t.id)}>
                        Close Others
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => closeRight(t.id)}>
                        Close to the Right
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => reopenLastClosed()}>
                        Reopen Last Closed
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
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
