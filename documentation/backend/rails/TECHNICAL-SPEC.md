# IFM MVP - Technical Specifications

**Version:** 2.1  
**Last Updated:** November 26, 2025  
**Status:** Backend Integration Phase (Rails)

---

## Overview

This document consolidates all technical specifications for the IFM MVP platform, including data schemas, API requirements, component integrations, and user permissions.

---

## Table of Contents

1. [Data Schema](#data-schema)
2. [API Requirements](#api-requirements)
3. [Component Integrations](#component-integrations)
4. [User Roles & Permissions](#user-roles--permissions)
5. [Authentication & Security](#authentication--security)

---

## Data Schema

### Database Overview
- **Database:** PostgreSQL
- **Total Tables:** 28+ core tables
- **Architecture:** Multi-tenant with row-level security
- **Relationships:** Comprehensive foreign keys and indexes

### Core Entity Groups

#### 1. Core Entities (3 tables)
- **Organizations:** Nonprofit entities
- **Users:** System users
- **OrganizationUsers:** User-organization relationships

#### 2. Donor Management (7 tables)
- **Donors:** Donor profiles and contact information
- **Donations:** Transaction records
- **RecurringDonations:** Subscription-based donations
- **DonationAllocations:** Fund-specific allocations
- **DonorAddresses:** Multiple addresses per donor
- **DonorNotes:** Activity and interaction notes
- **DonorTags:** Categorization and segmentation

#### 3. Accounting & Finance (10 tables)
- **Accounts:** Chart of accounts
- **JournalEntries:** Financial transaction headers
- **JournalEntryLines:** Transaction line items (debits/credits)
- **Expenses:** Expense tracking and approval
- **Reimbursements:** Employee reimbursements
- **CheckDeposits:** Check processing with OCR
- **Reconciliations:** Bank reconciliation records
- **ReconciliationMatches:** Transaction matching
- **Funds:** Fund accounting structure
- **Distributions:** Fiscal sponsor distributions

#### 4. Personnel & Volunteers (4 tables)
- **Personnel:** Staff member profiles
- **Volunteers:** Volunteer profiles
- **HourEntries:** Time tracking
- **LeaveRequests:** Time-off management

#### 5. Marketing (3 tables)
- **Campaigns:** Email and marketing campaigns
- **DonorPages:** Custom donation landing pages
- **Prospects:** Lead tracking

#### 6. System (1 table)
- **AuditLogs:** Complete activity tracking

### Detailed Schema

For complete field definitions, data types, indexes, and relationships, see:
**`01-DATA-SCHEMA.md`** - Complete data model specifications

---

## API Requirements

### API Overview
- **Style:** RESTful JSON API
- **Base URL:** `/api/v1/`
- **Authentication:** JWT Bearer tokens
- **Total Endpoints:** ~180+ endpoints

### Endpoint Categories

#### Dashboard (5 endpoints)
- GET `/dashboard/metrics` - Key performance indicators
- GET `/dashboard/donations/recent` - Recent donation list
- GET `/dashboard/donors/top` - Top donors ranking
- GET `/dashboard/donations/trends` - Donation trend data
- GET `/dashboard/todos` - Task list

#### Donors (12 endpoints)
- GET `/donors` - List donors with filtering
- GET `/donors/:id` - Get donor details
- POST `/donors` - Create new donor
- PATCH `/donors/:id` - Update donor
- DELETE `/donors/:id` - Soft delete donor
- GET `/donors/:id/donations` - Donor's donation history
- GET `/donors/:id/notes` - Donor notes
- POST `/donors/:id/notes` - Add note
- GET `/donors/:id/tags` - Donor tags
- POST `/donors/:id/tags` - Add tag
- GET `/donors/search` - Search donors
- GET `/donors/export` - Export donor data

#### Donations (10 endpoints)
- GET `/donations` - List donations
- GET `/donations/:id` - Get donation details
- POST `/donations` - Create donation
- PATCH `/donations/:id` - Update donation
- DELETE `/donations/:id` - Cancel/refund donation
- GET `/donations/:id/receipt` - Generate receipt
- POST `/donations/:id/send_receipt` - Email receipt
- GET `/donations/recurring` - List recurring donations
- PATCH `/donations/recurring/:id` - Update recurring
- DELETE `/donations/recurring/:id` - Cancel recurring

#### Accounting (40+ endpoints)

**General Ledger (Central Hub):**
- GET `/general_ledger/entries` - List transactions with filtering
- GET `/general_ledger/accounts/:id/summary` - Account summary with balances
- POST `/general_ledger/entries` - Create transaction (calculates running balance)
- PATCH `/general_ledger/entries/:id` - Update transaction (recalculates balances)
- DELETE `/general_ledger/entries/:id` - Soft delete transaction
- GET `/general_ledger/contacts` - Contact autocomplete
- GET `/general_ledger/grouped` - Transactions grouped by account

**Chart of Accounts:**
- GET `/chart_of_accounts` - List accounts
- POST `/chart_of_accounts` - Create account
- PATCH `/chart_of_accounts/:id` - Update account
- DELETE `/chart_of_accounts/:id` - Deactivate account

**Other Accounting Modules:**
- **Journal Entries:** Entry creation and posting
- **Expenses:** Expense tracking and approval
- **Reimbursements:** Reimbursement processing
- **Check Deposits:** Check processing with OCR
- **Reconciliation:** Bank reconciliation

#### Personnel & Volunteers (20+ endpoints)
- **Personnel CRM:** Staff management
- **Volunteers CRM:** Volunteer management
- **Hour Tracking:** Time entry and approval

#### Marketing (15+ endpoints)
- **Campaigns:** Campaign management
- **Donor Pages:** Landing page builder
- **Prospects:** Lead tracking

#### Reports (20+ endpoints)
- **Balance Sheet:** Financial position
- **Income Statement:** Revenue and expenses
- **Profit & Loss:** Detailed P&L
- **Fund Accounting:** Fund-specific reports
- **Volunteer Hours:** Hour tracking reports

#### Administration (15+ endpoints)
- **User Management:** User CRUD
- **Nonprofit Management:** Entity configuration
- **Settings:** System configuration
- **Distribution Manager:** Fiscal sponsor distributions

### API Specifications

For complete endpoint details including:
- Request/response schemas
- Query parameters
- Pagination
- Filtering and sorting
- Error responses

See: **`02-API-REQUIREMENTS.md`** - Complete API specifications

---

## Component Integrations

### Integration Overview

The IFM MVP features deep integration between modules, with the General Ledger serving as the central hub for all financial transactions.

### 🔴 CRITICAL ARCHITECTURE PRINCIPLE

**ALL financial transactions flow through Journal Entries before appearing in the General Ledger:**

```
Transaction Source (Donation, Expense, Reimbursement, etc.)
    ↓
Creates Journal Entry (with debit/credit lines)
    ↓
Journal Entry Posted (status = 'posted')
    ↓
Creates Ledger Entries (one per journal entry line)
    ↓
Appears in General Ledger
    ↓
Flows to Financial Reports
```

**Why This Matters:**
- ✅ **Enforces double-entry accounting** (debits always = credits)
- ✅ **Atomic transactions** (all lines post together or none post)
- ✅ **Complete audit trail** (can trace from report → ledger → journal entry → source)
- ✅ **Proper grouping** (related entries linked via journal_entry_id)
- ✅ **Voiding capability** (void journal entry creates reversing entry)

**Database Relationships:**
```sql
donations.journal_entry_id → journal_entries.id
expenses.journal_entry_id → journal_entries.id
reimbursements.journal_entry_id → journal_entries.id
deposits.journal_entry_id → journal_entries.id

journal_entries.id ← journal_entry_lines.journal_entry_id
journal_entry_lines → ledger_entries (created when posted)

ledger_entries.journal_entry_id → journal_entries.id
```

### Key Integration Flows

#### 1. Donation → Journal Entry → Ledger → Reconciliation → Reports
```
Donations Manager
    ↓ (Create donation)
Payment Processing (Stripe/Check)
    ↓ (Payment completed)
CREATE Journal Entry
  Line 1: Debit $500 - Checking Account (1000)
  Line 2: Credit $500 - Donation Revenue (4000)
    ↓ (Auto-post)
POST Journal Entry
    ↓ (Creates 2 ledger entries)
General Ledger (2 entries created)
    ↓
Reconciliation Manager
    ↓ (Match with bank statement)
Ledger Entries Updated (reconciled = true)
    ↓
Reports (Balance Sheet, Income Statement)
```

#### 2. Expense → Approval → Journal Entry → Ledger → Reports
```
Expenses Manager
    ↓ (Create expense - status: pending)
Approval Workflow
    ↓ (Manager approves - status: approved)
Payment Processing
    ↓ (Payment made - status: paid)
CREATE Journal Entry
  Line 1: Debit $150 - Office Supplies (5300)
  Line 2: Credit $150 - Checking Account (1000)
    ↓ (Auto-post)
POST Journal Entry
    ↓ (Creates 2 ledger entries)
General Ledger (2 entries created)
    ↓
Reconciliation Manager
    ↓ (Match with bank statement)
Ledger Entries Updated (reconciled = true)
    ↓
Reports (Balance Sheet, Income Statement)
```

#### 3. Hour Entry → Approval → Personnel Record
```
Hour Tracking
    ↓ (Submit hours)
Approval Workflow
    ↓ (Manager approves)
Personnel/Volunteer Record Updated
    ↓ (Total hours incremented)
Volunteer Hours Report
    ↓
Dashboard Metrics
```

### Cross-Module Navigation

#### Dashboard Integrations
- Recent Donations → Donations Manager (with donation pre-selected)
- Top Donors → Donor CRM (with donor profile open)
- Metrics Cards → Filtered views in respective modules

#### Donor Hub Integrations
- Donors CRM ↔ Donations Manager (bidirectional)
- Donations Manager → General Ledger
- Donations Manager → Check Deposit Manager
- Donor Page Builder → Donations Manager

#### Accounting Integrations
- **General Ledger** = Central hub for all financial transactions
  - **Refactored:** Now implements proper double-entry accounting
  - **Chart of Accounts:** All transactions linked to accounts
  - **Running Balance:** Calculated by backend for each account
  - **Contact Tracking:** Payee/donor names tracked per transaction
  - **Transaction Types:** Deposit, Check, Journal Entry, Transfer, Payment, Receipt
- All accounting modules create ledger entries
- Reconciliation Manager updates ledger status
- Reports pull from General Ledger

**See:** `pages/accounting/03-GENERAL-LEDGER.md` for complete specifications

#### Reports Integrations
- Balance Sheet → General Ledger (drill-down)
- Income Statement → Donations Manager (revenue drill-down)
- Income Statement → Expenses Manager (expense drill-down)
- All reports support drill-down to source transactions

### Integration Details

For complete integration specifications including:
- Navigation flows
- Data sharing patterns
- API integration points
- State synchronization
- Testing requirements

See: **`03-COMPONENT-INTEGRATIONS.md`** - Complete integration workflows

---

## User Roles & Permissions

### Role Hierarchy

```
Fiscal Sponsor (Super Admin)
    ↓
Nonprofit User (Entity Admin)
    ↓
Donor (Limited Access)
    ↓
Volunteer (Minimal Access)
```

### Role Definitions

#### 1. Fiscal Sponsor
- **Access:** ALL 34 nonprofits
- **Permissions:** Full system access
- **Features:** All modules, consolidated reporting, user management
- **Organization Selector:** Can switch between "All Organizations" and individual nonprofits

#### 2. Nonprofit User
- **Access:** SINGLE nonprofit only
- **Permissions:** Full access to their organization
- **Features:** All modules for their nonprofit
- **Organization Selector:** Locked to their nonprofit

#### 3. Donor
- **Access:** Self-only
- **Permissions:** Donor Portal only
- **Features:** View donations, download receipts, manage profile
- **Organization Selector:** N/A

#### 4. Volunteer
- **Access:** Self-only
- **Permissions:** Hour Tracking only
- **Features:** Submit hours, view hour history
- **Organization Selector:** N/A

### Permission Matrix

| Feature | Fiscal Sponsor | Nonprofit User | Donor | Volunteer |
|---------|---------------|----------------|-------|-----------|
| Dashboard | ✅ All orgs | ✅ Own org | ❌ | ❌ |
| Donors CRM | ✅ All orgs | ✅ Own org | ❌ | ❌ |
| Donations Manager | ✅ All orgs | ✅ Own org | ❌ | ❌ |
| Donor Portal | ✅ Admin view | ✅ Admin view | ✅ Self only | ❌ |
| Personnel CRM | ✅ All orgs | ✅ Own org | ❌ | ❌ |
| Volunteers CRM | ✅ All orgs | ✅ Own org | ❌ | ❌ |
| Hour Tracking | ✅ All orgs | ✅ Own org | ❌ | ✅ Self only |
| Accounting | ✅ All orgs | ✅ Own org | ❌ | ❌ |
| Reports | ✅ All orgs | ✅ Own org | ❌ | ❌ |
| User Management | ✅ All orgs | ✅ Own org | ❌ | ❌ |
| Nonprofit Management | ✅ | ❌ | ❌ | ❌ |
| Distribution Manager | ✅ | ❌ | ❌ | ❌ |

### Data Isolation Rules

#### Backend Enforcement (Critical)
All API endpoints MUST enforce data isolation based on user role and organization.

#### Database-Level Security
Use PostgreSQL Row-Level Security (RLS) policies as the last line of defense.

#### Frontend Filtering
Frontend should filter UI elements based on role, but never trust frontend-only security.

### Permission Details

For complete role specifications including:
- Detailed capabilities by role
- Data access rules
- Implementation guidelines
- Security considerations
- Testing requirements

See: **`04-USER-ROLES-AND-PERMISSIONS.md`** - Complete permission specifications

---

## Authentication & Security

### Authentication Flow

```
1. User logs in with email/password
2. Backend validates credentials
3. Backend returns JWT token with:
   - user_id
   - role
   - organization_id (if applicable)
   - permissions
4. Frontend stores token
5. Frontend renders UI based on role
6. All API calls include token
7. Backend validates token and enforces permissions
```

### JWT Token Structure

```json
{
  "user_id": "uuid",
  "email": "user@example.com",
  "role": "nonprofit_user",
  "organization_id": "uuid",
  "permissions": ["read:donors", "write:donations"],
  "exp": 1234567890
}
```

### Security Requirements

#### Authentication
- JWT tokens with expiration
- Secure password hashing (bcrypt)
- Token refresh mechanism
- Session timeout
- Password reset via email

#### Authorization
- Role-based access control (RBAC)
- Granular permissions
- Multi-tenant data isolation
- Row-level security in database

#### Data Protection
- HTTPS only
- Encrypted sensitive data
- Secure file uploads
- CORS configuration
- Rate limiting

#### Audit & Compliance
- Complete audit logging
- Activity tracking
- Data retention policies
- GDPR/CCPA compliance
- SOC 2 preparation

---

## API Client Architecture

### Proposed Frontend Structure

```typescript
// src/api/client.ts - Base API client
// src/api/auth.ts - Authentication endpoints
// src/api/donors.ts - Donor-related endpoints
// src/api/donations.ts - Donation endpoints
// src/api/accounting.ts - Accounting endpoints
// src/api/personnel.ts - Personnel endpoints
// src/api/reports.ts - Reporting endpoints
// ... etc
```

### Client Features
- Automatic JWT token injection
- Request/response interceptors
- Error handling
- Loading state management
- Retry logic
- Request cancellation
- Cache management

---

## Environment Configuration

### Required Environment Variables

```bash
# API Configuration
VITE_API_BASE_URL=https://api.example.com
VITE_API_VERSION=v1

# Authentication
VITE_AUTH_TOKEN_KEY=ifm_auth_token
VITE_REFRESH_TOKEN_KEY=ifm_refresh_token

# Feature Flags
VITE_ENABLE_DONOR_PORTAL=true
VITE_ENABLE_VIDEOBOMB=true

# External Services
VITE_STRIPE_PUBLIC_KEY=pk_test_...
VITE_GOOGLE_MAPS_API_KEY=...
```

### CORS Configuration

Rails backend must configure CORS to allow requests from frontend domain:

```ruby
# config/initializers/cors.rb
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins ENV['FRONTEND_URL']
    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: true
  end
end
```

---

## Testing Strategy

### Frontend Testing
- **Unit Tests:** Component logic
- **Integration Tests:** Component interactions
- **E2E Tests:** Complete user workflows
- **Visual Regression:** UI consistency

### Backend Testing
- **Unit Tests:** Model and business logic
- **Integration Tests:** API endpoints
- **Security Tests:** Permission enforcement
- **Performance Tests:** Load and stress testing

### Critical Test Scenarios
1. Donation → Ledger → Reconciliation → Reports (full flow)
2. Expense → Approval → Ledger → Reports (full flow)
3. Hour Entry → Approval → Volunteer Record (full flow)
4. Data isolation between nonprofits
5. Role-based access control
6. Multi-tenant data security

---

## Performance Considerations

### Frontend Optimization
- Code splitting
- Lazy loading
- Image optimization
- Caching strategies
- Bundle size optimization

### Backend Optimization
- Database indexing
- Query optimization
- Caching (Redis)
- Background jobs
- API pagination

### Monitoring
- Application performance monitoring (APM)
- Error tracking
- User analytics
- Server monitoring
- Database performance

---

## Deployment Architecture

### Frontend Deployment
- **Hosting:** Netlify, Vercel, or AWS S3 + CloudFront
- **Build:** Vite production build
- **CDN:** Global content delivery
- **SSL:** Automatic HTTPS

### Backend Deployment
- **Hosting:** Heroku, AWS, or DigitalOcean
- **Database:** PostgreSQL (managed service)
- **File Storage:** AWS S3 or similar
- **Background Jobs:** Sidekiq with Redis
- **Email:** SendGrid or Mailgun

---

## Related Documentation

- **`../database/DATABASE-SCHEMA.sql`** - SQL schema file
- **`../database/GL-INTEGRATION.md`** - General Ledger integration
- **`../frontend/STYLING-GUIDE.md`** - UI/UX styling guide
- **`../pages/`** - Page-specific documentation

---

*This technical specification serves as the primary reference for implementing the IFM MVP backend and integrating it with the frontend.*
