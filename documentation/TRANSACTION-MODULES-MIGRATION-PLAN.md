# Transaction Modules Migration Plan

**Date:** November 10, 2025  
**Goal:** Integrate Check Deposits, Reimbursements, and Expenses with General Ledger  
**Estimated Time:** 9 hours  
**Dependencies:** Journal Entry Manager (complete), General Ledger (complete)

## Overview

This plan outlines the step-by-step process to properly integrate the three transaction modules with the General Ledger system, following the same pattern as the Journal Entry Manager.

**Reference:** See `TRANSACTION-MODULES-ANALYSIS.md` for detailed analysis.

---

## Phase 1: Shared Infrastructure (1.5 hours)

### Step 1.1: Create Shared Types & Utilities
**File:** `src/lib/journalEntryHelpers.ts` (NEW)

**Create:**
```typescript
import { Account, JournalEntry, JournalEntryLine } from '../types';

// Helper to get account by code
export const getAccountByCode = (code: string, accounts: Account[]): Account => {
  const account = accounts.find(a => a.code === code);
  if (!account) throw new Error(`Account ${code} not found`);
  return account;
};

// Helper to create journal entry from transaction
export const createJournalEntryFromTransaction = (
  type: 'check-deposit' | 'reimbursement' | 'expense',
  data: any,
  accounts: Account[]
): JournalEntry => {
  const lines: JournalEntryLine[] = [];
  const entryId = `je-${type}-${Date.now()}`;
  
  switch (type) {
    case 'check-deposit':
      // Debit: Cash
      lines.push({
        id: `${entryId}-line-1`,
        journal_entry_id: entryId,
        account: getAccountByCode('1000', accounts),
        line_number: 1,
        description: `Check deposit - ${data.payerName}`,
        memo: data.memo || '',
        debit_amount: data.amount,
        credit_amount: 0,
      });
      // Credit: Revenue
      lines.push({
        id: `${entryId}-line-2`,
        journal_entry_id: entryId,
        account: data.account,
        line_number: 2,
        description: `Check deposit - ${data.payerName}`,
        memo: data.memo || '',
        debit_amount: 0,
        credit_amount: data.amount,
      });
      break;
      
    case 'reimbursement':
    case 'expense':
      // Debit: Expense
      lines.push({
        id: `${entryId}-line-1`,
        journal_entry_id: entryId,
        account: data.account,
        line_number: 1,
        description: `${data.vendor} - ${data.description}`,
        memo: data.notes || '',
        debit_amount: data.amount,
        credit_amount: 0,
      });
      // Credit: Cash
      lines.push({
        id: `${entryId}-line-2`,
        journal_entry_id: entryId,
        account: getAccountByCode('1000', accounts),
        line_number: 2,
        description: `${data.vendor} - ${data.description}`,
        memo: data.notes || '',
        debit_amount: 0,
        credit_amount: data.amount,
      });
      break;
  }
  
  return {
    id: entryId,
    organization_id: 'org-1',
    entity_id: data.entityId,
    entry_number: `${type.toUpperCase()}-${Date.now()}`,
    entry_date: data.date,
    description: `${type} - ${data.vendor || data.payerName}`,
    memo: data.memo || data.notes || '',
    status: 'posted',
    source_type: type,
    source_id: data.id,
    created_by: 'Current User',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    posted_at: new Date().toISOString(),
    posted_by: 'System',
    lines,
  };
};
```

**Commit:** "feat: Add journal entry helper utilities"

---

### Step 1.2: Update General Ledger Event Listener
**File:** `src/components/GeneralLedger.tsx`

**Add after existing reconciliation listener:**
```typescript
// Listen for journal entries created from transaction modules
useEffect(() => {
  const handleJournalEntriesCreated = (event: Event) => {
    const customEvent = event as CustomEvent;
    const { entries } = customEvent.detail;
    
    // Convert journal entries to ledger entries
    const newLedgerEntries: LedgerEntry[] = entries.flatMap((entry: JournalEntry) =>
      entry.lines.map(line => ({
        id: `${entry.id}-${line.id}`,
        date: entry.entry_date,
        account: line.account,
        entityId: entry.entity_id,
        transactionType: entry.source_type === 'check-deposit' ? 'check' : 'payment',
        referenceNumber: entry.entry_number,
        description: line.description,
        memo: line.memo,
        debit: line.debit_amount,
        credit: line.credit_amount,
        runningBalance: 0, // Will be recalculated
        reconciled: false,
        source: entry.source_type,
      }))
    );
    
    setTransactions(prev => [...newLedgerEntries, ...prev]);
    
    const count = entries.length;
    toast.success(`${count} transaction${count > 1 ? 's' : ''} posted to General Ledger`);
  };
  
  window.addEventListener('journal-entries-created', handleJournalEntriesCreated);
  return () => window.removeEventListener('journal-entries-created', handleJournalEntriesCreated);
}, []);
```

