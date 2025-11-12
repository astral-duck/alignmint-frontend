# IFM MVP - Nonprofit Management Platform

A comprehensive fiscal sponsor management system for InFocus Ministries.

## Overview

This application provides a complete management solution for fiscal sponsors and their nonprofit organizations, including:

- **Donor & Donation Management** - CRM, donation tracking, recurring payments, custom donation pages
- **Financial Accounting** - Chart of accounts, general ledger, journal entries, reconciliation
- **Expense Management** - Expense tracking, reimbursements, approval workflows
- **Personnel & Volunteers** - Staff management, volunteer tracking, hour logging
- **Marketing** - Email campaigns, prospect management, video donation pages
- **Reports** - Balance sheet, P&L, income statements, fund accounting
- **Multi-tenant Architecture** - Support for multiple nonprofits with role-based access control

## Documentation

Complete documentation is available in the `/documentation` folder:

- **[Product Requirements](documentation/PRODUCT-REQUIREMENTS.md)** - Product vision and requirements
- **[Data Schema](documentation/01-DATA-SCHEMA.md)** - Complete database schema (28 tables)
- **[Database SQL](documentation/DATABASE-SCHEMA.sql)** - PostgreSQL CREATE statements
- **[API Requirements](documentation/02-API-REQUIREMENTS.md)** - ~180+ API endpoints
- **[User Roles & Permissions](documentation/04-USER-ROLES-AND-PERMISSIONS.md)** - 4-role RBAC system
- **[Migration Plan](documentation/MIGRATION-PLAN.md)** - 34-week phased implementation
- **[Page Documentation](documentation/pages/)** - 50 detailed component docs

### Recent Updates

- **[Financial Reports Standardization](documentation/IMPLEMENTATION-COMPLETE.md)** - ✅ COMPLETE (Nov 2025)
  - Balance Sheet with 38 fund balances
  - Income Statement by Fund (multi-column)
  - Complete Chart of Accounts (79 accounts)
  - Multi-fund accounting support

## Tech Stack

### Frontend
- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **UI Library:** TailwindCSS + shadcn/ui
- **State Management:** React Context API
- **Charts:** Recharts
- **Icons:** Lucide React

### Backend (To Be Implemented)
- **Framework:** Ruby on Rails 7+
- **Database:** PostgreSQL 14+
- **Authentication:** JWT or Devise
- **API:** RESTful JSON API

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

```bash
# Build for production
npm run build
```

## Project Structure

```
ifmmvpfrontend/
├── documentation/          # Complete project documentation
│   ├── pages/             # 50 component documentation files
│   ├── DATABASE-SCHEMA.sql # PostgreSQL schema
│   └── *.md               # Architecture and requirements docs
├── src/
│   ├── components/        # React components
│   ├── contexts/          # Global state management
│   ├── lib/               # Utilities and mock data
│   └── styles/            # CSS and styling
└── package.json
```

## Project Status

- **Frontend UI:** Complete (all 50 pages implemented)
- **Documentation:** 100% Complete (50 pages + architecture docs)
- **Database Schema:** Complete (28 tables, SQL ready)
- **API Specification:** Complete (~180+ endpoints documented)
- **Backend API:** To be implemented
- **Database:** To be created
- **Authentication:** To be implemented
- **Production Deployment:** Pending

## Key Features

### Donor Management
- Complete donor CRM with contact management
- Donation tracking and processing
- Recurring donation subscriptions
- Custom donation landing pages
- Donor portal for self-service

### Financial Management
- Double-entry bookkeeping
- Chart of accounts management
- General ledger with full audit trail
- Bank reconciliation
- Expense and reimbursement workflows
- Financial reports (Balance Sheet, P&L, Income Statement)

### Personnel & Volunteers
- Staff and employee management
- Volunteer coordination
- Hour tracking and approval
- Leave request management

### Marketing
- Email campaign management
- Prospect tracking and conversion
- Video donation pages (VideoBomb)
- Campaign analytics

### Multi-Tenant & Security
- Support for multiple nonprofit organizations
- 4-tier role-based access control (Fiscal Sponsor, Nonprofit User, Donor, Volunteer)
- Organization-level data isolation
- Audit logging

## Development Notes

### Mock Data
The application currently uses mock data from `src/lib/mockData.ts` and `src/lib/financialData.ts`. These will be replaced with API calls during backend integration.

### Backend Integration
See `documentation/MIGRATION-PLAN.md` for the complete 34-week phased migration plan from mock data to full backend integration.

## Contributing

This is a proprietary project for InFocus Ministries. For questions or access, contact the project administrator.

## License

Proprietary - InFocus Ministries 2025