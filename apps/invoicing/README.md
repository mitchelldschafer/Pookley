# Pookley Invoicing & Payments

A comprehensive invoicing and payment management system built with React, TypeScript, Supabase, and Stripe.

## Features

- **Customer Management**: Create, edit, and manage customer information
- **Invoice Creation**: Build invoices with line items, tax calculations, and notes
- **Payment Processing**: Generate Stripe Checkout payment links
- **PDF Export**: Generate and download professional invoice PDFs
- **Status Tracking**: Track invoice lifecycle from draft to paid
- **Dashboard**: Overview of key metrics and recent activity

## Environment Variables

Create a `.env` file in the `apps/invoicing` directory with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

## Database Setup

The application uses Supabase with a `billing` schema. Run the migration file to set up the required tables:

```sql
-- Run the SQL from supabase/migrations/create_billing_schema.sql
```

This creates:
- `billing.customers` - Customer information
- `billing.invoices` - Invoice headers with totals and metadata
- `billing.invoice_items` - Individual line items for invoices

## How to Run

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables (see above)

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3001`

## API Stubs

The application includes API stubs for external integrations:

### Send Invoice
- **Endpoint**: `POST /api/send-invoice`
- **Payload**: `{ invoiceId: string }`
- **Response**: `{ ok: boolean }`

Currently implemented as a stub in `src/api/send-invoice.ts`. Will be replaced with n8n integration.

### Stripe Checkout
- **Endpoint**: `POST /api/stripe/create-checkout`
- **Payload**: `{ invoiceId: string }`
- **Response**: `{ sessionId: string, url: string }`

Currently implemented as a stub in `src/api/stripe-checkout.ts`. Will be replaced with n8n integration.

## Simulating Webhooks

To test webhook functionality locally, you can use curl to simulate Stripe webhook events:

```bash
# Simulate successful payment
curl -X POST http://localhost:3001/api/webhooks/stripe \
  -H "Content-Type: application/json" \
  -d '{
    "type": "checkout.session.completed",
    "data": {
      "object": {
        "id": "cs_test_session_id",
        "payment_status": "paid",
        "metadata": {
          "invoice_id": "your_invoice_id"
        }
      }
    }
  }'
```

## Invoice Status Flow

1. **Draft** - Initial state when invoice is created
2. **Sent** - Invoice has been emailed to customer
3. **Viewed** - Customer has opened the invoice (tracked via email/link)
4. **Paid** - Payment has been received and confirmed
5. **Overdue** - Invoice is past due date and unpaid
6. **Void** - Invoice has been cancelled

## Testing Checklist

- [ ] Create customer → create invoice with 2 items → totals calculate correctly
- [ ] Save draft → send → payment link created → status updates after webhook simulation
- [ ] PDF downloads and is readable
- [ ] Overdue status appears when due_date < today and status not paid/void
- [ ] Filters and search work on invoices list
- [ ] Customer CRUD operations work correctly
- [ ] Invoice editor saves changes properly
- [ ] Dashboard shows correct metrics

## Architecture

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Payments**: Stripe Checkout
- **PDF Generation**: jsPDF + html2canvas
- **State Management**: React Query
- **UI Components**: Custom component library (@pookley/ui)

## Future Enhancements

- Email templates and automation
- Recurring invoices
- Multi-currency support
- Advanced reporting and analytics
- Mobile app
- API for third-party integrations