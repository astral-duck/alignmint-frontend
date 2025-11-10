# Frontend-Backend Integration Documentation

This directory contains comprehensive documentation for integrating the IFM MVP Frontend with the Ruby on Rails backend API.

## Documentation Structure

### 1. Overview Documents
- `00-OVERVIEW.md` - High-level architecture and integration approach
- `01-DATA-SCHEMA.md` - Complete data models and relationships
- `02-API-REQUIREMENTS.md` - Summary of all API endpoints needed
- `03-COMPONENT-INTEGRATIONS.md` - Cross-component interactions and workflows

### 2. Styling Documentation
- `STYLING-GUIDE.md` - **Comprehensive styling system guide**
  - Color system and CSS variables
  - Dark mode implementation details
  - Component styling patterns
  - CSS architecture
  - Best practices and common patterns
- `STYLING-QUICK-REFERENCE.md` - Quick reference for common patterns

### 3. Page-by-Page Documentation
Each frontend page/component will have detailed documentation covering:
- **UI Functionality**: What the page does
- **Data Requirements**: What data is needed from the backend
- **API Endpoints**: Specific endpoints required (GET, POST, PUT, DELETE)
- **Request/Response Schemas**: Exact data structures
- **Authentication/Authorization**: Permission requirements
- **Business Logic**: Rules and validations

### 4. Migration Plan
- `MIGRATION-PLAN.md` - Step-by-step plan to remove mock data and integrate real API
- `VITE-BACKEND-REMOVAL.md` - Clarification on Vite vs mock data removal
- `PROGRESS.md` - Current documentation progress tracker

## Current Status
- ✅ Documentation folder created
- ✅ Styling guide completed
- ✅ Component integration workflows documented
- ✅ 18 pages documented
- ⏳ Cataloging remaining frontend pages
- ⏳ Defining data schemas
- ⏳ Documenting API requirements

## Pages to Document

### Accounting & Finance
- AccountingHub
- ChartOfAccountsManager
- GeneralLedger
- FundAccounting
- JournalEntryManager
- ReconciliationManager
- BalanceSheetReport
- IncomeStatementReport
- IncomeStatementByFund
- ProfitLossReport
- FinancialReports

### Donor Management
- DonorHub
- DonorsCRM
- DonorPortal
- DonorPaymentManagement
- DonorPageBuilder
- DonorPageManager
- DonorPagePreview
- DonationsManager
- TopDonorsTable
- RecentDonationsTable
- ProspectsList

### Deposits & Transactions
- DepositHub
- CheckDepositManager
- RegularDepositManager
- ExpensesManager
- DistributionManager
- ReimbursementsManager

### Personnel & Volunteers
- PersonnelHub
- PersonnelCRM
- VolunteersCRM
- HourTracking
- LeaveRequestsTable
- VolunteerHoursReport

### Marketing
- MarketingHub
- MarketingCampaigns
- VideoBombManager
- VideoBombLandingPage

### Administration
- AdministrationHub
- NonprofitManagement
- UserManagement
- Settings

### Reports
- ReportsHub

## Next Steps
1. Create overview documentation
2. Define complete data schema
3. Document each page systematically
4. Create API endpoint specifications
5. Plan mock data removal
6. Plan Vite backend removal strategy
