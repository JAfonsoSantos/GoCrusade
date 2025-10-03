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

export const demoBusiness: Business = {
  id: 'demo-business-1',
  name: 'Kevel Demo',
  region: 'EU',
  settings_json: {},
};

export const demoProperties: Property[] = [
  {
    id: 'prop-1',
    business_id: 'demo-business-1',
    name: 'continente.pt',
    domain: 'continente.pt',
  },
  {
    id: 'prop-2',
    business_id: 'demo-business-1',
    name: 'wells.pt',
    domain: 'wells.pt',
  },
];

export const demoAdUnits: AdUnit[] = [
  {
    id: 'au-1',
    business_id: 'demo-business-1',
    property_id: 'prop-1',
    name: 'Billboard',
    iab_standard: true,
    width: 970,
    height: 250,
    external_ref: 'kevel-au-970x250',
  },
  {
    id: 'au-2',
    business_id: 'demo-business-1',
    property_id: 'prop-1',
    name: 'Leaderboard',
    iab_standard: true,
    width: 728,
    height: 90,
    external_ref: 'kevel-au-728x90',
  },
  {
    id: 'au-3',
    business_id: 'demo-business-1',
    property_id: 'prop-1',
    name: 'Medium Rectangle',
    iab_standard: true,
    width: 300,
    height: 250,
    external_ref: 'kevel-au-300x250',
  },
  {
    id: 'au-4',
    business_id: 'demo-business-1',
    property_id: 'prop-2',
    name: 'Skyscraper',
    iab_standard: true,
    width: 160,
    height: 600,
    external_ref: 'kevel-au-160x600',
  },
  {
    id: 'au-5',
    business_id: 'demo-business-1',
    property_id: 'prop-2',
    name: 'Mobile Banner',
    iab_standard: true,
    width: 320,
    height: 50,
    external_ref: 'kevel-au-320x50',
  },
];

export const demoAdvertisers: Advertiser[] = [
  {
    id: 'adv-1',
    business_id: 'demo-business-1',
    name: 'Unilever',
    parent_name: 'Unilever Group',
    sf_id: 'SF-001',
  },
  {
    id: 'adv-2',
    business_id: 'demo-business-1',
    name: 'P&G',
    parent_name: 'Procter & Gamble',
    sf_id: 'SF-002',
  },
  {
    id: 'adv-3',
    business_id: 'demo-business-1',
    name: 'Nestlé',
    sf_id: 'SF-003',
  },
];

export const demoBrands: Brand[] = [
  {
    id: 'brand-1',
    business_id: 'demo-business-1',
    advertiser_id: 'adv-1',
    name: 'Dove',
  },
  {
    id: 'brand-2',
    business_id: 'demo-business-1',
    advertiser_id: 'adv-2',
    name: 'Ariel',
  },
];

export const demoContacts: Contact[] = [
  {
    id: 'contact-1',
    business_id: 'demo-business-1',
    advertiser_id: 'adv-1',
    name: 'Maria Silva',
    email: 'maria.silva@unilever.com',
    title: 'Marketing Manager',
    sf_id: 'SF-C-001',
  },
  {
    id: 'contact-2',
    business_id: 'demo-business-1',
    advertiser_id: 'adv-2',
    name: 'João Santos',
    email: 'joao.santos@pg.com',
    title: 'Brand Director',
    sf_id: 'SF-C-002',
  },
  {
    id: 'contact-3',
    business_id: 'demo-business-1',
    advertiser_id: 'adv-3',
    name: 'Ana Costa',
    email: 'ana.costa@nestle.com',
    title: 'Digital Lead',
    sf_id: 'SF-C-003',
  },
];

export const demoOpportunities: Opportunity[] = [
  {
    id: 'opp-1',
    business_id: 'demo-business-1',
    advertiser_id: 'adv-1',
    name: 'Dove Summer Campaign 2025',
    stage: 'Negotiation',
    amount: 50000,
    close_date: '2025-11-15',
    owner: 'Sales User',
    sf_id: 'SF-OPP-001',
  },
  {
    id: 'opp-2',
    business_id: 'demo-business-1',
    advertiser_id: 'adv-2',
    name: 'Ariel Launch Q1',
    stage: 'Proposal',
    amount: 75000,
    close_date: '2025-10-30',
    owner: 'Sales User',
    sf_id: 'SF-OPP-002',
  },
  {
    id: 'opp-3',
    business_id: 'demo-business-1',
    advertiser_id: 'adv-3',
    name: 'Nestlé Holiday Push',
    stage: 'Qualification',
    amount: 30000,
    close_date: '2025-12-01',
    owner: 'Sales User',
    sf_id: 'SF-OPP-003',
  },
  {
    id: 'opp-4',
    business_id: 'demo-business-1',
    advertiser_id: 'adv-1',
    name: 'Dove Always-On',
    stage: 'Closed Won',
    amount: 120000,
    close_date: '2025-09-20',
    owner: 'Sales User',
  },
];

