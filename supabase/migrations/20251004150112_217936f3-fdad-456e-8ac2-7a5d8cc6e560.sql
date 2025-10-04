-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('platform_owner', 'business_admin', 'sales', 'ad_ops', 'analyst');

-- Create pricing_model enum
CREATE TYPE public.pricing_model AS ENUM ('CPM', 'CPC', 'CPA', 'FLAT');

-- Create goal_type enum  
CREATE TYPE public.goal_type AS ENUM ('IMPRESSIONS', 'CLICKS', 'CONVERSIONS', 'SPEND');

-- Create priority enum
CREATE TYPE public.priority AS ENUM ('house', 'standard', 'sponsorship');

-- Create campaign_status enum
CREATE TYPE public.campaign_status AS ENUM ('draft', 'reserved', 'ready', 'live', 'paused', 'completed', 'archived');

-- Create opportunity_stage enum
CREATE TYPE public.opportunity_stage AS ENUM ('Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost');

-- Create sync_status enum
CREATE TYPE public.sync_status AS ENUM ('running', 'success', 'failed');

-- Create sync_source enum
CREATE TYPE public.sync_source AS ENUM ('salesforce', 'kevel');

-- Create log_level enum
CREATE TYPE public.log_level AS ENUM ('info', 'warning', 'error');

