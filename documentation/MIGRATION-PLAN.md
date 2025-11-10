# Frontend-Backend Migration Plan

## Overview
This document outlines the step-by-step plan to migrate the IFM MVP Frontend from using mock data to a real Ruby on Rails API backend.

## Current State
- ✅ React + TypeScript frontend with Vite
- ✅ Mock data in `src/lib/mockData.ts` and `src/lib/financialData.ts`
- ✅ React Context for state management
- ✅ shadcn/ui components
- ✅ ~50 pages/components
- ❌ No backend API
- ❌ No authentication
- ❌ No real data persistence

## Target State
- ✅ React + TypeScript frontend with Vite (unchanged)
- ✅ Rails API backend with PostgreSQL
- ✅ JWT authentication
- ✅ Real data persistence
- ✅ Multi-tenant architecture
- ✅ Role-based access control
- ❌ Mock data removed

## Phase 1: Foundation (Weeks 1-3)

### Week 1: Documentation & Planning
**Frontend Team:**
- ✅ Complete page-by-page documentation (in progress)
- [ ] Review and finalize data schema
- [ ] Make key technical decisions (auth, API client, etc.)
- [ ] Set up project tracking

**Backend Team:**
- [ ] Review data schema document
- [ ] Review API requirements document
- [ ] Set up Rails project
- [ ] Set up PostgreSQL database
- [ ] Configure CORS for frontend domain

**Deliverables:**
- Complete documentation for all pages
- Approved data schema
- Rails project initialized
- Database configured

### Week 2: Authentication Infrastructure
**Frontend Team:**
- [ ] Install Axios (or chosen API client)
- [ ] Create `src/api/client.ts` base API client
- [ ] Create `src/api/auth.ts` authentication endpoints
- [ ] Create login page/component
- [ ] Create protected route wrapper
- [ ] Set up environment variables
- [ ] Create TypeScript types for API responses

**Backend Team:**
- [ ] Implement JWT authentication
- [ ] Create User model and migrations
- [ ] Create Organization model and migrations
- [ ] Create OrganizationUser join table
- [ ] Implement auth endpoints (login, logout, refresh, me)
- [ ] Set up authentication middleware
- [ ] Write auth tests

**Deliverables:**
- Working login/logout flow
- JWT token management
- Protected routes
- Auth API endpoints

### Week 3: Core Data Models
**Frontend Team:**
- [ ] Create TypeScript interfaces for all data models
- [ ] Create `src/types/` directory structure
- [ ] Set up error handling utilities
- [ ] Set up loading state utilities
- [ ] Create API response type guards

**Backend Team:**
- [ ] Create all database migrations (28 tables)
- [ ] Create all Rails models
- [ ] Set up model associations
- [ ] Set up model validations
- [ ] Create database seeds for testing
- [ ] Write model tests

**Deliverables:**
- Complete TypeScript type definitions
- Complete database schema
- All Rails models created
- Passing model tests

## Phase 2: Donor Management (Weeks 4-6)

### Week 4: Donor API
**Backend Team:**
- [ ] Implement Donor CRUD endpoints
- [ ] Implement Prospect CRUD endpoints
- [ ] Implement donor notes endpoint
- [ ] Implement send message endpoint
- [ ] Write API tests
- [ ] Generate API documentation

**Frontend Team:**
- [ ] Create `src/api/donors.ts`
- [ ] Create `src/api/prospects.ts`
- [ ] Study current DonorsCRM component
- [ ] Plan component refactoring

**Deliverables:**
- Working Donor API endpoints
- API documentation
- Frontend API client methods

### Week 5: Donor CRM Integration
**Frontend Team:**
- [ ] Refactor DonorsCRM to use real API
- [ ] Add loading states
- [ ] Add error handling
- [ ] Add empty states
- [ ] Test create donor flow
- [ ] Test update donor flow
- [ ] Test delete donor flow
- [ ] Test donor search and filtering

**Backend Team:**
- [ ] Support frontend integration
- [ ] Fix any API issues
- [ ] Optimize query performance
- [ ] Add pagination

**Deliverables:**
- DonorsCRM fully integrated with API
- All CRUD operations working
- Search and filtering working

### Week 6: Prospects Integration
**Frontend Team:**
- [ ] Refactor ProspectsList to use real API
- [ ] Implement convert to donor flow
- [ ] Test all prospect operations

