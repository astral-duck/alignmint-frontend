# Chart of Accounts Manager

**Component File:** `src/components/ChartOfAccountsManager.tsx`  
**Route:** `/administration-hub` (with tool='chart-of-accounts')  
**Access Level:** Admin, Manager

## Overview
The Chart of Accounts Manager allows administrators to configure and manage the organization's accounting structure. It provides a comprehensive view of all account categories (Assets, Liabilities, Equity, Revenue, Expenses) and bank accounts. Users can create, edit, and deactivate accounts, maintaining the financial structure of the organization.

## UI Features

### Account Categories Tab
- **Account Type Filters:**
  - All Accounts
  - Assets
  - Liabilities
  - Equity
  - Revenue
  - Expenses
- **Search:** Search accounts by code or name
- **Account Table:**
  - Account code
  - Account name
  - Type badge
  - Description
  - Status (Active/Inactive)
  - Actions (Edit, Delete)
- **Actions:**
  - Add new account
  - Edit account
  - Delete/Deactivate account
  - View account hierarchy (parent-child relationships)

### Bank Accounts Tab
- **Bank Account List:**
  - Account name
  - Bank name
  - Account number (masked)
  - Account type (Checking, Savings, Credit)
  - Current balance
  - Status (Active/Inactive)
  - Actions (Edit, Delete)
- **Actions:**
  - Add new bank account
  - Edit bank account
  - Deactivate bank account

### Add/Edit Account Dialog
- Account code (e.g., 1000, 5001)
- Account name
- Account type (Asset, Liability, Equity, Revenue, Expense)
- Account subtype (optional, for more specific categorization)
- Parent account (optional, for hierarchical structure)
- Description
- Active status toggle

### Add/Edit Bank Account Dialog
- Account name
- Bank name
- Account number
- Routing number
- Account type (Checking, Savings, Credit)
- Initial/Current balance
- Active status toggle

## Data Requirements

### Account Data
- **id** (uuid) - Unique identifier
- **organization_id** (uuid) - Organization owner
- **account_number** (string) - Account code (e.g., '1000', '5001')
- **account_name** (string) - Account name
- **account_type** (string) - 'asset', 'liability', 'equity', 'income', 'expense'
- **account_subtype** (string, nullable) - More specific categorization
- **parent_account_id** (uuid, nullable) - Parent account for hierarchy
- **description** (text, nullable) - Account description
- **is_active** (boolean) - Active status
- **balance** (decimal) - Current balance (calculated)
- **created_at** (datetime) - When created
- **updated_at** (datetime) - When updated

### Bank Account Data
- **id** (uuid) - Unique identifier
- **organization_id** (uuid) - Organization owner
- **account_id** (uuid) - Linked to chart of accounts
- **account_name** (string) - Account name
- **bank_name** (string) - Bank institution name
- **account_number** (string) - Bank account number (encrypted)
- **routing_number** (string) - Bank routing number
- **account_type** (string) - 'checking', 'savings', 'credit'
- **current_balance** (decimal) - Current balance
- **is_active** (boolean) - Active status
- **created_at** (datetime) - When created
- **updated_at** (datetime) - When updated

### Data Mutations
- **Create Account:** Add new account to chart
- **Update Account:** Edit account details
- **Delete Account:** Soft delete (mark as inactive)
- **Create Bank Account:** Add new bank account
- **Update Bank Account:** Edit bank account details
- **Delete Bank Account:** Soft delete (mark as inactive)

## API Endpoints Required

### GET /api/v1/accounts
```
Description: Fetch chart of accounts for organization
Query Parameters:
  - organization_id (required, uuid)
  - account_type (optional, string) - Filter by type
  - is_active (optional, boolean) - Filter by status
  - include_balance (optional, boolean, default: true)
  - include_children (optional, boolean) - Include sub-accounts

Response: {
  data: [
    {
      id: "uuid",
      organization_id: "uuid",
      account_number: "1000",
      account_name: "Cash and Cash Equivalents",
      account_type: "asset",
      account_subtype: "current_asset",
      parent_account_id: null,
      description: "All cash accounts and equivalents",
      is_active: true,
      balance: 125000.00,
      children: [
        {
          id: "uuid",
          account_number: "1100",
          account_name: "Checking Accounts",
          balance: 75000.00
        }
      ],
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-11-08T10:00:00Z"
    }
  ],
  meta: {
    total: 45,
    by_type: {
      asset: 15,
      liability: 8,
      equity: 5,
      income: 7,
      expense: 10
    }
  }
}
```

