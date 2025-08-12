/*
  # Create Billing Schema for Invoicing & Payments

  1. New Tables
    - `billing.customers`
      - `id` (uuid, primary key)
      - `org_id` (text, organization identifier)
      - `name` (text, customer name)
      - `email` (text, customer email)
      - `phone` (text, optional phone)
      - `address` (text, optional address)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `billing.invoices`
      - `id` (uuid, primary key)
      - `org_id` (text, organization identifier)
      - `customer_id` (uuid, foreign key to customers)
      - `invoice_number` (text, unique invoice number)
      - `status` (text, invoice status)
      - `subtotal_cents` (integer, subtotal in cents)
      - `tax_percent` (numeric, tax percentage)
      - `tax_cents` (integer, tax amount in cents)
      - `total_cents` (integer, total amount in cents)
      - `due_date` (date, payment due date)
      - `notes` (text, optional notes)
      - `pdf_url` (text, optional PDF URL)
      - `stripe_checkout_session_id` (text, optional Stripe session)
      - `stripe_checkout_url` (text, optional Stripe URL)
      - `sent_at` (timestamp, when invoice was sent)
      - `viewed_at` (timestamp, when invoice was viewed)
      - `paid_at` (timestamp, when invoice was paid)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `billing.invoice_items`
      - `id` (uuid, primary key)
      - `invoice_id` (uuid, foreign key to invoices)
      - `description` (text, item description)
      - `quantity` (integer, item quantity)
      - `unit_price_cents` (integer, unit price in cents)
      - `total_cents` (integer, line total in cents)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their org data
    - Add indexes for performance
*/

-- Create billing schema
CREATE SCHEMA IF NOT EXISTS billing;

-- Create customers table
CREATE TABLE IF NOT EXISTS billing.customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id text NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  address text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create invoices table
CREATE TABLE IF NOT EXISTS billing.invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id text NOT NULL,
  customer_id uuid NOT NULL REFERENCES billing.customers(id) ON DELETE CASCADE,
  invoice_number text NOT NULL,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'paid', 'overdue', 'void')),
  subtotal_cents integer NOT NULL DEFAULT 0,
  tax_percent numeric(5,2) NOT NULL DEFAULT 0,
  tax_cents integer NOT NULL DEFAULT 0,
  total_cents integer NOT NULL DEFAULT 0,
  due_date date NOT NULL,
  notes text,
  pdf_url text,
  stripe_checkout_session_id text,
  stripe_checkout_url text,
  sent_at timestamptz,
  viewed_at timestamptz,
  paid_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create invoice items table
CREATE TABLE IF NOT EXISTS billing.invoice_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid NOT NULL REFERENCES billing.invoices(id) ON DELETE CASCADE,
  description text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  unit_price_cents integer NOT NULL DEFAULT 0,
  total_cents integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE billing.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing.invoice_items ENABLE ROW LEVEL SECURITY;

-- Create policies for customers
CREATE POLICY "Users can read own org customers"
  ON billing.customers
  FOR SELECT
  TO authenticated
  USING (org_id = current_setting('app.current_org_id', true));

CREATE POLICY "Users can insert own org customers"
  ON billing.customers
  FOR INSERT
  TO authenticated
  WITH CHECK (org_id = current_setting('app.current_org_id', true));

CREATE POLICY "Users can update own org customers"
  ON billing.customers
  FOR UPDATE
  TO authenticated
  USING (org_id = current_setting('app.current_org_id', true));

CREATE POLICY "Users can delete own org customers"
  ON billing.customers
  FOR DELETE
  TO authenticated
  USING (org_id = current_setting('app.current_org_id', true));

-- Create policies for invoices
CREATE POLICY "Users can read own org invoices"
  ON billing.invoices
  FOR SELECT
  TO authenticated
  USING (org_id = current_setting('app.current_org_id', true));

CREATE POLICY "Users can insert own org invoices"
  ON billing.invoices
  FOR INSERT
  TO authenticated
  WITH CHECK (org_id = current_setting('app.current_org_id', true));

CREATE POLICY "Users can update own org invoices"
  ON billing.invoices
  FOR UPDATE
  TO authenticated
  USING (org_id = current_setting('app.current_org_id', true));

CREATE POLICY "Users can delete own org invoices"
  ON billing.invoices
  FOR DELETE
  TO authenticated
  USING (org_id = current_setting('app.current_org_id', true));

-- Create policies for invoice items
CREATE POLICY "Users can read own org invoice items"
  ON billing.invoice_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM billing.invoices 
      WHERE id = invoice_items.invoice_id 
      AND org_id = current_setting('app.current_org_id', true)
    )
  );

CREATE POLICY "Users can insert own org invoice items"
  ON billing.invoice_items
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM billing.invoices 
      WHERE id = invoice_items.invoice_id 
      AND org_id = current_setting('app.current_org_id', true)
    )
  );

CREATE POLICY "Users can update own org invoice items"
  ON billing.invoice_items
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM billing.invoices 
      WHERE id = invoice_items.invoice_id 
      AND org_id = current_setting('app.current_org_id', true)
    )
  );

CREATE POLICY "Users can delete own org invoice items"
  ON billing.invoice_items
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM billing.invoices 
      WHERE id = invoice_items.invoice_id 
      AND org_id = current_setting('app.current_org_id', true)
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_customers_org_id ON billing.customers(org_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON billing.customers(email);
CREATE INDEX IF NOT EXISTS idx_invoices_org_id ON billing.invoices(org_id);
CREATE INDEX IF NOT EXISTS idx_invoices_customer_id ON billing.invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON billing.invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON billing.invoices(due_date);
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON billing.invoice_items(invoice_id);

-- Create unique constraint for invoice numbers per org
CREATE UNIQUE INDEX IF NOT EXISTS idx_invoices_org_number ON billing.invoices(org_id, invoice_number);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION billing.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_customers_updated_at'
  ) THEN
    CREATE TRIGGER update_customers_updated_at
      BEFORE UPDATE ON billing.customers
      FOR EACH ROW
      EXECUTE FUNCTION billing.update_updated_at_column();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_invoices_updated_at'
  ) THEN
    CREATE TRIGGER update_invoices_updated_at
      BEFORE UPDATE ON billing.invoices
      FOR EACH ROW
      EXECUTE FUNCTION billing.update_updated_at_column();
  END IF;
END $$;