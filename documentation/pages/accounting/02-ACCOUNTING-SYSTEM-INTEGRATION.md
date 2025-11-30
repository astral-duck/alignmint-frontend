# Accounting System Integration Guide

**Last Updated:** November 30, 2025  
**Audience:** Backend Developers (Ruby on Rails), Frontend Developers, QA  
**Status:** Authoritative Reference

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Core Accounting Principles](#core-accounting-principles)
3. [Data Flow Architecture](#data-flow-architecture)
4. [Module Integration Map](#module-integration-map)
5. [Journal Entry as Central Hub](#journal-entry-as-central-hub)
6. [Transaction Lifecycle](#transaction-lifecycle)
7. [Database Schema Requirements](#database-schema-requirements)
8. [API Integration Patterns](#api-integration-patterns)
9. [Fund Accounting](#fund-accounting)
10. [Reconciliation Flow](#reconciliation-flow)
11. [Audit Trail Requirements](#audit-trail-requirements)

---

## System Overview

The Alignmint accounting system implements **fund accounting** with **double-entry bookkeeping**. Every financial transaction ultimately flows through the **Journal Entry** system, which ensures balanced debits and credits before posting to the **General Ledger**.

### Key Components

| Component | Purpose | Creates Journal Entries? |
|-----------|---------|-------------------------|
| **Chart of Accounts** | Define account structure | No (reference data) |
| **Journal Entry Manager** | Manual adjustments, corrections | Yes (directly) |
| **General Ledger** | View all posted transactions | No (receives from JE) |
| **Expenses Manager** | Track organizational expenses | Yes (on payment) |
| **Reimbursements Manager** | Employee expense reimbursements | Yes (on payment) |
| **Check Deposit Manager** | Process check deposits | Yes (on finalization) |
| **Regular Deposit Manager** | Manual deposit entry | Yes (on submission) |
| **Distribution Manager** | Fiscal sponsor distributions | Yes (on payment) |
| **Reconciliation Manager** | Bank statement reconciliation | No (updates status only) |

---

## Core Accounting Principles

### Double-Entry Bookkeeping

Every transaction must have:
- **Equal debits and credits** (enforced at database level)
- **At least two line items** (one debit, one credit)
- **Valid account references** from Chart of Accounts

### Fund Accounting

Each transaction line can be attributed to a specific **Fund** (nonprofit/entity):
- Funds are the subsidiary nonprofits managed by the fiscal sponsor
- Fund attribution enables per-nonprofit reporting
- A single journal entry can span multiple funds

### Account Types

| Type | Normal Balance | Debit Effect | Credit Effect |
|------|---------------|--------------|---------------|
| Asset | Debit | Increase | Decrease |
| Liability | Credit | Decrease | Increase |
| Equity | Credit | Decrease | Increase |
| Revenue | Credit | Decrease | Increase |
| Expense | Debit | Increase | Decrease |

---

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SOURCE TRANSACTIONS                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   Expenses   │  │Reimbursements│  │   Deposits   │  │ Distributions│    │
│  │   Manager    │  │   Manager    │  │   Manager    │  │   Manager    │    │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘    │
│         │                 │                 │                 │             │
│         │ On Payment      │ On Payment      │ On Finalize     │ On Payment  │
│         ▼                 ▼                 ▼                 ▼             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                      │   │
│  │                    JOURNAL ENTRY MANAGER                             │   │
│  │                    (Central Transaction Hub)                         │   │
│  │                                                                      │   │
│  │   • Auto-generates entry number (JE-YYYY-NNN)                       │   │
│  │   • Validates debits = credits                                       │   │
│  │   • Links to source transaction                                      │   │
│  │   • Supports manual entries for adjustments                          │   │
│  │                                                                      │   │
│  └──────────────────────────────┬──────────────────────────────────────┘   │
│                                 │                                           │
│                                 │ On Post                                   │
│                                 ▼                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                      │   │
│  │                       GENERAL LEDGER                                 │   │
│  │                    (Posted Transactions)                             │   │
│  │                                                                      │   │
│  │   • One ledger entry per journal entry line                         │   │
│  │   • Running balance calculated per account                          │   │
│  │   • Reconciliation status tracked                                   │   │
│  │                                                                      │   │
│  └──────────────────────────────┬──────────────────────────────────────┘   │
│                                 │                                           │
│                                 ▼                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                   RECONCILIATION MANAGER                             │   │
│  │              (Match with Bank Statements)                            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Module Integration Map

### Expenses Manager → Journal Entry → General Ledger

**Trigger:** When expense is marked as "Paid"

**Journal Entry Created:**
```
Entry: "Expense Payment - [Vendor Name]"
Source Type: expense
Source ID: expense.id

Line 1 (Debit):
  Account: Expense account (e.g., 5300 Office Supplies)
  Fund: expense.fund_id
  Amount: expense.amount
  Description: expense.description

Line 2 (Credit):
  Account: Bank/Cash account (e.g., 1000 Checking)
  Fund: expense.fund_id  
  Amount: expense.amount
  Description: "Payment to [vendor_name]"
```

**Rails Implementation:**
```ruby
# app/services/expense_payment_service.rb
class ExpensePaymentService
  def call(expense, payment_params)
    ActiveRecord::Base.transaction do
      # 1. Update expense status
      expense.update!(
        status: 'paid',
        paid_at: Time.current,
        payment_method: payment_params[:payment_method]
      )
      
      # 2. Create journal entry
      journal_entry = JournalEntry.create!(
        organization_id: expense.organization_id,
        entry_date: Date.current,
        description: "Expense Payment - #{expense.vendor_name}",
        source_type: 'expense',
        source_id: expense.id,
        status: 'posted',
        created_by_id: Current.user.id,
        posted_by_id: Current.user.id,
        posted_at: Time.current
      )
      
      # 3. Create journal entry lines
      # Debit: Expense account
      journal_entry.lines.create!(
        account_id: expense.account_id,
        fund_id: expense.fund_id,
        debit: expense.amount,
        credit: 0,
        description: expense.description
      )
      
      # Credit: Bank account
      journal_entry.lines.create!(
        account_id: payment_params[:bank_account_id],
        fund_id: expense.fund_id,
        debit: 0,
        credit: expense.amount,
        description: "Payment to #{expense.vendor_name}"
      )
      
      # 4. Create ledger entries (triggered by JournalEntry callback)
      journal_entry
    end
  end
end
```

---

### Reimbursements Manager → Journal Entry → General Ledger

**Trigger:** When reimbursement is marked as "Paid"

**Journal Entry Created:**
```
Entry: "Reimbursement - [Requester Name]"
Source Type: reimbursement
Source ID: reimbursement.id

Line 1 (Debit):
  Account: Expense account (e.g., 5660 Meals)
  Fund: reimbursement.fund_id
  Amount: reimbursement.amount
  Description: reimbursement.description

Line 2 (Credit):
  Account: Bank/Cash account
  Fund: reimbursement.fund_id
  Amount: reimbursement.amount
  Description: "Reimbursement to [requester_name]"
```

---

### Check Deposit Manager → Journal Entry → General Ledger

**Trigger:** When deposit batch is finalized

**Journal Entry Created (one per batch):**
```
Entry: "Check Deposit - [Date]"
Source Type: check_deposit
Source ID: deposit_batch.id

For each check in batch:
  Line N (Debit):
    Account: Bank account (e.g., 1000 Checking)
    Fund: check.fund_id
    Amount: check.amount
    Description: "Check from [payer_name] #[check_number]"

  Line N+1 (Credit):
    Account: Income account (e.g., 4000 Donations)
    Fund: check.fund_id
    Amount: check.amount
    Description: "Donation from [payer_name]"
```

---

### Regular Deposit Manager → Journal Entry → General Ledger

**Trigger:** When deposit batch is submitted

**Journal Entry Created:**
```
Entry: "Deposit - [Date]"
Source Type: regular_deposit
Source ID: deposit_batch.id

For each deposit item:
  Line N (Debit):
    Account: Bank account
    Fund: deposit.fund_id
    Amount: deposit.amount
    Description: deposit.memo

  Line N+1 (Credit):
    Account: Income category account
    Fund: deposit.fund_id
    Amount: deposit.amount
    Description: "From [payer_name]"
```

---

### Distribution Manager → Journal Entry → General Ledger

**Trigger:** When distribution is marked as "Paid"

**Journal Entry Created:**
```
Entry: "Distribution to [Nonprofit Name]"
Source Type: distribution
Source ID: distribution.id

Line 1 (Debit):
  Account: Distribution Expense (or Liability reduction)
  Fund: fiscal_sponsor_fund_id
  Amount: distribution.amount
  Description: distribution.purpose

Line 2 (Credit):
  Account: Bank account
  Fund: fiscal_sponsor_fund_id
  Amount: distribution.amount
  Description: "Distribution to [nonprofit_name]"
```

---

## Journal Entry as Central Hub

### Entry Number Generation

Entry numbers are **auto-generated** and **immutable**:

```
Format: JE-YYYY-NNN
Example: JE-2025-001, JE-2025-002, ...

Rules:
- YYYY = Current year
- NNN = Sequential number, zero-padded to 3 digits
- Resets to 001 each year
- Never reused (even if entry is voided)
```

**Rails Implementation:**
```ruby
# app/models/journal_entry.rb
class JournalEntry < ApplicationRecord
  before_create :generate_entry_number
  
  private
  
  def generate_entry_number
    year = entry_date.year
    last_entry = JournalEntry
      .where(organization_id: organization_id)
      .where("entry_number LIKE ?", "JE-#{year}-%")
      .order(entry_number: :desc)
      .first
    
    if last_entry
      last_num = last_entry.entry_number.split('-').last.to_i
      self.entry_number = "JE-#{year}-#{(last_num + 1).to_s.rjust(3, '0')}"
    else
      self.entry_number = "JE-#{year}-001"
    end
  end
end
```

### Journal Entry Statuses

| Status | Description | Editable? | In GL? |
|--------|-------------|-----------|--------|
| `draft` | Not yet finalized | Yes | No |
| `posted` | Finalized, in GL | No | Yes |
| `voided` | Reversed | No | Yes (with reversal) |

### Posting a Journal Entry

When a journal entry is posted:

1. **Validate** debits = credits
2. **Update** status to 'posted'
3. **Create ledger entries** (one per line)
4. **Calculate running balances** for affected accounts
5. **Create audit log** entry

```ruby
# app/services/journal_entry_posting_service.rb
class JournalEntryPostingService
  def call(journal_entry)
    raise "Entry already posted" if journal_entry.posted?
    raise "Debits must equal credits" unless journal_entry.balanced?
    
    ActiveRecord::Base.transaction do
      journal_entry.update!(
        status: 'posted',
        posted_by_id: Current.user.id,
        posted_at: Time.current
      )
      
      journal_entry.lines.each do |line|
        LedgerEntry.create!(
          organization_id: journal_entry.organization_id,
          journal_entry_id: journal_entry.id,
          journal_entry_line_id: line.id,
          account_id: line.account_id,
          fund_id: line.fund_id,
          transaction_date: journal_entry.entry_date,
          description: line.description || journal_entry.description,
          debit: line.debit,
          credit: line.credit,
          reference_type: journal_entry.source_type,
          reference_id: journal_entry.source_id
        )
      end
      
      # Recalculate running balances
      RecalculateBalancesJob.perform_later(
        journal_entry.lines.pluck(:account_id).uniq
      )
    end
  end
end
```

### Voiding a Journal Entry

When voiding:

1. **Create reversing entry** (swap debits/credits)
2. **Mark original** as voided
3. **Link** reversing entry to original
4. **Post** reversing entry

```ruby
# app/services/journal_entry_void_service.rb
class JournalEntryVoidService
  def call(journal_entry, void_reason:)
    raise "Can only void posted entries" unless journal_entry.posted?
    
    ActiveRecord::Base.transaction do
      # Create reversing entry
      reversing_entry = JournalEntry.create!(
        organization_id: journal_entry.organization_id,
        entry_date: Date.current,
        description: "VOID: #{journal_entry.description}",
        memo: "Reversal of #{journal_entry.entry_number}",
        source_type: 'void_reversal',
        source_id: journal_entry.id,
        status: 'posted',
        created_by_id: Current.user.id,
        posted_by_id: Current.user.id,
        posted_at: Time.current
      )
      
      # Create reversed lines (swap debit/credit)
      journal_entry.lines.each do |line|
        reversing_entry.lines.create!(
          account_id: line.account_id,
          fund_id: line.fund_id,
          debit: line.credit,  # Swapped
          credit: line.debit,  # Swapped
          description: "Reversal: #{line.description}"
        )
      end
      
      # Mark original as voided
      journal_entry.update!(
        status: 'voided',
        voided_by_id: Current.user.id,
        voided_at: Time.current,
        void_reason: void_reason,
        reversing_entry_id: reversing_entry.id
      )
      
      # Create ledger entries for reversing entry
      JournalEntryPostingService.new.create_ledger_entries(reversing_entry)
    end
  end
end
```

---

## Transaction Lifecycle

### Expense Lifecycle

```
┌─────────┐    ┌──────────┐    ┌──────────┐    ┌────────┐
│ Created │───▶│ Pending  │───▶│ Approved │───▶│  Paid  │
└─────────┘    └──────────┘    └──────────┘    └────────┘
                    │                               │
                    ▼                               ▼
               ┌──────────┐                 Creates Journal
               │ Rejected │                    Entry
               └──────────┘
```

### Reimbursement Lifecycle

```
┌───────────┐    ┌─────────┐    ┌──────────┐    ┌────────┐
│ Submitted │───▶│ Pending │───▶│ Approved │───▶│  Paid  │
└───────────┘    └─────────┘    └──────────┘    └────────┘
                      │                              │
                      ▼                              ▼
                 ┌──────────┐                Creates Journal
                 │ Rejected │                   Entry
                 └──────────┘
```

### Deposit Lifecycle

```
┌──────────┐    ┌──────────┐    ┌───────────┐
│ Captured │───▶│ Reviewed │───▶│ Finalized │
└──────────┘    └──────────┘    └───────────┘
                                      │
                                      ▼
                              Creates Journal
                                 Entry
```

### Journal Entry Lifecycle

```
┌─────────┐    ┌────────┐    ┌────────────────┐
│  Draft  │───▶│ Posted │───▶│ Voided (opt.)  │
└─────────┘    └────────┘    └────────────────┘
     │              │                │
     │              ▼                ▼
     │       Creates Ledger   Creates Reversing
     │          Entries           Entry
     ▼
  Editable
```

---

## Database Schema Requirements

### Updated Journal Entries Table

```sql
-- Journal Entries (header)
CREATE TABLE journal_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    entity_id UUID REFERENCES organizations(id),  -- Primary fund/nonprofit
    entry_number VARCHAR(50) NOT NULL,
    entry_date DATE NOT NULL,
    description TEXT NOT NULL,
    memo TEXT,
    status VARCHAR(50) DEFAULT 'draft',  -- 'draft', 'posted', 'voided'
    source_type VARCHAR(50),  -- 'manual', 'expense', 'reimbursement', 'deposit', 'distribution', 'void_reversal'
    source_id UUID,  -- Reference to source transaction
    created_by_id UUID NOT NULL REFERENCES users(id),
    posted_by_id UUID REFERENCES users(id),
    posted_at TIMESTAMP,
    voided_by_id UUID REFERENCES users(id),
    voided_at TIMESTAMP,
    void_reason TEXT,
    reversing_entry_id UUID REFERENCES journal_entries(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(organization_id, entry_number)
);

CREATE INDEX idx_journal_entries_org ON journal_entries(organization_id);
CREATE INDEX idx_journal_entries_entity ON journal_entries(entity_id);
CREATE INDEX idx_journal_entries_date ON journal_entries(entry_date);
CREATE INDEX idx_journal_entries_status ON journal_entries(status);
CREATE INDEX idx_journal_entries_source ON journal_entries(source_type, source_id);
CREATE INDEX idx_journal_entries_number ON journal_entries(entry_number);
```

### Updated Journal Entry Lines Table

```sql
-- Journal Entry Lines (detail)
CREATE TABLE journal_entry_lines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    journal_entry_id UUID NOT NULL REFERENCES journal_entries(id) ON DELETE CASCADE,
    account_id UUID NOT NULL REFERENCES accounts(id),
    fund_id UUID REFERENCES organizations(id),  -- Fund attribution per line
    line_number INTEGER NOT NULL,
    description TEXT,
    memo TEXT,
    debit DECIMAL(12,2) DEFAULT 0 CHECK (debit >= 0),
    credit DECIMAL(12,2) DEFAULT 0 CHECK (credit >= 0),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT check_debit_or_credit CHECK (
        (debit > 0 AND credit = 0) OR (debit = 0 AND credit > 0) OR (debit = 0 AND credit = 0)
    )
);

CREATE INDEX idx_je_lines_entry ON journal_entry_lines(journal_entry_id);
CREATE INDEX idx_je_lines_account ON journal_entry_lines(account_id);
CREATE INDEX idx_je_lines_fund ON journal_entry_lines(fund_id);
```

### Updated Ledger Entries Table

```sql
-- Ledger Entries (General Ledger)
CREATE TABLE ledger_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    journal_entry_id UUID NOT NULL REFERENCES journal_entries(id),
    journal_entry_line_id UUID NOT NULL REFERENCES journal_entry_lines(id),
    account_id UUID NOT NULL REFERENCES accounts(id),
    fund_id UUID REFERENCES organizations(id),
    transaction_date DATE NOT NULL,
    description TEXT NOT NULL,
    memo TEXT,
    debit DECIMAL(12,2) DEFAULT 0,
    credit DECIMAL(12,2) DEFAULT 0,
    running_balance DECIMAL(12,2),  -- Calculated by backend
    reference_type VARCHAR(100),  -- Source type for drill-down
    reference_id UUID,  -- Source ID for drill-down
    is_reconciled BOOLEAN DEFAULT false,
    reconciled_at TIMESTAMP,
    reconciled_by_id UUID REFERENCES users(id),
    reconciliation_id UUID REFERENCES reconciliations(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ledger_org ON ledger_entries(organization_id);
CREATE INDEX idx_ledger_journal ON ledger_entries(journal_entry_id);
CREATE INDEX idx_ledger_account ON ledger_entries(account_id);
CREATE INDEX idx_ledger_fund ON ledger_entries(fund_id);
CREATE INDEX idx_ledger_date ON ledger_entries(transaction_date);
CREATE INDEX idx_ledger_reconciled ON ledger_entries(is_reconciled);
CREATE INDEX idx_ledger_reference ON ledger_entries(reference_type, reference_id);
```

### Updated Expenses Table

```sql
-- Add journal_entry_id to expenses
ALTER TABLE expenses ADD COLUMN journal_entry_id UUID REFERENCES journal_entries(id);
ALTER TABLE expenses ADD COLUMN fund_id UUID REFERENCES organizations(id);

CREATE INDEX idx_expenses_journal ON expenses(journal_entry_id);
CREATE INDEX idx_expenses_fund ON expenses(fund_id);
```

### Updated Reimbursements Table

```sql
-- Add journal_entry_id to reimbursements
ALTER TABLE reimbursements ADD COLUMN journal_entry_id UUID REFERENCES journal_entries(id);
ALTER TABLE reimbursements ADD COLUMN fund_id UUID REFERENCES organizations(id);
ALTER TABLE reimbursements ADD COLUMN account_id UUID REFERENCES accounts(id);

CREATE INDEX idx_reimbursements_journal ON reimbursements(journal_entry_id);
CREATE INDEX idx_reimbursements_fund ON reimbursements(fund_id);
CREATE INDEX idx_reimbursements_account ON reimbursements(account_id);
```

### New Deposits Table

```sql
-- Deposit Batches
CREATE TABLE deposit_batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    deposit_type VARCHAR(50) NOT NULL,  -- 'check', 'regular'
    deposit_date DATE NOT NULL,
    bank_account_id UUID NOT NULL REFERENCES bank_accounts(id),
    total_amount DECIMAL(12,2) NOT NULL,
    item_count INTEGER NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',  -- 'pending', 'finalized'
    journal_entry_id UUID REFERENCES journal_entries(id),
    finalized_by_id UUID REFERENCES users(id),
    finalized_at TIMESTAMP,
    created_by_id UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Deposit Items (individual checks or deposits)
CREATE TABLE deposit_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    deposit_batch_id UUID NOT NULL REFERENCES deposit_batches(id) ON DELETE CASCADE,
    fund_id UUID REFERENCES organizations(id),
    payer_name VARCHAR(255) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    check_number VARCHAR(50),  -- For check deposits
    income_account_id UUID NOT NULL REFERENCES accounts(id),
    memo TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_deposit_batches_org ON deposit_batches(organization_id);
CREATE INDEX idx_deposit_batches_status ON deposit_batches(status);
CREATE INDEX idx_deposit_items_batch ON deposit_items(deposit_batch_id);
CREATE INDEX idx_deposit_items_fund ON deposit_items(fund_id);
```

---

## API Integration Patterns

### Creating Transactions with Journal Entries

All transaction creation endpoints that affect the GL should:

1. **Accept fund_id** for fund attribution
2. **Create journal entry** when appropriate status is reached
3. **Return journal_entry_id** in response
4. **Support drill-down** from GL to source

### Example: Mark Expense as Paid

**Request:**
```json
POST /api/v1/expenses/:id/mark_paid
{
  "payment_method": "check",
  "check_number": "1234",
  "bank_account_id": "uuid-of-bank-account"
}
```

**Response:**
```json
{
  "data": {
    "id": "expense-uuid",
    "status": "paid",
    "paid_at": "2025-11-30T12:00:00Z",
    "journal_entry_id": "je-uuid",
    "journal_entry_number": "JE-2025-042"
  },
  "message": "Expense marked as paid"
}
```

---

## Fund Accounting

### Fund Attribution

Every journal entry line can have a `fund_id` that attributes the transaction to a specific nonprofit:

```typescript
interface JournalEntryLine {
  id: string;
  journal_entry_id: string;
  account_id: string;
  fund_id?: string;        // Which nonprofit this line belongs to
  line_number: number;
  description: string;
  debit: number;
  credit: number;
}
```

### Multi-Fund Entries

A single journal entry can span multiple funds:

```
JE-2025-001: "Shared Office Expense Allocation"

Line 1: Debit $300 to 5500-Rent, Fund: Nonprofit-A
Line 2: Debit $200 to 5500-Rent, Fund: Nonprofit-B  
Line 3: Credit $500 from 1000-Checking, Fund: Fiscal-Sponsor
```

### Fund Reporting

The General Ledger supports filtering by fund to generate per-nonprofit reports:

```
GET /api/v1/general_ledger/entries?fund_id=nonprofit-a-uuid
```

---

## Reconciliation Flow

### How Reconciliation Works

1. **Upload bank statement** or enter statement balance
2. **Match transactions** (auto or manual)
3. **Mark ledger entries** as reconciled
4. **Complete reconciliation** when balanced

### Reconciliation Does NOT Create Journal Entries

Reconciliation only updates the `is_reconciled` flag on existing ledger entries:

```ruby
# When marking a transaction as reconciled
ledger_entry.update!(
  is_reconciled: true,
  reconciled_at: Time.current,
  reconciled_by_id: Current.user.id,
  reconciliation_id: reconciliation.id
)
```

### Reconciliation Status in GL

The General Ledger displays reconciliation status:
- ✅ Reconciled (green checkmark)
- ⬜ Unreconciled (empty)

---

## Audit Trail Requirements

### What to Log

| Event | Data to Capture |
|-------|-----------------|
| Journal Entry Created | entry_id, user_id, source_type, source_id |
| Journal Entry Posted | entry_id, user_id, timestamp |
| Journal Entry Voided | entry_id, user_id, void_reason, reversing_entry_id |
| Expense Paid | expense_id, journal_entry_id, user_id |
| Reimbursement Paid | reimbursement_id, journal_entry_id, user_id |
| Deposit Finalized | deposit_batch_id, journal_entry_id, user_id |
| Transaction Reconciled | ledger_entry_id, reconciliation_id, user_id |

### Audit Log Table

```sql
-- Already exists, ensure these fields are populated
INSERT INTO audit_logs (
    user_id,
    organization_id,
    action,
    resource_type,
    resource_id,
    changes,
    ip_address,
    created_at
) VALUES (
    'user-uuid',
    'org-uuid',
    'post',
    'journal_entry',
    'je-uuid',
    '{"status": ["draft", "posted"]}',
    '192.168.1.1',
    NOW()
);
```

---

## Related Documentation

- [03-CHART-OF-ACCOUNTS.md](./03-CHART-OF-ACCOUNTS.md) - Account structure
- [04-GENERAL-LEDGER.md](./04-GENERAL-LEDGER.md) - Ledger display and filtering
- [05-JOURNAL-ENTRY-MANAGER.md](./05-JOURNAL-ENTRY-MANAGER.md) - Manual entries
- [06-EXPENSES-MANAGER.md](./06-EXPENSES-MANAGER.md) - Expense tracking
- [07-REIMBURSEMENTS-MANAGER.md](./07-REIMBURSEMENTS-MANAGER.md) - Reimbursements
- [08-CHECK-DEPOSIT-MANAGER.md](./08-CHECK-DEPOSIT-MANAGER.md) - Check deposits
- [09-RECONCILIATION-MANAGER.md](./09-RECONCILIATION-MANAGER.md) - Bank reconciliation
- [10-REGULAR-DEPOSIT-MANAGER.md](./10-REGULAR-DEPOSIT-MANAGER.md) - Manual deposits
- [11-DISTRIBUTION-MANAGER.md](./11-DISTRIBUTION-MANAGER.md) - Fiscal sponsor distributions