**Backend Team:**
- [ ] Implement convert prospect to donor endpoint
- [ ] Support frontend integration

**Deliverables:**
- ProspectsList fully integrated
- Convert to donor working

## Phase 3: Donations (Weeks 7-9)

### Week 7: Donation API
**Backend Team:**
- [ ] Implement Donation CRUD endpoints
- [ ] Implement refund endpoint
- [ ] Implement recurring donation endpoints
- [ ] Implement send receipt endpoint
- [ ] Write API tests

**Frontend Team:**
- [ ] Create `src/api/donations.ts`
- [ ] Study DonationsManager component
- [ ] Plan component refactoring

**Deliverables:**
- Working Donation API endpoints
- Frontend API client methods

### Week 8-9: Donations Integration
**Frontend Team:**
- [ ] Refactor DonationsManager to use real API
- [ ] Refactor RecentDonationsTable
- [ ] Refactor TopDonorsTable
- [ ] Add loading/error states
- [ ] Test all donation operations
- [ ] Test refund flow
- [ ] Test recurring donations

**Backend Team:**
- [ ] Support frontend integration
- [ ] Fix any API issues
- [ ] Optimize queries

**Deliverables:**
- All donation components integrated
- Refund flow working
- Recurring donations working

## Phase 4: Accounting (Weeks 10-14)

### Week 10-11: Accounting API
**Backend Team:**
- [ ] Implement Account (Chart of Accounts) endpoints
- [ ] Implement Fund endpoints
- [ ] Implement JournalEntry endpoints
- [ ] Implement Expense endpoints
- [ ] Implement Reimbursement endpoints
- [ ] Write API tests

**Frontend Team:**
- [ ] Create `src/api/accounting.ts`
- [ ] Create `src/api/expenses.ts`
- [ ] Study accounting components

**Deliverables:**
- Accounting API endpoints
- Frontend API client methods

### Week 12-14: Accounting Integration
**Frontend Team:**
- [ ] ChartOfAccountsManager integration
- [ ] GeneralLedger integration
- [ ] JournalEntryManager integration
- [ ] ExpensesManager integration
- [ ] ReimbursementsManager integration
- [ ] FundAccounting integration

**Backend Team:**
- [ ] Support frontend integration
- [ ] Ensure journal entries balance
- [ ] Implement account balance calculations

**Deliverables:**
- All accounting components integrated
- Journal entries working
- Expense tracking working

## Phase 5: Deposits & Reconciliation (Weeks 15-17)

### Week 15-16: Deposit & Reconciliation API
**Backend Team:**
- [ ] Implement Deposit endpoints
- [ ] Implement DepositItem endpoints
- [ ] Implement Reconciliation endpoints
- [ ] Implement ReconciliationItem endpoints
- [ ] Implement Distribution endpoints
- [ ] Write API tests

**Frontend Team:**
- [ ] Create `src/api/deposits.ts`
- [ ] Create `src/api/reconciliation.ts`
- [ ] Study deposit and reconciliation components

**Deliverables:**
- Deposit API endpoints
- Reconciliation API endpoints
- Frontend API client methods

### Week 17: Integration
**Frontend Team:**
- [ ] CheckDepositManager integration
- [ ] RegularDepositManager integration
- [ ] ReconciliationManager integration
- [ ] DistributionManager integration

**Backend Team:**
- [ ] Support frontend integration

**Deliverables:**
- Deposit management working
- Reconciliation working
- Distribution tracking working

## Phase 6: Personnel (Weeks 18-20)

### Week 18-19: Personnel API
**Backend Team:**
- [ ] Implement PersonnelMember endpoints
- [ ] Implement PersonnelGroup endpoints
- [ ] Implement HourEntry endpoints
- [ ] Implement LeaveRequest endpoints
- [ ] Write API tests

**Frontend Team:**
- [ ] Create `src/api/personnel.ts`
- [ ] Study personnel components

**Deliverables:**
- Personnel API endpoints
- Frontend API client methods

### Week 20: Integration
**Frontend Team:**
- [ ] PersonnelCRM integration
- [ ] VolunteersCRM integration
- [ ] HourTracking integration
- [ ] LeaveRequestsTable integration

**Backend Team:**
- [ ] Support frontend integration

**Deliverables:**
- Personnel management working
- Hour tracking working
- Leave requests working

## Phase 7: Marketing (Weeks 21-22)

