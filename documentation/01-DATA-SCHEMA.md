# Complete Data Schema

This document defines all data models needed for the backend Rails API.

## Core Entities

### 1. Organization (Nonprofit)
```ruby
# Table: organizations
{
  id: uuid (primary key),
  name: string,
  slug: string (unique), # e.g., 'awakenings', 'bloom-strong'
  type: string, # 'nonprofit' or 'all'
  status: string, # 'active', 'inactive', 'pending'
  settings: jsonb, # Organization-specific settings
  created_at: datetime,
  updated_at: datetime
}
```

### 2. User
```ruby
# Table: users
{
  id: uuid (primary key),
  email: string (unique),
  encrypted_password: string,
  first_name: string,
  last_name: string,
  role: string, # 'admin', 'manager', 'staff', 'volunteer'
  avatar_url: string (nullable),
  phone: string (nullable),
  status: string, # 'active', 'inactive', 'pending'
  last_sign_in_at: datetime,
  created_at: datetime,
  updated_at: datetime
}
```

### 3. OrganizationUser (Join Table)
```ruby
# Table: organization_users
{
  id: uuid (primary key),
  organization_id: uuid (foreign key -> organizations),
  user_id: uuid (foreign key -> users),
  role: string, # 'admin', 'manager', 'staff', 'viewer'
  permissions: jsonb, # Granular permissions
  created_at: datetime,
  updated_at: datetime
}
# Indexes: [organization_id, user_id] (unique), organization_id, user_id
```

## Donor Management

### 4. Donor
```ruby
# Table: donors
{
  id: uuid (primary key),
  organization_id: uuid (foreign key -> organizations),
  first_name: string,
  last_name: string,
  email: string,
  phone: string (nullable),
  address_line1: string (nullable),
  address_line2: string (nullable),
  city: string (nullable),
  state: string (nullable),
  zip_code: string (nullable),
  country: string (default: 'US'),
  donor_type: string, # 'individual', 'organization', 'foundation'
  status: string, # 'active', 'inactive', 'lapsed'
  total_donated: decimal(12,2) (default: 0),
  first_donation_date: date (nullable),
  last_donation_date: date (nullable),
  donation_count: integer (default: 0),
  tags: string[], # Array of tags
  notes: text (nullable),
  created_at: datetime,
  updated_at: datetime
}
# Indexes: organization_id, email, [organization_id, email]
```

### 5. Donation
```ruby
# Table: donations
{
  id: uuid (primary key),
  organization_id: uuid (foreign key -> organizations),
  donor_id: uuid (foreign key -> donors),
  amount: decimal(12,2),
  currency: string (default: 'USD'),
  donation_type: string, # 'one-time', 'recurring', 'pledge'
  payment_method: string, # 'credit_card', 'check', 'cash', 'ach', 'wire'
  payment_status: string, # 'completed', 'pending', 'failed', 'refunded'
  transaction_id: string (nullable), # External payment processor ID
  fund_id: uuid (foreign key -> funds, nullable),
  campaign_id: uuid (foreign key -> campaigns, nullable),
  designation: string (nullable), # Specific purpose
  is_anonymous: boolean (default: false),
  is_recurring: boolean (default: false),
  recurring_frequency: string (nullable), # 'weekly', 'monthly', 'quarterly', 'yearly'
  recurring_day: integer (nullable), # Day of month/week
  recurring_end_date: date (nullable),
  check_number: string (nullable),
  deposited_at: datetime (nullable),
  donation_date: date,
  notes: text (nullable),
  created_at: datetime,
  updated_at: datetime
}
# Indexes: organization_id, donor_id, donation_date, payment_status, fund_id
```

### 6. DonorPage
```ruby
# Table: donor_pages
{
  id: uuid (primary key),
  organization_id: uuid (foreign key -> organizations),
  title: string,
  slug: string, # URL-friendly identifier
  description: text (nullable),
  goal_amount: decimal(12,2) (nullable),
  current_amount: decimal(12,2) (default: 0),
  is_active: boolean (default: true),
  custom_fields: jsonb, # Custom form fields
  theme_settings: jsonb, # Colors, fonts, etc.
  header_image_url: string (nullable),
  video_url: string (nullable),
  published_at: datetime (nullable),
  expires_at: datetime (nullable),
  created_at: datetime,
  updated_at: datetime
}
# Indexes: organization_id, slug, [organization_id, slug] (unique)
```

### 7. Prospect
```ruby
# Table: prospects
{
  id: uuid (primary key),
  organization_id: uuid (foreign key -> organizations),
  name: string,
  email: string,
  phone: string (nullable),
  source: string, # 'website', 'event', 'referral', 'social_media'
  status: string, # 'new', 'contacted', 'qualified', 'converted', 'lost'
  notes: text (nullable),
  added_date: date,
  converted_to_donor_id: uuid (foreign key -> donors, nullable),
  created_at: datetime,
  updated_at: datetime
}
# Indexes: organization_id, email, status
```

