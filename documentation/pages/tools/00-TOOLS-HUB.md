# Tools Hub

**Component File:** `src/components/ToolsHub.tsx`  
**Route:** `/tools`  
**Access Level:** Admin, Manager, Accounting Staff

## Overview
The Tools Hub is a navigation landing page that provides access to utility tools and integrations. It displays a grid of tool cards for specialized functions that support the main accounting and administrative workflows.

## UI Features

### Tool Cards (4 tools)
1. **Reconciliation** - Match and categorize bank transactions
2. **Sponsor Fee Allocation** - Review and confirm monthly admin fees
3. **Memorized Transactions** - Manage recurring journal entry templates
4. **Mileage Tracker** - Log business mileage for tax deductions

### Features
- Grid layout (responsive: 1/2/3 columns)
- Icon-based tool cards
- Hover effects
- Tool descriptions
- Click to navigate

## Navigation Mapping

| Tool ID | Routes To | Component |
|---------|-----------|-----------|
| `reconciliation` | Tools → Reconciliation | ReconciliationManager |
| `sponsor-fee-allocation` | Tools → Fee Allocation | SponsorFeeAllocation |
| `memorized-transactions` | Tools → Memorized Transactions | MemorizedTransactions |
| `mileage-tracker` | Tools → Mileage Tracker | MileageTracker |

## State Management

### Local State
None - pure navigation component

### Global State (AppContext)
- `toolsTool` - Currently selected tool
- `setToolsTool` - Function to navigate to a tool

## Related Documentation
- [../accounting/09-RECONCILIATION-MANAGER.md](../accounting/09-RECONCILIATION-MANAGER.md)
- [02-SPONSOR-FEE-ALLOCATION.md](./02-SPONSOR-FEE-ALLOCATION.md)
- [01-MEMORIZED-TRANSACTIONS.md](./01-MEMORIZED-TRANSACTIONS.md)
- [03-MILEAGE-TRACKER.md](./03-MILEAGE-TRACKER.md)
