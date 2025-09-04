// CRM Type Definitions
export type JobStage = 'LEAD' | 'QUALIFIED' | 'PROPOSAL' | 'WON' | 'IN_PROGRESS' | 'COMPLETED' | 'PAID' | 'LOST';
export type TaskStatus = 'OPEN' | 'IN_PROGRESS' | 'BLOCKED' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type InvoiceStatus = 'DRAFT' | 'SENT' | 'PARTIALLY_PAID' | 'PAID' | 'VOID';
export type ActivityType = 'note' | 'status_change' | 'file_upload' | 'invoice_status';

export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  company_name?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  owner_id: string;
  name: string;
  contact_name?: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  // Computed fields
  jobs_count?: number;
  total_value?: number;
  last_activity?: string;
}

export interface Job {
  id: string;
  owner_id: string;
  client_id: string;
  title: string;
  description?: string;
  stage: JobStage;
  estimated_amount: number;
  start_date?: string;
  due_date?: string;
  location?: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  // Relations
  client?: Client;
  tasks?: Task[];
  invoices?: CRMInvoice[];
}

export interface Task {
  id: string;
  owner_id: string;
  job_id?: string;
  client_id?: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_at?: string;
  created_at: string;
  updated_at: string;
  // Relations
  job?: Job;
  client?: Client;
}

export interface CRMInvoice {
  id: string;
  owner_id: string;
  client_id: string;
  job_id?: string;
  number: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  issued_at?: string;
  due_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  // Relations
  client?: Client;
  job?: Job;
}

export interface Activity {
  id: string;
  owner_id: string;
  entity_type: string;
  entity_id: string;
  type: ActivityType;
  message: string;
  created_at: string;
}

export interface DashboardStats {
  total_pipeline_value: number;
  won_this_month: number;
  unpaid_invoices: number;
  open_tasks: number;
  jobs_by_stage: Record<JobStage, number>;
  recent_activities: Activity[];
}

// Form types
export interface CreateClientData {
  name: string;
  contact_name?: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
}

export interface CreateJobData {
  client_id: string;
  title: string;
  description?: string;
  estimated_amount: number;
  start_date?: string;
  due_date?: string;
  location?: string;
  tags: string[];
}

export interface CreateTaskData {
  title: string;
  description?: string;
  job_id?: string;
  client_id?: string;
  priority: TaskPriority;
  due_at?: string;
}

export interface CreateInvoiceData {
  client_id: string;
  job_id?: string;
  amount: number;
  due_at?: string;
  notes?: string;
}