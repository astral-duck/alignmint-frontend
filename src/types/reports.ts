// Financial Reports Type Definitions
// Aligned with legacy system structure

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
  balanced: boolean; // Must be true: assets = liabilities + equity
}

export interface IncomeStatementByFundData {
  start_date: string;
  end_date: string;
  generated_by: string;
  generated_at: string;
  organization_id: string;
  organization_name: string;
  
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
  fund_code: string;
  fund_name: string;
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

export interface IncomeStatementData {
  start_date: string;
  end_date: string;
  generated_by: string;
  generated_at: string;
  organization_id: string;
  organization_name: string;
  
  revenue: RevenueData;
  expenses: ExpenseData;
  net_income: number;
}

export interface RevenueData {
  donations: number;
  earned_income: number;
  book_sales: number;
  initial_fees: number;
  interest_income: number;
  misc_revenue: number;
  admin_fees: number;
  total_revenue: number;
}

export interface ExpenseData {
  program_services: ExpenseCategory;
  personnel: ExpenseCategory;
  administrative: ExpenseCategory;
  facilities: ExpenseCategory;
  other: ExpenseCategory;
  total_expenses: number;
}

export interface ExpenseCategory {
  [key: string]: number;
  total: number;
}
