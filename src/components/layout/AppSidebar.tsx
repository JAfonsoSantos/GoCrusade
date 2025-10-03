import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  Target,
  Megaphone,
  Package,
  BarChart3,
  Plug,
  Settings,
  ChevronRight,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const navigationItems = [
  { title: "Home", url: "/", icon: Home },
  {
    title: "Pipeline",
    url: "/pipeline",
    icon: Target,
    submenu: [
      { title: "Opportunities", url: "/pipeline" },
      { title: "Advertisers", url: "/pipeline/advertisers" },
      { title: "Brands", url: "/pipeline/brands" },
      { title: "Contacts", url: "/pipeline/contacts" },
    ],
  },
  {
    title: "Campaigns",
    url: "/campaigns",
    icon: Megaphone,
    submenu: [
      { title: "Timeline", url: "/campaigns" },
      { title: "List", url: "/campaigns/list" },
      { title: "Creatives", url: "/campaigns/creatives" },
    ],
  },
  {
    title: "Inventory",
    url: "/inventory",
    icon: Package,
    submenu: [
      { title: "Properties", url: "/inventory/properties" },
      { title: "Ad Units", url: "/inventory/ad-units" },
    ],
  },
  {
    title: "Insights",
    url: "/insights",
    icon: BarChart3,
    submenu: [
      { title: "Reports", url: "/insights/reports" },
      { title: "Forecast", url: "/insights/forecast" },
    ],
  },
  { title: "Integrations", url: "/integrations", icon: Plug },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    submenu: [
      { title: "Personal", url: "/settings/personal" },
      { title: "Business", url: "/settings/business" },
    ],
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const collapsed = state === "collapsed";

  const isActive = (url: string) => {
    if (url === "/") return location.pathname === "/";
    return location.pathname.startsWith(url);
  };

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
            <Megaphone className="h-4 w-4 text-white" />
          </div>
          {!collapsed && <span className="font-semibold text-sidebar-foreground">Crusade</span>}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const active = isActive(item.url);
                
                if (!item.submenu) {
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={active}>
                        <NavLink to={item.url} className="flex items-center gap-3">
                          <item.icon className="h-4 w-4" />
                          {!collapsed && <span>{item.title}</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                }

                return (
                  <Collapsible key={item.title} defaultOpen={active} className="group/collapsible">
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton isActive={active}>
                          <item.icon className="h-4 w-4" />
                          {!collapsed && (
                            <>
                              <span>{item.title}</span>
                              <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                            </>
                          )}
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      {!collapsed && (
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.submenu.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.url}>
                                <SidebarMenuSubButton asChild isActive={location.pathname === subItem.url}>
                                  <NavLink to={subItem.url}>{subItem.title}</NavLink>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      )}
                    </SidebarMenuItem>
                  </Collapsible>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
