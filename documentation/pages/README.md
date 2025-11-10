# Documentation Structure

This documentation is organized by sidebar categories to match the application's navigation structure.

## Folder Structure

### Main Categories (Sidebar Order)
1. **dashboard/** - Dashboard and home page components
2. **donor-hub/** - Donor management and donation tracking
3. **people/** - Staff, volunteers, and hour tracking
4. **marketing/** - Marketing campaigns and outreach
5. **accounting/** - Financial management and accounting tools
6. **reports/** - Financial and operational reports
7. **administration/** - System administration and settings

### Supporting Folders
- **components/** - Reusable UI component documentation
- **PAGE-TEMPLATE.md** - Template for creating new documentation pages

## Naming Convention

Each category folder contains:
- `00-[CATEGORY]-HUB.md` - Hub/landing page documentation (appears first)
- `01-XX.md`, `02-XX.md`, etc. - Individual tool/feature documentation (numbered sequentially)

## Hub Pages

Hub pages document the navigation landing pages that provide access to tools within each category:

- **Donor Hub** (`/donor-hub`) - Donors, Donations, Donor Page, Donor Portal
- **People Hub** (`/people`) - Groups & Teams, Volunteers, Hour Tracking
- **Marketing Hub** (`/marketing`) - Campaigns, Prospects, Video Bomb
- **Accounting Hub** (`/accounting`) - Chart of Accounts, Ledger, Journals, Expenses, etc.
- **Reports Hub** (`/reports`) - Balance Sheet, Income Statement, P&L, etc.
- **Administration Hub** (`/administration`) - Nonprofit Management, User Management, Settings

## Tool Pages

Tool pages document individual features/components accessible from hub pages. Each tool page includes:
- Component file reference
- Route/access information
- UI features and layout
- State management details
- Business logic and validation rules
- Related documentation links

## Creating New Documentation

1. Use `PAGE-TEMPLATE.md` as a starting point
2. Place the file in the appropriate category folder
3. Use sequential numbering (e.g., `05-NEW-FEATURE.md`)
4. Update related hub page to reference the new tool
5. Follow the established format and structure
