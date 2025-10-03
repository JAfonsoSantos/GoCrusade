export type AppRole = 'platform_owner' | 'business_admin' | 'sales' | 'ad_ops' | 'analyst';

export type PricingModel = 'CPM' | 'CPC' | 'CPA' | 'FLAT';
export type GoalType = 'IMPRESSIONS' | 'CLICKS' | 'CONVERSIONS' | 'SPEND' | 'none';
export type Priority = 'house' | 'standard' | 'sponsorship';
export type CampaignStatus = 'draft' | 'reserved' | 'ready' | 'live' | 'paused' | 'completed' | 'archived';
export type OpportunityStage = 'Prospecting' | 'Qualification' | 'Proposal' | 'Negotiation' | 'Closed Won' | 'Closed Lost';

export interface Business {
  id: string;
  name: string;
  region: string;
  settings_json?: Record<string, any>;
}

export interface Property {
  id: string;
  business_id: string;
  name: string;
  domain?: string;
  app_id?: string;
}

export interface AdUnit {
  id: string;
  business_id: string;
  property_id: string;
  name: string;
  iab_standard: boolean;
  width: number;
  height: number;
  external_ref?: string;
}

export interface Advertiser {
  id: string;
  business_id: string;
  name: string;
  parent_name?: string;
  sf_id?: string;
  kevel_id?: string;
}

export interface Brand {
  id: string;
  business_id: string;
  advertiser_id: string;
  name: string;
}

export interface Contact {
  id: string;
  business_id: string;
  advertiser_id?: string;
  name: string;
  email: string;
  title?: string;
  sf_id?: string;
}

export interface Opportunity {
  id: string;
  business_id: string;
  advertiser_id: string;
  name: string;
  stage: OpportunityStage;
  amount?: number;
  close_date?: string;
  owner?: string;
  sf_id?: string;
}

export interface Campaign {
  id: string;
  business_id: string;
  advertiser_id: string;
  property_id: string;
  name: string;
  status: CampaignStatus;
  budget?: number;
  owner?: string;
  sf_id?: string;
  kevel_id?: string;
}

export interface Flight {
  id: string;
  campaign_id: string;
  ad_unit_id: string;
  name: string;
  start_at?: string;
  end_at?: string;
  always_on: boolean;
  pricing_model: PricingModel;
  rate: number;
  goal_type: GoalType;
  goal_amount?: number;
  priority: Priority;
  freq_cap_json?: Record<string, any>;
  timezone: string;
  kevel_id?: string;
}

export interface Creative {
  id: string;
  campaign_id: string;
  name: string;
  type: string;
  url: string;
  width?: number;
  height?: number;
  kevel_ad_id?: string;
}

export interface DeliveryFlightDaily {
  id: string;
  flight_id: string;
  date: string;
  imps: number;
  clicks: number;
  spend: number;
  convs: number;
}

export interface IntegrationConfig {
  business_id: string;
  salesforce_json?: Record<string, any>;
  kevel_json?: Record<string, any>;
}

export interface MappingRule {
  id: string;
  business_id: string;
  source: 'salesforce' | 'kevel';
  object: string;
  source_field: string;
  dest_object: string;
  dest_field: string;
  direction: 'in' | 'out' | 'both';
  rules_json?: Record<string, any>;
}

export interface SyncJob {
  id: string;
  business_id: string;
  source: 'salesforce' | 'kevel';
  started_at: string;
  finished_at?: string;
  stats_json?: Record<string, any>;
  status: 'running' | 'success' | 'failed';
}

export interface SyncLog {
  id: string;
  job_id: string;
  level: 'info' | 'warning' | 'error';
  object: string;
  record_id?: string;
  message: string;
  payload_json?: Record<string, any>;
}
