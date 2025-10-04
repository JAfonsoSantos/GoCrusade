import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Flight } from '@/lib/types';
import { toast } from 'sonner';

export function useFlights(campaignId?: string) {
  return useQuery({
    queryKey: ['flights', campaignId],
    queryFn: async () => {
      let query = supabase
        .from('flight')
        .select(`
          *,
          campaign:campaign(*),
          ad_unit:ad_unit(*)
        `)
        .order('created_at', { ascending: false });
      
      if (campaignId) {
        query = query.eq('campaign_id', campaignId);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as Flight[];
    },
  });
}

export function useFlight(id: string | undefined) {
  return useQuery({
    queryKey: ['flight', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('flight')
        .select(`
          *,
          campaign:campaign(*),
          ad_unit:ad_unit(*)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Flight;
    },
    enabled: !!id,
  });
}

export function useCreateFlight() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (flight: Omit<Flight, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('flight')
        .insert([flight as any])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flights'] });
      toast.success('Flight created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create flight');
    },
  });
}

export function useUpdateFlight() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Flight> & { id: string }) => {
      const { data, error } = await supabase
        .from('flight')
        .update(updates as any)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['flights'] });
      queryClient.invalidateQueries({ queryKey: ['flight', data.id] });
      toast.success('Flight updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update flight');
    },
  });
}

export function useDeleteFlight() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('flight')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flights'] });
      toast.success('Flight deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete flight');
    },
  });
}