**Commit:** "feat: Add GL listener for transaction module journal entries"

---

## Phase 2: Check Deposit Manager (2.5 hours)

### Step 2.1: Update CheckData Interface
**File:** `src/components/CheckDepositManager.tsx`

**Replace interface:**
```typescript
interface CheckData {
  id: string;
  image: string;
  payerName: string;
  checkNumber: string;
  amount: number;              // Changed from string
  date: string;
  account: Account;            // Changed from category string
  memo: string;
  bankName: string;
  entityId: string;
  // New fields
  batchId?: string;
  journalEntryId?: string;
  reconciled: boolean;
  depositedBy: string;
  depositedAt: string;
}
```

**Commit:** "refactor: Update CheckData interface for GL integration"

---

### Step 2.2: Import MOCK_ACCOUNTS
**File:** `src/components/CheckDepositManager.tsx`

**Add after imports:**
```typescript
import { createJournalEntryFromTransaction } from '../lib/journalEntryHelpers';

// Import from JournalEntryManager or create shared
const MOCK_ACCOUNTS: Account[] = [
  // Copy from JournalEntryManager.tsx
];
```

**Update category selector to account selector** (similar to Journal Entry Manager)

**Commit:** "feat: Add Chart of Accounts to Check Deposit Manager"

---

### Step 2.3: Update handleSubmitDeposit
**File:** `src/components/CheckDepositManager.tsx`

**Replace:**
```typescript
const handleSubmitDeposit = () => {
  if (checks.length === 0) {
    toast.error('No checks to deposit');
    return;
  }

  const checksWithoutEntity = checks.filter(c => !c.entityId);
  if (checksWithoutEntity.length > 0) {
    toast.error('All checks must have a nonprofit assigned');
    return;
  }

  // Create batch ID
  const batchId = `batch-${Date.now()}`;
  
  // Create journal entries for each check
  const journalEntries = checks.map(check => 
    createJournalEntryFromTransaction('check-deposit', {
      ...check,
      batchId,
      depositedBy: 'Current User',
      depositedAt: new Date().toISOString(),
    }, MOCK_ACCOUNTS)
  );
  
  // Dispatch event to update General Ledger
  const event = new CustomEvent('journal-entries-created', {
    detail: { entries: journalEntries }
  });
  window.dispatchEvent(event);
  
  const totalAmount = checks.reduce((sum, c) => sum + c.amount, 0);
  toast.success(`${checks.length} check(s) deposited - $${totalAmount.toFixed(2)} posted to General Ledger`);
  
  // Reset form
  setChecks([]);
  setCurrentCheck(null);
  setStep('capture');
  setFormData({
    entityId: selectedEntity === 'all' ? '' : selectedEntity,
  });
};
```

**Commit:** "feat: Integrate Check Deposit with General Ledger"

---

## Phase 3: Reimbursements Manager (2.5 hours)

### Step 3.1: Update ReceiptData Interface
**File:** `src/components/ReimbursementsManager.tsx`

**Replace interface:**
```typescript
interface ReceiptData {
  id: string;
  image: string;
  vendor: string;
  amount: number;              // Changed from string
  date: string;
  account: Account;            // Changed from category string
  description: string;
  entityId: string;            // Now required
  // New fields
  requestId: string;
  journalEntryId?: string;
  status: 'pending' | 'approved' | 'paid';
  approvedBy?: string;
  approvedAt?: string;
  paidBy?: string;
  paidAt?: string;
  paymentMethod?: string;
}
```

**Commit:** "refactor: Update ReceiptData interface for GL integration"

---

### Step 3.2: Add Chart of Accounts
**File:** `src/components/ReimbursementsManager.tsx`

**Same as Check Deposit Manager - import MOCK_ACCOUNTS and update category selector**

**Commit:** "feat: Add Chart of Accounts to Reimbursements Manager"

---

### Step 3.3: Update handleSubmitReimbursement
**File:** `src/components/ReimbursementsManager.tsx`

