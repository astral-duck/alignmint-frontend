# Reports Implementation - Detailed Task Breakdown

**Date:** November 10, 2025

---

## 📦 Task 1: Create Shared Types & Constants

### File: `src/types/reports.ts`
```typescript
export interface AccountBalance {
  account_number: string;
  account_name: string;
  account_type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  amount: number;
  fund_id?: string;
  fund_name?: string;
}

export interface BalanceSheetData {
  report_date: string;
  generated_by: string;
  generated_at: string;
  organization_id: string;
  organization_name: string;
  assets: AccountBalance[];
  liabilities: AccountBalance[];
  equity: AccountBalance[];
  total_assets: number;
  total_liabilities: number;
  total_equity: number;
  balanced: boolean;
}

export interface IncomeStatementByFundData {
  start_date: string;
  end_date: string;
  generated_by: string;
  generated_at: string;
  organization_id: string;
  funds: FundColumn[];
  income_accounts: IncomeExpenseAccount[];
  expense_accounts: IncomeExpenseAccount[];
  summary: FundSummary[];
}

export interface FundColumn {
  fund_id: string;
  fund_code: string;
  fund_name: string;
  total_income: number;
  total_expense: number;
  net_income: number;
}

export interface IncomeExpenseAccount {
  account_number: string;
  account_name: string;
  amounts_by_fund: { [fund_id: string]: number };
}

export interface FundSummary {
  fund_id: string;
  beginning_balance: number;
  other_movements: number;
  net_income: number;
  ending_balance: number;
}

export interface TransactionDetail {
  id: string;
  date: string;
  description: string;
  reference_number?: string;
  debit: number;
  credit: number;
  balance: number;
  account_code: string;
  account_name: string;
  contact_name?: string;
  reconciled: boolean;
  source_type?: string;
}
```

