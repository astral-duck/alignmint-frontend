# Accounting System Migration Plan

**Version:** 1.0  
**Created:** November 10, 2025  
**Status:**  Planning Phase  
**Target Completion:** TBD

---

## Executive Summary

This document outlines the step-by-step migration plan to transform the IFM MVP accounting system into a proper double-entry accounting system where ALL transactions flow through journal entries before appearing in the General Ledger.

### Critical Architecture Change

**Before:**
```
Transaction Source  Ledger Entry (direct)
```

**After:**
```
Transaction Source  Journal Entry  Ledger Entries (when posted)
```

### Why This Matters
-  Enforces double-entry accounting (debits always = credits)
-  Provides complete audit trail
-  Enables transaction voiding/reversing
-  Ensures data integrity
-  Supports proper financial reporting

---

## Migration Phases Overview

### Phase 1: Journal Entry Manager Refactor 
**Status:**  Not Started  
**Priority:** CRITICAL  
**Estimated Time:** 8-12 hours  
**Dependencies:** None

### Phase 2: Backend API Implementation 
**Status:**  Not Started  
**Priority:** CRITICAL  
**Estimated Time:** 16-24 hours  
**Dependencies:** Phase 1 (for interface definitions)

### Phase 3: Transaction Source Integration 
**Status:**  Not Started  
**Priority:** HIGH  
**Estimated Time:** 12-16 hours  
**Dependencies:** Phase 2

### Phase 4: General Ledger Updates 
**Status:**  Not Started  
**Priority:** HIGH  
**Estimated Time:** 6-8 hours  
**Dependencies:** Phase 2, Phase 3

### Phase 5: Testing & Validation 
**Status:**  Not Started  
**Priority:** CRITICAL  
**Estimated Time:** 8-12 hours  
**Dependencies:** All previous phases

**Total Estimated Time:** 50-72 hours

---

## Phase 1: Journal Entry Manager Refactor

**Goal:** Transform Journal Entry Manager to create proper journal entries (header + lines) instead of individual ledger entries.

### Step 1.1: Update TypeScript Interfaces 
**Status:**  Documented (needs implementation)  
**Time:** 1 hour

**Tasks:**
- [ ] Create new JournalEntry interface
- [ ] Create new JournalEntryLine interface  
- [ ] Update Account interface
- [ ] Remove old LedgerEntry interface from JournalEntryManager

**Verification:**
- [ ] TypeScript compiles without errors
- [ ] All interfaces match backend spec in 01-DATA-SCHEMA.md

---

### Step 1.2: Replace Hardcoded Categories with Chart of Accounts
**Status:**  Not Started  
**Time:** 2 hours

**Tasks:**
- [ ] Remove hardcoded categoryMap
- [ ] Add state for Chart of Accounts
- [ ] Add API call to fetch Chart of Accounts
- [ ] Update account selector in line items
- [ ] Store full Account object in lines (not just code)
- [ ] Add loading state while fetching accounts
- [ ] Add error handling for failed API calls

**Verification:**
- [ ] Accounts load from API (or mock data)
- [ ] Account selector shows all accounts
- [ ] Selected account is stored as object
- [ ] No hardcoded categories remain

---

### Step 1.3: Update Mock Data Structure
**Status:**  Not Started  
**Time:** 1 hour

**Tasks:**
- [ ] Replace mockJournalEntries: LedgerEntry[] with mockJournalEntries: JournalEntry[]
- [ ] Create mock journal entries with proper structure
- [ ] Include mix of draft, posted, and voided entries
- [ ] Ensure all entries have debits = credits

**Verification:**
- [ ] Mock data matches new interface
- [ ] All entries have at least 2 lines
- [ ] Debits equal credits for each entry

---

### Step 1.4: Update Table to Show Grouped Entries
**Status:**  Not Started  
**Time:** 3 hours

**Tasks:**
- [ ] Change table columns to: Entry Number, Date, Description, Entity, Line Count, Total Debits, Total Credits, Status, Actions
- [ ] Update table body to show one row per journal entry
- [ ] Add line count badge
- [ ] Calculate and display totals per entry
- [ ] Add status badge with color coding
- [ ] Update click handler to open entry detail view

**Verification:**
- [ ] Table shows one row per journal entry
- [ ] Line count is accurate
- [ ] Totals are calculated correctly
- [ ] Status badges display correctly

---

### Step 1.5: Add Entry Detail View
**Status:**  Not Started  
**Time:** 2 hours

**Tasks:**
- [ ] Create new Sheet/Modal for entry details
- [ ] Display entry header
- [ ] Display all lines in a table
- [ ] Display totals row
- [ ] Add action buttons based on status

