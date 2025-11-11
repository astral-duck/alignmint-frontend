# General Ledger Integration - Quick Reference Guide

**Date:** November 10, 2025  
**Status:** Production Ready ✅

---

## Overview

All transaction modules now create proper journal entries and integrate with the General Ledger using double-entry accounting principles.

---

## Integrated Modules

### 1. Check Deposit Manager
**File:** `src/components/CheckDepositManager.tsx`

**Accounting Entry:**
```
Debit:  1000 - Cash                    $XXX.XX
Credit: 4xxx - Revenue Account         $XXX.XX
```

**How to Use:**
1. Scan or upload check image
2. Review OCR-extracted data
3. Select revenue account (4000-4600 series)
4. Assign to nonprofit
5. Click "Submit Deposit to Ledger"
6. ✅ Journal entry created and posted to GL

**Features:**
- Batch deposit tracking
- OCR data extraction
- Unreconciled by default (can be reconciled later)
- Immediate GL visibility

---

### 2. Reimbursements Manager
**File:** `src/components/ReimbursementsManager.tsx`

**Accounting Entry:**
```
Debit:  5xxx - Expense Account         $XXX.XX
Credit: 1000 - Cash                    $XXX.XX
```

**How to Use:**
1. Capture receipt photo
2. Review OCR-extracted data
3. Select expense account (5000-6000 series)
4. Assign to nonprofit
5. Click "Submit for Approval"
6. ✅ Journal entry created and posted to GL

**Features:**
- Request ID tracking
- Multiple receipts per request
- OCR data extraction
- Immediate GL posting

---

### 3. Expenses Manager
**File:** `src/components/ExpensesManager.tsx`

**Accounting Entry:**
```
Debit:  5xxx - Expense Account         $XXX.XX
Credit: 1000 - Cash                    $XXX.XX
```

**How to Use:**
1. Create manual expense entry
2. Fill in vendor, amount, account, nonprofit
3. Submit (status: pending)
4. Approve expense (status: approved)
5. Click "Post to GL" button
6. ✅ Journal entry created and posted to GL (status: posted)

**Features:**
- Approval workflow (pending → approved → posted)
- Only approved expenses can be posted
- Posted status badge
- Prevents duplicate posting

---

### 4. Sponsor Fee Allocation
**File:** `src/components/IncomeStatementByFund.tsx`

**Accounting Entries (creates TWO entries):**

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

**How to Use:**
1. Review monthly admin fee allocations
2. Adjust rate or allocated income if needed
3. Click "Confirm" for individual allocation
   - OR click "Confirm All" for batch processing
4. ✅ Two journal entries created (one per entity)

**Features:**
- Inter-entity accounting
- Adjustable fee rates and amounts
- Batch confirmation
- Tracks confirmation metadata

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

## Event-Based Architecture

All modules use the same event pattern:

```typescript
// Module creates journal entry
const journalEntry = createJournalEntryFromTransaction(
  'check-deposit', // or 'reimbursement', 'expense'
  transactionData,
  MOCK_ACCOUNTS
);

// Dispatch event
const event = new CustomEvent('journal-entries-created', {
  detail: { entries: [journalEntry] }
});
window.dispatchEvent(event);
```

**General Ledger listens:**
```typescript
useEffect(() => {
  const handleJournalEntriesCreated = (event: Event) => {
    const { entries } = (event as CustomEvent).detail;
    // Convert to ledger entries and display
  };
  
  window.addEventListener('journal-entries-created', handleJournalEntriesCreated);
  return () => window.removeEventListener('journal-entries-created', handleJournalEntriesCreated);
}, []);
```

---

## Testing the Integration

### Test 1: Check Deposit Flow
1. Navigate to Accounting Hub → Check Deposit
2. Upload a check image
3. Verify OCR data extraction
4. Select revenue account (e.g., 4000 - Donations)
5. Select nonprofit
6. Submit deposit
7. ✅ Check General Ledger for new entry
8. ✅ Verify debit to Cash (1000) and credit to Revenue

### Test 2: Reimbursement Flow
1. Navigate to Accounting Hub → Reimbursements
2. Capture receipt photo
3. Verify OCR data extraction
4. Select expense account (e.g., 5300 - Office Supplies)
5. Select nonprofit
6. Submit reimbursement
7. ✅ Check General Ledger for new entry
8. ✅ Verify debit to Expense and credit to Cash (1000)

### Test 3: Expense Approval Flow
1. Navigate to Accounting Hub → Expenses
2. Add new expense
3. Fill in details with expense account
4. Submit (pending status)
5. Approve expense
6. Click "Post to GL"
7. ✅ Check General Ledger for new entry
8. ✅ Verify posted status badge appears