### GET /api/v1/accounts/:id
```
Description: Get single account details
Path Parameters:
  - id (required, uuid)
Query Parameters:
  - organization_id (required, uuid)
  - include_transactions (optional, boolean) - Include recent transactions

Response: {
  data: {
    id: "uuid",
    ...all account fields,
    recent_transactions: [...]
  }
}
```

### POST /api/v1/accounts
```
Description: Create new account
Request Body: {
  organization_id: "uuid",
  account_number: "1000",
  account_name: "Cash and Cash Equivalents",
  account_type: "asset",
  account_subtype: "current_asset",
  parent_account_id: null,
  description: "All cash accounts and equivalents",
  is_active: true
}

Response: {
  data: {
    id: "uuid",
    ...all account fields
  },
  message: "Account created successfully"
}
```

### PUT /api/v1/accounts/:id
```
Description: Update existing account
Path Parameters:
  - id (required, uuid)
Request Body: {
  organization_id: "uuid",
  account_name: "Updated Name",
  description: "Updated description",
  is_active: true
}

Response: {
  data: {
    id: "uuid",
    ...updated account fields
  },
  message: "Account updated successfully"
}
```

### DELETE /api/v1/accounts/:id
```
Description: Soft delete account (mark as inactive)
Path Parameters:
  - id (required, uuid)
Query Parameters:
  - organization_id (required, uuid)

Response: {
  message: "Account deactivated successfully"
}

Note: Cannot delete accounts with transactions or child accounts
```

### GET /api/v1/accounts/:id/balance
```
Description: Get current balance for account
Path Parameters:
  - id (required, uuid)
Query Parameters:
  - organization_id (required, uuid)
  - as_of_date (optional, date) - Balance as of specific date

Response: {
  data: {
    account_id: "uuid",
    account_number: "1000",
    account_name: "Cash and Cash Equivalents",
    balance: 125000.00,
    as_of_date: "2024-11-08",
    last_transaction_date: "2024-11-07"
  }
}
```

### GET /api/v1/bank_accounts
```
Description: Fetch bank accounts for organization
Query Parameters:
  - organization_id (required, uuid)
  - is_active (optional, boolean)
  - account_type (optional, string) - 'checking', 'savings', 'credit'

Response: {
  data: [
    {
      id: "uuid",
      organization_id: "uuid",
      account_id: "uuid",
      account_name: "Operating Checking",
      bank_name: "First National Bank",
      account_number: "****1234",
      routing_number: "123456789",
      account_type: "checking",
      current_balance: 75000.00,
      is_active: true,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-11-08T10:00:00Z"
    }
  ]
}
```

### POST /api/v1/bank_accounts
```
Description: Create new bank account
Request Body: {
  organization_id: "uuid",
  account_id: "uuid",
  account_name: "Operating Checking",
  bank_name: "First National Bank",
  account_number: "1234567890",
  routing_number: "123456789",
  account_type: "checking",
  current_balance: 0.00,
  is_active: true
}

Response: {
  data: {
    id: "uuid",
    ...all bank account fields (account_number masked)
  },
  message: "Bank account created successfully"
}
```

### PUT /api/v1/bank_accounts/:id
```
Description: Update bank account
Path Parameters:
  - id (required, uuid)
Request Body: {
  organization_id: "uuid",
  account_name: "Updated Name",
  bank_name: "Updated Bank",
  is_active: true
}

Response: {
  data: {
    id: "uuid",
    ...updated fields
  },
  message: "Bank account updated successfully"
}
```

### DELETE /api/v1/bank_accounts/:id
```
Description: Soft delete bank account
Path Parameters:
  - id (required, uuid)
Query Parameters:
  - organization_id (required, uuid)

Response: {
  message: "Bank account deactivated successfully"
}
```

## Request/Response Schemas