### Week 21: Marketing API
**Backend Team:**
- [ ] Implement Campaign endpoints
- [ ] Implement VideoBomb endpoints
- [ ] Write API tests

**Frontend Team:**
- [ ] Create `src/api/marketing.ts`
- [ ] Study marketing components

**Deliverables:**
- Marketing API endpoints
- Frontend API client methods

### Week 22: Integration
**Frontend Team:**
- [ ] MarketingCampaigns integration
- [ ] VideoBombManager integration
- [ ] VideoBombLandingPage integration

**Backend Team:**
- [ ] Support frontend integration

**Deliverables:**
- Campaign management working
- Video bomb feature working

## Phase 8: Reports (Weeks 23-25)

### Week 23-24: Reports API
**Backend Team:**
- [ ] Implement balance sheet report endpoint
- [ ] Implement income statement endpoint
- [ ] Implement income statement by fund endpoint
- [ ] Implement profit & loss endpoint
- [ ] Implement cash flow endpoint
- [ ] Implement volunteer hours report endpoint
- [ ] Optimize report queries for performance
- [ ] Write API tests

**Frontend Team:**
- [ ] Create `src/api/reports.ts`
- [ ] Study report components

**Deliverables:**
- All report API endpoints
- Frontend API client methods

### Week 25: Integration
**Frontend Team:**
- [ ] BalanceSheetReport integration
- [ ] IncomeStatementReport integration
- [ ] IncomeStatementByFund integration
- [ ] ProfitLossReport integration
- [ ] VolunteerHoursReport integration
- [ ] FinancialReports integration

**Backend Team:**
- [ ] Support frontend integration
- [ ] Optimize slow queries

**Deliverables:**
- All reports working
- Report generation performant

## Phase 9: Administration & Donor Pages (Weeks 26-28)

### Week 26-27: Admin & Donor Page API
**Backend Team:**
- [ ] Implement UserManagement endpoints
- [ ] Implement NonprofitManagement endpoints
- [ ] Implement DonorPage endpoints
- [ ] Implement Settings endpoints
- [ ] Write API tests

**Frontend Team:**
- [ ] Create `src/api/admin.ts`
- [ ] Create `src/api/donor-pages.ts`
- [ ] Study admin components

**Deliverables:**
- Admin API endpoints
- Donor page API endpoints
- Frontend API client methods

### Week 28: Integration
**Frontend Team:**
- [ ] UserManagement integration
- [ ] NonprofitManagement integration
- [ ] DonorPageBuilder integration
- [ ] DonorPageManager integration
- [ ] DonorPagePreview integration
- [ ] DonorPortal integration
- [ ] Settings integration

**Backend Team:**
- [ ] Support frontend integration

**Deliverables:**
- User management working
- Nonprofit settings working
- Donor page builder working
- Public donor portal working

## Phase 10: Dashboard & Supporting Features (Weeks 29-30)

### Week 29: Dashboard & Utilities API
**Backend Team:**
- [ ] Implement dashboard metrics endpoint
- [ ] Implement Todo endpoints
- [ ] Implement Notification endpoints
- [ ] Implement file upload endpoints
- [ ] Implement export endpoints
- [ ] Write API tests

**Frontend Team:**
- [ ] Create `src/api/dashboard.ts`
- [ ] Create `src/api/todos.ts`
- [ ] Create `src/api/notifications.ts`
- [ ] Create `src/api/uploads.ts`

**Deliverables:**
- Dashboard API working
- Todo API working
- Notification API working
- File upload working

### Week 30: Integration
**Frontend Team:**
- [ ] Dashboard (App.tsx) integration
- [ ] TodoList integration
- [ ] NotificationPanel integration
- [ ] ExportButton integration
- [ ] Update AppContext to use real API

**Backend Team:**
- [ ] Support frontend integration

**Deliverables:**
- Dashboard fully functional
- Todos working
- Notifications working
- Export functionality working

## Phase 11: Cleanup & Optimization (Weeks 31-32)

### Week 31: Cleanup
**Frontend Team:**
- [ ] Remove `src/lib/mockData.ts`
- [ ] Remove `src/lib/financialData.ts`
- [ ] Remove all mock data imports
- [ ] Clean up unused code
- [ ] Update documentation
- [ ] Fix any remaining TypeScript errors

