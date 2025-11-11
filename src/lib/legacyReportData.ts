// Mock data generators for financial reports
// Based on legacy system reports from 10/29/2025

import { BalanceSheetData, IncomeStatementByFundData, AccountBalance, FundColumn, IncomeExpenseAccount, FundSummary } from '../types/reports';

// Generate Balance Sheet with legacy data
export const generateLegacyBalanceSheet = (asOfDate: string = '2025-10-29'): BalanceSheetData => {
  const assets: AccountBalance[] = [
    { account_number: '1000', account_name: 'IFM Checking Peoples Bank', account_type: 'asset', amount: 68238.73 },
    { account_number: '1010', account_name: 'IFM - Savings - Peoples Bank', account_type: 'asset', amount: 24362.93 },
    { account_number: '1020', account_name: 'Investment - Adelfi Credit Union', account_type: 'asset', amount: 210414.36 },
    { account_number: '1021', account_name: 'Ministry Partners CD', account_type: 'asset', amount: 260926.82 },
    { account_number: '1022', account_name: 'Peoples Bank Money Market', account_type: 'asset', amount: 114412.53 },
    { account_number: '1023', account_name: 'RBC Capital Markets', account_type: 'asset', amount: 50781.39 },
    { account_number: '1100', account_name: 'Marriage Mosaic - Operating', account_type: 'asset', amount: 823.16 },
    { account_number: '1120', account_name: 'Crossroads Youth Ranch - Operating', account_type: 'asset', amount: 3544.06 },
    { account_number: '1130', account_name: 'Skagit Connections - Operating', account_type: 'asset', amount: 904.96 },
    { account_number: '1140', account_name: 'Cornerstone Operating Account', account_type: 'asset', amount: 4871.32 },
    { account_number: '1131.999999', account_name: 'Stripe Payments', account_type: 'asset', amount: 7213.93 },
    { account_number: '1500', account_name: 'Real Property', account_type: 'asset', amount: 434880.70 },
  ];

  const liabilities: AccountBalance[] = [
    { account_number: '2000', account_name: 'Loan - Heritage #1', account_type: 'liability', amount: 322482.80 },
    { account_number: '2001', account_name: 'Heritage Loan #2', account_type: 'liability', amount: 38701.07 },
    { account_number: '2100', account_name: 'Suspense', account_type: 'liability', amount: 4880.64 },
    { account_number: '2200', account_name: 'Accrued Expenses', account_type: 'liability', amount: 1210.46 },
    { account_number: '2210', account_name: 'Taxes Payable', account_type: 'liability', amount: -765.00 },
  ];

  const equity: AccountBalance[] = [
    { account_number: '3000', account_name: 'General Fund - Fund Balance', account_type: 'equity', amount: 104.05 },
    { account_number: '3101', account_name: 'Awakenings - Fund Balance', account_type: 'equity', amount: 1225.57 },
    { account_number: '3103', account_name: 'Bloom Strong - Fund Balance', account_type: 'equity', amount: 1469.16 },
    { account_number: '3104', account_name: 'Bonfire - Fund Balance', account_type: 'equity', amount: 91.34 },
    { account_number: '3106', account_name: 'BreakThrough Ministry - Fund Balance', account_type: 'equity', amount: 18356.31 },
    { account_number: '3107', account_name: 'Breathe Pray Worship - Fund Balance', account_type: 'equity', amount: 2679.82 },
    { account_number: '3109', account_name: 'Child and Youth Care Organization - Fund Balance', account_type: 'equity', amount: 599.41 },
    { account_number: '3110', account_name: 'Crossroads Youth Ranch - Fund Balance', account_type: 'equity', amount: 5331.40 },
    { account_number: '3111', account_name: 'Senior Living Champions - Fund Balance', account_type: 'equity', amount: 101569.72 },
    { account_number: '3112', account_name: 'Church without Walls - Fund Balance', account_type: 'equity', amount: 51076.99 },
    { account_number: '3114', account_name: 'Fidalgo Chaplaincy - Fund Balance', account_type: 'equity', amount: 22259.62 },
    { account_number: '3116', account_name: 'InFocus Ministries - Fund Balance', account_type: 'equity', amount: 166970.74 },
    { account_number: '3117', account_name: 'Love With Actions - Fund Balance', account_type: 'equity', amount: 78804.58 },
    { account_number: '3119', account_name: 'Marriage Mosaic - Fund Balance', account_type: 'equity', amount: 45505.26 },
    { account_number: '3122', account_name: 'Pure Water - Fund Balance', account_type: 'equity', amount: 2356.46 },
    { account_number: '3123', account_name: 'ReImagine Ministry - Fund Balance', account_type: 'equity', amount: 9863.57 },
    { account_number: '3125', account_name: 'Skagit Connections - Fund Balance', account_type: 'equity', amount: 25664.08 },
    { account_number: '3127', account_name: 'The Uprising - Fund Balance', account_type: 'equity', amount: 1902.80 },
    { account_number: '3129', account_name: 'Whidbey Resource Chaplains - Fund Balance', account_type: 'equity', amount: 5331.03 },
    { account_number: '3132', account_name: 'Rising Martial Arts - Fund Balance', account_type: 'equity', amount: 14677.84 },
    { account_number: '3134', account_name: 'Fire and Rice Ministries - Fund Balance', account_type: 'equity', amount: 3780.81 },
    { account_number: '3135', account_name: 'Deeper Walk - Fund Balance', account_type: 'equity', amount: 34746.60 },
    { account_number: '3136', account_name: 'Doing Good Things - Fund Balance', account_type: 'equity', amount: 212.39 },
    { account_number: '3139', account_name: 'Cornerstone - Fund Balance', account_type: 'equity', amount: 99924.70 },
    { account_number: '3140', account_name: 'Corban Family - Fund Balance', account_type: 'equity', amount: 1323.16 },
    { account_number: '3142', account_name: 'Upper Room Academy - Fund Balance', account_type: 'equity', amount: 461.59 },
    { account_number: '3145', account_name: 'Restored Living - Fund Balance', account_type: 'equity', amount: 2306.34 },
    { account_number: '3146', account_name: 'Grapevine Ministries - Fund Balance', account_type: 'equity', amount: 13685.91 },
    { account_number: '3148', account_name: 'NW Reign - Fund Balance', account_type: 'equity', amount: 828.15 },
    { account_number: '3149', account_name: 'Hugs Center - Fund Balance', account_type: 'equity', amount: 7921.28 },
    { account_number: '3150', account_name: 'Iron Horse Kids FUNd - Fund Balance', account_type: 'equity', amount: 1852.32 },
    { account_number: '3151', account_name: 'Called to Love Uganda - Fund Balance', account_type: 'equity', amount: 20714.80 },
    { account_number: '3152', account_name: "God's Grace Family Ministries - Fund Balance", account_type: 'equity', amount: 4966.24 },
    { account_number: '3153', account_name: 'Rose Counseling - Fund Balance', account_type: 'equity', amount: 188.70 },
    { account_number: '3154', account_name: 'Into The Breach - Fund Balance', account_type: 'equity', amount: 324.67 },
    { account_number: '3155', account_name: 'Senior Living Bucket Wishes - Fund Balance', account_type: 'equity', amount: 62971.67 },
    { account_number: '3156', account_name: 'Yellow Soul - Fund Balance', account_type: 'equity', amount: 181.85 },
    { account_number: '3157', account_name: 'Journeyman NW - Fund Balance', account_type: 'equity', amount: 2633.99 },
  ];

  const totalAssets = assets.reduce((sum, acc) => sum + acc.amount, 0);
  const totalLiabilities = liabilities.reduce((sum, acc) => sum + acc.amount, 0);
  const totalEquity = equity.reduce((sum, acc) => sum + acc.amount, 0);

  return {
    report_date: asOfDate,
    generated_by: 'maribeth@infocusministries.org',
    generated_at: new Date().toISOString(),
    organization_id: 'org-infocus',
    organization_name: 'InFocus Ministries',
    assets,
    liabilities,
    equity,
    total_assets: totalAssets,
    total_liabilities: totalLiabilities,
    total_equity: totalEquity,
    balanced: Math.abs(totalAssets - (totalLiabilities + totalEquity)) < 0.01,
  };
};