### Test 4: Admin Fee Allocation
1. Navigate to Reports → Income Statement by Fund
2. Review admin fee allocations
3. Click "Confirm" on one allocation
4. ✅ Check General Ledger for TWO entries:
   - Nonprofit expense entry
   - InFocus revenue entry
5. ✅ Verify inter-entity balancing

### Test 5: End-to-End Verification
1. Create transactions in all 4 modules
2. Navigate to General Ledger
3. ✅ Verify all transactions appear
4. ✅ Verify running balances are correct
5. ✅ Filter by entity to see entity-specific entries
6. ✅ Export to verify data integrity

---

## Reconciliation Support

### Check Deposits
- All check deposits are marked as **unreconciled** by default
- Navigate to Reconciliation Manager to reconcile
- Match against bank statement
- Mark as reconciled when verified

### Other Transactions
- Reimbursements and expenses are not reconciled (no bank clearing)
- Admin fees are inter-entity (no external reconciliation needed)

---

## Audit Trail

Every journal entry includes:
- **created_by**: Who created the entry
- **created_at**: When it was created
- **posted_by**: Who posted it (usually "System")
- **posted_at**: When it was posted
- **source_type**: Where it came from (check-deposit, reimbursement, expense, manual)
- **source_id**: Link back to original transaction

---

## Data Flow Diagram

```
┌─────────────────────┐
│ Transaction Module  │
│ (Check/Reimb/Exp)   │
└──────────┬──────────┘
           │ Creates
           ▼
┌─────────────────────┐
│  Journal Entry      │
│  (Double-Entry)     │
└──────────┬──────────┘
           │ Dispatches Event
           ▼
┌─────────────────────┐
│  General Ledger     │
│  (Event Listener)   │
└──────────┬──────────┘
           │ Converts
           ▼
┌─────────────────────┐
│  Ledger Entries     │
│  (Display)          │
└──────────┬──────────┘
           │ Available for
           ▼
┌─────────────────────┐
│  Reconciliation &   │
│  Reporting          │
└─────────────────────┘
```

---

## Common Issues & Solutions

### Issue: Transaction not appearing in GL
**Solution:** Check browser console for errors. Verify the event is being dispatched.

### Issue: Debits don't equal credits
**Solution:** This shouldn't happen - the helper function ensures balance. If it does, check the transaction data.

### Issue: Wrong account selected
**Solution:** Edit the transaction before submitting. Once posted, would need a reversing entry.

### Issue: Duplicate entries
**Solution:** Each transaction creates a unique journal entry ID. Check source_id to identify duplicates.

### Issue: Can't reconcile check deposit
**Solution:** Ensure the check was submitted through Check Deposit Manager, not manually entered.

---

## Future Enhancements

Potential improvements for future development:

1. **Reversing Entries** - Add ability to reverse/void posted entries
2. **Edit Posted Entries** - Add correction entry workflow
3. **Batch Import** - Import multiple transactions from CSV
4. **Recurring Transactions** - Auto-create monthly admin fees
5. **Budget Tracking** - Compare expenses against budgets
6. **Multi-Currency** - Support for foreign currency transactions
7. **Attachment Storage** - Store receipt images with entries
8. **Email Notifications** - Notify on approvals/postings
9. **Advanced Reporting** - More financial reports
10. **API Integration** - Connect to external accounting systems

---

## Technical Reference

### Helper Functions
Located in `src/lib/journalEntryHelpers.ts`:

- `getAccountByCode(code, accounts)` - Find account by code
- `createJournalEntryFromTransaction(type, data, accounts)` - Create journal entry

### Interfaces
```typescript
interface Account {
  id: string;
  code: string;
  name: string;
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  full_name: string;
  is_active?: boolean;
}

interface JournalEntry {
  id: string;
  organization_id: string;
  entity_id: string;
  entry_number: string;
  entry_date: string;
  description: string;
  memo?: string;
  status: 'draft' | 'posted' | 'voided';
  source_type: 'check-deposit' | 'reimbursement' | 'expense' | 'manual';
  source_id: string | null;
  lines: JournalEntryLine[];
  // ... audit fields
}

interface JournalEntryLine {
  id: string;
  journal_entry_id: string;
  account: Account;
  line_number: number;
  description: string;
  memo?: string;
  debit_amount: number;
  credit_amount: number;
}
```

---

## Support

For questions or issues:
1. Check this guide first
2. Review `MIGRATION-PROGRESS.md` for implementation details
3. Review `TRANSACTION-MODULES-ANALYSIS.md` for architecture
4. Check browser console for errors
5. Verify event dispatching in Network/Console tabs

---

**Last Updated:** November 10, 2025  
**Version:** 1.0.0  
**Status:** Production Ready ✅