**Replace:**
```typescript
const handleSubmitReimbursement = () => {
  if (receipts.length === 0) {
    toast.error('No receipts to submit');
    return;
  }

  if (!formData.entityId) {
    toast.error('Please select a nonprofit');
    return;
  }

  // Create request ID
  const requestId = `reimb-${Date.now()}`;
  
  // Create journal entries for each receipt
  const journalEntries = receipts.map(receipt => 
    createJournalEntryFromTransaction('reimbursement', {
      ...receipt,
      entityId: formData.entityId,
      requestId,
    }, MOCK_ACCOUNTS)
  );
  
  // Dispatch event to update General Ledger
  const event = new CustomEvent('journal-entries-created', {
    detail: { entries: journalEntries }
  });
  window.dispatchEvent(event);
  
  const totalAmount = receipts.reduce((sum, r) => sum + r.amount, 0);
  toast.success(`Reimbursement posted - $${totalAmount.toFixed(2)} to General Ledger`);
  
  // Reset form
  setReceipts([]);
  setCurrentReceipt(null);
  setStep('capture');
  setFormData({
    entityId: selectedEntity === 'all' ? '' : selectedEntity,
  });
};
```

**Commit:** "feat: Integrate Reimbursements with General Ledger"

---

## Phase 4: Expenses Manager (2.5 hours)

### Step 4.1: Update ManualExpense Interface
**File:** `src/components/ExpensesManager.tsx`

**Replace interface:**
```typescript
interface ManualExpense {
  id: string;
  date: string;
  vendor: string;
  description: string;
  amount: number;
  account: Account;            // Changed from category string
  entityId: string;            // Now required
  notes?: string;
  status: 'pending' | 'approved' | 'posted';
  submittedBy: string;
  submittedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  // New fields
  journalEntryId?: string;
  postedBy?: string;
  postedAt?: string;
  attachments?: string[];
  paymentMethod?: string;
}
```

**Commit:** "refactor: Update ManualExpense interface for GL integration"

---

### Step 4.2: Add Chart of Accounts
**File:** `src/components/ExpensesManager.tsx`

**Same as other modules - import MOCK_ACCOUNTS and update category selector**

**Commit:** "feat: Add Chart of Accounts to Expenses Manager"

---

### Step 4.3: Add Post to GL Handler
**File:** `src/components/ExpensesManager.tsx`

**Add new handler:**
```typescript
const handlePostToGL = (expense: ManualExpense) => {
  if (expense.status !== 'approved') {
    toast.error('Only approved expenses can be posted to GL');
    return;
  }

  // Create journal entry
  const journalEntry = createJournalEntryFromTransaction('expense', expense, MOCK_ACCOUNTS);
  
  // Dispatch event to update General Ledger
  const event = new CustomEvent('journal-entries-created', {
    detail: { entries: [journalEntry] }
  });
  window.dispatchEvent(event);
  
  // Update expense status
  setExpenses(prev => prev.map(e => 
    e.id === expense.id 
      ? { 
          ...e, 
          status: 'posted',
          journalEntryId: journalEntry.id,
          postedBy: 'Current User',
          postedAt: new Date().toISOString(),
        }
      : e
  ));
  
  toast.success(`Expense posted to General Ledger - $${expense.amount.toFixed(2)}`);
};
```

**Add button to table:**
```typescript
{expense.status === 'approved' && (
  <Button 
    size="sm" 
    onClick={() => handlePostToGL(expense)}
    className="gap-2"
  >
    <CheckCircle className="h-4 w-4" />
    Post to GL
  </Button>
)}
```

**Commit:** "feat: Add Post to GL functionality for Expenses"

---

## Phase 5: Sponsor Fee Allocation (2 hours)

### Overview
**File:** `src/components/IncomeStatementByFund.tsx`  
**Current Name:** `SponsorFeeAllocation`  
**Purpose:** Allocate admin fees from sponsored nonprofits to InFocus

### Current Behavior
```typescript
handleConfirm(entityId) {
  // Just marks as confirmed
  toast.success('Admin fee allocation confirmed');
  // ❌ NO JOURNAL ENTRY CREATED
}
```

### Required Accounting Logic
When admin fee is confirmed:
```
For each nonprofit:
  Debit:  5900 - Admin Fee Expense (nonprofit's books)  $XXX.XX
  Credit: 2200 - Due to InFocus (liability)            $XXX.XX

For InFocus:
  Debit:  1300 - Due from Nonprofits (asset)           $XXX.XX
  Credit: 4900 - Admin Fee Revenue                     $XXX.XX
```

### Implementation Steps