### File: `src/lib/legacyAccounts.ts`
```typescript
// Complete Chart of Accounts from legacy system
export const LEGACY_ACCOUNTS = [
  // ASSETS (1000-1599)
  { code: '1000', name: 'IFM Checking Peoples Bank', type: 'asset' },
  { code: '1010', name: 'IFM - Savings - Peoples Bank', type: 'asset' },
  { code: '1020', name: 'Investment - Adelfi Credit Union', type: 'asset' },
  { code: '1021', name: 'Ministry Partners CD', type: 'asset' },
  { code: '1022', name: 'Peoples Bank Money Market', type: 'asset' },
  { code: '1023', name: 'RBC Capital Markets', type: 'asset' },
  { code: '1100', name: 'Marriage Mosaic - Operating', type: 'asset' },
  { code: '1120', name: 'Crossroads Youth Ranch - Operating', type: 'asset' },
  { code: '1130', name: 'Skagit Connections - Operating', type: 'asset' },
  { code: '1140', name: 'Cornerstone Operating Account', type: 'asset' },
  { code: '1131.999999', name: 'Stripe Payments', type: 'asset' },
  { code: '1500', name: 'Real Property', type: 'asset' },
  
  // LIABILITIES (2000-2299)
  { code: '2000', name: 'Loan - Heritage #1', type: 'liability' },
  { code: '2001', name: 'Heritage Loan #2', type: 'liability' },
  { code: '2100', name: 'Suspense', type: 'liability' },
  { code: '2200', name: 'Accrued Expenses', type: 'liability' },
  { code: '2210', name: 'Taxes Payable', type: 'liability' },
  
  // EQUITY/FUND BALANCES (3000-3157)
  { code: '3000', name: 'General Fund - Fund Balance', type: 'equity' },
  { code: '3101', name: 'Awakenings - Fund Balance', type: 'equity' },
  { code: '3103', name: 'Bloom Strong - Fund Balance', type: 'equity' },
  { code: '3104', name: 'Bonfire - Fund Balance', type: 'equity' },
  { code: '3106', name: 'BreakThrough Ministry - Fund Balance', type: 'equity' },
  { code: '3107', name: 'Breathe Pray Worship - Fund Balance', type: 'equity' },
  { code: '3109', name: 'Child and Youth Care Organization - Fund Balance', type: 'equity' },
  { code: '3110', name: 'Crossroads Youth Ranch - Fund Balance', type: 'equity' },
  { code: '3111', name: 'Senior Living Champions - Fund Balance', type: 'equity' },
  { code: '3112', name: 'Church without Walls - Fund Balance', type: 'equity' },
  { code: '3114', name: 'Fidalgo Chaplaincy - Fund Balance', type: 'equity' },
  { code: '3116', name: 'InFocus Ministries - Fund Balance', type: 'equity' },
  { code: '3117', name: 'Love With Actions - Fund Balance', type: 'equity' },
  { code: '3119', name: 'Marriage Mosaic - Fund Balance', type: 'equity' },
  { code: '3122', name: 'Pure Water - Fund Balance', type: 'equity' },
  { code: '3123', name: 'ReImagine Ministry - Fund Balance', type: 'equity' },
  { code: '3125', name: 'Skagit Connections - Fund Balance', type: 'equity' },
  { code: '3127', name: 'The Uprising - Fund Balance', type: 'equity' },
  { code: '3129', name: 'Whidbey Resource Chaplains - Fund Balance', type: 'equity' },
  { code: '3132', name: 'Rising Martial Arts - Fund Balance', type: 'equity' },
  { code: '3134', name: 'Fire and Rice Ministries - Fund Balance', type: 'equity' },
  { code: '3135', name: 'Deeper Walk - Fund Balance', type: 'equity' },
  { code: '3136', name: 'Doing Good Things - Fund Balance', type: 'equity' },
  { code: '3139', name: 'Cornerstone - Fund Balance', type: 'equity' },
  { code: '3140', name: 'Corban Family - Fund Balance', type: 'equity' },
  { code: '3142', name: 'Upper Room Academy - Fund Balance', type: 'equity' },
  { code: '3145', name: 'Restored Living - Fund Balance', type: 'equity' },
  { code: '3146', name: 'Grapevine Ministries - Fund Balance', type: 'equity' },
  { code: '3148', name: 'NW Reign - Fund Balance', type: 'equity' },
  { code: '3149', name: 'Hugs Center - Fund Balance', type: 'equity' },
  { code: '3150', name: 'Iron Horse Kids FUNd - Fund Balance', type: 'equity' },
  { code: '3151', name: 'Called to Love Uganda - Fund Balance', type: 'equity' },
  { code: '3152', name: "God's Grace Family Ministries - Fund Balance", type: 'equity' },
  { code: '3153', name: 'Rose Counseling - Fund Balance', type: 'equity' },
  { code: '3154', name: 'Into The Breach - Fund Balance', type: 'equity' },
  { code: '3155', name: 'Senior Living Bucket Wishes - Fund Balance', type: 'equity' },
  { code: '3156', name: 'Yellow Soul - Fund Balance', type: 'equity' },
  { code: '3157', name: 'Journeyman NW - Fund Balance', type: 'equity' },
  
  // INCOME (4000-4999)
  { code: '4000', name: 'Direct Public Support', type: 'revenue' },
  { code: '4510', name: 'Initial Fee', type: 'revenue' },
  { code: '4520', name: 'Interest Income', type: 'revenue' },
  { code: '4530', name: 'Miscellaneous Revenue', type: 'revenue' },
  { code: '4600', name: 'Admin Fees from Ministries', type: 'revenue' },
  
  // EXPENSES (5000-6999)
  { code: '5001', name: 'Advertising Expenses', type: 'expense' },
  { code: '5002', name: 'Bank Fees', type: 'expense' },
  { code: '5006', name: 'Continuing Education', type: 'expense' },
  { code: '5011', name: 'Funds waiting for receipts', type: 'expense' },
  { code: '5017', name: 'Office Supplies', type: 'expense' },
  { code: '5019', name: 'Payroll Expenses', type: 'expense' },
  { code: '5020', name: 'Postage, Mailing Service', type: 'expense' },
  { code: '5023', name: 'Rent', type: 'expense' },
  { code: '5028', name: 'Telephone, Telecommunications', type: 'expense' },
  { code: '5033', name: 'Donor Appreciation', type: 'expense' },
  { code: '5004', name: 'Business Expenses', type: 'expense' },
  { code: '5013', name: 'Insurance Premium', type: 'expense' },
  { code: '5014', name: 'Meals', type: 'expense' },
  { code: '5018', name: 'Parking', type: 'expense' },
  { code: '5027', name: 'Supplies', type: 'expense' },
  { code: '5031', name: 'Transportation', type: 'expense' },
  { code: '5032', name: 'Travel and Meetings', type: 'expense' },
  { code: '5100', name: 'Event Expenses', type: 'expense' },
  { code: '5000', name: 'Admin fee', type: 'expense' },
  { code: '5022', name: 'Professional Services', type: 'expense' },
  { code: '5026', name: 'Software Programs', type: 'expense' },
  { code: '6000', name: 'Miscellaneous Expense', type: 'expense' },
  { code: '6001', name: 'Reconciliation Discrepancies', type: 'expense' },
  { code: '6004', name: 'Ask My Accountant', type: 'expense' },
];

export const getLegacyAccountsByType = (type: string) => {
  return LEGACY_ACCOUNTS.filter(acc => acc.type === type);
};
```