## Accounting & Finance

### 8. Fund
```ruby
# Table: funds
{
  id: uuid (primary key),
  organization_id: uuid (foreign key -> organizations),
  name: string,
  code: string, # e.g., '3116', '3127'
  description: text (nullable),
  fund_type: string, # 'unrestricted', 'temporarily_restricted', 'permanently_restricted'
  is_active: boolean (default: true),
  balance: decimal(12,2) (default: 0),
  created_at: datetime,
  updated_at: datetime
}
# Indexes: organization_id, code, [organization_id, code] (unique)
```

### 9. Account (Chart of Accounts)
```ruby
# Table: accounts
{
  id: uuid (primary key),
  organization_id: uuid (foreign key -> organizations),
  account_number: string, # e.g., '1000', '5001'
  account_name: string,
  account_type: string, # 'asset', 'liability', 'equity', 'income', 'expense'
  account_subtype: string (nullable), # More specific categorization
  parent_account_id: uuid (foreign key -> accounts, nullable),
  description: text (nullable),
  is_active: boolean (default: true),
  balance: decimal(12,2) (default: 0),
  created_at: datetime,
  updated_at: datetime
}
# Indexes: organization_id, account_number, [organization_id, account_number] (unique)
```

### 10. JournalEntry
```ruby
# Table: journal_entries
{
  id: uuid (primary key),
  organization_id: uuid (foreign key -> organizations),
  entry_number: string, # Auto-generated or manual
  entry_date: date,
  description: text,
  reference: string (nullable), # Check number, invoice number, etc.
  status: string, # 'draft', 'posted', 'voided'
  created_by_id: uuid (foreign key -> users),
  posted_at: datetime (nullable),
  created_at: datetime,
  updated_at: datetime
}
# Indexes: organization_id, entry_date, status
```

### 11. JournalEntryLine
```ruby
# Table: journal_entry_lines
{
  id: uuid (primary key),
  journal_entry_id: uuid (foreign key -> journal_entries),
  account_id: uuid (foreign key -> accounts),
  fund_id: uuid (foreign key -> funds, nullable),
  debit_amount: decimal(12,2) (default: 0),
  credit_amount: decimal(12,2) (default: 0),
  description: text (nullable),
  line_order: integer,
  created_at: datetime,
  updated_at: datetime
}
# Indexes: journal_entry_id, account_id
# Constraint: (debit_amount > 0 AND credit_amount = 0) OR (credit_amount > 0 AND debit_amount = 0)
```

### 12. Expense
```ruby
# Table: expenses
{
  id: uuid (primary key),
  organization_id: uuid (foreign key -> organizations),
  account_id: uuid (foreign key -> accounts),
  fund_id: uuid (foreign key -> funds, nullable),
  vendor_name: string,
  amount: decimal(12,2),
  expense_date: date,
  payment_method: string, # 'check', 'credit_card', 'ach', 'cash'
  check_number: string (nullable),
  reference_number: string (nullable),
  description: text,
  category: string, # Maps to account types
  receipt_url: string (nullable),
  status: string, # 'pending', 'approved', 'paid', 'rejected'
  approved_by_id: uuid (foreign key -> users, nullable),
  approved_at: datetime (nullable),
  created_by_id: uuid (foreign key -> users),
  created_at: datetime,
  updated_at: datetime
}
# Indexes: organization_id, expense_date, status, account_id
```

### 13. Reimbursement
```ruby
# Table: reimbursements
{
  id: uuid (primary key),
  organization_id: uuid (foreign key -> organizations),
  user_id: uuid (foreign key -> users), # Person requesting reimbursement
  amount: decimal(12,2),
  description: text,
  expense_date: date,
  category: string,
  receipt_url: string (nullable),
  status: string, # 'pending', 'approved', 'paid', 'rejected'
  approved_by_id: uuid (foreign key -> users, nullable),
  approved_at: datetime (nullable),
  paid_at: datetime (nullable),
  payment_method: string (nullable),
  notes: text (nullable),
  created_at: datetime,
  updated_at: datetime
}
# Indexes: organization_id, user_id, status, expense_date
```

### 14. Deposit
```ruby
# Table: deposits
{
  id: uuid (primary key),
  organization_id: uuid (foreign key -> organizations),
  deposit_type: string, # 'check', 'cash', 'mixed'
  deposit_date: date,
  bank_account_id: uuid (foreign key -> accounts), # The account being deposited to
  total_amount: decimal(12,2),
  check_count: integer (default: 0),
  status: string, # 'pending', 'deposited', 'cleared'
  deposited_by_id: uuid (foreign key -> users),
  deposit_slip_url: string (nullable),
  notes: text (nullable),
  created_at: datetime,
  updated_at: datetime
}
# Indexes: organization_id, deposit_date, status
```

