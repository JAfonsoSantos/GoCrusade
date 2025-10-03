import { create } from 'zustand';
import {
  Business,
  Property,
  AdUnit,
  Advertiser,
  Brand,
  Contact,
  Opportunity,
  Campaign,
  Flight,
  Creative,
  DeliveryFlightDaily,
} from '@/lib/types';
import {
  demoBusiness,
  demoProperties,
  demoAdUnits,
  demoAdvertisers,
  demoBrands,
  demoContacts,
  demoOpportunities,
  demoCampaigns,
  demoFlights,
  demoCreatives,
  demoDeliveryData,
} from './demoData';

interface DemoState {
  business: Business;
  properties: Property[];
  adUnits: AdUnit[];
  advertisers: Advertiser[];
  brands: Brand[];
  contacts: Contact[];
  opportunities: Opportunity[];
  campaigns: Campaign[];
  flights: Flight[];
  creatives: Creative[];
  deliveryData: DeliveryFlightDaily[];

  // Selected state
  selectedBusinessId: string;
  selectedPropertyId: string | null;

  // Actions
  setSelectedBusiness: (id: string) => void;
  setSelectedProperty: (id: string | null) => void;
  
  // CRUD operations
  addCampaign: (campaign: Campaign) => void;
  updateCampaign: (id: string, updates: Partial<Campaign>) => void;
  deleteCampaign: (id: string) => void;
  
  addFlight: (flight: Flight) => void;
  updateFlight: (id: string, updates: Partial<Flight>) => void;
  deleteFlight: (id: string) => void;
  
  updateOpportunity: (id: string, updates: Partial<Opportunity>) => void;
  
  addProperty: (property: Property) => void;
  updateProperty: (id: string, updates: Partial<Property>) => void;
  
  addAdUnit: (adUnit: AdUnit) => void;
  updateAdUnit: (id: string, updates: Partial<AdUnit>) => void;
}

export const useDemoStore = create<DemoState>((set) => ({
  business: demoBusiness,
  properties: demoProperties,
  adUnits: demoAdUnits,
  advertisers: demoAdvertisers,
  brands: demoBrands,
  contacts: demoContacts,
  opportunities: demoOpportunities,
  campaigns: demoCampaigns,
  flights: demoFlights,
  creatives: demoCreatives,
  deliveryData: demoDeliveryData,

  selectedBusinessId: demoBusiness.id,
  selectedPropertyId: null,

  setSelectedBusiness: (id) => set({ selectedBusinessId: id }),
  setSelectedProperty: (id) => set({ selectedPropertyId: id }),

  addCampaign: (campaign) =>
    set((state) => ({ campaigns: [...state.campaigns, campaign] })),
  updateCampaign: (id, updates) =>
    set((state) => ({
      campaigns: state.campaigns.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    })),
  deleteCampaign: (id) =>
    set((state) => ({
      campaigns: state.campaigns.filter((c) => c.id !== id),
      flights: state.flights.filter((f) => f.campaign_id !== id),
    })),

  addFlight: (flight) =>
    set((state) => ({ flights: [...state.flights, flight] })),
  updateFlight: (id, updates) =>
    set((state) => ({
      flights: state.flights.map((f) => (f.id === id ? { ...f, ...updates } : f)),
    })),
  deleteFlight: (id) =>
    set((state) => ({ flights: state.flights.filter((f) => f.id !== id) })),

  updateOpportunity: (id, updates) =>
    set((state) => ({
      opportunities: state.opportunities.map((o) => (o.id === id ? { ...o, ...updates } : o)),
    })),

  addProperty: (property) =>
    set((state) => ({ properties: [...state.properties, property] })),
  updateProperty: (id, updates) =>
    set((state) => ({
      properties: state.properties.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    })),

  addAdUnit: (adUnit) =>
    set((state) => ({ adUnits: [...state.adUnits, adUnit] })),
  updateAdUnit: (id, updates) =>
    set((state) => ({
      adUnits: state.adUnits.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    })),
}));
