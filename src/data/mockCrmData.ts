import type { Client, Job, Task, CRMInvoice, Activity, DashboardStats } from '../types/crm';

// Mock data for CRM development and testing
export const mockClients: Client[] = [
  {
    id: '1',
    owner_id: 'user1',
    name: 'Acme Corporation',
    contact_name: 'John Smith',
    phone: '+1-555-0100',
    email: 'john@acme.com',
    address: '123 Business St, City, ST 12345',
    notes: 'Large enterprise client. Prefers email communication.',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-20T14:30:00Z',
    jobs_count: 3,
    total_value: 75000,
    last_activity: '2024-01-20T14:30:00Z'
  },
  {
    id: '2',
    owner_id: 'user1',
    name: 'Tech Startup Inc',
    contact_name: 'Sarah Johnson',
    phone: '+1-555-0200',
    email: 'sarah@techstartup.com',
    address: '456 Innovation Ave, Tech City, CA 90210',
    notes: 'Fast-growing startup. Very responsive and decisive.',
    created_at: '2024-01-10T09:00:00Z',
    updated_at: '2024-01-25T16:45:00Z',
    jobs_count: 2,
    total_value: 45000,
    last_activity: '2024-01-25T16:45:00Z'
  },
  {
    id: '3',
    owner_id: 'user1',
    name: 'Local Restaurant Group',
    contact_name: 'Mike Chen',
    phone: '+1-555-0300',
    email: 'mike@restaurantgroup.com',
    address: '789 Food Court, Downtown, NY 10001',
    notes: 'Owns 5 restaurants. Looking for POS system integration.',
    created_at: '2024-01-05T11:00:00Z',
    updated_at: '2024-01-18T13:20:00Z',
    jobs_count: 1,
    total_value: 25000,
    last_activity: '2024-01-18T13:20:00Z'
  }
];

export const mockJobs: Job[] = [
  {
    id: '1',
    owner_id: 'user1',
    client_id: '1',
    title: 'Website Redesign',
    description: 'Complete overhaul of company website with modern design and improved UX',
    stage: 'PROPOSAL',
    estimated_amount: 15000,
    start_date: '2024-02-01',
    due_date: '2024-04-01',
    location: 'Remote',
    tags: ['web', 'design', 'ux'],
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-20T14:30:00Z'
  },
  {
    id: '2',
    owner_id: 'user1',
    client_id: '2',
    title: 'Mobile App Development',
    description: 'Native iOS and Android app for customer engagement',
    stage: 'IN_PROGRESS',
    estimated_amount: 45000,
    start_date: '2024-01-15',
    due_date: '2024-06-15',
    location: 'Hybrid',
    tags: ['mobile', 'ios', 'android'],
    created_at: '2024-01-10T09:00:00Z',
    updated_at: '2024-01-25T16:45:00Z'
  },
  {
    id: '3',
    owner_id: 'user1',
    client_id: '1',
    title: 'E-commerce Platform',
    description: 'Custom e-commerce solution with inventory management',
    stage: 'QUALIFIED',
    estimated_amount: 35000,
    start_date: '2024-03-01',
    due_date: '2024-08-01',
    location: 'Remote',
    tags: ['ecommerce', 'backend', 'api'],
    created_at: '2024-01-12T14:00:00Z',
    updated_at: '2024-01-22T11:15:00Z'
  },
  {
    id: '4',
    owner_id: 'user1',
    client_id: '3',
    title: 'POS System Integration',
    description: 'Integrate existing POS systems across 5 restaurant locations',
    stage: 'LEAD',
    estimated_amount: 25000,
    start_date: '2024-02-15',
    due_date: '2024-05-15',
    location: 'On-site',
    tags: ['pos', 'integration', 'restaurants'],
    created_at: '2024-01-05T11:00:00Z',
    updated_at: '2024-01-18T13:20:00Z'
  },
  {
    id: '5',
    owner_id: 'user1',
    client_id: '2',
    title: 'API Development',
    description: 'RESTful API for third-party integrations',
    stage: 'COMPLETED',
    estimated_amount: 12000,
    start_date: '2023-11-01',
    due_date: '2023-12-31',
    location: 'Remote',
    tags: ['api', 'backend'],
    created_at: '2023-10-25T10:00:00Z',
    updated_at: '2024-01-02T09:00:00Z'
  }
];

