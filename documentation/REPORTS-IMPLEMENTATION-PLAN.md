# Financial Reports Implementation Plan

**Date:** November 10, 2025  
**Status:** 🔄 IN PROGRESS  

---

## 🎯 Goal

Standardize all financial reports to match legacy system while maintaining consistent UI/UX across all components.

---

## 📊 Reports to Update

### Priority 1: Core Financial Statements
1. **Balance Sheet** - Match legacy structure with fund balances in equity
2. **Income Statement by Fund** - Multi-column format showing each fund
3. **Income Statement (P&L)** - Consolidated single-column format

### Priority 2: Supporting Reports
4. **General Ledger** ✅ (Already refactored - use as style reference)
5. **Fund Accounting** - Update to match new fund structure
6. **Volunteer Hours Report** - Standardize drawer components

---

## 🎨 Design Standards (from General Ledger)

### Drawer/Sheet Pattern
```tsx
<Sheet open={isOpen} onOpenChange={setIsOpen}>
  <SheetContent className="w-full sm:max-w-2xl overflow-y-auto p-8">
    <SheetHeader className="pb-8 border-b border-gray-200 dark:border-gray-700">
      <SheetTitle className="flex items-center gap-2">
        <Icon className="h-5 w-5" />
        Title
      </SheetTitle>
      <SheetDescription>Description</SheetDescription>
    </SheetHeader>
    
    <div className="space-y-10 mt-10">
      {/* Content */}
    </div>
    
    <SheetFooter className="pt-8 border-t border-gray-200 dark:border-gray-700 mt-10">
      {/* Actions */}
    </SheetFooter>
  </SheetContent>
</Sheet>
```

### Color Standards
- **Credits/Income:** `text-green-600 dark:text-green-400`
- **Debits/Expenses:** `text-red-600 dark:text-red-400`
- **Borders:** `border-gray-200 dark:border-gray-700`
- **Section dividers:** `border-t-2 border-gray-300 dark:border-gray-600`

---

## 📋 Implementation Phases

### Phase 1: Data Schema (Week 1)
- [ ] Add all legacy accounts to Chart of Accounts (40+ fund balances in 3000 series)
- [ ] Update `funds` table with `fund_code` and `account_id`
- [ ] Update `journal_entry_lines` with `fund_id`
- [ ] Create shared types in `src/types/reports.ts`

### Phase 2: Balance Sheet (Week 1-2)
- [ ] Update layout to match legacy format exactly
- [ ] Add EQUITY section with all fund balances (3000-3157)
- [ ] Implement transaction drill-down sheet (matching GL style)
- [ ] Add balance verification (Assets = Liabilities + Equity)
- [ ] Update mock data with legacy account structure

### Phase 3: Income Statement by Fund (Week 2)
- [ ] Implement multi-column layout (one column per fund)
- [ ] Add income accounts section (4000 series)
- [ ] Add expense accounts section (5000-6000 series)
- [ ] Add fund balance reconciliation section
- [ ] Implement drill-down for line items
- [ ] Match legacy report format exactly

### Phase 4: Income Statement/P&L (Week 2-3)
- [ ] Consolidate all funds into single column
- [ ] Group expenses by category (Program, Personnel, Admin, Facilities, Other)
- [ ] Add drill-down to transaction details
- [ ] Standardize drawer component

### Phase 5: Drawer Standardization (Week 3)
- [ ] Update all report drill-down sheets to match GL pattern
- [ ] Ensure consistent spacing (`space-y-10`, `mt-10`, `pb-8`, `pt-8`)
- [ ] Standardize header/footer borders
- [ ] Apply consistent color scheme

### Phase 6: Testing & Validation (Week 4)
- [ ] Test all reports with legacy data
- [ ] Verify calculations match legacy system
- [ ] Test drill-down functionality
- [ ] Verify responsive design
- [ ] Test dark mode

---