export const demoCampaigns: Campaign[] = [
  {
    id: 'camp-1',
    business_id: 'demo-business-1',
    advertiser_id: 'adv-1',
    property_id: 'prop-1',
    name: 'Dove Summer 2025',
    status: 'live',
    budget: 50000,
    owner: 'Ad Ops User',
    kevel_id: 'KVL-CAMP-001',
  },
  {
    id: 'camp-2',
    business_id: 'demo-business-1',
    advertiser_id: 'adv-2',
    property_id: 'prop-2',
    name: 'Ariel Launch',
    status: 'ready',
    budget: 75000,
    owner: 'Ad Ops User',
    kevel_id: 'KVL-CAMP-002',
  },
];

const now = new Date();
const nextMonth = new Date(now);
nextMonth.setMonth(nextMonth.getMonth() + 1);
const twoMonths = new Date(now);
twoMonths.setMonth(twoMonths.getMonth() + 2);

export const demoFlights: Flight[] = [
  {
    id: 'flight-1',
    campaign_id: 'camp-1',
    ad_unit_id: 'au-1',
    name: 'Dove Billboard Q4',
    start_at: now.toISOString().split('T')[0],
    end_at: nextMonth.toISOString().split('T')[0],
    always_on: false,
    pricing_model: 'CPM',
    rate: 5.0,
    goal_type: 'IMPRESSIONS',
    goal_amount: 1000000,
    priority: 'standard',
    timezone: 'Europe/Lisbon',
    kevel_id: 'KVL-FLT-001',
  },
  {
    id: 'flight-2',
    campaign_id: 'camp-1',
    ad_unit_id: 'au-3',
    name: 'Dove Always-On Rectangle',
    always_on: true,
    pricing_model: 'FLAT',
    rate: 10000,
    goal_type: 'none',
    priority: 'standard',
    timezone: 'Europe/Lisbon',
    kevel_id: 'KVL-FLT-002',
  },
  {
    id: 'flight-3',
    campaign_id: 'camp-2',
    ad_unit_id: 'au-2',
    name: 'Ariel CPC Leaderboard',
    pricing_model: 'CPC',
    rate: 1.5,
    goal_type: 'CLICKS',
    goal_amount: 50000,
    always_on: false,
    priority: 'sponsorship',
    timezone: 'Europe/Lisbon',
  },
  {
    id: 'flight-4',
    campaign_id: 'camp-2',
    ad_unit_id: 'au-5',
    name: 'Ariel Mobile CPA',
    start_at: nextMonth.toISOString().split('T')[0],
    end_at: twoMonths.toISOString().split('T')[0],
    always_on: false,
    pricing_model: 'CPA',
    rate: 25.0,
    goal_type: 'CONVERSIONS',
    goal_amount: 2000,
    priority: 'standard',
    timezone: 'Europe/Lisbon',
  },
];

export const demoCreatives: Creative[] = [
  {
    id: 'creative-1',
    campaign_id: 'camp-1',
    name: 'Dove Summer Creative 970x250',
    type: 'image',
    url: 'https://placeholder.svg',
    width: 970,
    height: 250,
  },
  {
    id: 'creative-2',
    campaign_id: 'camp-2',
    name: 'Ariel Launch Banner 728x90',
    type: 'image',
    url: 'https://placeholder.svg',
    width: 728,
    height: 90,
  },
];

// Generate 14 days of delivery data for flight-1
export const demoDeliveryData: DeliveryFlightDaily[] = [];
for (let i = 0; i < 14; i++) {
  const date = new Date(now);
  date.setDate(date.getDate() - (13 - i));
  demoDeliveryData.push({
    id: `delivery-${i + 1}`,
    flight_id: 'flight-1',
    date: date.toISOString().split('T')[0],
    imps: Math.floor(Math.random() * 100000) + 50000,
    clicks: Math.floor(Math.random() * 1000) + 500,
    spend: Math.floor(Math.random() * 500) + 250,
    convs: Math.floor(Math.random() * 50) + 10,
  });
}
