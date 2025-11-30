# Fund Accounting Hub

**Component File:** `src/components/AccountingHub.tsx`  
**Route:** `/accounting`  
**Access Level:** Admin, Manager, Accounting Staff  
**Last Updated:** November 30, 2025

## Overview

The Fund Accounting Hub is a navigation landing page that provides access to all fund accounting-related tools. It displays a grid of tool cards, each linking to a specific accounting function. The hub supports visibility customization, allowing users to show/hide tools based on their needs.

**For system integration details, see:** [02-ACCOUNTING-SYSTEM-INTEGRATION.md](./02-ACCOUNTING-SYSTEM-INTEGRATION.md)

## UI Features

### Tool Cards (5 tools)
1. **Expenses** - Submit and approve expense requests
2. **Reimbursements** - Manage reimbursement requests and approvals
3. **Deposits** - Record regular deposits or scan checks
4. **General Ledger** - Complete transaction history with debits and credits
5. **Journal Entries** - Create manual journal entries and adjustments

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
| `expenses` | Fund Accounting → Expenses | ExpensesManager |
| `reimbursements` | Fund Accounting → Reimbursements | ReimbursementsManager |
| `deposits` | Fund Accounting → Deposit Hub | DepositHub (sub-hub) |
| `general-ledger` | Fund Accounting → General Ledger | GeneralLedger |
| `journal-entry` | Fund Accounting → Journal Entry | JournalEntryManager |

## State Management

### Local State
None - pure navigation component

### Global State (AppContext)
- `visibilityEditMode` - Edit mode for showing/hiding tools
- `isTileVisible(pageId, toolId)` - Check tool visibility
- `toggleTileVisibility(pageId, toolId)` - Toggle tool visibility

## Related Documentation

### System Integration (Start Here)
- [02-ACCOUNTING-SYSTEM-INTEGRATION.md](./02-ACCOUNTING-SYSTEM-INTEGRATION.md) - **How all modules work together**

### Individual Module Documentation
- [03-CHART-OF-ACCOUNTS.md](./03-CHART-OF-ACCOUNTS.md) - Account structure
- [04-GENERAL-LEDGER.md](./04-GENERAL-LEDGER.md) - Transaction history
- [05-JOURNAL-ENTRY-MANAGER.md](./05-JOURNAL-ENTRY-MANAGER.md) - Manual entries (central hub)
- [06-EXPENSES-MANAGER.md](./06-EXPENSES-MANAGER.md) - Expense tracking
- [07-REIMBURSEMENTS-MANAGER.md](./07-REIMBURSEMENTS-MANAGER.md) - Employee reimbursements
- [08-CHECK-DEPOSIT-MANAGER.md](./08-CHECK-DEPOSIT-MANAGER.md) - Check deposits with OCR
- [09-RECONCILIATION-MANAGER.md](./09-RECONCILIATION-MANAGER.md) - Bank reconciliation
- [10-REGULAR-DEPOSIT-MANAGER.md](./10-REGULAR-DEPOSIT-MANAGER.md) - Manual deposits
- [11-DISTRIBUTION-MANAGER.md](./11-DISTRIBUTION-MANAGER.md) - Fiscal sponsor distributions