#### Step 5.1: Update FundAllocation Interface
```typescript
interface FundAllocation {
  entityId: string;
  entityName: string;
  totalIncome: number;
  allocatedIncome: number;
  adminFeeRate: number;
  adminFeeAmount: number;
  confirmed: boolean;
  // New fields
  journalEntryId?: string;  // Link to created journal entry
  confirmedBy?: string;
  confirmedAt?: string;
}
```

#### Step 5.2: Update handleConfirm
```typescript
const handleConfirm = (entityId: string) => {
  const allocation = allocations.find(a => a.entityId === entityId);
  if (!allocation) return;

  // Create journal entry for the nonprofit
  const nonprofitEntry = createJournalEntryFromTransaction('admin-fee', {
    entityId: allocation.entityId,
    amount: allocation.adminFeeAmount,
    date: `${month}-01`, // First of the month
    description: `Admin fee allocation - ${allocation.entityName}`,
    account: getAccountByCode('5900', MOCK_ACCOUNTS), // Admin Fee Expense
  }, MOCK_ACCOUNTS);

  // Create journal entry for InFocus
  const infocusEntry = createJournalEntryFromTransaction('admin-fee-revenue', {
    entityId: 'infocus',
    amount: allocation.adminFeeAmount,
    date: `${month}-01`,
    description: `Admin fee revenue - ${allocation.entityName}`,
    account: getAccountByCode('4900', MOCK_ACCOUNTS), // Admin Fee Revenue
  }, MOCK_ACCOUNTS);

  // Dispatch events
  const event = new CustomEvent('journal-entries-created', {
    detail: { entries: [nonprofitEntry, infocusEntry] }
  });
  window.dispatchEvent(event);

  // Update allocation
  setAllocations(prev =>
    prev.map(alloc =>
      alloc.entityId === entityId 
        ? { 
            ...alloc, 
            confirmed: true,
            journalEntryId: nonprofitEntry.id,
            confirmedBy: 'Current User',
            confirmedAt: new Date().toISOString(),
          } 
        : alloc
    )
  );

  toast.success(`Admin fee posted to General Ledger - $${allocation.adminFeeAmount.toFixed(2)}`);
};
```

#### Step 5.3: Update handleConfirmAll
Same logic but for all unconfirmed allocations.

#### Step 5.4: Add Unconfirm with Reversal
When unconfirming, create reversing journal entries.

**Commit:** "feat: Integrate Sponsor Fee Allocation with General Ledger"

---

## Phase 6: Testing & Validation (1 hour)

### Step 5.1: Test Check Deposits
1. Deposit a check
2. Verify journal entry created
3. Check General Ledger shows transaction
4. Verify unreconciled status
5. Test reconciliation

### Step 5.2: Test Reimbursements
1. Submit reimbursement
2. Verify journal entry created
3. Check General Ledger shows transaction
4. Verify proper accounts used

### Step 5.3: Test Expenses
1. Create expense
2. Approve expense
3. Post to GL
4. Verify journal entry created
5. Check General Ledger shows transaction

### Step 5.4: End-to-End Test
1. Create transactions in all three modules
2. Verify all appear in General Ledger
3. Verify running balances correct
4. Test filtering and search
5. Test export

**Commit:** "test: Verify transaction modules GL integration"

---

## Phase 6: Documentation (1 hour)

### Step 6.1: Update Module Documentation
- Update Check Deposit Manager docs
- Update Reimbursements Manager docs
- Update Expenses Manager docs
- Add integration notes

### Step 6.2: Delete Migration Docs
- Delete `TRANSACTION-MODULES-ANALYSIS.md`
- Delete `TRANSACTION-MODULES-MIGRATION-PLAN.md`

**Commit:** "docs: Update transaction modules documentation"

---

## Success Criteria

- ✅ All three modules create journal entries
- ✅ Transactions appear in General Ledger immediately
- ✅ Proper double-entry accounting (debits = credits)
- ✅ Chart of Accounts integration
- ✅ Reconciliation support for check deposits
- ✅ Audit trail (who, when, what)
- ✅ No TypeScript errors
- ✅ All tests passing

---

## Rollback Plan

If issues arise:
1. Revert commits in reverse order
2. Restore original toast-only behavior
3. Document issues encountered
4. Revise plan and retry

---

## Notes

- Follow the same pattern as Journal Entry Manager
- Use event-based communication (no prop drilling)
- Keep changes incremental and testable
- Commit after each step
- Test thoroughly before moving to next phase
