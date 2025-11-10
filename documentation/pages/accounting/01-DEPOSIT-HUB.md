# Deposit Hub

**Component File:** `src/components/DepositHub.tsx`  
**Route:** `/accounting` → Deposits tool (sub-hub within Accounting)  
**Access Level:** Admin, Manager, Accounting Staff

## Overview
The Deposit Hub is a sub-navigation page within the Accounting section. When users click "Deposits" from the Accounting Hub, this component displays two deposit recording options: Regular Deposit (for manual entry) and Check Deposit (for OCR scanning). It includes a back button to return to the Accounting Hub.

## UI Features

### Tool Cards (2 tools)
1. **Regular Deposit** - Record income deposits without physical checks
2. **Check Deposit** - Scan and deposit checks with OCR processing

### Features
- Grid layout (responsive: 1/2/3 columns)
- Icon-based tool cards
- Hover effects
- Back to Accounting Hub button
- Tool descriptions
- Click to navigate

## Navigation Mapping

| Tool ID | Routes To | Component |
|---------|-----------|-----------|
| `regular` | Deposit → Regular | RegularDepositManager |
| `check` | Deposit → Check | CheckDepositManager |

## State Management

### Local State
None - pure navigation component

### Global State (AppContext)
None required

## Related Documentation
- [../accounting/08-CHECK-DEPOSIT-MANAGER.md](../accounting/08-CHECK-DEPOSIT-MANAGER.md)
- [../accounting/10-REGULAR-DEPOSIT-MANAGER.md](../accounting/10-REGULAR-DEPOSIT-MANAGER.md)
- [01-ACCOUNTING-HUB.md](./01-ACCOUNTING-HUB.md)