**Estimated Time:** 2 hours

---

## 📦 Task 2: Update Balance Sheet Report

### File: `src/components/BalanceSheetReport.tsx`

**Subtasks:**

1. **Import new types and constants** (15 min)
2. **Update report layout structure** (2 hours)
3. **Add EQUITY section with fund balances** (1 hour)
4. **Implement transaction drill-down sheet** (2 hours)
5. **Add balance verification** (30 min)
6. **Update mock data generator** (1 hour)
7. **Test with legacy data** (1 hour)

**Key Code Changes:**

```tsx
// Add EQUITY section
<div>
  <h2 className="text-xl font-semibold mb-4 border-b-2 pb-2">
    EQUITY (Fund Balances)
  </h2>
  {equity.map(account => (
    <div 
      key={account.account_number}
      className="flex justify-between py-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
      onClick={() => handleAccountClick(account)}
    >
      <span className="text-sm">
        {account.account_number} - {account.account_name}
      </span>
      <span className="font-mono">
        ${account.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
      </span>
    </div>
  ))}
  <div className="flex justify-between py-2 border-t-2 border-gray-300 dark:border-gray-600 font-semibold mt-2">
    <span>Total Equity</span>
    <span className="font-mono">${totalEquity.toFixed(2)}</span>
  </div>
</div>

// Add balance verification
<div className="border-t-4 border-gray-400 dark:border-gray-500 pt-4">
  <div className="flex justify-between py-2 font-bold text-lg">
    <span>Total Liabilities + Total Equity</span>
    <span className={`font-mono ${
      Math.abs(totalAssets - (totalLiabilities + totalEquity)) < 0.01
        ? 'text-green-600 dark:text-green-400'
        : 'text-red-600 dark:text-red-400'
    }`}>
      ${(totalLiabilities + totalEquity).toFixed(2)}
    </span>
  </div>
</div>
```

**Estimated Time:** 7.5 hours

---

## 📦 Task 3: Update Income Statement by Fund

### File: `src/components/IncomeStatementByFund.tsx`

**Subtasks:**

1. **Create multi-column table layout** (3 hours)
2. **Add income accounts section** (1 hour)
3. **Add expense accounts section** (1 hour)
4. **Add fund balance reconciliation** (2 hours)
5. **Implement drill-down sheet** (2 hours)
6. **Update mock data generator** (2 hours)
7. **Test calculations** (1 hour)

**Key Code Changes:**

```tsx
<div className="overflow-x-auto">
  <table className="w-full border-collapse">
    <thead>
      <tr className="border-b-2 border-gray-300 dark:border-gray-600">
        <th className="text-left py-3 px-4">Account</th>
        <th className="text-left py-3 px-4">Account Name</th>
        {funds.map(fund => (
          <th key={fund.fund_id} className="text-right py-3 px-4 min-w-[120px]">
            {fund.fund_name}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {/* INCOME Section */}
      <tr className="bg-gray-100 dark:bg-gray-800">
        <td colSpan={2 + funds.length} className="py-2 px-4 font-semibold">
          INCOME
        </td>
      </tr>
      {incomeAccounts.map(account => (
        <tr key={account.account_number} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
          <td className="py-2 px-4 font-mono text-sm">{account.account_number}</td>
          <td className="py-2 px-4 text-sm">{account.account_name}</td>
          {funds.map(fund => (
            <td key={fund.fund_id} className="py-2 px-4 text-right font-mono">
              ${(account.amounts_by_fund[fund.fund_id] || 0).toFixed(2)}
            </td>
          ))}
        </tr>
      ))}
      {/* Total Income */}
      <tr className="border-t-2 border-gray-300 dark:border-gray-600 font-semibold">
        <td colSpan={2} className="py-2 px-4">Total Income</td>
        {funds.map(fund => (
          <td key={fund.fund_id} className="py-2 px-4 text-right font-mono">
            ${fund.total_income.toFixed(2)}
          </td>
        ))}
      </tr>
    </tbody>
  </table>
</div>
```

