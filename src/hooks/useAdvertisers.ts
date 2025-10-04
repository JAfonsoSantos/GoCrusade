import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Advertiser } from '@/lib/types';
import { toast } from 'sonner';

export function useAdvertisers(businessId?: string) {
  return useQuery({
    queryKey: ['advertisers', businessId],
    queryFn: async () => {
      let query = supabase.from('advertiser').select('*').order('name');
      
      if (businessId) {
        query = query.eq('business_id', businessId);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as Advertiser[];
    },
  });
}

export function useAdvertiser(id: string | undefined) {
  return useQuery({
    queryKey: ['advertiser', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('advertiser')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Advertiser;
    },
    enabled: !!id,
  });
}

export function useCreateAdvertiser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (advertiser: Omit<Advertiser, 'id'>) => {
      const { data, error } = await supabase
        .from('advertiser')
        .insert(advertiser)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advertisers'] });
      toast.success('Advertiser created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create advertiser');
    },
  });
}

export function useUpdateAdvertiser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Advertiser> & { id: string }) => {
      const { data, error } = await supabase
        .from('advertiser')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['advertisers'] });
      queryClient.invalidateQueries({ queryKey: ['advertiser', data.id] });
      toast.success('Advertiser updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update advertiser');
    },
  });
}

export function useDeleteAdvertiser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('advertiser')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advertisers'] });
      toast.success('Advertiser deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete advertiser');
    },
  });
}