**Backend Team:**
- [ ] Optimize slow queries
- [ ] Add database indexes
- [ ] Implement caching where appropriate
- [ ] Review and improve error handling

**Deliverables:**
- All mock data removed
- Code cleaned up
- Performance optimized

### Week 32: Testing
**Frontend Team:**
- [ ] End-to-end testing
- [ ] Cross-browser testing
- [ ] Mobile responsiveness testing
- [ ] Fix bugs

**Backend Team:**
- [ ] Load testing
- [ ] Security audit
- [ ] Fix bugs

**Deliverables:**
- All features tested
- Critical bugs fixed
- Performance acceptable

## Phase 12: Deployment (Weeks 33-34)

### Week 33: Staging Deployment
**DevOps:**
- [ ] Set up staging environment
- [ ] Deploy backend to staging
- [ ] Deploy frontend to staging
- [ ] Configure environment variables
- [ ] Set up SSL certificates
- [ ] Configure database backups

**Team:**
- [ ] Test on staging
- [ ] Fix any deployment issues

**Deliverables:**
- Working staging environment
- All features working in staging

### Week 34: Production Deployment
**DevOps:**
- [ ] Set up production environment
- [ ] Deploy backend to production
- [ ] Deploy frontend to production
- [ ] Set up monitoring and logging
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Configure CDN for frontend assets

**Team:**
- [ ] Final testing in production
- [ ] Monitor for issues
- [ ] Create runbook for common issues

**Deliverables:**
- Application live in production
- Monitoring in place
- Documentation complete

## Success Criteria

### Functional Requirements
- ✅ All 50+ pages working with real API
- ✅ Authentication and authorization working
- ✅ All CRUD operations functional
- ✅ Reports generating correctly
- ✅ File uploads working
- ✅ Export functionality working
- ✅ Multi-tenant isolation working
- ✅ No mock data remaining

### Non-Functional Requirements
- ✅ Page load time < 2 seconds
- ✅ API response time < 500ms (95th percentile)
- ✅ Mobile responsive
- ✅ Cross-browser compatible (Chrome, Firefox, Safari, Edge)
- ✅ 99.9% uptime
- ✅ Secure (HTTPS, JWT, CORS configured)
- ✅ Accessible (WCAG 2.1 Level AA)

### Quality Requirements
- ✅ Test coverage > 80%
- ✅ No critical security vulnerabilities
- ✅ No P0/P1 bugs in production
- ✅ Documentation complete and up-to-date

## Risk Management

### High Risks
1. **Scope Creep** - Stick to documented requirements
2. **Backend Delays** - Start backend work immediately
3. **Integration Issues** - Regular sync meetings between teams
4. **Performance Issues** - Load testing early and often
5. **Data Migration** - If migrating from existing system, plan carefully

### Mitigation Strategies
- Weekly team sync meetings
- Daily standups within teams
- Continuous integration and testing
- Regular demos to stakeholders
- Buffer time in schedule (2-4 weeks)

## Timeline Summary

- **Phase 1: Foundation** - Weeks 1-3
- **Phase 2: Donor Management** - Weeks 4-6
- **Phase 3: Donations** - Weeks 7-9
- **Phase 4: Accounting** - Weeks 10-14
- **Phase 5: Deposits & Reconciliation** - Weeks 15-17
- **Phase 6: Personnel** - Weeks 18-20
- **Phase 7: Marketing** - Weeks 21-22
- **Phase 8: Reports** - Weeks 23-25
- **Phase 9: Administration** - Weeks 26-28
- **Phase 10: Dashboard** - Weeks 29-30
- **Phase 11: Cleanup** - Weeks 31-32
- **Phase 12: Deployment** - Weeks 33-34

**Total Duration: 34 weeks (8.5 months)**

## Team Requirements

### Frontend Team
- 2 Senior React Developers
- 1 QA Engineer

### Backend Team
- 2 Senior Rails Developers
- 1 Database Engineer
- 1 QA Engineer

### DevOps
- 1 DevOps Engineer (part-time)

### Management
- 1 Project Manager
- 1 Product Owner

## Budget Estimate

*To be filled in based on team rates and infrastructure costs*

## Next Steps

1. **Review and approve this migration plan**
2. **Assemble the team**
3. **Set up project management tools**
4. **Begin Phase 1: Foundation**
5. **Schedule weekly sync meetings**
6. **Create detailed sprint plans**