export const mockTasks: Task[] = [
  {
    id: '1',
    owner_id: 'user1',
    job_id: '1',
    client_id: '1',
    title: 'Create wireframes',
    description: 'Design initial wireframes for homepage and key pages',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    due_at: '2024-02-05T17:00:00Z',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-20T14:30:00Z'
  },
  {
    id: '2',
    owner_id: 'user1',
    job_id: '2',
    client_id: '2',
    title: 'Setup development environment',
    description: 'Configure React Native development environment',
    status: 'DONE',
    priority: 'MEDIUM',
    due_at: '2024-01-20T17:00:00Z',
    created_at: '2024-01-10T09:00:00Z',
    updated_at: '2024-01-18T16:00:00Z'
  },
  {
    id: '3',
    owner_id: 'user1',
    job_id: null,
    client_id: '1',
    title: 'Follow up on proposal',
    description: 'Call client to discuss proposal feedback',
    status: 'OPEN',
    priority: 'URGENT',
    due_at: '2024-02-02T10:00:00Z',
    created_at: '2024-01-25T11:00:00Z',
    updated_at: '2024-01-25T11:00:00Z'
  },
  {
    id: '4',
    owner_id: 'user1',
    job_id: '2',
    client_id: '2',
    title: 'Design app mockups',
    description: 'Create high-fidelity mockups for key app screens',
    status: 'OPEN',
    priority: 'HIGH',
    due_at: '2024-02-10T17:00:00Z',
    created_at: '2024-01-22T14:00:00Z',
    updated_at: '2024-01-22T14:00:00Z'
  },
  {
    id: '5',
    owner_id: 'user1',
    job_id: '3',
    client_id: '1',
    title: 'Research e-commerce platforms',
    description: 'Evaluate Shopify, WooCommerce, and custom solutions',
    status: 'BLOCKED',
    priority: 'MEDIUM',
    due_at: '2024-02-08T17:00:00Z',
    created_at: '2024-01-20T10:00:00Z',
    updated_at: '2024-01-24T15:30:00Z'
  }
];

export const mockInvoices: CRMInvoice[] = [
  {
    id: '1',
    owner_id: 'user1',
    client_id: '2',
    job_id: '2',
    number: 'INV-2024-001',
    amount: 15000,
    currency: 'USD',
    status: 'SENT',
    issued_at: '2024-01-15',
    due_at: '2024-02-15',
    notes: 'First milestone payment for mobile app development',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    owner_id: 'user1',
    client_id: '1',
    job_id: '1',
    number: 'INV-2024-002',
    amount: 7500,
    currency: 'USD',
    status: 'DRAFT',
    issued_at: '2024-01-20',
    due_at: '2024-02-20',
    notes: 'Website redesign - 50% upfront payment',
    created_at: '2024-01-20T14:00:00Z',
    updated_at: '2024-01-20T14:00:00Z'
  },
  {
    id: '3',
    owner_id: 'user1',
    client_id: '2',
    job_id: '5',
    number: 'INV-2023-015',
    amount: 12000,
    currency: 'USD',
    status: 'PAID',
    issued_at: '2023-12-31',
    due_at: '2024-01-31',
    notes: 'API development project - final payment',
    created_at: '2023-12-31T10:00:00Z',
    updated_at: '2024-01-05T09:00:00Z'
  }
];

export const mockActivities: Activity[] = [
  {
    id: '1',
    owner_id: 'user1',
    entity_type: 'job',
    entity_id: '1',
    type: 'status_change',
    message: 'Job stage changed from QUALIFIED to PROPOSAL',
    created_at: '2024-01-20T14:30:00Z'
  },
  {
    id: '2',
    owner_id: 'user1',
    entity_type: 'client',
    entity_id: '1',
    type: 'note',
    message: 'Initial discovery call completed. Client is interested in modern, responsive design.',
    created_at: '2024-01-19T16:00:00Z'
  },
  {
    id: '3',
    owner_id: 'user1',
    entity_type: 'task',
    entity_id: '2',
    type: 'status_change',
    message: 'Task marked as completed',
    created_at: '2024-01-18T16:00:00Z'
  },
  {
    id: '4',
    owner_id: 'user1',
    entity_type: 'invoice',
    entity_id: '1',
    type: 'invoice_status',
    message: 'Invoice INV-2024-001 sent to client',
    created_at: '2024-01-15T10:30:00Z'
  },
  {
    id: '5',
    owner_id: 'user1',
    entity_type: 'job',
    entity_id: '2',
    type: 'note',
    message: 'Client approved initial mockups. Moving to development phase.',
    created_at: '2024-01-14T11:00:00Z'
  }
];

export const mockDashboardStats: DashboardStats = {
  total_pipeline_value: 132000,
  won_this_month: 57000,
  unpaid_invoices: 22500,
  open_tasks: 8,
  jobs_by_stage: {
    'LEAD': 1,
    'QUALIFIED': 1,
    'PROPOSAL': 1,
    'WON': 0,
    'IN_PROGRESS': 1,
    'COMPLETED': 1,
    'PAID': 0,
    'LOST': 0
  },
  recent_activities: mockActivities.slice(0, 5)
};

// Helper functions for mock data
export const getClientById = (id: string): Client | undefined => {
  return mockClients.find(client => client.id === id);
};

export const getJobsByClientId = (clientId: string): Job[] => {
  return mockJobs.filter(job => job.client_id === clientId);
};

export const getTasksByJobId = (jobId: string): Task[] => {
  return mockTasks.filter(task => task.job_id === jobId);
};

export const getInvoicesByClientId = (clientId: string): CRMInvoice[] => {
  return mockInvoices.filter(invoice => invoice.client_id === clientId);
};

export const getActivitiesByEntity = (entityType: string, entityId: string): Activity[] => {
  return mockActivities.filter(activity => 
    activity.entity_type === entityType && activity.entity_id === entityId
  );
};