### 15. DepositItem
```ruby
# Table: deposit_items
{
  id: uuid (primary key),
  deposit_id: uuid (foreign key -> deposits),
  donation_id: uuid (foreign key -> donations, nullable),
  item_type: string, # 'check', 'cash'
  amount: decimal(12,2),
  check_number: string (nullable),
  payer_name: string (nullable),
  created_at: datetime,
  updated_at: datetime
}
# Indexes: deposit_id, donation_id
```

### 16. Reconciliation
```ruby
# Table: reconciliations
{
  id: uuid (primary key),
  organization_id: uuid (foreign key -> organizations),
  account_id: uuid (foreign key -> accounts),
  reconciliation_date: date,
  statement_date: date,
  beginning_balance: decimal(12,2),
  ending_balance: decimal(12,2),
  statement_balance: decimal(12,2),
  difference: decimal(12,2),
  status: string, # 'in_progress', 'completed', 'reviewed'
  reconciled_by_id: uuid (foreign key -> users),
  reviewed_by_id: uuid (foreign key -> users, nullable),
  notes: text (nullable),
  created_at: datetime,
  updated_at: datetime
}
# Indexes: organization_id, account_id, reconciliation_date
```

### 17. ReconciliationItem
```ruby
# Table: reconciliation_items
{
  id: uuid (primary key),
  reconciliation_id: uuid (foreign key -> reconciliations),
  transaction_id: uuid (nullable), # Could reference various transaction types
  transaction_type: string, # 'journal_entry', 'donation', 'expense', etc.
  transaction_date: date,
  description: string,
  amount: decimal(12,2),
  is_cleared: boolean (default: false),
  created_at: datetime,
  updated_at: datetime
}
# Indexes: reconciliation_id, transaction_id
```

### 18. Distribution
```ruby
# Table: distributions
{
  id: uuid (primary key),
  organization_id: uuid (foreign key -> organizations),
  recipient_name: string,
  amount: decimal(12,2),
  distribution_date: date,
  fund_id: uuid (foreign key -> funds, nullable),
  account_id: uuid (foreign key -> accounts),
  payment_method: string, # 'check', 'ach', 'wire'
  check_number: string (nullable),
  description: text,
  status: string, # 'pending', 'approved', 'paid'
  approved_by_id: uuid (foreign key -> users, nullable),
  created_by_id: uuid (foreign key -> users),
  created_at: datetime,
  updated_at: datetime
}
# Indexes: organization_id, distribution_date, status
```

## Personnel & Volunteers

### 19. PersonnelGroup
```ruby
# Table: personnel_groups
{
  id: uuid (primary key),
  organization_id: uuid (foreign key -> organizations),
  name: string,
  description: text (nullable),
  group_type: string, # 'staff', 'volunteer', 'board', 'committee'
  is_active: boolean (default: true),
  created_at: datetime,
  updated_at: datetime
}
# Indexes: organization_id
```

### 20. PersonnelMember
```ruby
# Table: personnel_members
{
  id: uuid (primary key),
  organization_id: uuid (foreign key -> organizations),
  user_id: uuid (foreign key -> users, nullable), # If they have system access
  first_name: string,
  last_name: string,
  email: string,
  phone: string (nullable),
  member_type: string, # 'staff', 'volunteer', 'board_member'
  status: string, # 'active', 'inactive', 'on_leave'
  hire_date: date (nullable),
  termination_date: date (nullable),
  position: string (nullable),
  department: string (nullable),
  hourly_rate: decimal(8,2) (nullable),
  notes: text (nullable),
  created_at: datetime,
  updated_at: datetime
}
# Indexes: organization_id, email, member_type, status
```

### 21. PersonnelGroupMember (Join Table)
```ruby
# Table: personnel_group_members
{
  id: uuid (primary key),
  personnel_group_id: uuid (foreign key -> personnel_groups),
  personnel_member_id: uuid (foreign key -> personnel_members),
  joined_at: date,
  role: string (nullable),
  created_at: datetime,
  updated_at: datetime
}
# Indexes: [personnel_group_id, personnel_member_id] (unique)
```

### 22. HourEntry
```ruby
# Table: hour_entries
{
  id: uuid (primary key),
  organization_id: uuid (foreign key -> organizations),
  personnel_member_id: uuid (foreign key -> personnel_members),
  entry_date: date,
  hours: decimal(5,2),
  activity_type: string, # 'volunteer', 'work', 'training', 'meeting'
  description: text (nullable),
  status: string, # 'pending', 'approved', 'rejected'
  approved_by_id: uuid (foreign key -> users, nullable),
  approved_at: datetime (nullable),
  created_at: datetime,
  updated_at: datetime
}
# Indexes: organization_id, personnel_member_id, entry_date, status
```

