import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Business } from '@/lib/types';
import { toast } from 'sonner';

export function useBusinesses() {
  return useQuery({
    queryKey: ['businesses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('business')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Business[];
    },
  });
}

export function useBusiness(id: string | undefined) {
  return useQuery({
    queryKey: ['business', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('business')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Business;
    },
    enabled: !!id,
  });
}

export function useCreateBusiness() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (business: Omit<Business, 'id'>) => {
      const { data, error } = await supabase
        .from('business')
        .insert(business)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businesses'] });
      toast.success('Business created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create business');
    },
  });
}

export function useUpdateBusiness() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Business> & { id: string }) => {
      const { data, error } = await supabase
        .from('business')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['businesses'] });
      queryClient.invalidateQueries({ queryKey: ['business', data.id] });
      toast.success('Business updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update business');
    },
  });
}