-- Business table
CREATE TABLE public.business (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  region TEXT NOT NULL DEFAULT 'EU',
  settings_json JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.business ENABLE ROW LEVEL SECURITY;

-- Profiles table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  business_id UUID REFERENCES public.business(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- User roles table (separate for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Property table
CREATE TABLE public.property (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.business(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  domain TEXT,
  app_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.property ENABLE ROW LEVEL SECURITY;

-- Ad Unit table
CREATE TABLE public.ad_unit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.business(id) ON DELETE CASCADE NOT NULL,
  property_id UUID REFERENCES public.property(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  iab_standard BOOLEAN NOT NULL DEFAULT false,
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  external_ref TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.ad_unit ENABLE ROW LEVEL SECURITY;

-- Advertiser table
CREATE TABLE public.advertiser (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.business(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  parent_name TEXT,
  sf_id TEXT,
  kevel_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.advertiser ENABLE ROW LEVEL SECURITY;

-- Brand table
CREATE TABLE public.brand (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.business(id) ON DELETE CASCADE NOT NULL,
  advertiser_id UUID REFERENCES public.advertiser(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.brand ENABLE ROW LEVEL SECURITY;

-- Contact table
CREATE TABLE public.contact (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.business(id) ON DELETE CASCADE NOT NULL,
  advertiser_id UUID REFERENCES public.advertiser(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  title TEXT,
  sf_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.contact ENABLE ROW LEVEL SECURITY;

-- Opportunity table
CREATE TABLE public.opportunity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.business(id) ON DELETE CASCADE NOT NULL,
  advertiser_id UUID REFERENCES public.advertiser(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  stage public.opportunity_stage NOT NULL DEFAULT 'Prospecting',
  amount NUMERIC(12,2),
  close_date DATE,
  owner TEXT,
  sf_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.opportunity ENABLE ROW LEVEL SECURITY;

-- Campaign table
CREATE TABLE public.campaign (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.business(id) ON DELETE CASCADE NOT NULL,
  advertiser_id UUID REFERENCES public.advertiser(id) ON DELETE CASCADE NOT NULL,
  property_id UUID REFERENCES public.property(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  status public.campaign_status NOT NULL DEFAULT 'draft',
  budget NUMERIC(12,2),
  owner TEXT,
  sf_id TEXT,
  kevel_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.campaign ENABLE ROW LEVEL SECURITY;

-- Flight table
CREATE TABLE public.flight (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES public.campaign(id) ON DELETE CASCADE NOT NULL,
  ad_unit_id UUID REFERENCES public.ad_unit(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  start_at TIMESTAMPTZ,
  end_at TIMESTAMPTZ,
  always_on BOOLEAN NOT NULL DEFAULT false,
  pricing_model public.pricing_model NOT NULL,
  rate NUMERIC(12,2) NOT NULL,
  goal_type public.goal_type,
  goal_amount NUMERIC(12,2),
  priority public.priority NOT NULL DEFAULT 'standard',
  freq_cap_json JSONB,
  timezone TEXT NOT NULL DEFAULT 'Europe/Lisbon',
  kevel_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.flight ENABLE ROW LEVEL SECURITY;

-- Creative table
CREATE TABLE public.creative (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES public.campaign(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  url TEXT NOT NULL,
  width INTEGER,
  height INTEGER,
  kevel_ad_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.creative ENABLE ROW LEVEL SECURITY;

-- Campaign Opportunity junction table
CREATE TABLE public.campaign_opportunity (
  campaign_id UUID REFERENCES public.campaign(id) ON DELETE CASCADE NOT NULL,
  opportunity_id UUID REFERENCES public.opportunity(id) ON DELETE CASCADE NOT NULL,
  PRIMARY KEY (campaign_id, opportunity_id)
);

ALTER TABLE public.campaign_opportunity ENABLE ROW LEVEL SECURITY;

-- Delivery Flight Daily table
CREATE TABLE public.delivery_flight_daily (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flight_id UUID REFERENCES public.flight(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  imps INTEGER NOT NULL DEFAULT 0,
  clicks INTEGER NOT NULL DEFAULT 0,
  spend NUMERIC(12,2) NOT NULL DEFAULT 0,
  convs INTEGER NOT NULL DEFAULT 0,
  UNIQUE (flight_id, date)
);

ALTER TABLE public.delivery_flight_daily ENABLE ROW LEVEL SECURITY;

-- Integration Config table
CREATE TABLE public.integration_config (
  business_id UUID PRIMARY KEY REFERENCES public.business(id) ON DELETE CASCADE,
  salesforce_json JSONB,
  kevel_json JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.integration_config ENABLE ROW LEVEL SECURITY;

-- Mapping Rule table
CREATE TABLE public.mapping_rule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.business(id) ON DELETE CASCADE NOT NULL,
  source public.sync_source NOT NULL,
  object TEXT NOT NULL,
  source_field TEXT NOT NULL,
  dest_object TEXT NOT NULL,
  dest_field TEXT NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('in', 'out', 'both')),
  rules_json JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.mapping_rule ENABLE ROW LEVEL SECURITY;

-- Sync Job table
CREATE TABLE public.sync_job (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.business(id) ON DELETE CASCADE NOT NULL,
  source public.sync_source NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  finished_at TIMESTAMPTZ,
  stats_json JSONB,
  status public.sync_status NOT NULL DEFAULT 'running'
);

ALTER TABLE public.sync_job ENABLE ROW LEVEL SECURITY;

-- Sync Log table
CREATE TABLE public.sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES public.sync_job(id) ON DELETE CASCADE NOT NULL,
  level public.log_level NOT NULL,
  object TEXT NOT NULL,
  record_id TEXT,
  message TEXT NOT NULL,
  payload_json JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.sync_log ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to get user's business_id
CREATE OR REPLACE FUNCTION public.get_user_business_id(_user_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT business_id
  FROM public.profiles
  WHERE id = _user_id
  LIMIT 1
$$;

-- Trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Add updated_at triggers
CREATE TRIGGER update_business_updated_at BEFORE UPDATE ON public.business
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_property_updated_at BEFORE UPDATE ON public.property
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ad_unit_updated_at BEFORE UPDATE ON public.ad_unit
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_advertiser_updated_at BEFORE UPDATE ON public.advertiser
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_brand_updated_at BEFORE UPDATE ON public.brand
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contact_updated_at BEFORE UPDATE ON public.contact
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_opportunity_updated_at BEFORE UPDATE ON public.opportunity
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_campaign_updated_at BEFORE UPDATE ON public.campaign
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_flight_updated_at BEFORE UPDATE ON public.flight
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_creative_updated_at BEFORE UPDATE ON public.creative
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_integration_config_updated_at BEFORE UPDATE ON public.integration_config
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_mapping_rule_updated_at BEFORE UPDATE ON public.mapping_rule
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger to auto-create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email)
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS Policies for business (platform_owner sees all, others see their business)
CREATE POLICY "Platform owners can view all businesses"
  ON public.business FOR SELECT
  USING (public.has_role(auth.uid(), 'platform_owner'));

CREATE POLICY "Users can view their business"
  ON public.business FOR SELECT
  USING (id = public.get_user_business_id(auth.uid()));

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (id = auth.uid());

-- RLS Policies for user_roles (only business_admin and platform_owner can manage)
CREATE POLICY "Platform owners can manage all roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'platform_owner'));

CREATE POLICY "Business admins can view roles in their business"
  ON public.user_roles FOR SELECT
  USING (
    public.has_role(auth.uid(), 'business_admin') AND
    user_id IN (
      SELECT id FROM public.profiles WHERE business_id = public.get_user_business_id(auth.uid())
    )
  );

-- Generic RLS policies for business-scoped tables
CREATE POLICY "Users can view their business data"
  ON public.property FOR SELECT
  USING (business_id = public.get_user_business_id(auth.uid()));

CREATE POLICY "Users can view their business data"
  ON public.ad_unit FOR SELECT
  USING (business_id = public.get_user_business_id(auth.uid()));

CREATE POLICY "Users can view their business data"
  ON public.advertiser FOR SELECT
  USING (business_id = public.get_user_business_id(auth.uid()));

CREATE POLICY "Users can view their business data"
  ON public.brand FOR SELECT
  USING (business_id = public.get_user_business_id(auth.uid()));

CREATE POLICY "Users can view their business data"
  ON public.contact FOR SELECT
  USING (business_id = public.get_user_business_id(auth.uid()));

CREATE POLICY "Users can view their business data"
  ON public.opportunity FOR SELECT
  USING (business_id = public.get_user_business_id(auth.uid()));

CREATE POLICY "Users can view their business data"
  ON public.campaign FOR SELECT
  USING (business_id = public.get_user_business_id(auth.uid()));

CREATE POLICY "Users can view their business data"
  ON public.integration_config FOR SELECT
  USING (business_id = public.get_user_business_id(auth.uid()));

CREATE POLICY "Users can view their business data"
  ON public.mapping_rule FOR SELECT
  USING (business_id = public.get_user_business_id(auth.uid()));

CREATE POLICY "Users can view their business data"
  ON public.sync_job FOR SELECT
  USING (business_id = public.get_user_business_id(auth.uid()));

-- Flight and creative policies (join through campaign)
CREATE POLICY "Users can view flights for their campaigns"
  ON public.flight FOR SELECT
  USING (
    campaign_id IN (
      SELECT id FROM public.campaign WHERE business_id = public.get_user_business_id(auth.uid())
    )
  );

CREATE POLICY "Users can view creatives for their campaigns"
  ON public.creative FOR SELECT
  USING (
    campaign_id IN (
      SELECT id FROM public.campaign WHERE business_id = public.get_user_business_id(auth.uid())
    )
  );

-- Delivery data policies
CREATE POLICY "Users can view delivery data for their flights"
  ON public.delivery_flight_daily FOR SELECT
  USING (
    flight_id IN (
      SELECT f.id FROM public.flight f
      JOIN public.campaign c ON f.campaign_id = c.id
      WHERE c.business_id = public.get_user_business_id(auth.uid())
    )
  );

-- Sync log policies
CREATE POLICY "Users can view sync logs for their jobs"
  ON public.sync_log FOR SELECT
  USING (
    job_id IN (
      SELECT id FROM public.sync_job WHERE business_id = public.get_user_business_id(auth.uid())
    )
  );

-- Campaign opportunity junction policies
CREATE POLICY "Users can view campaign opportunity links"
  ON public.campaign_opportunity FOR SELECT
  USING (
    campaign_id IN (
      SELECT id FROM public.campaign WHERE business_id = public.get_user_business_id(auth.uid())
    )
  );