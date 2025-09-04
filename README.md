# Pookley Business Platform

A comprehensive business management platform with integrated CRM, invoicing, and productivity tools.

## Features

### 🏢 **CRM Module**
- **Client Management**: Store and organize client information with contact details
- **Job Pipeline**: Track deals from lead to completion with Kanban board
- **Task Management**: Organize tasks with priorities and due dates
- **Invoice Tracking**: Monitor payment status and overdue invoices
- **Activity Timeline**: Keep track of all interactions and changes
- **File Storage**: Upload and organize job-related files

### 💰 **Invoicing Module**
- **Professional Invoices**: Create and send branded invoices
- **Payment Processing**: Stripe integration for online payments
- **Customer Database**: Centralized customer management
- **PDF Generation**: Download invoices as PDF documents
- **Status Tracking**: Monitor invoice lifecycle from draft to paid

### 📊 **Dashboard Analytics**
- **Pipeline Overview**: Visual representation of sales stages
- **Revenue Tracking**: Monitor monthly income and outstanding payments
- **Task Management**: Quick access to urgent and overdue tasks
- **Activity Feed**: Recent business activities at a glance

## Tech Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **State Management**: TanStack Query (React Query)
- **UI Components**: Custom component library + Lucide React icons
- **Payments**: Stripe (integration ready)
- **File Storage**: Supabase Storage

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account and project

### Environment Setup

1. **Clone and install dependencies**:
```bash
npm install
```

2. **Set up Supabase**:
   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key
   - Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. **Run database migrations**:
   - In your Supabase dashboard, go to SQL Editor
   - Copy and run the SQL from `supabase/migrations/create_crm_schema.sql`
   - This creates all necessary tables, RLS policies, and seed data

4. **Start the development server**:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Database Schema

### Core Tables
- **profiles**: User profiles linked to Supabase auth
- **clients**: Client/customer information and contact details
- **jobs**: Projects/deals with stage tracking (Lead → Paid)
- **tasks**: Task management with priorities and due dates
- **invoices**: Invoice tracking with payment status
- **activities**: Activity timeline and audit log

### File Storage
- **job_files**: Supabase Storage bucket for job-related files
- Organized by user ID with proper access controls

### Security
- Row Level Security (RLS) enabled on all tables
- Owner-based access control (users only see their own data)
- Secure file upload with user-based folder structure

## Usage

### CRM Workflow
1. **Add Clients**: Start by adding your clients with contact information
2. **Create Jobs**: Set up projects/deals and track them through stages
3. **Manage Tasks**: Break down work into actionable tasks with priorities
4. **Generate Invoices**: Create invoices linked to jobs and clients
5. **Track Progress**: Monitor everything from the dashboard

### Key Features
- **Drag & Drop**: Move jobs between pipeline stages
- **Quick Actions**: Fast task completion and status updates
- **Global Search**: Find clients, jobs, and tasks instantly
- **Mobile Responsive**: Full functionality on all devices
- **Dark Mode**: Toggle between light and dark themes

## Future Enhancements

### Stripe Integration
To add payment processing:
1. Get Stripe API keys from your Stripe dashboard
2. Add to environment variables:
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
```
3. Implement Stripe Checkout in invoice components
4. Set up webhooks for automatic status updates

### Additional Features
- Email automation and templates
- Advanced reporting and analytics
- Calendar integration
- Mobile app (PWA)
- Team collaboration features
- API for third-party integrations

## Development

### Project Structure
```
src/
├── components/
│   ├── crm/              # CRM-specific components
│   ├── AppCard.tsx       # App launcher cards
│   ├── CRMApp.tsx        # Main CRM application
│   └── InvoicingApp.tsx  # Invoicing module
├── data/
│   ├── mockCrmData.ts    # Mock data for development
│   └── sampleApps.ts     # App catalog data
├── types/
│   ├── crm.ts           # CRM type definitions
│   └── index.ts         # General types
└── App.tsx              # Main application component
```

### Adding New Features
1. **Database Changes**: Create new migration files in `supabase/migrations/`
2. **Types**: Update type definitions in `src/types/crm.ts`
3. **Components**: Add new components in `src/components/crm/`
4. **Mock Data**: Update `src/data/mockCrmData.ts` for testing

### Testing
- Mock data is provided for all CRM entities
- All CRUD operations log to console for development
- Real Supabase integration points are clearly marked with TODO comments

## Support

For questions or issues:
1. Check the console for development logs
2. Verify Supabase connection and RLS policies
3. Ensure environment variables are properly set
4. Review the database schema and seed data

## License

Private project - All rights reserved.