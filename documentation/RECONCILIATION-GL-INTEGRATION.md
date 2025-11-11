# Reconciliation & General Ledger Integration Plan

## Overview
This document outlines the integration between the Reconciliation Manager and General Ledger to ensure reconciliation status flows properly through the system.

## Current State

### General Ledger
- ✅ Displays `reconciled` status (Reconciled/Pending badges)
- ✅ Shows orange flag for unreconciled check deposits
- ✅ Filters by reconciliation status (default: unreconciled)
- ✅ Uses Sheet/Drawer for transaction details (sm:max-w-2xl, p-8)
- ❌ No way to update reconciliation status from GL

### Reconciliation Manager
- ✅ Allows matching bank transactions with ledger transactions
- ✅ Tracks selected/matched transactions
- ✅ Uses Dialog for upload/matching interface
- ❌ Doesn't update General Ledger reconciled status
- ❌ No shared state with General Ledger
- ❌ Inconsistent UI patterns (Dialog vs Sheet)

## Problems to Solve

1. **No State Synchronization** - Reconciling transactions doesn't update the GL
2. **Manual Status Updates** - Users must manually mark transactions as reconciled
3. **Inconsistent UI** - Different patterns between components
4. **No Feedback Loop** - No way to see reconciliation results in GL immediately
5. **Flag Persistence** - Orange flags don't disappear after reconciliation

## Target State

### Reconciliation Manager
- ✅ Updates General Ledger reconciled status when matching transactions
- ✅ Uses Sheet/Drawer for consistency (not Dialog)
- ✅ Provides real-time feedback on reconciliation
- ✅ Allows bulk reconciliation
- ✅ Shows reconciliation history

### General Ledger
- ✅ Reflects reconciliation status immediately
- ✅ Flags disappear when transactions are reconciled
- ✅ Can toggle reconciliation status from GL drawer
- ✅ Shows reconciliation date and method

## Implementation Plan

### Phase 1: Shared State Management (30 min)
**Goal:** Create shared state for ledger transactions

#### Step 1.1: Create Ledger Context
- Create `LedgerContext.tsx` in contexts folder
- Store ledger transactions in context
- Provide methods to update reconciliation status
- Export hooks: `useLedger()`, `useLedgerTransactions()`, `useReconciliation()`

#### Step 1.2: Update AppContext
- Add ledger transaction state to AppContext
- Add `updateTransactionReconciliation(id, status)` method
- Add `bulkUpdateReconciliation(ids, status)` method

#### Step 1.3: Migrate General Ledger to Context
- Replace local state with context
- Use `useLedgerTransactions()` hook
- Update handlers to use context methods

### Phase 2: Reconciliation Manager Updates (45 min)
**Goal:** Update ReconciliationManager to modify GL status

#### Step 2.1: Convert Dialog to Sheet
- Replace Dialog components with Sheet components
- Match General Ledger drawer styling (sm:max-w-2xl, p-8)
- Update layout for consistency

#### Step 2.2: Integrate with Ledger Context
- Import `useLedger()` hook
- Update reconciliation logic to call `updateTransactionReconciliation()`
- Add bulk reconciliation support

#### Step 2.3: Add Reconciliation Metadata
- Track reconciliation date
- Track reconciliation method (manual/auto)
- Store bank statement reference

#### Step 2.4: Update UI Feedback
- Show success toast with count of reconciled items
- Update matched transactions list in real-time
- Add "View in General Ledger" link

### Phase 3: General Ledger Enhancements (30 min)
**Goal:** Add reconciliation controls to GL

#### Step 3.1: Add Reconciliation Toggle to Drawer
- Add "Mark as Reconciled" button in transaction drawer
- Add "Mark as Unreconciled" button (for corrections)
- Show reconciliation metadata (date, method)

#### Step 3.2: Update Flag Logic
- Ensure flag disappears when reconciled
- Add tooltip explaining flag meaning
- Consider adding flag for other transaction types

#### Step 3.3: Enhance Filters
- Keep default filter as "unreconciled"
- Add quick filter buttons (All/Reconciled/Unreconciled)
- Show count of unreconciled transactions

### Phase 4: Data Model Updates (15 min)
**Goal:** Extend LedgerEntry interface

#### Step 4.1: Update LedgerEntry Interface
```typescript
interface LedgerEntry {
  // ... existing fields
  reconciled: boolean;
  reconciled_at?: string;        // NEW: When reconciled
  reconciled_by?: string;        // NEW: Who reconciled
  reconciliation_method?: 'manual' | 'auto' | 'import'; // NEW: How reconciled
  bank_statement_ref?: string;   // NEW: Bank statement reference
}
```

#### Step 4.2: Update Mock Data
- Add reconciliation metadata to mock transactions
- Ensure variety of reconciled/unreconciled states
- Add realistic reconciliation dates

### Phase 5: Testing & Validation (20 min)
**Goal:** Ensure integration works correctly

#### Step 5.1: Test Reconciliation Flow
- Upload bank statement
- Match transactions
- Verify GL updates immediately
- Check flags disappear
- Verify status badges update

#### Step 5.2: Test Manual Reconciliation
- Mark transaction as reconciled from GL drawer
- Verify status updates
- Test bulk reconciliation

