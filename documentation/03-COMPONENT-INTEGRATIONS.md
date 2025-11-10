# Component Integrations & Cross-References

This document details how different components interact with each other, including navigation flows, data sharing, and integration points across the application.

## Table of Contents
1. [Dashboard Integrations](#dashboard-integrations)
2. [Donor Hub Integrations](#donor-hub-integrations)
3. [Accounting Integrations](#accounting-integrations)
4. [Personnel Integrations](#personnel-integrations)
5. [Reports Integrations](#reports-integrations)
6. [Cross-Module Workflows](#cross-module-workflows)

---

## Dashboard Integrations

### Recent Donations → Donations Manager
- **Trigger:** Click on any donation in Recent Donations table
- **Action:** Navigate to Donations Manager with donation pre-selected
- **Data Passed:** Donation ID
- **Expected Behavior:** Opens donation detail view in Donations Manager

### Top Donors → Donor CRM
- **Trigger:** Click on donor name in Top Donors table
- **Action:** Navigate to Donor CRM with donor profile open
- **Data Passed:** Donor ID
- **Expected Behavior:** Opens donor profile view with full history

### Metrics Cards → Filtered Views
- **Total Donations Card → Donations Manager:** Shows all donations for selected period
- **Active Donors Card → Donor CRM:** Filters to donors who donated in period
- **Volunteer Hours Card → Hour Tracking:** Shows hour entries for period
- **Upcoming Events Card → Calendar/Events:** (Future feature)

---

## Donor Hub Integrations

### Donors CRM ↔ Donations Manager

#### From Donors CRM to Donations Manager:
- **Trigger:** Click "View Donations" on donor profile
- **Action:** Navigate to Donations Manager filtered by donor
- **Data Passed:** Donor ID
- **Expected Behavior:** Shows all donations from that donor

#### From Donations Manager to Donors CRM:
- **Trigger:** Click donor name in donations table
- **Action:** Open donor profile in side panel or navigate to Donor CRM
- **Data Passed:** Donor ID
- **Expected Behavior:** Shows donor profile with donation history

### Donations Manager → General Ledger
- **Trigger:** Click "View in Ledger" on donation
- **Action:** Navigate to General Ledger filtered by donation transaction
- **Data Passed:** Transaction ID, Date range
- **Expected Behavior:** Shows ledger entry for that donation with debit/credit details

### Donations Manager → Check Deposit Manager
- **Trigger:** Donation payment method is "Check"
- **Action:** Link to associated check deposit
- **Data Passed:** Check deposit ID
- **Expected Behavior:** Shows check deposit details including OCR data

### Donor Portal → Donations Manager (Internal)
- **Trigger:** Admin views donor portal on behalf of donor
- **Action:** Can see same donation history as donor sees
- **Data Passed:** Donor ID
- **Expected Behavior:** Read-only view of donor's donations

### Donor Page Builder → Donations Manager
- **Trigger:** Donation submitted through custom donor page
- **Action:** Creates new donation record
- **Data Passed:** Donor info, amount, payment method, page ID
- **Expected Behavior:** Donation appears in Donations Manager with source = "Donor Page"

---

## Accounting Integrations

### General Ledger ↔ All Accounting Modules

The General Ledger is the **central hub** for all financial transactions. Every accounting action creates ledger entries:

#### Donations → General Ledger:
- **When:** Donation marked as "Completed"
- **Ledger Entry:** 
  - Debit: Cash/Bank Account (1000)
  - Credit: Donation Revenue (4000)
- **Link:** Each donation has `ledger_entry_id`

#### Expenses → General Ledger:
- **When:** Expense approved and paid
- **Ledger Entry:**
  - Debit: Expense Account (5xxx)
  - Credit: Cash/Bank Account (1000)
- **Link:** Each expense has `ledger_entry_id`

#### Reimbursements → General Ledger:
- **When:** Reimbursement approved and paid
- **Ledger Entry:**
  - Debit: Expense Account (5xxx)
  - Credit: Cash/Bank Account (1000)
- **Link:** Each reimbursement has `ledger_entry_id`

#### Check Deposits → General Ledger:
- **When:** Check deposit processed
- **Ledger Entry:**
  - Debit: Cash/Bank Account (1000)
  - Credit: Donation Revenue (4000) or other income
- **Link:** Each check deposit has `ledger_entry_id`

#### Journal Entries → General Ledger:
- **When:** Journal entry posted
- **Ledger Entry:** Multiple debits/credits as specified
- **Link:** Journal entry IS a ledger transaction

### Reconciliation Manager ↔ General Ledger

#### Integration Flow:
1. **Fetch Ledger Transactions:**
   - Reconciliation pulls all unreconciled ledger entries for selected account
   - Filters by date range (statement period)
   - Shows source (Donation, Expense, Journal Entry, etc.)

2. **Matching Process:**
   - Bank transaction matched to ledger transaction
   - Updates ledger entry: `reconciled = true`, `reconciled_date = today`
   - Creates reconciliation record linking bank and ledger

3. **View in Ledger:**
   - Click "View in Ledger" on matched transaction
   - Opens General Ledger filtered to that transaction
   - Highlights the reconciled entry

4. **Unmatching:**
   - If unmatch is performed, updates ledger: `reconciled = false`
   - Removes reconciliation record

### Chart of Accounts → All Accounting Modules

#### Account Selection:
- **Expenses Manager:** Select expense account from COA
- **Reimbursements Manager:** Select expense account from COA
- **Check Deposits:** Select income account from COA
- **Journal Entries:** Select debit/credit accounts from COA
- **General Ledger:** Filter by account from COA

#### Account Validation:
- All transactions validate account codes against COA
- Inactive accounts cannot be used for new transactions
- Account type restrictions enforced (can't debit a revenue account)

### Income by Fund (Sponsor Fee Allocation) → General Ledger
- **Trigger:** Monthly sponsor fee calculation
- **Action:** Creates journal entry for fee allocation
- **Ledger Entry:**
  - Debit: Sponsor Fee Expense (5xxx)
  - Credit: Admin Fee Revenue (4xxx)
- **Link:** Creates journal entry that posts to ledger

---

## Personnel Integrations

### Personnel CRM ↔ Hour Tracking

#### From Personnel CRM:
- **Trigger:** Click "View Hours" on personnel profile
- **Action:** Navigate to Hour Tracking filtered by personnel
- **Data Passed:** Personnel ID
- **Expected Behavior:** Shows all hour entries for that person

#### Hour Tracking → Personnel CRM:
- **When:** Hour entry submitted
- **Action:** Updates personnel record's total hours
- **Data Updated:** `ytd_hours`, `total_hours` on personnel record

### Volunteers CRM ↔ Hour Tracking

#### From Volunteers CRM:
- **Trigger:** Click "View Hours" on volunteer profile
- **Action:** Navigate to Hour Tracking filtered by volunteer
- **Data Passed:** Volunteer ID
- **Expected Behavior:** Shows all hour entries for that volunteer

#### Hour Tracking → Volunteers CRM:
- **When:** Hour entry approved
- **Action:** Updates volunteer record's total hours
- **Data Updated:** `ytd_hours`, `total_hours` on volunteer record

### Personnel CRM ↔ User Management

#### Create User from Personnel:
- **Trigger:** Click "Create User Account" on personnel profile
- **Action:** Opens User Management with pre-filled data
- **Data Passed:** Email, name, organization
- **Expected Behavior:** Creates user account linked to personnel record

#### User Management → Personnel CRM:
- **When:** User created
- **Action:** Links user to personnel record via `user_id`
- **Data Updated:** Personnel record gets `user_id` field populated

---

## Reports Integrations

### Balance Sheet → General Ledger

#### Account Drill-Down:
- **Trigger:** Click on any account line in Balance Sheet
- **Action:** Opens transaction detail sheet/modal
- **API Call:** `GET /api/v1/reports/balance_sheet/account_transactions`
- **Data Shown:** All transactions for that account up to report date
- **Features:**
  - View transaction details
  - Click "View in Ledger" to open General Ledger
  - Filter by date range
  - See running balance

#### View in Ledger:
- **Trigger:** Click "View in Ledger" on transaction in drill-down
- **Action:** Navigate to General Ledger
- **Data Passed:** Transaction ID, account code, date
- **Expected Behavior:** General Ledger opens with transaction highlighted

### Balance Sheet → Chart of Accounts
- **Account Structure:** Balance Sheet uses COA for account organization
- **Account Names:** Pulls account names from COA
- **Account Categories:** Groups accounts by COA categories

### Income Statement → Donations Manager

#### Revenue Drill-Down:
- **Trigger:** Click on "Donation Revenue" line
- **Action:** Opens filtered view of donations
- **Data Passed:** Date range, revenue account code
- **Expected Behavior:** Shows all donations that contributed to that revenue

### Income Statement → Expenses Manager

#### Expense Drill-Down:
- **Trigger:** Click on expense category line
- **Action:** Opens filtered view of expenses
- **Data Passed:** Date range, expense account code
- **Expected Behavior:** Shows all expenses in that category

### Profit & Loss → General Ledger

#### Transaction Drill-Down:
- **Trigger:** Click on any revenue or expense line
- **Action:** Opens General Ledger filtered by account
- **Data Passed:** Account code, date range
- **Expected Behavior:** Shows all ledger entries for that account

### Volunteer Hours Report → Hour Tracking

#### Hours Drill-Down:
- **Trigger:** Click on volunteer name in report
- **Action:** Opens Hour Tracking filtered by volunteer
- **Data Passed:** Volunteer ID, date range
- **Expected Behavior:** Shows all hour entries for that volunteer

### Volunteer Hours Report → Volunteers CRM

#### Volunteer Profile:
- **Trigger:** Click "View Profile" on volunteer in report
- **Action:** Navigate to Volunteers CRM
- **Data Passed:** Volunteer ID
- **Expected Behavior:** Opens volunteer profile

---

## Cross-Module Workflows

### Complete Donation Workflow

1. **Donation Entry:**
   - Created in Donations Manager
   - Status: "Pending"

2. **Payment Processing:**
   - If check: Links to Check Deposit Manager
   - If credit card: Processes through payment gateway
   - Status: "Completed"

3. **Ledger Entry:**
   - Automatically creates General Ledger entry
   - Debit: Cash Account
   - Credit: Donation Revenue

4. **Reconciliation:**
   - Appears in Reconciliation Manager as unreconciled
   - Matched with bank statement transaction
   - Marked as reconciled in General Ledger

5. **Reporting:**
   - Appears in Balance Sheet (increases cash)
   - Appears in Income Statement (revenue)
   - Appears in Donor CRM (donor history)
   - Appears in Dashboard metrics

### Complete Expense Workflow

1. **Expense Request:**
   - Created in Expenses Manager
   - Status: "Pending Approval"

2. **Approval:**
   - Manager reviews and approves
   - Status: "Approved"

3. **Payment:**
   - Payment processed (check or ACH)
   - Status: "Paid"

4. **Ledger Entry:**
   - Automatically creates General Ledger entry
   - Debit: Expense Account
   - Credit: Cash Account

5. **Reconciliation:**
   - Appears in Reconciliation Manager
   - Matched with bank statement
   - Marked as reconciled

6. **Reporting:**
   - Appears in Balance Sheet (decreases cash)
   - Appears in Income Statement (expense)
   - Appears in Profit & Loss

### Complete Reimbursement Workflow

1. **Reimbursement Request:**
   - Created in Reimbursements Manager
   - Receipts uploaded
   - Status: "Pending Approval"

2. **Approval:**
   - Manager reviews receipts and approves
   - Status: "Approved"

3. **Payment:**
   - Reimbursement paid to employee
   - Status: "Paid"

4. **Ledger Entry:**
   - Creates General Ledger entry
   - Debit: Expense Account
   - Credit: Cash Account

5. **Personnel Record:**
   - Updates personnel record with reimbursement
   - Tracks total reimbursements for reporting

### Complete Volunteer Hour Workflow

1. **Hour Entry:**
   - Volunteer submits hours in Hour Tracking
   - Status: "Pending"

2. **Approval:**
   - Manager reviews and approves
   - Status: "Approved"

3. **Volunteer Record Update:**
   - Updates volunteer's total hours
   - Updates YTD hours

4. **Reporting:**
   - Appears in Volunteer Hours Report
   - Appears in Dashboard metrics
   - Appears in volunteer profile

### Complete Bank Reconciliation Workflow

1. **Upload Statement:**
   - Upload bank statement in Reconciliation Manager
   - Parses transactions

2. **Fetch Ledger Transactions:**
   - Pulls unreconciled transactions from General Ledger
   - Filters by account and date range

3. **Auto-Match:**
   - System attempts automatic matching
   - Matches by amount, date, reference number

4. **Manual Match:**
   - User manually matches remaining transactions
   - Can match one-to-many (e.g., batch deposit)

5. **Reconcile:**
   - Mark all matched transactions as reconciled
   - Updates General Ledger entries
   - Creates reconciliation record

6. **Reporting:**
   - Reconciliation status appears in reports
   - Balance Sheet shows reconciled balances

---

## Navigation Patterns

### Deep Linking
All components support deep linking with IDs:
- `/donor-hub?tool=donors&id=DON-123` - Opens specific donor
- `/accounting-hub?tool=general-ledger&transaction=TXN-456` - Opens specific transaction
- `/reports?tool=balance-sheet&account=1000` - Opens with account drill-down

### Back Navigation
- All detail views have "Back" button
- Returns to previous list view
- Preserves filters and search state

### Side Panels vs Full Navigation
- **Side Panels:** Quick views (donor profile from donations table)
- **Full Navigation:** Detailed editing (click "Edit" opens full page)

### Breadcrumbs
- Dashboard > Donor Hub > Donors CRM > John Doe
- Dashboard > Accounting > General Ledger > Transaction Details

---

## Data Flow Diagrams

### Donation to Ledger Flow
```
Donations Manager
    ↓ (Create donation)
Payment Processing
    ↓ (Payment completed)
General Ledger Entry Created
    ↓ (Debit: Cash, Credit: Revenue)
Reconciliation Manager
    ↓ (Match with bank)
General Ledger Updated (reconciled = true)
    ↓
Reports (Balance Sheet, Income Statement)
```

### Expense to Ledger Flow
```
Expenses Manager
    ↓ (Create expense)
Approval Workflow
    ↓ (Manager approves)
Payment Processing
    ↓ (Payment made)
General Ledger Entry Created
    ↓ (Debit: Expense, Credit: Cash)
Reconciliation Manager
    ↓ (Match with bank)
General Ledger Updated (reconciled = true)
    ↓
Reports (Balance Sheet, Income Statement)
```

### Hour Entry Flow
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

---

## API Integration Points

### Shared Endpoints
Many components share the same API endpoints:

#### Donors:
- `GET /api/v1/donors/:id` - Used by Donor CRM, Donations Manager, Reports
- `GET /api/v1/donors/:id/donations` - Used by Donor CRM, Donor Portal

#### Ledger:
- `GET /api/v1/ledger_entries` - Used by General Ledger, Reconciliation, Reports
- `GET /api/v1/ledger_entries/:id` - Used by all accounting modules

#### Accounts:
- `GET /api/v1/chart_of_accounts` - Used by all accounting modules, reports

### Webhook/Event System (Future)
For real-time updates across components:
- Donation created → Update dashboard metrics
- Expense approved → Update pending approvals count
- Reconciliation completed → Update account balances

---

## State Management Considerations

### Global State (AppContext)
Shared across all components:
- `selectedEntity` - Current organization
- `timePeriod` - Current time filter
- `currentUser` - Logged-in user info

### Component State Synchronization
When data changes in one component, related components should update:
- Donation created → Dashboard metrics refresh
- Expense approved → General Ledger refreshes
- Hours approved → Volunteer profile refreshes

### Cache Invalidation
When mutations occur, invalidate related caches:
- Create donation → Invalidate donor cache, ledger cache, metrics cache
- Reconcile transaction → Invalidate ledger cache, balance sheet cache

---

## Testing Integration Points

### Integration Tests Required
1. **Donation → Ledger → Reconciliation → Reports** (Full flow)
2. **Expense → Approval → Ledger → Reports** (Full flow)
3. **Hour Entry → Approval → Volunteer Record** (Full flow)
4. **Donor CRM ↔ Donations Manager** (Bidirectional navigation)
5. **General Ledger ↔ All Accounting Modules** (Data consistency)
6. **Reports → Drill-down → Source Modules** (Navigation flow)

### Data Consistency Tests
1. Ledger balance = Sum of all transactions
2. Donor total = Sum of all donations
3. Volunteer hours = Sum of all approved hour entries
4. Balance Sheet balances (Assets = Liabilities + Equity)

---

## Future Integration Enhancements

### Planned Integrations
1. **Email Integration:** Send receipts from Donations Manager
2. **Calendar Integration:** Link events to volunteer hours
3. **Payment Gateway:** Real-time payment processing
4. **Accounting Software:** Export to QuickBooks, Xero
5. **CRM Integration:** Sync with external CRM systems
6. **Notification System:** Real-time alerts across modules

### API Improvements
1. **GraphQL:** Single query for related data
2. **WebSockets:** Real-time updates
3. **Batch Operations:** Bulk updates across modules
4. **Event Sourcing:** Complete audit trail of all changes