**Verification:**
- [ ] Entry details display correctly
- [ ] All lines are visible
- [ ] Totals are accurate
- [ ] Action buttons appear based on status

---

### Step 1.6: Add Memo Fields
**Status:**  Not Started  
**Time:** 1 hour

**Tasks:**
- [ ] Add entry-level memo field to create dialog
- [ ] Add line-level memo field to each line
- [ ] Display memos in entry detail view
- [ ] Include memos in export

**Verification:**
- [ ] Entry memo saves correctly
- [ ] Line memos save correctly
- [ ] Memos display in detail view
- [ ] Memos export correctly

---

### Step 1.7: Implement Draft/Posted/Voided Status Workflow
**Status:**  Not Started  
**Time:** 3 hours

**Tasks:**
- [ ] Add status field to state
- [ ] Default new entries to 'draft' status
- [ ] Add "Post Entry" button
- [ ] Add "Void Entry" button with reason prompt
- [ ] Prevent editing posted/voided entries
- [ ] Prevent deleting posted/voided entries
- [ ] Add confirmation dialogs for post/void actions

**Verification:**
- [ ] New entries start as draft
- [ ] Post button works and updates status
- [ ] Void button works and prompts for reason
- [ ] Cannot edit posted/voided entries
- [ ] Cannot delete posted/voided entries

---

### Step 1.8: Update Export Functionality
**Status:**  Partial (dialog added, needs grouping)  
**Time:** 2 hours

**Tasks:**
- [ ] Update export to group by journal entry
- [ ] Add entry number column
- [ ] Show all lines per entry
- [ ] Add total row per entry
- [ ] Include memo fields

**Verification:**
- [ ] Export groups entries correctly
- [ ] All lines are included
- [ ] Totals are accurate
- [ ] Memos are included

---

### Step 1.9: Update Filters
**Status:**  Not Started  
**Time:** 1 hour

**Tasks:**
- [ ] Update status filter to use new values (All, Draft, Posted, Voided)
- [ ] Update search to search entry-level fields
- [ ] Ensure date filters work with new structure

**Verification:**
- [ ] Status filter works
- [ ] Search works
- [ ] Date filters work

---

### Step 1.10: Fix Sonner Import
**Status:**  Not Started  
**Time:** 5 minutes

**Tasks:**
- [ ] Change import { toast } from 'sonner@2.0.3'; to import { toast } from 'sonner';

**Verification:**
- [ ] No TypeScript errors
- [ ] Toast notifications still work

---

## Phase 2: Backend API Implementation

**Goal:** Implement backend API endpoints to support journal entry workflow.

### Step 2.1: Database Migrations
**Status:**  Not Started  
**Time:** 2 hours

**Tasks:**
- [ ] Create journal_entries table (if not exists)
- [ ] Create journal_entry_lines table (if not exists)
- [ ] Add journal_entry_id column to: donations, expenses, reimbursements, deposits, ledger_entries
- [ ] Add indexes for performance

**Verification:**
- [ ] All tables exist
- [ ] All foreign keys are in place
- [ ] All indexes are created
- [ ] Migration runs without errors

---

### Step 2.2: Create Journal Entry Endpoints
**Status:**  Not Started  
**Time:** 6 hours

**Tasks:**
- [ ] GET /api/v1/journal_entries - List with pagination
- [ ] GET /api/v1/journal_entries/:id - Get single entry with lines
- [ ] POST /api/v1/journal_entries - Create new (status: draft)
- [ ] PATCH /api/v1/journal_entries/:id - Update (draft only)
- [ ] DELETE /api/v1/journal_entries/:id - Delete (draft only)
- [ ] POST /api/v1/journal_entries/:id/post - Post entry, create ledger entries
- [ ] POST /api/v1/journal_entries/:id/void - Void entry, create reversing entry

**Verification:**
- [ ] All endpoints return correct data
- [ ] Validation works
- [ ] Posting creates ledger entries
- [ ] Voiding creates reversing entry

---

### Step 2.3: Implement Running Balance Calculation
**Status:**  Not Started  
**Time:** 4 hours

**Tasks:**
- [ ] Create recalculate_running_balances function
- [ ] Call on journal entry post
- [ ] Call on journal entry void
- [ ] Handle concurrent updates (database locking)

**Verification:**
- [ ] Running balances are accurate
- [ ] Concurrent updates don't corrupt data
- [ ] Performance is acceptable

---

### Step 2.4: Create Chart of Accounts Endpoint
**Status:**  Not Started  
**Time:** 2 hours

**Tasks:**
- [ ] GET /api/v1/chart_of_accounts - List all accounts for organization

**Verification:**
- [ ] Endpoint returns all accounts
- [ ] Filters work correctly

---

