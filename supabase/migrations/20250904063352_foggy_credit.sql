/*
  # CRM Schema for Solo Operator

  1. New Tables
    - `profiles` - User profiles linked to auth
    - `clients` - Client/customer information
    - `jobs` - Projects/deals with stage tracking
    - `tasks` - Task management system
    - `invoices` - Invoice tracking (payment processing to be added later)
    - `activities` - Activity timeline and notes

  2. Storage
    - `job_files` bucket for file uploads

  3. Security
    - Enable RLS on all tables
    - Owner-based access control policies
    - Secure file upload policies
*/

-- Create enum types
CREATE TYPE job_stage AS ENUM ('LEAD', 'QUALIFIED', 'PROPOSAL', 'WON', 'IN_PROGRESS', 'COMPLETED', 'PAID', 'LOST');
CREATE TYPE task_status AS ENUM ('OPEN', 'IN_PROGRESS', 'BLOCKED', 'DONE');
CREATE TYPE task_priority AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');
CREATE TYPE invoice_status AS ENUM ('DRAFT', 'SENT', 'PARTIALLY_PAID', 'PAID', 'VOID');
CREATE TYPE activity_type AS ENUM ('note', 'status_change', 'file_upload', 'invoice_status');

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  company_name text,
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Clients table
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  contact_name text,
  phone text,
  email text,
  address text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  stage job_stage DEFAULT 'LEAD',
  estimated_amount numeric DEFAULT 0,
  start_date date,
  due_date date,
  location text,
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  job_id uuid REFERENCES jobs(id) ON DELETE CASCADE,
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  status task_status DEFAULT 'OPEN',
  priority task_priority DEFAULT 'MEDIUM',
  due_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  job_id uuid REFERENCES jobs(id) ON DELETE SET NULL,
  number text UNIQUE NOT NULL,
  amount numeric NOT NULL,
  currency text DEFAULT 'USD',
  status invoice_status DEFAULT 'DRAFT',
  issued_at date,
  due_at date,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Activities table
CREATE TABLE IF NOT EXISTS activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  type activity_type NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for clients
CREATE POLICY "Users can view own clients" ON clients FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Users can insert own clients" ON clients FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users can update own clients" ON clients FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Users can delete own clients" ON clients FOR DELETE USING (auth.uid() = owner_id);

-- RLS Policies for jobs
CREATE POLICY "Users can view own jobs" ON jobs FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Users can insert own jobs" ON jobs FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users can update own jobs" ON jobs FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Users can delete own jobs" ON jobs FOR DELETE USING (auth.uid() = owner_id);

-- RLS Policies for tasks
CREATE POLICY "Users can view own tasks" ON tasks FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Users can insert own tasks" ON tasks FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users can update own tasks" ON tasks FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Users can delete own tasks" ON tasks FOR DELETE USING (auth.uid() = owner_id);

-- RLS Policies for invoices
CREATE POLICY "Users can view own invoices" ON invoices FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Users can insert own invoices" ON invoices FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users can update own invoices" ON invoices FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Users can delete own invoices" ON invoices FOR DELETE USING (auth.uid() = owner_id);

-- RLS Policies for activities
CREATE POLICY "Users can view own activities" ON activities FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Users can insert own activities" ON activities FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users can update own activities" ON activities FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Users can delete own activities" ON activities FOR DELETE USING (auth.uid() = owner_id);

-- Create storage bucket for job files
INSERT INTO storage.buckets (id, name, public) VALUES ('job_files', 'job_files', false);

-- Storage policies for job_files bucket
CREATE POLICY "Users can upload job files" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'job_files' AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view own job files" ON storage.objects FOR SELECT USING (
  bucket_id = 'job_files' AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update own job files" ON storage.objects FOR UPDATE USING (
  bucket_id = 'job_files' AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete own job files" ON storage.objects FOR DELETE USING (
  bucket_id = 'job_files' AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Seed data for testing
INSERT INTO profiles (id, email, full_name, company_name, phone) VALUES 
('00000000-0000-0000-0000-000000000001', 'demo@example.com', 'Demo User', 'Demo Consulting', '+1-555-0123');

INSERT INTO clients (id, owner_id, name, contact_name, phone, email, address, notes) VALUES 
('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Acme Corporation', 'John Smith', '+1-555-0100', 'john@acme.com', '123 Business St, City, ST 12345', 'Large enterprise client'),
('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Tech Startup Inc', 'Sarah Johnson', '+1-555-0200', 'sarah@techstartup.com', '456 Innovation Ave, Tech City, CA 90210', 'Fast-growing startup');

INSERT INTO jobs (id, owner_id, client_id, title, description, stage, estimated_amount, start_date, due_date, location) VALUES 
('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Website Redesign', 'Complete overhaul of company website with modern design', 'PROPOSAL', 15000, '2024-02-01', '2024-04-01', 'Remote'),
('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 'Mobile App Development', 'Native iOS and Android app development', 'IN_PROGRESS', 45000, '2024-01-15', '2024-06-15', 'Hybrid');

INSERT INTO tasks (id, owner_id, job_id, client_id, title, description, status, priority, due_at) VALUES 
('30000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Create wireframes', 'Design initial wireframes for homepage and key pages', 'IN_PROGRESS', 'HIGH', '2024-02-05 17:00:00+00'),
('30000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', 'Setup development environment', 'Configure React Native development environment', 'DONE', 'MEDIUM', '2024-01-20 17:00:00+00'),
('30000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', NULL, '10000000-0000-0000-0000-000000000001', 'Follow up on proposal', 'Call client to discuss proposal feedback', 'OPEN', 'URGENT', '2024-02-02 10:00:00+00');

INSERT INTO invoices (id, owner_id, client_id, job_id, number, amount, status, issued_at, due_at, notes) VALUES 
('40000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', 'INV-2024-001', 15000, 'SENT', '2024-01-15', '2024-02-15', 'First milestone payment for mobile app development');

INSERT INTO activities (id, owner_id, entity_type, entity_id, type, message) VALUES 
('50000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'job', '20000000-0000-0000-0000-000000000001', 'status_change', 'Job stage changed from QUALIFIED to PROPOSAL'),
('50000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'client', '10000000-0000-0000-0000-000000000001', 'note', 'Initial discovery call completed. Client is interested in modern, responsive design.'),
('50000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'task', '30000000-0000-0000-0000-000000000002', 'status_change', 'Task marked as completed');