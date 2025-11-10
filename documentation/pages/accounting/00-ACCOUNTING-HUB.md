# Accounting Hub

**Component File:** `src/components/AccountingHub.tsx`  
**Route:** `/accounting`  
**Access Level:** Admin, Manager, Accounting Staff

## Overview
The Accounting Hub is a navigation landing page that provides access to all accounting-related tools. It displays a grid of tool cards, each linking to a specific accounting function. The hub supports visibility customization, allowing users to show/hide tools based on their needs.

## UI Features

### Tool Cards (7 tools)
1. **Reconciliation** - Match and categorize bank transactions
2. **Expenses** - Submit and approve expense requests
3. **Reimbursements** - Manage reimbursement requests and approvals
4. **Sponsor Fee Allocation** - Review and confirm monthly admin fees
5. **Deposits** - Record regular deposits or scan checks
6. **General Ledger** - Complete transaction history with debits and credits
7. **Journal Entries** - Create manual journal entries and adjustments

### Features
- Grid layout (responsive: 1/2/3 columns)
- Icon-based tool cards
- Hover effects
- Visibility toggle (edit mode)
- Tool descriptions
- Click to navigate

## Navigation Mapping

| Tool ID | Routes To | Component |
|---------|-----------|-----------|
| `reconciliation` | Accounting → Reconciliation | ReconciliationManager |
| `expenses` | Accounting → Expenses | ExpensesManager |
| `reimbursements` | Accounting → Reimbursements | ReimbursementsManager |
| `income-by-fund` | Accounting → Fee Allocation | IncomeStatementByFund |
| `deposits` | Accounting → Deposit Hub | DepositHub (sub-hub) |
| `general-ledger` | Accounting → General Ledger | GeneralLedger |
| `journal-entry` | Accounting → Journal Entry | JournalEntryManager |

## State Management

### Local State
None - pure navigation component

### Global State (AppContext)
- `visibilityEditMode` - Edit mode for showing/hiding tools
- `isTileVisible(pageId, toolId)` - Check tool visibility
- `toggleTileVisibility(pageId, toolId)` - Toggle tool visibility

## Related Documentation
- [../accounting/03-CHART-OF-ACCOUNTS.md](../accounting/03-CHART-OF-ACCOUNTS.md)
- [../accounting/04-GENERAL-LEDGER.md](../accounting/04-GENERAL-LEDGER.md)
- [../accounting/05-JOURNAL-ENTRY-MANAGER.md](../accounting/05-JOURNAL-ENTRY-MANAGER.md)
- [../accounting/06-EXPENSES-MANAGER.md](../accounting/06-EXPENSES-MANAGER.md)
- [../accounting/07-REIMBURSEMENTS-MANAGER.md](../accounting/07-REIMBURSEMENTS-MANAGER.md)
- [../accounting/08-CHECK-DEPOSIT-MANAGER.md](../accounting/08-CHECK-DEPOSIT-MANAGER.md)
- [../accounting/09-RECONCILIATION-MANAGER.md](../accounting/09-RECONCILIATION-MANAGER.md)
- [../accounting/10-REGULAR-DEPOSIT-MANAGER.md](../accounting/10-REGULAR-DEPOSIT-MANAGER.md)
