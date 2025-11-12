# General Ledger Integration

**Date:** November 10, 2025  
**Status:** ✅ PRODUCTION READY

---

## Overview

All transaction modules are integrated with the General Ledger using proper double-entry accounting principles.

---

## Integrated Modules

### ✅ Check Deposit Manager
**File:** `src/components/CheckDepositManager.tsx`

**Accounting Entry:**
```
Debit:  1000 - Cash                    $XXX.XX
Credit: 4xxx - Revenue Account         $XXX.XX
```

**Features:**
- OCR data extraction from check images
- Batch deposit tracking
- Revenue account selection (4000-4600 series)
- Reconciliation support
- Immediate GL posting

---

### ✅ Reimbursements Manager
**File:** `src/components/ReimbursementsManager.tsx`

**Accounting Entry:**
```
Debit:  5xxx - Expense Account         $XXX.XX
Credit: 1000 - Cash                    $XXX.XX
```

**Features:**
- OCR data extraction from receipts
- Request ID tracking for grouped receipts
- Expense account selection (5000-6000 series)
- Immediate GL posting

---

### ✅ Expenses Manager
**File:** `src/components/ExpensesManager.tsx`

**Accounting Entry:**
```
Debit:  5xxx - Expense Account         $XXX.XX
Credit: 1000 - Cash                    $XXX.XX
```

**Features:**
- Manual expense entry
- Approval workflow: pending → approved → posted
- "Post to GL" button for approved expenses
- Posted status tracking
- Expense account selection (5000-6000 series)

---

### ✅ Sponsor Fee Allocation
**File:** `src/components/IncomeStatementByFund.tsx`

**Accounting Entries (creates TWO entries per allocation):**

**For Nonprofit:**
```
Debit:  5900 - Admin Fee Expense       $XXX.XX
Credit: 2200 - Due to InFocus          $XXX.XX
```

**For InFocus:**
```
Debit:  1300 - Due from Nonprofits     $XXX.XX
Credit: 4900 - Admin Fee Revenue       $XXX.XX
```

**Features:**
- Inter-entity accounting
- Adjustable fee rates and amounts
- Batch confirmation support
- Confirmation tracking (who, when)

---

## Technical Implementation

### Shared Infrastructure
**File:** `src/lib/journalEntryHelpers.ts`

Helper functions:
- `getAccountByCode(code, accounts)` - Find account by code
- `createJournalEntryFromTransaction(type, data, accounts)` - Create balanced journal entries

### Event-Based Architecture
All modules dispatch events to General Ledger:

```typescript
const event = new CustomEvent('journal-entries-created', {
  detail: { entries: [journalEntry] }
});
window.dispatchEvent(event);
```

General Ledger listens and updates in real-time.

---

## Chart of Accounts

### Assets (1000-1999)
- **1000** - Cash
- **1300** - Due from Nonprofits

### Liabilities (2000-2999)
- **2200** - Due to InFocus

### Revenue (4000-4999)
- **4000** - Donations
- **4100** - Earned Income
- **4200** - Cash Pledge Collections
- **4300** - Grants
- **4400** - Government Grants
- **4500** - Investment Income
- **4600** - Other Income
- **4900** - Admin Fee Revenue

### Expenses (5000-6999)
- **5000** - Tithe
- **5010** - Family Support
- **5200** - Legal Fees
- **5210** - Accounting
- **5240** - Advertising Expenses
- **5300** - Office Supplies
- **5400** - Information Technology
- **5500** - Rent
- **5510** - Utilities
- **5600** - Travel and Meetings
- **5700** - Insurance Premium
- **5800** - Bank Fees
- **5890** - Miscellaneous Expense
- **5900** - Admin Fee Expense
- **6000** - Event Expenses

---

## Key Features

✅ **Double-Entry Accounting** - All debits equal credits  
✅ **Event-Based Updates** - Real-time GL synchronization  
✅ **Audit Trail** - Complete transaction history  
✅ **Reconciliation Support** - Bank reconciliation for deposits  
✅ **Type Safety** - Full TypeScript implementation  
✅ **Inter-Entity Accounting** - Admin fees between nonprofits and InFocus  

---

## Data Flow

```
Transaction Module (Check/Reimb/Expense/Fee)
  ↓ Creates
Journal Entry (proper double-entry)
  ↓ Dispatches
CustomEvent('journal-entries-created')
  ↓ Received by
General Ledger Component
  ↓ Converts to
Ledger Entries (displayed in GL)
  ↓ Available for
Reconciliation & Reporting
```

---

**Last Updated:** November 10, 2025  
**Version:** 1.0.0
