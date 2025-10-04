import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Opportunity } from '@/lib/types';
import { toast } from 'sonner';

export function useOpportunities(businessId?: string) {
  return useQuery({
    queryKey: ['opportunities', businessId],
    queryFn: async () => {
      let query = supabase
        .from('opportunity')
        .select(`
          *,
          advertiser:advertiser(*)
        `)
        .order('created_at', { ascending: false });
      
      if (businessId) {
        query = query.eq('business_id', businessId);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as Opportunity[];
    },
  });
}

export function useOpportunity(id: string | undefined) {
  return useQuery({
    queryKey: ['opportunity', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('opportunity')
        .select(`
          *,
          advertiser:advertiser(*)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Opportunity;
    },
    enabled: !!id,
  });
}

export function useCreateOpportunity() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (opportunity: Omit<Opportunity, 'id'>) => {
      const { data, error } = await supabase
        .from('opportunity')
        .insert(opportunity)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      toast.success('Opportunity created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create opportunity');
    },
  });
}

export function useUpdateOpportunity() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Opportunity> & { id: string }) => {
      const { data, error } = await supabase
        .from('opportunity')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      queryClient.invalidateQueries({ queryKey: ['opportunity', data.id] });
      toast.success('Opportunity updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update opportunity');
    },
  });
}

export function useDeleteOpportunity() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('opportunity')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      toast.success('Opportunity deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete opportunity');
    },
  });
}