### Account Schema
```typescript
interface Account {
  id: string;
  organization_id: string;
  account_number: string;
  account_name: string;
  account_type: 'asset' | 'liability' | 'equity' | 'income' | 'expense';
  account_subtype?: string;
  parent_account_id?: string;
  description?: string;
  is_active: boolean;
  balance: number;
  children?: Account[];
  created_at: string;
  updated_at: string;
}

interface BankAccount {
  id: string;
  organization_id: string;
  account_id: string;
  account_name: string;
  bank_name: string;
  account_number: string; // Masked in responses
  routing_number: string;
  account_type: 'checking' | 'savings' | 'credit';
  current_balance: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
```

## Authentication & Authorization

### Required Permissions
- `accounts:read` - View chart of accounts
- `accounts:write` - Create and update accounts
- `accounts:delete` - Delete accounts
- `bank_accounts:read` - View bank accounts
- `bank_accounts:write` - Create and update bank accounts
- `bank_accounts:delete` - Delete bank accounts

### Role-Based Access
- **Admin:** Full access to all account management
- **Manager:** Can view and edit; cannot delete
- **Staff:** Can view only
- **Volunteer:** No access

## Business Logic & Validations

### Frontend Validations
- Account number required and must be unique
- Account name required
- Account type required
- Cannot delete account with transactions
- Cannot delete account with child accounts
- Bank account number must be valid format
- Routing number must be 9 digits

### Backend Validations (Rails)
- Account number unique within organization
- Valid account type
- Parent account must exist and be same type
- Cannot create circular hierarchy
- Bank account number encrypted at rest
- Cannot delete account with non-zero balance
- Cannot delete account referenced in transactions

### Business Rules
- Accounts follow standard accounting hierarchy
- Asset, Liability, Equity accounts use debit/credit rules
- Income and Expense accounts follow accrual accounting
- Bank accounts must link to chart of accounts
- Inactive accounts hidden from transaction entry but visible in reports
- Account balances calculated from journal entries
- Standard account codes:
  - 1000-1999: Assets
  - 2000-2999: Liabilities
  - 3000-3999: Equity
  - 4000-4999: Income/Revenue
  - 5000-5999: Expenses

## State Management

### Local State
- `selectedTab` - 'categories' or 'bank-accounts'
- `accountTypeFilter` - Filter by account type
- `searchQuery` - Search input
- `addAccountOpen` - Add account dialog
- `editAccountOpen` - Edit account dialog
- `deleteAccountOpen` - Delete confirmation dialog
- `selectedAccount` - Currently selected account
- `newAccount` - Form state for new account
- `newBankAccount` - Form state for new bank account

### Global State (AppContext)
- `selectedEntity` - Current organization

## Dependencies

### Internal Dependencies
- `AppContext` - Global state
- Mock data - **TO BE REMOVED**
- UI components (Card, Button, Table, Dialog, etc.)

### External Libraries
- `lucide-react` - Icons
- `sonner` - Toast notifications

## Error Handling

### Error Scenarios
1. **Network Error:** Show toast "Unable to load accounts", retry button
2. **Validation Error:** Show inline field errors
3. **Duplicate Account Number:** Show error "Account number already exists"
4. **Cannot Delete:** Show error "Cannot delete account with transactions"
5. **Permission Error:** Show toast "You don't have permission"

## Loading States
- **Initial load:** Skeleton table
- **Form submission:** Disable button, show spinner
- **Delete confirmation:** Show warning about consequences

## Mock Data to Remove
- `ChartOfAccountsManager.tsx` - `generateMockAccounts()` function
- `ChartOfAccountsManager.tsx` - `mockBankAccounts` array
- Move interfaces to `src/types/account.ts`

## Migration Notes

### Phase 1: API Integration
1. Create `src/api/accounts.ts`
2. Create `src/types/account.ts`
3. Replace mock data with API calls
4. Add loading/error states

### Phase 2: CRUD Operations
1. Implement create account
2. Implement update account
3. Implement delete account
4. Test hierarchy relationships

### Phase 3: Bank Accounts
1. Implement bank account CRUD
2. Link to chart of accounts
3. Implement balance tracking

## Related Documentation
- [04-GENERAL-LEDGER.md](./04-GENERAL-LEDGER.md) - Transaction tracking
- [05-JOURNAL-ENTRY-MANAGER.md](./05-JOURNAL-ENTRY-MANAGER.md) - Journal entries
- [01-DATA-SCHEMA.md](../01-DATA-SCHEMA.md) - Account data model