#### Step 5.3: Test Edge Cases
- Reconcile already reconciled transaction
- Unreconcile transaction
- Filter by reconciliation status
- Export reconciled vs unreconciled

## Data Flow

### Reconciliation Flow
```
1. User uploads bank statement → ReconciliationManager
2. User matches transactions → ReconciliationManager
3. User clicks "Reconcile" → ReconciliationManager
4. ReconciliationManager calls updateTransactionReconciliation()
5. Context updates ledger transaction state
6. General Ledger re-renders with updated status
7. Flag disappears, badge changes to "Reconciled"
```

### Manual Reconciliation Flow
```
1. User opens transaction in GL drawer
2. User clicks "Mark as Reconciled"
3. GL calls updateTransactionReconciliation()
4. Context updates transaction state
5. Drawer closes, table updates
6. Flag disappears, badge changes
```

## UI Changes

### Reconciliation Manager
**Before:**
- Dialog-based interface
- No connection to GL
- No feedback on reconciliation

**After:**
- Sheet/Drawer interface (consistent with GL)
- Updates GL in real-time
- Shows reconciliation count and success message
- "View in General Ledger" button

### General Ledger Drawer
**Before:**
- Read-only transaction details
- No reconciliation controls

**After:**
- "Mark as Reconciled" button (if unreconciled)
- "Mark as Unreconciled" button (if reconciled)
- Shows reconciliation metadata:
  - Reconciled on: [date]
  - Reconciled by: [user]
  - Method: [manual/auto/import]
  - Bank ref: [reference]

### General Ledger Table
**Before:**
- Orange flag for unreconciled checks
- Status column (Reconciled/Pending)

**After:**
- Same, but updates in real-time
- Flag disappears immediately after reconciliation
- Status badge updates immediately

## API Requirements (Future - Phase 2 Backend)

### Endpoints Needed
```
PATCH /api/v1/ledger_entries/:id/reconcile
  - Mark single transaction as reconciled
  - Body: { reconciled_by, bank_statement_ref, method }

PATCH /api/v1/ledger_entries/bulk_reconcile
  - Mark multiple transactions as reconciled
  - Body: { ids: [], reconciled_by, bank_statement_ref, method }

PATCH /api/v1/ledger_entries/:id/unreconcile
  - Mark transaction as unreconciled (for corrections)
```

## Success Criteria

### Functional
- ✅ Reconciling in ReconciliationManager updates GL immediately
- ✅ Flags disappear when transactions are reconciled
- ✅ Status badges update in real-time
- ✅ Can manually reconcile from GL drawer
- ✅ Bulk reconciliation works
- ✅ Filters work correctly with reconciliation status

### UI/UX
- ✅ Consistent drawer styling across components
- ✅ Clear feedback on reconciliation actions
- ✅ Reconciliation metadata visible
- ✅ Easy to identify unreconciled transactions

### Technical
- ✅ Shared state management via context
- ✅ No prop drilling
- ✅ Type-safe interfaces
- ✅ No TypeScript errors
- ✅ Clean, maintainable code

## Rollout Strategy

### Step 1: Create Context (Non-breaking)
- Add LedgerContext
- Keep existing local state as fallback
- Test context in isolation

### Step 2: Migrate General Ledger (Low risk)
- Switch GL to use context
- Test all GL functionality
- Ensure no regressions

### Step 3: Update Reconciliation Manager (Medium risk)
- Convert to Sheet
- Add reconciliation updates
- Test reconciliation flow end-to-end

### Step 4: Add Manual Controls (Low risk)
- Add reconciliation buttons to GL drawer
- Test manual reconciliation
- Document for users

### Step 5: Polish & Document (Low risk)
- Add tooltips
- Update user documentation
- Create video walkthrough

## Timeline

- **Phase 1:** 30 minutes (Context setup)
- **Phase 2:** 45 minutes (ReconciliationManager updates)
- **Phase 3:** 30 minutes (GL enhancements)
- **Phase 4:** 15 minutes (Data model)
- **Phase 5:** 20 minutes (Testing)

**Total Estimated Time:** 2 hours 20 minutes

## Dependencies

- None (all frontend changes)
- Backend API will be needed in Phase 2 (Backend Implementation)

## Risks & Mitigation

### Risk: Breaking existing functionality
**Mitigation:** Incremental rollout, keep fallbacks, extensive testing

### Risk: State management complexity
**Mitigation:** Use React Context (simple), clear separation of concerns

### Risk: Performance with large datasets
**Mitigation:** Use useMemo for filtered data, consider pagination later

### Risk: User confusion with new UI
**Mitigation:** Add tooltips, clear labels, user documentation

## Future Enhancements

1. **Reconciliation History** - Show all reconciliation events
2. **Undo Reconciliation** - Allow reverting reconciliation
3. **Auto-matching** - Suggest matches based on amount/date
4. **Bank Integration** - Direct bank feed integration
5. **Reconciliation Reports** - Show reconciliation statistics
6. **Audit Trail** - Track all reconciliation changes

## Notes

- This is a frontend-only implementation using mock data
- Backend API integration will come in Phase 2
- Focus on UX consistency and real-time updates
- Keep code clean and maintainable for future backend integration
