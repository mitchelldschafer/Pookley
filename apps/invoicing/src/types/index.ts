export interface Customer {
  id: string;
  org_id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  org_id: string;
  customer_id: string;
  invoice_number: string;
  status: InvoiceStatus;
  subtotal_cents: number;
  tax_percent: number;
  tax_cents: number;
  total_cents: number;
  due_date: string;
  notes?: string;
  pdf_url?: string;
  stripe_checkout_session_id?: string;
  stripe_checkout_url?: string;
  sent_at?: string;
  viewed_at?: string;
  paid_at?: string;
  created_at: string;
  updated_at: string;
  customer?: Customer;
  items?: InvoiceItem[];
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price_cents: number;
  total_cents: number;
  created_at: string;
}

export type InvoiceStatus = 'draft' | 'sent' | 'viewed' | 'paid' | 'overdue' | 'void';

export interface DashboardStats {
  paidThisMonth: number;
  unpaidTotal: number;
  totalInvoices: number;
  overdueCount: number;
}

export interface CreateCustomerData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface CreateInvoiceData {
  customer_id: string;
  due_date: string;
  tax_percent: number;
  notes?: string;
}

export interface CreateInvoiceItemData {
  description: string;
  quantity: number;
  unit_price_cents: number;
}