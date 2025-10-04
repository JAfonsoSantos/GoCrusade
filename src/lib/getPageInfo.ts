import { useDemoStore } from "@/demo/DemoProvider";

interface PageInfo {
  canCreateTab: boolean;
  title?: string;
  id?: string;
  icon?: string;
}

type DemoStore = ReturnType<typeof useDemoStore.getState>;

export function getPageInfo(pathname: string, store: DemoStore): PageInfo {
  // Home page
  if (pathname === '/') {
    return { canCreateTab: false };
  }
  
  // Campaign detail: /campaigns/:id
  const campaignMatch = pathname.match(/^\/campaigns\/([^\/]+)$/);
  if (campaignMatch) {
    const id = campaignMatch[1];
    const campaign = store.campaigns.find(c => c.id === id);
    if (campaign) {
      return {
        canCreateTab: true,
        title: campaign.name,
        id: `campaign:${id}`,
        icon: 'campaign'
      };
    }
  }
  
  // Advertiser detail: /pipeline/advertisers/:id
  const advertiserMatch = pathname.match(/^\/pipeline\/advertisers\/([^\/]+)$/);
  if (advertiserMatch) {
    const id = advertiserMatch[1];
    const advertiser = store.advertisers.find(a => a.id === id);
    if (advertiser) {
      return {
        canCreateTab: true,
        title: advertiser.name,
        id: `advertiser:${id}`,
        icon: 'advertiser'
      };
    }
  }
  
  // Brand detail: /pipeline/brands/:id
  const brandMatch = pathname.match(/^\/pipeline\/brands\/([^\/]+)$/);
  if (brandMatch) {
    const id = brandMatch[1];
    const brand = store.brands.find(b => b.id === id);
    if (brand) {
      return {
        canCreateTab: true,
        title: brand.name,
        id: `brand:${id}`,
        icon: 'brand'
      };
    }
  }
  
  // Contact detail: /pipeline/contacts/:id
  const contactMatch = pathname.match(/^\/pipeline\/contacts\/([^\/]+)$/);
  if (contactMatch) {
    const id = contactMatch[1];
    const contact = store.contacts.find(c => c.id === id);
    if (contact) {
      return {
        canCreateTab: true,
        title: contact.name,
        id: `contact:${id}`,
        icon: 'contact'
      };
    }
  }
  
  // Generic pages (integrations, settings, insights, campaigns list, etc.)
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length > 0) {
    const pageName = segments[segments.length - 1]
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    return {
      canCreateTab: true,
      title: pageName,
      id: `page:${pathname}`,
      icon: 'default'
    };
  }
  
  // Fallback
  return { canCreateTab: false };
}
