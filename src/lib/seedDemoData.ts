import { supabase } from '@/integrations/supabase/client';

export async function seedDemoData() {
  const { data, error } = await supabase.functions.invoke('seed-demo-data');
  
  if (error) {
    console.error('Failed to seed demo data:', error);
    throw error;
  }
  
  return data;
}