import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get the authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      throw new Error('Not authenticated');
    }

    console.log('Seeding demo data for user:', user.id);

    // Create a demo business
    const { data: business, error: businessError } = await supabaseClient
      .from('business')
      .insert({
        name: 'Acme Retail',
        region: 'EU',
        settings_json: {
          currency: 'EUR',
          timezone: 'Europe/Lisbon',
        },
      })
      .select()
      .single();

    if (businessError) throw businessError;
    console.log('Created business:', business.id);

    // Update user profile with business_id
    const { error: profileError } = await supabaseClient
      .from('profiles')
      .update({ business_id: business.id })
      .eq('id', user.id);

    if (profileError) throw profileError;

    // Assign user as business_admin role
    const { error: roleError } = await supabaseClient
      .from('user_roles')
      .insert({ user_id: user.id, role: 'business_admin' });

    if (roleError) throw roleError;

    // Create properties
    const { data: properties, error: propertiesError } = await supabaseClient
      .from('property')
      .insert([
        {
          business_id: business.id,
          name: 'Continente.pt',
          domain: 'continente.pt',
        },
        {
          business_id: business.id,
          name: 'Wells.pt',
          domain: 'wells.pt',
        },
        {
          business_id: business.id,
          name: 'Pingo Doce App',
          app_id: 'pt.pingodoce.app',
        },
      ])
      .select();

    if (propertiesError) throw propertiesError;
    console.log('Created properties:', properties.length);

    // Create ad units for first property
    const { data: adUnits, error: adUnitsError } = await supabaseClient
      .from('ad_unit')
      .insert([
        {
          business_id: business.id,
          property_id: properties[0].id,
          name: 'Billboard',
          iab_standard: true,
          width: 970,
          height: 250,
        },
        {
          business_id: business.id,
          property_id: properties[0].id,
          name: 'Leaderboard',
          iab_standard: true,
          width: 728,
          height: 90,
        },
        {
          business_id: business.id,
          property_id: properties[0].id,
          name: 'Medium Rectangle',
          iab_standard: true,
          width: 300,
          height: 250,
        },
        {
          business_id: business.id,
          property_id: properties[0].id,
          name: 'Mobile Banner',
          iab_standard: true,
          width: 320,
          height: 50,
        },
      ])
      .select();

    if (adUnitsError) throw adUnitsError;
    console.log('Created ad units:', adUnits.length);

    // Create advertisers
    const { data: advertisers, error: advertisersError } = await supabaseClient
      .from('advertiser')
      .insert([
        {
          business_id: business.id,
          name: 'Unilever',
          parent_name: 'Unilever PLC',
        },
        {
          business_id: business.id,
          name: 'Procter & Gamble',
          parent_name: 'P&G',
        },
        {
          business_id: business.id,
          name: 'Nestlé',
        },
      ])
      .select();

    if (advertisersError) throw advertisersError;
    console.log('Created advertisers:', advertisers.length);

    // Create brands
    const { data: brands, error: brandsError } = await supabaseClient
      .from('brand')
      .insert([
        {
          business_id: business.id,
          advertiser_id: advertisers[0].id,
          name: 'Dove',
        },
        {
          business_id: business.id,
          advertiser_id: advertisers[1].id,
          name: 'Ariel',
        },
      ])
      .select();

    if (brandsError) throw brandsError;
    console.log('Created brands:', brands.length);

    // Create contacts
    const { data: contacts, error: contactsError } = await supabaseClient
      .from('contact')
      .insert([
        {
          business_id: business.id,
          advertiser_id: advertisers[0].id,
          name: 'John Smith',
          email: 'john.smith@unilever.com',
          title: 'Media Director',
        },
        {
          business_id: business.id,
          advertiser_id: advertisers[1].id,
          name: 'Sarah Johnson',
          email: 'sarah.j@pg.com',
          title: 'Brand Manager',
        },
      ])
      .select();

    if (contactsError) throw contactsError;
    console.log('Created contacts:', contacts.length);

    // Create opportunities
    const { data: opportunities, error: opportunitiesError } = await supabaseClient
      .from('opportunity')
      .insert([
        {
          business_id: business.id,
          advertiser_id: advertisers[0].id,
          name: 'Q1 2025 Beauty Campaign',
          stage: 'Proposal',
          amount: 50000,
          close_date: '2025-01-15',
          owner: user.email,
        },
        {
          business_id: business.id,
          advertiser_id: advertisers[1].id,
          name: 'Summer Laundry Promotion',
          stage: 'Negotiation',
          amount: 75000,
          close_date: '2025-02-01',
          owner: user.email,
        },
      ])
      .select();

    if (opportunitiesError) throw opportunitiesError;
    console.log('Created opportunities:', opportunities.length);

    // Create campaigns
    const { data: campaigns, error: campaignsError } = await supabaseClient
      .from('campaign')
      .insert([
        {
          business_id: business.id,
          advertiser_id: advertisers[0].id,
          property_id: properties[0].id,
          name: 'Dove - Valentine\'s Day 2025',
          status: 'live',
          budget: 25000,
          owner: user.email,
        },
        {
          business_id: business.id,
          advertiser_id: advertisers[1].id,
          property_id: properties[0].id,
          name: 'Ariel - Spring Clean Campaign',
          status: 'draft',
          budget: 35000,
          owner: user.email,
        },
      ])
      .select();

    if (campaignsError) throw campaignsError;
    console.log('Created campaigns:', campaigns.length);

    // Create flights for first campaign
    const { data: flights, error: flightsError } = await supabaseClient
      .from('flight')
      .insert([
        {
          campaign_id: campaigns[0].id,
          ad_unit_id: adUnits[0].id,
          name: 'Billboard - Homepage',
          start_at: new Date('2025-01-20').toISOString(),
          end_at: new Date('2025-02-14').toISOString(),
          always_on: false,
          pricing_model: 'CPM',
          rate: 5.5,
          goal_type: 'IMPRESSIONS',
          goal_amount: 1000000,
          priority: 'sponsorship',
          timezone: 'Europe/Lisbon',
        },
        {
          campaign_id: campaigns[0].id,
          ad_unit_id: adUnits[3].id,
          name: 'Mobile Banner - Always On',
          start_at: new Date('2025-01-20').toISOString(),
          always_on: true,
          pricing_model: 'CPC',
          rate: 0.75,
          priority: 'standard',
          timezone: 'Europe/Lisbon',
        },
      ])
      .select();

    if (flightsError) throw flightsError;
    console.log('Created flights:', flights.length);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Demo data seeded successfully',
        business_id: business.id,
        counts: {
          properties: properties.length,
          ad_units: adUnits.length,
          advertisers: advertisers.length,
          brands: brands.length,
          contacts: contacts.length,
          opportunities: opportunities.length,
          campaigns: campaigns.length,
          flights: flights.length,
        },
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error seeding demo data:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});