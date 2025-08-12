import { useQuery, useMutation, useQueryClient } from 'react-query';
import { supabase } from '@pookley/supabase';
import { useCurrentOrg } from '@pookley/supabase';
import type { Invoice, CreateInvoiceData, InvoiceStatus, DashboardStats } from '../types';

export const useInvoices = (filters?: { status?: InvoiceStatus; customer_id?: string }) => {
  const { org_id } = useCurrentOrg();
  
  return useQuery<Invoice[]>(['invoices', org_id, filters], async () => {
    let query = supabase
      .from('billing.invoices')
      .select(`
        *,
        customer:billing.customers(*),
        items:billing.invoice_items(*)
      `)
      .eq('org_id', org_id)
      .order('created_at', { ascending: false });
    
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    
    if (filters?.customer_id) {
      query = query.eq('customer_id', filters.customer_id);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  });
};

export const useInvoice = (id: string) => {
  const { org_id } = useCurrentOrg();
  
  return useQuery<Invoice>(['invoice', id], async () => {
    const { data, error } = await supabase
      .from('billing.invoices')
      .select(`
        *,
        customer:billing.customers(*),
        items:billing.invoice_items(*)
      `)
      .eq('id', id)
      .eq('org_id', org_id)
      .single();
    
    if (error) throw error;
    return data;
  });
};

export const useDashboardStats = () => {
  const { org_id } = useCurrentOrg();
  
  return useQuery<DashboardStats>(['dashboard-stats', org_id], async () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // Paid this month
    const { data: paidData } = await supabase
      .from('billing.invoices')
      .select('total_cents')
      .eq('org_id', org_id)
      .eq('status', 'paid')
      .gte('paid_at', startOfMonth.toISOString());
    
    const paidThisMonth = paidData?.reduce((sum, inv) => sum + inv.total_cents, 0) || 0;
    
    // Unpaid total
    const { data: unpaidData } = await supabase
      .from('billing.invoices')
      .select('total_cents')
      .eq('org_id', org_id)
      .in('status', ['sent', 'viewed', 'overdue']);
    
    const unpaidTotal = unpaidData?.reduce((sum, inv) => sum + inv.total_cents, 0) || 0;
    
    // Total invoices
    const { count: totalInvoices } = await supabase
      .from('billing.invoices')
      .select('*', { count: 'exact', head: true })
      .eq('org_id', org_id);
    
    // Overdue count
    const { count: overdueCount } = await supabase
      .from('billing.invoices')
      .select('*', { count: 'exact', head: true })
      .eq('org_id', org_id)
      .eq('status', 'overdue');
    
    return {
      paidThisMonth,
      unpaidTotal,
      totalInvoices: totalInvoices || 0,
      overdueCount: overdueCount || 0,
    };
  });
};

export const useCreateInvoice = () => {
  const queryClient = useQueryClient();
  const { org_id } = useCurrentOrg();
  
  return useMutation<Invoice, Error, CreateInvoiceData>(
    async (data) => {
      // Generate invoice number
      const { count } = await supabase
        .from('billing.invoices')
        .select('*', { count: 'exact', head: true })
        .eq('org_id', org_id);
      
      const invoice_number = `INV-${String((count || 0) + 1).padStart(4, '0')}`;
      
      const { data: invoice, error } = await supabase
        .from('billing.invoices')
        .insert({
          ...data,
          org_id,
          invoice_number,
          status: 'draft',
          subtotal_cents: 0,
          tax_cents: 0,
          total_cents: 0,
        })
        .select()
        .single();
      
      if (error) throw error;
      return invoice;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['invoices', org_id]);
        queryClient.invalidateQueries(['dashboard-stats', org_id]);
      },
    }
  );
};

export const useUpdateInvoiceStatus = () => {
  const queryClient = useQueryClient();
  const { org_id } = useCurrentOrg();
  
  return useMutation<Invoice, Error, { id: string; status: InvoiceStatus; metadata?: Record<string, any> }>(
    async ({ id, status, metadata = {} }) => {
      const updates: any = { status };
      
      if (status === 'sent') {
        updates.sent_at = new Date().toISOString();
      } else if (status === 'viewed') {
        updates.viewed_at = new Date().toISOString();
      } else if (status === 'paid') {
        updates.paid_at = new Date().toISOString();
      }
      
      Object.assign(updates, metadata);
      
      const { data, error } = await supabase
        .from('billing.invoices')
        .update(updates)
        .eq('id', id)
        .eq('org_id', org_id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['invoices', org_id]);
        queryClient.invalidateQueries(['dashboard-stats', org_id]);
      },
    }
  );
};