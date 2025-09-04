import { useState, useEffect } from 'react';
import type { 
  Client, 
  Job, 
  Task, 
  CRMInvoice, 
  Activity, 
  CreateClientData, 
  CreateJobData, 
  CreateTaskData, 
  CreateInvoiceData,
  JobStage,
  TaskStatus,
  InvoiceStatus
} from '../types/crm';
import { 
  mockClients, 
  mockJobs, 
  mockTasks, 
  mockInvoices, 
  mockActivities 
} from '../data/mockCrmData';

// Simulate local storage for persistence during development
const STORAGE_KEYS = {
  clients: 'crm_clients',
  jobs: 'crm_jobs',
  tasks: 'crm_tasks',
  invoices: 'crm_invoices',
  activities: 'crm_activities'
};

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// Helper to get data from localStorage with fallback to mock data
const getStoredData = <T>(key: string, fallback: T[]): T[] => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
};

// Helper to save data to localStorage
const saveData = <T>(key: string, data: T[]) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

// Custom hooks for CRM data management
export const useClients = () => {
  const [clients, setClients] = useState<Client[]>(() => 
    getStoredData(STORAGE_KEYS.clients, mockClients)
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    saveData(STORAGE_KEYS.clients, clients);
  }, [clients]);

  const addClient = async (data: CreateClientData): Promise<Client> => {
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newClient: Client = {
      id: generateId(),
      owner_id: 'user1', // TODO: Replace with auth.uid()
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      jobs_count: 0,
      total_value: 0,
      last_activity: new Date().toISOString()
    };

    setClients(prev => [newClient, ...prev]);
    setLoading(false);
    
    console.log('Created client:', newClient);
    return newClient;
  };

  const updateClient = async (id: string, data: Partial<CreateClientData>): Promise<Client> => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const updatedClient = clients.find(c => c.id === id);
    if (!updatedClient) throw new Error('Client not found');

    const updated: Client = {
      ...updatedClient,
      ...data,
      updated_at: new Date().toISOString()
    };

    setClients(prev => prev.map(c => c.id === id ? updated : c));
    setLoading(false);
    
    console.log('Updated client:', updated);
    return updated;
  };

  const deleteClient = async (id: string): Promise<void> => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setClients(prev => prev.filter(c => c.id !== id));
    setLoading(false);
    
    console.log('Deleted client:', id);
  };

  return {
    clients,
    loading,
    addClient,
    updateClient,
    deleteClient
  };
};

export const useJobs = () => {
  const [jobs, setJobs] = useState<Job[]>(() => 
    getStoredData(STORAGE_KEYS.jobs, mockJobs)
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    saveData(STORAGE_KEYS.jobs, jobs);
  }, [jobs]);

  const addJob = async (data: CreateJobData): Promise<Job> => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newJob: Job = {
      id: generateId(),
      owner_id: 'user1', // TODO: Replace with auth.uid()
      stage: 'LEAD',
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setJobs(prev => [newJob, ...prev]);
    setLoading(false);
    
    console.log('Created job:', newJob);
    return newJob;
  };

  const updateJobStage = async (id: string, stage: JobStage): Promise<Job> => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const job = jobs.find(j => j.id === id);
    if (!job) throw new Error('Job not found');

    const updated: Job = {
      ...job,
      stage,
      updated_at: new Date().toISOString()
    };

    setJobs(prev => prev.map(j => j.id === id ? updated : j));
    setLoading(false);
    
    console.log('Updated job stage:', updated);
    return updated;
  };

  const deleteJob = async (id: string): Promise<void> => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setJobs(prev => prev.filter(j => j.id !== id));
    setLoading(false);
    
    console.log('Deleted job:', id);
  };

  return {
    jobs,
    loading,
    addJob,
    updateJobStage,
    deleteJob
  };
};

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>(() => 
    getStoredData(STORAGE_KEYS.tasks, mockTasks)
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    saveData(STORAGE_KEYS.tasks, tasks);
  }, [tasks]);

  const addTask = async (data: CreateTaskData): Promise<Task> => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newTask: Task = {
      id: generateId(),
      owner_id: 'user1', // TODO: Replace with auth.uid()
      status: 'OPEN',
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setTasks(prev => [newTask, ...prev]);
    setLoading(false);
    
    console.log('Created task:', newTask);
    return newTask;
  };

  const updateTaskStatus = async (id: string, status: TaskStatus): Promise<Task> => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const task = tasks.find(t => t.id === id);
    if (!task) throw new Error('Task not found');

    const updated: Task = {
      ...task,
      status,
      updated_at: new Date().toISOString()
    };

    setTasks(prev => prev.map(t => t.id === id ? updated : t));
    setLoading(false);
    
    console.log('Updated task status:', updated);
    return updated;
  };

  const deleteTask = async (id: string): Promise<void> => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setTasks(prev => prev.filter(t => t.id !== id));
    setLoading(false);
    
    console.log('Deleted task:', id);
  };

  return {
    tasks,
    loading,
    addTask,
    updateTaskStatus,
    deleteTask
  };
};

export const useInvoices = () => {
  const [invoices, setInvoices] = useState<CRMInvoice[]>(() => 
    getStoredData(STORAGE_KEYS.invoices, mockInvoices)
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    saveData(STORAGE_KEYS.invoices, invoices);
  }, [invoices]);

  const addInvoice = async (data: CreateInvoiceData): Promise<CRMInvoice> => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Generate invoice number
    const invoiceCount = invoices.length + 1;
    const number = `INV-${new Date().getFullYear()}-${String(invoiceCount).padStart(3, '0')}`;
    
    const newInvoice: CRMInvoice = {
      id: generateId(),
      owner_id: 'user1', // TODO: Replace with auth.uid()
      number,
      currency: 'USD',
      status: 'DRAFT',
      issued_at: new Date().toISOString().split('T')[0],
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setInvoices(prev => [newInvoice, ...prev]);
    setLoading(false);
    
    console.log('Created invoice:', newInvoice);
    return newInvoice;
  };

  const updateInvoiceStatus = async (id: string, status: InvoiceStatus): Promise<CRMInvoice> => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const invoice = invoices.find(i => i.id === id);
    if (!invoice) throw new Error('Invoice not found');

    const updated: CRMInvoice = {
      ...invoice,
      status,
      updated_at: new Date().toISOString()
    };

    setInvoices(prev => prev.map(i => i.id === id ? updated : i));
    setLoading(false);
    
    console.log('Updated invoice status:', updated);
    return updated;
  };

  return {
    invoices,
    loading,
    addInvoice,
    updateInvoiceStatus
  };
};

export const useActivities = () => {
  const [activities, setActivities] = useState<Activity[]>(() => 
    getStoredData(STORAGE_KEYS.activities, mockActivities)
  );

  const addActivity = (
    entityType: string,
    entityId: string,
    type: 'note' | 'status_change' | 'file_upload' | 'invoice_status',
    message: string
  ) => {
    const newActivity: Activity = {
      id: generateId(),
      owner_id: 'user1', // TODO: Replace with auth.uid()
      entity_type: entityType,
      entity_id: entityId,
      type,
      message,
      created_at: new Date().toISOString()
    };

    setActivities(prev => [newActivity, ...prev]);
    saveData(STORAGE_KEYS.activities, [newActivity, ...activities]);
    
    console.log('Added activity:', newActivity);
  };

  return {
    activities,
    addActivity
  };
};