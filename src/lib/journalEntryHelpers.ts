// Journal Entry Helper Utilities
// Used by Check Deposits, Reimbursements, and Expenses to create proper journal entries

// Account interface
export interface Account {
  id: string;
  code: string;
  name: string;
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  full_name: string;
  is_active?: boolean;
}

// Journal Entry Line interface
export interface JournalEntryLine {
  id: string;
  journal_entry_id: string;
  account: Account;
  line_number: number;
  description: string;
  memo?: string;
  debit_amount: number;
  credit_amount: number;
}

// Journal Entry interface
export interface JournalEntry {
  id: string;
  organization_id: string;
  entity_id: string;
  entry_number: string;
  entry_date: string;
  description: string;
  memo?: string;
  status: 'draft' | 'posted' | 'voided';
  source_type: 'check-deposit' | 'reimbursement' | 'expense' | 'manual';
  source_id: string | null;
  posted_at?: string;
  posted_by?: string;
  voided_at?: string;
  voided_by?: string;
  void_reason?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  lines: JournalEntryLine[];
}

// Helper to get account by code
export const getAccountByCode = (code: string, accounts: Account[]): Account => {
  const account = accounts.find(a => a.code === code);
  if (!account) {
    throw new Error(`Account ${code} not found in Chart of Accounts`);
  }
  return account;
};

// Helper to create journal entry from transaction
export const createJournalEntryFromTransaction = (
  type: 'check-deposit' | 'reimbursement' | 'expense',
  data: any,
  accounts: Account[]
): JournalEntry => {
  const lines: JournalEntryLine[] = [];
  const entryId = `je-${type}-${Date.now()}`;
  
  switch (type) {
    case 'check-deposit':
      // Debit: Cash (increase asset)
      lines.push({
        id: `${entryId}-line-1`,
        journal_entry_id: entryId,
        account: getAccountByCode('1000', accounts), // Cash account
        line_number: 1,
        description: `Check deposit - ${data.payerName}`,
        memo: data.memo || '',
        debit_amount: data.amount,
        credit_amount: 0,
      });
      // Credit: Revenue (increase revenue)
      lines.push({
        id: `${entryId}-line-2`,
        journal_entry_id: entryId,
        account: data.account, // Revenue account from check data
        line_number: 2,
        description: `Check deposit - ${data.payerName}`,
        memo: data.memo || '',
        debit_amount: 0,
        credit_amount: data.amount,
      });
      break;
      
    case 'reimbursement':
    case 'expense':
      // Debit: Expense (increase expense)
      lines.push({
        id: `${entryId}-line-1`,
        journal_entry_id: entryId,
        account: data.account, // Expense account from transaction data
        line_number: 1,
        description: `${data.vendor} - ${data.description}`,
        memo: data.notes || '',
        debit_amount: data.amount,
        credit_amount: 0,
      });
      // Credit: Cash (decrease asset)
      lines.push({
        id: `${entryId}-line-2`,
        journal_entry_id: entryId,
        account: getAccountByCode('1000', accounts), // Cash account
        line_number: 2,
        description: `${data.vendor} - ${data.description}`,
        memo: data.notes || '',
        debit_amount: 0,
        credit_amount: data.amount,
      });
      break;
  }
  
  return {
    id: entryId,
    organization_id: 'org-1',
    entity_id: data.entityId,
    entry_number: `${type.toUpperCase()}-${Date.now()}`,
    entry_date: data.date,
    description: `${type} - ${data.vendor || data.payerName}`,
    memo: data.memo || data.notes || '',
    status: 'posted', // Auto-post these transactions
    source_type: type,
    source_id: data.id,
    created_by: 'Current User',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    posted_at: new Date().toISOString(),
    posted_by: 'System',
    lines,
  };
};