### 23. LeaveRequest
```ruby
# Table: leave_requests
{
  id: uuid (primary key),
  organization_id: uuid (foreign key -> organizations),
  personnel_member_id: uuid (foreign key -> personnel_members),
  leave_type: string, # 'vacation', 'sick', 'personal', 'unpaid'
  start_date: date,
  end_date: date,
  total_days: decimal(4,1),
  reason: text (nullable),
  status: string, # 'pending', 'approved', 'rejected', 'cancelled'
  approved_by_id: uuid (foreign key -> users, nullable),
  approved_at: datetime (nullable),
  notes: text (nullable),
  created_at: datetime,
  updated_at: datetime
}
# Indexes: organization_id, personnel_member_id, status, start_date
```

## Marketing

### 24. Campaign
```ruby
# Table: campaigns
{
  id: uuid (primary key),
  organization_id: uuid (foreign key -> organizations),
  name: string,
  description: text (nullable),
  campaign_type: string, # 'email', 'social', 'event', 'direct_mail'
  status: string, # 'draft', 'scheduled', 'active', 'completed', 'cancelled'
  goal_amount: decimal(12,2) (nullable),
  raised_amount: decimal(12,2) (default: 0),
  start_date: date (nullable),
  end_date: date (nullable),
  created_by_id: uuid (foreign key -> users),
  created_at: datetime,
  updated_at: datetime
}
# Indexes: organization_id, status, start_date
```

### 25. VideoBomb
```ruby
# Table: video_bombs
{
  id: uuid (primary key),
  organization_id: uuid (foreign key -> organizations),
  title: string,
  video_url: string,
  thumbnail_url: string (nullable),
  description: text (nullable),
  is_active: boolean (default: true),
  view_count: integer (default: 0),
  created_by_id: uuid (foreign key -> users),
  created_at: datetime,
  updated_at: datetime
}
# Indexes: organization_id, is_active
```

## System & Configuration

### 26. Todo
```ruby
# Table: todos
{
  id: uuid (primary key),
  organization_id: uuid (foreign key -> organizations),
  user_id: uuid (foreign key -> users),
  title: string,
  description: text (nullable),
  completed: boolean (default: false),
  due_date: date (nullable),
  is_recurring: boolean (default: false),
  recurring_frequency: string (nullable), # 'daily', 'weekly', 'monthly', 'yearly'
  next_due_date: date (nullable),
  completed_at: datetime (nullable),
  created_at: datetime,
  updated_at: datetime
}
# Indexes: organization_id, user_id, completed, due_date
```

### 27. Notification
```ruby
# Table: notifications
{
  id: uuid (primary key),
  organization_id: uuid (foreign key -> organizations),
  user_id: uuid (foreign key -> users),
  title: string,
  message: text,
  category: string, # 'financial', 'operational', 'alert', 'system'
  is_read: boolean (default: false),
  read_at: datetime (nullable),
  action_url: string (nullable),
  created_at: datetime,
  updated_at: datetime
}
# Indexes: organization_id, user_id, is_read, created_at
```

### 28. AuditLog
```ruby
# Table: audit_logs
{
  id: uuid (primary key),
  organization_id: uuid (foreign key -> organizations),
  user_id: uuid (foreign key -> users),
  action: string, # 'create', 'update', 'delete'
  resource_type: string, # Model name
  resource_id: uuid,
  changes: jsonb, # What changed
  ip_address: string (nullable),
  user_agent: string (nullable),
  created_at: datetime
}
# Indexes: organization_id, user_id, resource_type, resource_id, created_at
```

## Relationships Summary

### One-to-Many
- Organization → Users (through OrganizationUser)
- Organization → Donors
- Organization → Donations
- Organization → Funds
- Organization → Accounts
- Organization → Campaigns
- Donor → Donations
- Fund → Donations
- JournalEntry → JournalEntryLines
- Deposit → DepositItems
- Reconciliation → ReconciliationItems

### Many-to-Many
- Users ↔ Organizations (through OrganizationUser)
- PersonnelGroups ↔ PersonnelMembers (through PersonnelGroupMember)

## Data Validation Rules

### Financial
- All monetary amounts must be non-negative (except for certain adjustment entries)
- Journal entries must balance (total debits = total credits)
- Deposits must have at least one deposit item
- Reconciliation difference should be zero when completed

### Dates
- End dates must be after start dates
- Donation dates cannot be in the future
- Fiscal year constraints for reporting

### Business Rules
- Donors must belong to an organization
- Users can belong to multiple organizations with different roles
- Soft deletes for most entities (add `deleted_at` timestamp)
- All financial transactions require audit trail

## Next Steps
1. Review and approve this schema
2. Identify any missing entities or fields
3. Define API endpoints for each entity
4. Create migration files in Rails
5. Set up model validations and associations