// Generate Income Statement by Fund with legacy data
export const generateLegacyIncomeStatementByFund = (
  startDate: string = '2025-01-01',
  endDate: string = '2025-10-29'
): IncomeStatementByFundData => {
  const funds: FundColumn[] = [
    {
      fund_id: 'fund-3116',
      fund_code: '3116',
      fund_name: 'InFocus Admin',
      total_income: 220019.60,
      total_expense: 134042.70,
      net_income: 85976.90,
    },
    {
      fund_id: 'fund-3127',
      fund_code: '3127',
      fund_name: 'The Uprising',
      total_income: 47204.68,
      total_expense: 45653.10,
      net_income: 1551.58,
    },
  ];

  const incomeAccounts: IncomeExpenseAccount[] = [
    {
      account_number: '4000',
      account_name: 'Direct Public Support',
      amounts_by_fund: {
        'fund-3116': 12770.72,
        'fund-3127': 47204.68,
      },
    },
    {
      account_number: '4510',
      account_name: 'Initial Fee',
      amounts_by_fund: {
        'fund-3116': 375.00,
        'fund-3127': 0.00,
      },
    },
    {
      account_number: '4520',
      account_name: 'Interest Income',
      amounts_by_fund: {
        'fund-3116': 16226.89,
        'fund-3127': 0.00,
      },
    },
    {
      account_number: '4530',
      account_name: 'Miscellaneous Revenue',
      amounts_by_fund: {
        'fund-3116': 100874.08,
        'fund-3127': 0.00,
      },
    },
    {
      account_number: '4600',
      account_name: 'Admin Fees from Ministries',
      amounts_by_fund: {
        'fund-3116': 89772.91,
        'fund-3127': 0.00,
      },
    },
  ];

  const expenseAccounts: IncomeExpenseAccount[] = [
    {
      account_number: '5001',
      account_name: 'Advertising Expenses',
      amounts_by_fund: {
        'fund-3116': 1278.98,
        'fund-3127': 2863.95,
      },
    },
    {
      account_number: '5002',
      account_name: 'Bank Fees',
      amounts_by_fund: {
        'fund-3116': 140.52,
        'fund-3127': 1432.01,
      },
    },
    {
      account_number: '5006',
      account_name: 'Continuing Education',
      amounts_by_fund: {
        'fund-3116': 310.93,
        'fund-3127': 0.00,
      },
    },
    {
      account_number: '5011',
      account_name: 'Funds waiting for receipts',
      amounts_by_fund: {
        'fund-3116': 194.01,
        'fund-3127': 0.00,
      },
    },
    {
      account_number: '5017',
      account_name: 'Office Supplies',
      amounts_by_fund: {
        'fund-3116': -38.62,
        'fund-3127': 0.00,
      },
    },
    {
      account_number: '5019',
      account_name: 'Payroll Expenses',
      amounts_by_fund: {
        'fund-3116': 73270.23,
        'fund-3127': 21174.36,
      },
    },
    {
      account_number: '5020',
      account_name: 'Postage, Mailing Service',
      amounts_by_fund: {
        'fund-3116': 513.60,
        'fund-3127': 0.00,
      },
    },
    {
      account_number: '5023',
      account_name: 'Rent',
      amounts_by_fund: {
        'fund-3116': 0.00,
        'fund-3127': 1500.00,
      },
    },
    {
      account_number: '5028',
      account_name: 'Telephone, Telecommunications',
      amounts_by_fund: {
        'fund-3116': 0.00,
        'fund-3127': 86.52,
      },
    },
    {
      account_number: '5033',
      account_name: 'Donor Appreciation',
      amounts_by_fund: {
        'fund-3116': -0.19,
        'fund-3127': 0.00,
      },
    },
    {
      account_number: '5004',
      account_name: 'Business Expenses',
      amounts_by_fund: {
        'fund-3116': 372.60,
        'fund-3127': 70.38,
      },
    },
    {
      account_number: '5013',
      account_name: 'Insurance Premium',
      amounts_by_fund: {
        'fund-3116': -858.00,
        'fund-3127': 90.00,
      },
    },
    {
      account_number: '5014',
      account_name: 'Meals',
      amounts_by_fund: {
        'fund-3116': 1884.79,
        'fund-3127': 5590.14,
      },
    },
    {
      account_number: '5018',
      account_name: 'Parking',
      amounts_by_fund: {
        'fund-3116': 0.00,
        'fund-3127': 41.00,
      },
    },
    {
      account_number: '5027',
      account_name: 'Supplies',
      amounts_by_fund: {
        'fund-3116': 3002.14,
        'fund-3127': 0.00,
      },
    },
    {
      account_number: '5031',
      account_name: 'Transportation',
      amounts_by_fund: {
        'fund-3116': 3539.26,
        'fund-3127': 1250.45,
      },
    },
    {
      account_number: '5032',
      account_name: 'Travel and Meetings',
      amounts_by_fund: {
        'fund-3116': 11422.26,
        'fund-3127': 4448.15,
      },
    },
    {
      account_number: '5100',
      account_name: 'Event Expenses',
      amounts_by_fund: {
        'fund-3116': 88.63,
        'fund-3127': 1571.99,
      },
    },
    {
      account_number: '5000',
      account_name: 'Admin fee',
      amounts_by_fund: {
        'fund-3116': 0.00,
        'fund-3127': 3276.80,
      },
    },
    {
      account_number: '5022',
      account_name: 'Professional Services',
      amounts_by_fund: {
        'fund-3116': 34627.75,
        'fund-3127': 0.00,
      },
    },
    {
      account_number: '5026',
      account_name: 'Software Programs',
      amounts_by_fund: {
        'fund-3116': 5715.04,
        'fund-3127': 546.92,
      },
    },
    {
      account_number: '6000',
      account_name: 'Miscellaneous Expense',
      amounts_by_fund: {
        'fund-3116': 291.45,
        'fund-3127': 0.00,
      },
    },
    {
      account_number: '6001',
      account_name: 'Reconciliation Discrepancies',
      amounts_by_fund: {
        'fund-3116': -2.25,
        'fund-3127': 0.00,
      },
    },
    {
      account_number: '6004',
      account_name: 'Ask My Accountant',
      amounts_by_fund: {
        'fund-3116': -1710.43,
        'fund-3127': 1710.43,
      },
    },
  ];

  const summary: FundSummary[] = [
    {
      fund_id: 'fund-3116',
      fund_code: '3116',
      fund_name: 'InFocus Admin',
      beginning_balance: 80993.84,
      other_movements: 0.00,
      net_income: 85976.90,
      ending_balance: 166970.74,
    },
    {
      fund_id: 'fund-3127',
      fund_code: '3127',
      fund_name: 'The Uprising',
      beginning_balance: 351.22,
      other_movements: 0.00,
      net_income: 1551.58,
      ending_balance: 1902.80,
    },
  ];

  return {
    start_date: startDate,
    end_date: endDate,
    generated_by: 'maribeth@infocusministries.org',
    generated_at: new Date().toISOString(),
    organization_id: 'org-infocus',
    organization_name: 'InFocus Ministries',
    funds,
    income_accounts: incomeAccounts,
    expense_accounts: expenseAccounts,
    summary,
  };
};