**Estimated Time:** 12 hours

---

## 📦 Task 4: Standardize Drawer Components

**Files to Update:**
- `BalanceSheetReport.tsx`
- `IncomeStatementByFund.tsx`
- `IncomeStatementReport.tsx`
- `ProfitLossReport.tsx`
- `FundAccounting.tsx`
- `VolunteerHoursReport.tsx`

**Standard Pattern:**
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
      <Button variant="outline" onClick={() => setIsOpen(false)}>Close</Button>
      <Button>Action</Button>
    </SheetFooter>
  </SheetContent>
</Sheet>
```

**Estimated Time:** 4 hours (30-45 min per component)

---

## 📦 Task 5: Update Mock Data Generators

**Files:**
- `src/lib/financialData.ts`
- Individual component mock data functions

**Create:**
```typescript
export const generateLegacyBalanceSheet = (asOfDate: string): BalanceSheetData => {
  return {
    report_date: asOfDate,
    generated_by: 'maribeth@infocusministries.org',
    generated_at: new Date().toISOString(),
    organization_id: 'org-1',
    organization_name: 'InFocus Ministries',
    assets: [
      { account_number: '1000', account_name: 'IFM Checking Peoples Bank', account_type: 'asset', amount: 68238.73 },
      // ... all assets from legacy report
    ],
    liabilities: [
      { account_number: '2000', account_name: 'Loan - Heritage #1', account_type: 'liability', amount: 322482.80 },
      // ... all liabilities
    ],
    equity: [
      { account_number: '3000', account_name: 'General Fund - Fund Balance', account_type: 'equity', amount: 104.05 },
      { account_number: '3116', account_name: 'InFocus Ministries - Fund Balance', account_type: 'equity', amount: 166970.74 },
      // ... all 40+ fund balances
    ],
    total_assets: 1181374.89,
    total_liabilities: 366509.97,
    total_equity: 814864.92,
    balanced: true,
  };
};
```

**Estimated Time:** 3 hours

---

## 📦 Task 6: Testing & Validation

**Test Cases:**

1. **Balance Sheet:**
   - [ ] All accounts display correctly
   - [ ] Totals calculate correctly
   - [ ] Assets = Liabilities + Equity
   - [ ] Drill-down opens with correct data
   - [ ] Responsive design works
   - [ ] Dark mode works

2. **Income Statement by Fund:**
   - [ ] All funds display as columns
   - [ ] Income/expense totals correct
   - [ ] Fund balance reconciliation correct
   - [ ] Horizontal scroll works
   - [ ] Drill-down works

3. **All Reports:**
   - [ ] Drawer components match GL style
   - [ ] Colors consistent
   - [ ] Spacing consistent
   - [ ] Export works
   - [ ] Print works

**Estimated Time:** 4 hours

---

## 📊 Total Time Estimate

| Task | Hours |
|------|-------|
| 1. Shared Types & Constants | 2 |
| 2. Balance Sheet Update | 7.5 |
| 3. Income Statement by Fund | 12 |
| 4. Standardize Drawers | 4 |
| 5. Mock Data Generators | 3 |
| 6. Testing & Validation | 4 |
| **Total** | **32.5 hours** |

**Estimated Timeline:** 4-5 days of focused work

---

## 🚀 Priority Order

1. **Day 1:** Tasks 1 & 2 (Types + Balance Sheet)
2. **Day 2-3:** Task 3 (Income Statement by Fund)
3. **Day 4:** Tasks 4 & 5 (Standardize + Mock Data)
4. **Day 5:** Task 6 (Testing)

---

## ✅ Success Criteria

- [ ] All reports match legacy system structure exactly
- [ ] All calculations verified against legacy data
- [ ] All drawer components use consistent styling
- [ ] All reports responsive and work in dark mode
- [ ] No console errors or warnings
- [ ] Code follows existing patterns and conventions
