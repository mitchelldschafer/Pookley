import { useQuery, useMutation, useQueryClient } from 'react-query';
import { supabase } from '@pookley/supabase';
import type { InvoiceItem, CreateInvoiceItemData } from '../types';

export const useInvoiceItems = (invoiceId: string) => {
  return useQuery<InvoiceItem[]>(['invoice-items', invoiceId], async () => {
    const { data, error } = await supabase
      .from('billing.invoice_items')
      .select('*')
      .eq('invoice_id', invoiceId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return data || [];
  });
};

export const useCreateInvoiceItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation<InvoiceItem, Error, CreateInvoiceItemData & { invoice_id: string }>(
    async (data) => {
      const total_cents = data.quantity * data.unit_price_cents;
      
      const { data: item, error } = await supabase
        .from('billing.invoice_items')
        .insert({ ...data, total_cents })
        .select()
        .single();
      
      if (error) throw error;
      return item;
    },
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(['invoice-items', variables.invoice_id]);
        queryClient.invalidateQueries(['invoice', variables.invoice_id]);
      },
    }
  );
};

export const useUpdateInvoiceItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation<InvoiceItem, Error, { id: string; invoice_id: string; data: Partial<CreateInvoiceItemData> }>(
    async ({ id, data }) => {
      const updates: any = { ...data };
      
      if (data.quantity !== undefined || data.unit_price_cents !== undefined) {
        // Recalculate total if quantity or price changed
        const { data: currentItem } = await supabase
          .from('billing.invoice_items')
          .select('quantity, unit_price_cents')
          .eq('id', id)
          .single();
        
        if (currentItem) {
          const quantity = data.quantity ?? currentItem.quantity;
          const unit_price_cents = data.unit_price_cents ?? currentItem.unit_price_cents;
          updates.total_cents = quantity * unit_price_cents;
        }
      }
      
      const { data: item, error } = await supabase
        .from('billing.invoice_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return item;
    },
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(['invoice-items', variables.invoice_id]);
        queryClient.invalidateQueries(['invoice', variables.invoice_id]);
      },
    }
  );
};

export const useDeleteInvoiceItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, { id: string; invoice_id: string }>(
    async ({ id }) => {
      const { error } = await supabase
        .from('billing.invoice_items')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(['invoice-items', variables.invoice_id]);
        queryClient.invalidateQueries(['invoice', variables.invoice_id]);
      },
    }
  );
};