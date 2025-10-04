import { useTabsStore } from "@/store/tabs";

export function openInTab(tab: { 
  id: string; 
  title: string; 
  path: string; 
  icon?: string 
}) {
  const { openTab } = useTabsStore.getState();
  openTab(tab);
}

// Convenience functions for each entity type
export function openCampaignTab(id: string, name: string) {
  openInTab({
    id: `campaign:${id}`,
    title: name,
    path: `/campaigns/${id}`,
    icon: "campaign"
  });
}

export function openFlightTab(id: string, name: string) {
  openInTab({
    id: `flight:${id}`,
    title: name,
    path: `/flights/${id}`,
    icon: "flight"
  });
}

export function openAdvertiserTab(id: string, name: string) {
  openInTab({
    id: `advertiser:${id}`,
    title: name,
    path: `/pipeline/advertisers/${id}`,
    icon: "advertiser"
  });
}

export function openBrandTab(id: string, name: string) {
  openInTab({
    id: `brand:${id}`,
    title: name,
    path: `/pipeline/brands/${id}`,
    icon: "brand"
  });
}

export function openContactTab(id: string, name: string) {
  openInTab({
    id: `contact:${id}`,
    title: name,
    path: `/pipeline/contacts/${id}`,
    icon: "contact"
  });
}