### Step 2.5: Add Audit Logging
**Status:**  Not Started  
**Time:** 2 hours

**Tasks:**
- [ ] Log journal entry creation
- [ ] Log journal entry updates
- [ ] Log journal entry posting
- [ ] Log journal entry voiding

**Verification:**
- [ ] All actions are logged
- [ ] Audit trail is complete

---

## Phase 3: Transaction Source Integration

**Goal:** Update all transaction sources to create journal entries.

### Step 3.1: Donations  Journal Entries
**Status:**  Not Started  
**Time:** 3 hours

**Tasks:**
- [ ] When donation completed, create journal entry with 2 lines (debit cash, credit revenue)
- [ ] Auto-post journal entry
- [ ] Link donation to journal entry

**Verification:**
- [ ] Donation creates journal entry
- [ ] Journal entry is auto-posted
- [ ] Ledger entries are created

---

### Step 3.2: Expenses  Journal Entries
**Status:**  Not Started  
**Time:** 3 hours

**Tasks:**
- [ ] When expense marked as 'paid', create journal entry
- [ ] Auto-post journal entry
- [ ] Link expense to journal entry

**Verification:**
- [ ] Expense creates journal entry when paid
- [ ] Links correctly

---

### Step 3.3: Reimbursements  Journal Entries
**Status:**  Not Started  
**Time:** 2 hours

**Tasks:**
- [ ] Same pattern as expenses

**Verification:**
- [ ] Reimbursement creates journal entry
- [ ] Links correctly

---

### Step 3.4: Check Deposits  Journal Entries
**Status:**  Not Started  
**Time:** 3 hours

**Tasks:**
- [ ] When deposit is finalized, create journal entry

**Verification:**
- [ ] Deposit creates journal entry
- [ ] Links correctly

---

## Phase 4: General Ledger Updates

### Step 4.1: Add Journal Entry Link Column
**Status:**  Not Started  
**Time:** 2 hours

**Tasks:**
- [ ] Add "View Journal Entry" button to each ledger entry
- [ ] Display journal entry detail modal

**Verification:**
- [ ] Link appears for all entries
- [ ] Shows all lines of journal entry

---

### Step 4.2: Add Grouping Option
**Status:**  Not Started  
**Time:** 3 hours

**Tasks:**
- [ ] Add toggle: "Group by Journal Entry"
- [ ] Show expandable rows

**Verification:**
- [ ] Grouping works
- [ ] Can expand/collapse groups

---

### Step 4.3: Add Source Transaction Link
**Status:**  Not Started  
**Time:** 2 hours

**Tasks:**
- [ ] From journal entry, link to source transaction

**Verification:**
- [ ] Links work for all source types

---

## Phase 5: Testing & Validation

### Step 5.1: Unit Tests
**Status:**  Not Started  
**Time:** 4 hours

**Tasks:**
- [ ] Test journal entry validation
- [ ] Test running balance calculation
- [ ] Test status transitions

**Verification:**
- [ ] All unit tests pass

---

### Step 5.2: Integration Tests
**Status:**  Not Started  
**Time:** 4 hours

**Tasks:**
- [ ] Test complete flows end-to-end

**Verification:**
- [ ] All integration tests pass

---

### Step 5.3: E2E Tests
**Status:**  Not Started  
**Time:** 4 hours

**Tasks:**
- [ ] Test user workflows

**Verification:**
- [ ] All E2E tests pass

---

## Success Criteria

- [ ]  All transactions create journal entries
- [ ]  Journal entries enforce debits = credits
- [ ]  Posting creates ledger entries
- [ ]  Running balances are accurate
- [ ]  Voiding creates reversing entries
- [ ]  Cannot edit posted entries
- [ ]  Complete audit trail exists
- [ ]  Reports pull from ledger entries
- [ ]  Drill-down works (Report  Ledger  Journal  Source)

---

## Progress Tracking

**Overall Progress: 5%** (Documentation Complete)

**Phase 1:**  0% (0/10 steps)  
**Phase 2:**  0% (0/5 steps)  
**Phase 3:**  0% (0/4 steps)  
**Phase 4:**  0% (0/3 steps)  
**Phase 5:**  0% (0/3 steps)

### Next Steps
1. Start Phase 1, Step 1.1: Update TypeScript Interfaces
2. Get approval on migration plan
3. Set target completion date

---

## Rollout Strategy (RECOMMENDED: Phased)

1. **Week 1:** Deploy backend API
2. **Week 2:** Deploy Journal Entry Manager refactor
3. **Week 3:** Deploy transaction source integrations
4. **Week 4:** Deploy General Ledger updates
5. **Week 5:** Testing and bug fixes

---

*Last Updated: November 10, 2025*
