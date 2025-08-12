import { useQuery, useMutation, useQueryClient } from 'react-query';
import { supabase } from '@pookley/supabase';
import { useCurrentOrg } from '@pookley/supabase';
import type { Customer, CreateCustomerData } from '../types';

export const useCustomers = () => {
  const { org_id } = useCurrentOrg();
  
  return useQuery<Customer[]>(['customers', org_id], async () => {
    const { data, error } = await supabase
      .from('billing.customers')
      .select('*')
      .eq('org_id', org_id)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  });
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  const { org_id } = useCurrentOrg();
  
  return useMutation<Customer, Error, CreateCustomerData>(
    async (data) => {
      const { data: customer, error } = await supabase
        .from('billing.customers')
        .insert({ ...data, org_id })
        .select()
        .single();
      
      if (error) throw error;
      return customer;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['customers', org_id]);
      },
    }
  );
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();
  const { org_id } = useCurrentOrg();
  
  return useMutation<Customer, Error, { id: string; data: Partial<CreateCustomerData> }>(
    async ({ id, data }) => {
      const { data: customer, error } = await supabase
        .from('billing.customers')
        .update(data)
        .eq('id', id)
        .eq('org_id', org_id)
        .select()
        .single();
      
      if (error) throw error;
      return customer;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['customers', org_id]);
      },
    }
  );
};