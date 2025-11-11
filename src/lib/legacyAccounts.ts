// Complete Chart of Accounts from Legacy System
// Based on Balance Sheet and Income Statement reports from 10/29/2025

export interface LegacyAccount {
  code: string;
  name: string;
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  full_name: string;
}

export const LEGACY_ACCOUNTS: LegacyAccount[] = [
  // ============================================
  // ASSETS (1000-1599)
  // ============================================
  { code: '1000', name: 'IFM Checking Peoples Bank', type: 'asset', full_name: '1000 - IFM Checking Peoples Bank' },
  { code: '1010', name: 'IFM - Savings - Peoples Bank', type: 'asset', full_name: '1010 - IFM - Savings - Peoples Bank' },
  { code: '1020', name: 'Investment - Adelfi Credit Union', type: 'asset', full_name: '1020 - Investment - Adelfi Credit Union' },
  { code: '1021', name: 'Ministry Partners CD', type: 'asset', full_name: '1021 - Ministry Partners CD' },
  { code: '1022', name: 'Peoples Bank Money Market', type: 'asset', full_name: '1022 - Peoples Bank Money Market' },
  { code: '1023', name: 'RBC Capital Markets', type: 'asset', full_name: '1023 - RBC Capital Markets' },
  { code: '1100', name: 'Marriage Mosaic - Operating', type: 'asset', full_name: '1100 - Marriage Mosaic - Operating' },
  { code: '1120', name: 'Crossroads Youth Ranch - Operating', type: 'asset', full_name: '1120 - Crossroads Youth Ranch - Operating' },
  { code: '1130', name: 'Skagit Connections - Operating', type: 'asset', full_name: '1130 - Skagit Connections - Operating' },
  { code: '1140', name: 'Cornerstone Operating Account', type: 'asset', full_name: '1140 - Cornerstone Operating Account' },
  { code: '1131.999999', name: 'Stripe Payments', type: 'asset', full_name: '1131.999999 - Stripe Payments' },
  { code: '1500', name: 'Real Property', type: 'asset', full_name: '1500 - Real Property' },

  // ============================================
  // LIABILITIES (2000-2299)
  // ============================================
  { code: '2000', name: 'Loan - Heritage #1', type: 'liability', full_name: '2000 - Loan - Heritage #1' },
  { code: '2001', name: 'Heritage Loan #2', type: 'liability', full_name: '2001 - Heritage Loan #2' },
  { code: '2100', name: 'Suspense', type: 'liability', full_name: '2100 - Suspense' },
  { code: '2200', name: 'Accrued Expenses', type: 'liability', full_name: '2200 - Accrued Expenses' },
  { code: '2210', name: 'Taxes Payable', type: 'liability', full_name: '2210 - Taxes Payable' },

  // ============================================
  // EQUITY / FUND BALANCES (3000-3157)
  // ============================================
  { code: '3000', name: 'General Fund - Fund Balance', type: 'equity', full_name: '3000 - General Fund - Fund Balance' },
  { code: '3101', name: 'Awakenings - Fund Balance', type: 'equity', full_name: '3101 - Awakenings - Fund Balance' },
  { code: '3103', name: 'Bloom Strong - Fund Balance', type: 'equity', full_name: '3103 - Bloom Strong - Fund Balance' },
  { code: '3104', name: 'Bonfire - Fund Balance', type: 'equity', full_name: '3104 - Bonfire - Fund Balance' },
  { code: '3106', name: 'BreakThrough Ministry - Fund Balance', type: 'equity', full_name: '3106 - BreakThrough Ministry - Fund Balance' },
  { code: '3107', name: 'Breathe Pray Worship - Fund Balance', type: 'equity', full_name: '3107 - Breathe Pray Worship - Fund Balance' },
  { code: '3109', name: 'Child and Youth Care Organization - Fund Balance', type: 'equity', full_name: '3109 - Child and Youth Care Organization - Fund Balance' },
  { code: '3110', name: 'Crossroads Youth Ranch - Fund Balance', type: 'equity', full_name: '3110 - Crossroads Youth Ranch - Fund Balance' },
  { code: '3111', name: 'Senior Living Champions - Fund Balance', type: 'equity', full_name: '3111 - Senior Living Champions - Fund Balance' },
  { code: '3112', name: 'Church without Walls - Fund Balance', type: 'equity', full_name: '3112 - Church without Walls - Fund Balance' },
  { code: '3114', name: 'Fidalgo Chaplaincy - Fund Balance', type: 'equity', full_name: '3114 - Fidalgo Chaplaincy - Fund Balance' },
  { code: '3116', name: 'InFocus Ministries - Fund Balance', type: 'equity', full_name: '3116 - InFocus Ministries - Fund Balance' },
  { code: '3117', name: 'Love With Actions - Fund Balance', type: 'equity', full_name: '3117 - Love With Actions - Fund Balance' },
  { code: '3119', name: 'Marriage Mosaic - Fund Balance', type: 'equity', full_name: '3119 - Marriage Mosaic - Fund Balance' },
  { code: '3122', name: 'Pure Water - Fund Balance', type: 'equity', full_name: '3122 - Pure Water - Fund Balance' },
  { code: '3123', name: 'ReImagine Ministry - Fund Balance', type: 'equity', full_name: '3123 - ReImagine Ministry - Fund Balance' },
  { code: '3125', name: 'Skagit Connections - Fund Balance', type: 'equity', full_name: '3125 - Skagit Connections - Fund Balance' },
  { code: '3127', name: 'The Uprising - Fund Balance', type: 'equity', full_name: '3127 - The Uprising - Fund Balance' },
  { code: '3129', name: 'Whidbey Resource Chaplains - Fund Balance', type: 'equity', full_name: '3129 - Whidbey Resource Chaplains - Fund Balance' },
  { code: '3132', name: 'Rising Martial Arts - Fund Balance', type: 'equity', full_name: '3132 - Rising Martial Arts - Fund Balance' },
  { code: '3134', name: 'Fire and Rice Ministries - Fund Balance', type: 'equity', full_name: '3134 - Fire and Rice Ministries - Fund Balance' },
  { code: '3135', name: 'Deeper Walk - Fund Balance', type: 'equity', full_name: '3135 - Deeper Walk - Fund Balance' },
  { code: '3136', name: 'Doing Good Things - Fund Balance', type: 'equity', full_name: '3136 - Doing Good Things - Fund Balance' },
  { code: '3139', name: 'Cornerstone - Fund Balance', type: 'equity', full_name: '3139 - Cornerstone - Fund Balance' },
  { code: '3140', name: 'Corban Family - Fund Balance', type: 'equity', full_name: '3140 - Corban Family - Fund Balance' },
  { code: '3142', name: 'Upper Room Academy - Fund Balance', type: 'equity', full_name: '3142 - Upper Room Academy - Fund Balance' },
  { code: '3145', name: 'Restored Living - Fund Balance', type: 'equity', full_name: '3145 - Restored Living - Fund Balance' },
  { code: '3146', name: 'Grapevine Ministries - Fund Balance', type: 'equity', full_name: '3146 - Grapevine Ministries - Fund Balance' },
  { code: '3148', name: 'NW Reign - Fund Balance', type: 'equity', full_name: '3148 - NW Reign - Fund Balance' },
  { code: '3149', name: 'Hugs Center - Fund Balance', type: 'equity', full_name: '3149 - Hugs Center - Fund Balance' },
  { code: '3150', name: 'Iron Horse Kids FUNd - Fund Balance', type: 'equity', full_name: '3150 - Iron Horse Kids FUNd - Fund Balance' },
  { code: '3151', name: 'Called to Love Uganda - Fund Balance', type: 'equity', full_name: '3151 - Called to Love Uganda - Fund Balance' },
  { code: '3152', name: "God's Grace Family Ministries - Fund Balance", type: 'equity', full_name: "3152 - God's Grace Family Ministries - Fund Balance" },
  { code: '3153', name: 'Rose Counseling - Fund Balance', type: 'equity', full_name: '3153 - Rose Counseling - Fund Balance' },
  { code: '3154', name: 'Into The Breach - Fund Balance', type: 'equity', full_name: '3154 - Into The Breach - Fund Balance' },
  { code: '3155', name: 'Senior Living Bucket Wishes - Fund Balance', type: 'equity', full_name: '3155 - Senior Living Bucket Wishes - Fund Balance' },
  { code: '3156', name: 'Yellow Soul - Fund Balance', type: 'equity', full_name: '3156 - Yellow Soul - Fund Balance' },
  { code: '3157', name: 'Journeyman NW - Fund Balance', type: 'equity', full_name: '3157 - Journeyman NW - Fund Balance' },

  // ============================================
  // INCOME / REVENUE (4000-4999)
  // ============================================
  { code: '4000', name: 'Direct Public Support', type: 'revenue', full_name: '4000 - Direct Public Support' },
  { code: '4510', name: 'Initial Fee', type: 'revenue', full_name: '4510 - Initial Fee' },
  { code: '4520', name: 'Interest Income', type: 'revenue', full_name: '4520 - Interest Income' },
  { code: '4530', name: 'Miscellaneous Revenue', type: 'revenue', full_name: '4530 - Miscellaneous Revenue' },
  { code: '4600', name: 'Admin Fees from Ministries', type: 'revenue', full_name: '4600 - Admin Fees from Ministries' },

  // ============================================
  // EXPENSES (5000-6999)
  // ============================================
  { code: '5001', name: 'Advertising Expenses', type: 'expense', full_name: '5001 - Advertising Expenses' },
  { code: '5002', name: 'Bank Fees', type: 'expense', full_name: '5002 - Bank Fees' },
  { code: '5006', name: 'Continuing Education', type: 'expense', full_name: '5006 - Continuing Education' },
  { code: '5011', name: 'Funds waiting for receipts', type: 'expense', full_name: '5011 - Funds waiting for receipts' },
  { code: '5017', name: 'Office Supplies', type: 'expense', full_name: '5017 - Office Supplies' },
  { code: '5019', name: 'Payroll Expenses', type: 'expense', full_name: '5019 - Payroll Expenses' },
  { code: '5020', name: 'Postage, Mailing Service', type: 'expense', full_name: '5020 - Postage, Mailing Service' },
  { code: '5023', name: 'Rent', type: 'expense', full_name: '5023 - Rent' },
  { code: '5028', name: 'Telephone, Telecommunications', type: 'expense', full_name: '5028 - Telephone, Telecommunications' },
  { code: '5033', name: 'Donor Appreciation', type: 'expense', full_name: '5033 - Donor Appreciation' },
  { code: '5004', name: 'Business Expenses', type: 'expense', full_name: '5004 - Business Expenses' },
  { code: '5013', name: 'Insurance Premium', type: 'expense', full_name: '5013 - Insurance Premium' },
  { code: '5014', name: 'Meals', type: 'expense', full_name: '5014 - Meals' },
  { code: '5018', name: 'Parking', type: 'expense', full_name: '5018 - Parking' },
  { code: '5027', name: 'Supplies', type: 'expense', full_name: '5027 - Supplies' },
  { code: '5031', name: 'Transportation', type: 'expense', full_name: '5031 - Transportation' },
  { code: '5032', name: 'Travel and Meetings', type: 'expense', full_name: '5032 - Travel and Meetings' },
  { code: '5100', name: 'Event Expenses', type: 'expense', full_name: '5100 - Event Expenses' },
  { code: '5000', name: 'Admin fee', type: 'expense', full_name: '5000 - Admin fee' },
  { code: '5022', name: 'Professional Services', type: 'expense', full_name: '5022 - Professional Services' },
  { code: '5026', name: 'Software Programs', type: 'expense', full_name: '5026 - Software Programs' },
  { code: '6000', name: 'Miscellaneous Expense', type: 'expense', full_name: '6000 - Miscellaneous Expense' },
  { code: '6001', name: 'Reconciliation Discrepancies', type: 'expense', full_name: '6001 - Reconciliation Discrepancies' },
  { code: '6004', name: 'Ask My Accountant', type: 'expense', full_name: '6004 - Ask My Accountant' },
];

// Helper functions
export const getLegacyAccountsByType = (type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense'): LegacyAccount[] => {
  return LEGACY_ACCOUNTS.filter(acc => acc.type === type);
};

export const getLegacyAccountByCode = (code: string): LegacyAccount | undefined => {
  return LEGACY_ACCOUNTS.find(acc => acc.code === code);
};

export const getFundBalanceAccounts = (): LegacyAccount[] => {
  return LEGACY_ACCOUNTS.filter(acc => acc.type === 'equity' && acc.code.startsWith('3'));
};

export const getAssetAccounts = (): LegacyAccount[] => {
  return getLegacyAccountsByType('asset');
};

export const getLiabilityAccounts = (): LegacyAccount[] => {
  return getLegacyAccountsByType('liability');
};

export const getRevenueAccounts = (): LegacyAccount[] => {
  return getLegacyAccountsByType('revenue');
};

export const getExpenseAccounts = (): LegacyAccount[] => {
  return getLegacyAccountsByType('expense');
};
