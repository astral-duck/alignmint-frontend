# Product Requirements Document (PRD)
## IFM MVP - Unified Fiscal Sponsor Management Platform

**Version:** 2.0  
**Last Updated:** November 10, 2025  
**Document Owner:** Product & Engineering Team  
**Status:** Backend Integration Phase

---

## Executive Summary

The IFM MVP is a comprehensive nonprofit management platform designed for fiscal sponsor organizations managing multiple nonprofit entities. Built for InFocus Ministries and their 34 subsidiary nonprofits, this platform provides centralized management with strict data isolation and role-based access controls.

### Current Status
- **Frontend:** 100% complete with React 18 + TypeScript
- **Backend:** In planning phase - transitioning from mock data to Ruby on Rails API
- **Documentation:** 36% complete (18 of ~50 pages documented)
- **Mobile Responsive:** 85% complete

### Key Value Propositions
- **Centralized Management:** Single platform for all fiscal sponsor operations
- **Data Isolation:** Complete separation between nonprofit entities
- **Role-Based Access:** Granular permissions ensuring data privacy
- **Mobile-First Design:** Fully responsive interface
- **Comprehensive Features:** Complete nonprofit management suite
- **Scalable Architecture:** Designed for growth

---

## Table of Contents

1. [Product Vision](#product-vision)
2. [User Personas & Roles](#user-personas--roles)
3. [Core Modules](#core-modules)
4. [Technical Architecture](#technical-architecture)
5. [Security & Compliance](#security--compliance)
6. [Integration Points](#integration-points)
7. [Success Metrics](#success-metrics)
8. [Implementation Roadmap](#implementation-roadmap)

---

## Product Vision

### Mission Statement
Empower fiscal sponsor organizations to efficiently manage multiple nonprofit entities through a unified, secure, and intuitive platform that streamlines operations, ensures compliance, and enables growth.

### Primary Objectives
1. **Streamline Operations:** Centralize all nonprofit management activities
2. **Ensure Compliance:** Maintain proper financial segregation and reporting
3. **Improve Efficiency:** Reduce administrative overhead through automation
4. **Enhance Transparency:** Provide clear visibility while respecting privacy
5. **Support Growth:** Enable easy onboarding of new nonprofits

### Target Users
- **Primary:** InFocus Ministries (fiscal sponsor) managing 34 nonprofits
- **Secondary:** Individual nonprofit directors and staff
- **Tertiary:** Donors, volunteers, and external stakeholders

---

## User Personas & Roles

### 1. Fiscal Sponsor Administrator
**Role:** Super admin with full system access  
**Responsibilities:**
- Oversee all 34 nonprofits
- Manage distributions and compliance
- User administration across all entities
- Consolidated reporting

**Access Level:** Full visibility across all entities  
**Key Features:** Entity management, consolidated reports, user admin, distribution manager

### 2. Nonprofit Executive Director
**Role:** Entity-level administrator  
**Responsibilities:**
- Manage their specific nonprofit's operations
- Oversee fundraising and programs
- Financial oversight
- Staff management

**Access Level:** Full access to their entity only  
**Key Features:** All modules for their organization, reporting, user management

### 3. Development Officer
**Role:** Fundraising specialist  
**Responsibilities:**
- Donor cultivation and stewardship
- Campaign management
- Grant writing and tracking
- Event coordination

**Access Level:** Donor and marketing modules  
**Key Features:** Donor CRM, donations manager, campaigns, donor pages

### 4. Finance Manager
**Role:** Financial operations specialist  
**Responsibilities:**
- Bookkeeping and reconciliation
- Expense management
- Budget tracking
- Financial reporting

**Access Level:** Accounting and reporting modules  
**Key Features:** Expenses, reconciliation, general ledger, financial reports

### 5. Volunteer Coordinator
**Role:** Personnel management specialist  
**Responsibilities:**
- Volunteer recruitment and retention
- Hour tracking and approval
- Event staffing
- Recognition programs

**Access Level:** Personnel modules  
**Key Features:** Volunteer CRM, hour tracking, activity management

---

## Core Modules

### 1. Dashboard
**Purpose:** Real-time overview of key metrics and activities

**Features:**
- Customizable drag-and-drop layout
- 4 key metric cards with trend indicators
- Donation trends chart
- Recent donations table
- Top donors list
- Todo management
- Time period filtering (Day, Week, Month, YTD)
- Organization selector

**Integration Points:**
- Pulls data from all modules
- Links to detail views in source modules
- Real-time metric updates

### 2. Donor Hub
**Purpose:** Complete donor relationship and donation management

**Sub-Modules:**
- **Donors CRM:** Contact management, history, segmentation
- **Donations Manager:** Transaction tracking, receipts, recurring donations
- **Donor Page Builder:** Custom donation landing pages
- **Donor Portal:** Self-service for donors (history, receipts, profile)

**Integration Points:**
- Links to General Ledger for financial tracking
- Connects to Marketing for campaigns
- Feeds Dashboard metrics
- Generates financial reports

### 3. Personnel Hub
**Purpose:** Staff and volunteer management

**Sub-Modules:**
- **Personnel CRM:** Staff profiles, employment details, documents
- **Volunteers CRM:** Volunteer profiles, skills, activities
- **Hour Tracking:** Time entry, approval workflow, reporting

**Integration Points:**
- Links to User Management for account creation
- Feeds Volunteer Hours Report
- Updates Dashboard metrics
- Connects to Payroll (future)

### 4. Marketing Hub
**Purpose:** Campaign management and prospect cultivation

**Sub-Modules:**
- **Email Campaigns:** Template-based email marketing with analytics
- **Prospects List:** Lead tracking and cultivation
- **VideoBomb Manager:** Video-centric donation pages

**Integration Points:**
- Pulls donor lists from Donor CRM
- Creates donations in Donations Manager
- Tracks campaign ROI in reports

### 5. Accounting Hub
**Purpose:** Complete financial management and compliance

**Sub-Modules:**
- **Chart of Accounts:** Account structure management
- **General Ledger:** Central transaction repository
- **Journal Entry Manager:** Manual entries and adjustments
- **Expenses Manager:** Expense tracking and approval
- **Reimbursements Manager:** Employee reimbursement processing
- **Check Deposit Manager:** Check processing with OCR
- **Reconciliation Manager:** Bank reconciliation

**Integration Points:**
- **Central Hub:** All financial transactions flow through General Ledger
- Donations create ledger entries
- Expenses create ledger entries
- Reconciliation updates ledger status
- Feeds all financial reports

### 6. Reports Hub
**Purpose:** Comprehensive financial and operational reporting

**Report Types:**
- **Balance Sheet:** Assets, liabilities, net assets with drill-down
- **Income Statement:** Revenue and expenses by period
- **Profit & Loss:** Detailed P&L with comparisons
- **Fund Accounting:** Fund-specific financial tracking
- **Volunteer Hours:** Hour tracking and analytics
- **Cash Flow:** Cash movement analysis (future)

**Integration Points:**
- Pulls from General Ledger
- Drill-down to source transactions
- Links to Donor CRM and Donations Manager
- Export to Excel/PDF

### 7. Administration Hub
**Purpose:** System configuration and user management

**Sub-Modules:**
- **User Management:** Account creation, roles, permissions
- **Nonprofit Management:** Entity configuration
- **Settings:** System preferences and configuration
- **Distribution Manager:** Fiscal sponsor fund distribution

**Integration Points:**
- User Management links to Personnel CRM
- Controls access across all modules
- Manages multi-tenant data isolation

---

## Technical Architecture

### Frontend Stack
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** TailwindCSS v4.0
- **UI Components:** shadcn/ui
- **State Management:** React Context API
- **Charts:** Recharts
- **Drag & Drop:** react-dnd
- **Icons:** Lucide React
- **Notifications:** Sonner

### Backend Stack (Planned)
- **Framework:** Ruby on Rails 7+
- **Database:** PostgreSQL
- **Authentication:** JWT tokens
- **API:** RESTful JSON API
- **File Storage:** Cloud storage (AWS S3 or similar)
- **Email:** SendGrid or Mailgun
- **Payment Processing:** Stripe integration
- **OCR:** Tesseract or cloud OCR service

### Database Architecture
- **28 Core Tables:**
  - Organizations (nonprofits)
  - Users
  - Donors (7 tables including addresses, notes, tags)
  - Donations (3 tables including recurring, allocations)
  - Personnel (2 tables)
  - Volunteers
  - Hour Entries
  - Chart of Accounts
  - Ledger Entries
  - Journal Entries
  - Expenses
  - Reimbursements
  - Check Deposits
  - Reconciliations
  - Campaigns
  - Donor Pages
  - And more...

### API Structure
- **~180+ Endpoints** across all modules
- RESTful conventions
- JWT authentication
- Role-based authorization
- Multi-tenant filtering
- Pagination support
- Search and filtering
- Export capabilities

---

## Security & Compliance

### Authentication & Authorization
- **JWT Tokens:** Secure token-based authentication
- **Role-Based Access Control (RBAC):** 4 primary roles
- **Granular Permissions:** Module-level and action-level permissions
- **Multi-Factor Authentication:** Required for admins (future)
- **Session Management:** Secure session handling with timeout
- **Password Policies:** Strong password requirements

### Data Isolation
- **Multi-Tenant Architecture:** Complete data separation between nonprofits
- **Row-Level Security:** Database-level access controls
- **API Filtering:** Backend filtering based on user permissions
- **Audit Trails:** Complete logging of all data access and modifications

### Compliance
- **Financial Compliance:** Proper segregation for fiscal sponsor requirements
- **Data Privacy:** GDPR and CCPA compliance features
- **Security Standards:** SOC 2 Type II preparation
- **Audit Logging:** Comprehensive activity tracking
- **Data Retention:** Configurable retention policies

---

## Integration Points

### Internal Integrations
See `03-COMPONENT-INTEGRATIONS.md` for complete details:

**Key Integration Flows:**
1. **Donation → Ledger → Reconciliation → Reports**
2. **Expense → Approval → Ledger → Reports**
3. **Hour Entry → Approval → Personnel/Volunteer Record**
4. **Donor CRM ↔ Donations Manager** (bidirectional)
5. **General Ledger ↔ All Accounting Modules** (central hub)
6. **Reports → Drill-down → Source Modules**

### External Integrations (Future)
- Payment processors (Stripe, PayPal)
- Email service providers (SendGrid, Mailgun)
- Accounting software (QuickBooks, Xero)
- CRM systems (Salesforce)
- Calendar systems (Google Calendar, Outlook)
- Document storage (Google Drive, Dropbox)

---

## Success Metrics

### User Adoption
- **Target:** 90% of intended users active monthly
- **Feature Usage:** 80% utilization of core features
- **Mobile Usage:** 60% of sessions from mobile devices
- **User Satisfaction:** 4.5+ star rating

### Operational Efficiency
- **Time Savings:** 50% reduction in administrative tasks
- **Error Reduction:** 75% fewer data entry errors
- **Process Automation:** 80% of routine tasks automated
- **Reporting Speed:** 90% faster report generation

### Financial Impact
- **Cost Reduction:** 30% reduction in operational costs
- **Revenue Growth:** 25% increase in donation processing efficiency
- **Compliance:** 100% regulatory compliance maintained
- **ROI:** Positive return within 12 months

### Technical Performance
- **Page Load:** 95% of pages load under 2 seconds
- **Mobile Performance:** 90+ Lighthouse mobile score
- **Error Rate:** Less than 0.1% error rate
- **Uptime:** 99.9% availability

---

## Implementation Roadmap

### Phase 1: Frontend Development (COMPLETE)
✅ React/TypeScript foundation  
✅ All 7 core modules implemented  
✅ 85% mobile responsive  
✅ Mock data integration  
✅ UI/UX design system

### Phase 2: Backend Development (CURRENT)
🔄 **Documentation (36% complete):**
- 18 of ~50 pages documented
- Component integrations documented
- API requirements defined
- Data schema complete

📋 **Next Steps:**
- Complete remaining page documentation
- Ruby on Rails API development
- Database schema implementation
- Authentication system
- API endpoint development

### Phase 3: Integration & Testing
- Remove mock data from frontend
- Connect frontend to backend API
- Integration testing
- Performance optimization
- Security audit
- User acceptance testing

### Phase 4: Deployment & Launch
- Production deployment
- User training and onboarding
- Monitoring and support setup
- Documentation finalization
- Launch to InFocus Ministries

### Phase 5: Enhancement & Scale
- Additional features from roadmap
- Performance optimization
- Third-party integrations
- Mobile app development
- AI-powered insights

---

## Risk Assessment & Mitigation

### High Priority Risks
1. **Data Security**
   - Risk: Data breaches affecting multiple nonprofits
   - Mitigation: Regular security audits, encryption, access controls

2. **Compliance**
   - Risk: Regulatory changes affecting fiscal sponsor requirements
   - Mitigation: Legal review, compliance monitoring, flexible architecture

3. **Performance**
   - Risk: Degradation with rapid growth
   - Mitigation: Load testing, scalable architecture, monitoring

### Medium Priority Risks
1. **User Adoption**
   - Risk: Resistance to change from current systems
   - Mitigation: Training programs, change management, user feedback

2. **Integration Complexity**
   - Risk: Third-party service integration challenges
   - Mitigation: Modular architecture, API abstraction, thorough testing

### Mitigation Strategies
- Comprehensive testing at all levels
- Phased rollout approach
- User training and support
- Regular security audits
- Performance monitoring
- Backup and disaster recovery plans

---

## Documentation Status

### Completed Documentation
- ✅ Overview and architecture
- ✅ Data schema (28 tables)
- ✅ API requirements (~180 endpoints)
- ✅ Component integrations
- ✅ Migration plan (34 weeks)
- ✅ 18 page-specific documents

### In Progress
- 🔄 Remaining 32 page documents
- 🔄 API implementation guides
- 🔄 Testing documentation
- 🔄 Deployment guides

### Documentation Location
All documentation located in `/documentation/` folder:
- High-level docs in root
- Page-specific docs in `/pages/` subfolders
- Organized by module (donor-hub, accounting, personnel, etc.)

---

## Conclusion

The IFM MVP represents a comprehensive solution for nonprofit management within a fiscal sponsor framework. With the frontend complete and backend planning underway, the platform is well-positioned to serve InFocus Ministries and their 34 nonprofit entities.

**Current Focus:**
- Complete documentation (64% remaining)
- Begin Ruby on Rails backend development
- Maintain frontend while building backend
- Plan integration and testing phases

**Next Milestones:**
1. Complete page documentation (32 pages remaining)
2. Finalize API specifications
3. Begin Rails backend development
4. Database schema implementation
5. Authentication system setup

---

*This PRD serves as a living document and will be updated as the product evolves and new requirements emerge.*

**Related Documentation:**
- `00-OVERVIEW.md` - High-level architecture
- `01-DATA-SCHEMA.md` - Database schema
- `02-API-REQUIREMENTS.md` - API endpoints
- `03-COMPONENT-INTEGRATIONS.md` - Component interactions
- `MIGRATION-PLAN.md` - Implementation timeline
- `pages/` - Page-specific documentation