## 🔧 Key Changes by Component

### BalanceSheetReport.tsx
**Changes:**
1. Add EQUITY section showing all fund balances (3000-3157 accounts)
2. Update account grouping to match legacy
3. Add transaction drill-down sheet (GL style)
4. Add balance verification alert
5. Update mock data with all legacy accounts

**New Structure:**
```
ASSETS (1000-1599)
  - All asset accounts from legacy
  Total Assets: $1,181,374.89

LIABILITIES (2000-2299)
  - All liability accounts from legacy
  Total Liabilities: $366,509.97

EQUITY (FUND BALANCES) (3000-3157) ← NEW SECTION
  - 3000: General Fund
  - 3101-3157: Individual ministry fund balances (40+ accounts)
  Total Equity: $814,864.92

Total Liabilities + Equity: $1,181,374.89 ✅
```

### IncomeStatementByFund.tsx
**Changes:**
1. Implement horizontal scrolling table with fund columns
2. Add income section (4000 series accounts)
3. Add expense section (5000-6000 series accounts)
4. Add summary section with fund balance reconciliation
5. Implement drill-down sheet for line items

**New Structure:**
```
Account | Account Name              | InFocus | Uprising | ... 
--------|---------------------------|---------|----------|-----
INCOME
4000    | Direct Public Support     | $12,770 | $47,204  |
4510    | Initial Fee               | $375    | $0       |
        | Total Income              | $220,019| $47,204  |

EXPENSE
5001    | Advertising               | $1,278  | $2,863   |
5019    | Payroll                   | $73,270 | $21,174  |
        | Total Expense             | $134,042| $45,653  |

        | Net Income (Loss)         | $85,976 | $1,551   |

SUMMARY
        | Beginning Balance         | $80,993 | $351     |
        | + Net Income              | $85,976 | $1,551   |
        | = Ending Balance          | $166,970| $1,902   |
```

### IncomeStatementReport.tsx / ProfitLossReport.tsx
**Changes:**
1. Consolidate all funds into single column
2. Group expenses by functional category
3. Standardize drill-down sheet
4. Match legacy P&L format

---

## 📝 Checklist

### Data Components
- [ ] Create `src/types/reports.ts` with all interfaces
- [ ] Update `MOCK_ACCOUNTS` in all report components
- [ ] Create mock data generators matching legacy structure
- [ ] Add fund balance accounts (3000-3157) to all mock data

### UI Components
- [ ] Standardize all Sheet components to match GL pattern
- [ ] Apply consistent color scheme across all reports
- [ ] Ensure all monetary values use same formatting
- [ ] Add hover states to all clickable rows
- [ ] Implement consistent loading states

### Functionality
- [ ] Implement drill-down for all account lines
- [ ] Add "View in General Ledger" links
- [ ] Implement export functionality
- [ ] Add date range filters
- [ ] Add fund filters where applicable

### Testing
- [ ] Test with legacy report data
- [ ] Verify all calculations
- [ ] Test responsive design
- [ ] Test dark mode
- [ ] Test drill-down functionality

---

## 🚀 Quick Start

1. **Update Chart of Accounts:**
   - Add all legacy accounts to `MOCK_ACCOUNTS` arrays
   - Include all 40+ fund balance accounts (3000-3157)

2. **Create Shared Types:**
   - Create `src/types/reports.ts`
   - Define `BalanceSheetData`, `IncomeStatementByFundData`, etc.

3. **Update Balance Sheet First:**
   - Add EQUITY section
   - Implement drill-down sheet
   - Test with legacy data

4. **Then Income Statement by Fund:**
   - Implement multi-column layout
   - Add fund balance reconciliation
   - Test calculations

5. **Standardize All Drawers:**
   - Apply GL sheet pattern to all reports
   - Ensure consistent spacing and colors

---

**Next Steps:** Start with Phase 1 (Data Schema) and Phase 2 (Balance Sheet)
