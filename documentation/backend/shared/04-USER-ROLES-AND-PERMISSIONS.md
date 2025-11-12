# User Roles and Permissions

**Version:** 1.0  
**Last Updated:** November 10, 2025

---

## Overview

The IFM MVP implements a strict role-based access control (RBAC) system with four distinct user roles. Each role has specific access levels, visible modules, and data permissions designed to maintain data isolation between nonprofit entities while enabling the fiscal sponsor to oversee all operations.

---

## Table of Contents

1. [Role Hierarchy](#role-hierarchy)
2. [Fiscal Sponsor Role](#fiscal-sponsor-role)
3. [Nonprofit Role](#nonprofit-role)
4. [Donor Role](#donor-role)
5. [Volunteer Role](#volunteer-role)
6. [Permission Matrix](#permission-matrix)
7. [Data Isolation Rules](#data-isolation-rules)
8. [Implementation Guidelines](#implementation-guidelines)

---

## Role Hierarchy

```
Fiscal Sponsor (Super Admin)
    ↓
Nonprofit User (Entity Admin)
    ↓
Donor (Limited Access)
    ↓
Volunteer (Minimal Access)
```

### Role Assignment
- Users are assigned ONE primary role
- Role determines visible sidebar items and accessible features
- Role determines data scope (all entities vs single entity)
- Role cannot be self-assigned (must be set by administrator)

---

## Fiscal Sponsor Role

**Role Name:** `fiscal_sponsor`  
**Display Name:** Fiscal Sponsor Administrator  
**Organization Access:** ALL (34 nonprofits)  
**Data Scope:** Global - can view and manage all nonprofit data

### Access Level: FULL SYSTEM ACCESS

#### Visible Sidebar Items
✅ **Dashboard** - Full access  
✅ **Donor Hub** - Full access to all tools  
✅ **People** - Full access to all tools  
✅ **Marketing** - Full access to all tools  
✅ **Accounting** - Full access to all tools  
✅ **Reports** - Full access to all reports  
✅ **Administration** - Full access to all admin tools

#### Specific Capabilities

**Dashboard:**
- View consolidated metrics across all 34 nonprofits
- Switch between "All Organizations" and individual nonprofits
- Customize dashboard layout
- Access all time period filters

**Donor Hub:**
- ✅ Donors CRM - View/edit donors from all nonprofits
- ✅ Donations Manager - View/edit donations from all nonprofits
- ✅ Donor Page Builder - Create/edit pages for any nonprofit
- ✅ Donor Portal - View any donor's portal (admin view)

**People:**
- ✅ Personnel CRM - View/edit all staff across all nonprofits
- ✅ Volunteers CRM - View/edit all volunteers
- ✅ Hour Tracking - View/approve hours for all entities

**Marketing:**
- ✅ Email Campaigns - Create/send campaigns for any nonprofit
- ✅ Prospects List - View/manage prospects for all nonprofits
- ✅ VideoBomb Manager - Create video pages for any nonprofit

**Accounting:**
- ✅ Chart of Accounts - Manage accounts for all nonprofits
- ✅ General Ledger - View all transactions across all entities
- ✅ Journal Entry Manager - Create entries for any nonprofit
- ✅ Expenses Manager - View/approve expenses for all nonprofits
- ✅ Reimbursements Manager - View/approve reimbursements for all
- ✅ Check Deposit Manager - Process deposits for any nonprofit
- ✅ Reconciliation Manager - Reconcile accounts for all nonprofits

**Reports:**
- ✅ Balance Sheet - Generate for any nonprofit or consolidated
- ✅ Income Statement - Generate for any nonprofit or consolidated
- ✅ Profit & Loss - Generate for any nonprofit or consolidated
- ✅ Fund Accounting - View all fund allocations
- ✅ Volunteer Hours Report - View hours across all nonprofits
- ✅ All other reports - Full access

**Administration:**
- ✅ User Management - Create/edit users for all nonprofits
- ✅ Nonprofit Management - Add/edit/configure all 34 nonprofits
- ✅ Settings - Configure system-wide settings
- ✅ Distribution Manager - Manage fiscal sponsor distributions

#### Data Permissions

**Read Access:**
- ALL donor records across all nonprofits
- ALL donation records across all nonprofits
- ALL personnel and volunteer records
- ALL financial transactions and accounts
- ALL campaigns and marketing data
- ALL reports and analytics

**Write Access:**
- Create/edit/delete donors for any nonprofit
- Create/edit/delete donations for any nonprofit
- Create/edit/delete personnel and volunteers
- Create/edit/delete financial transactions
- Create/edit/delete campaigns
- Approve expenses and reimbursements for any nonprofit
- Reconcile accounts for any nonprofit
- Manage users across all nonprofits

**Special Permissions:**
- Switch organization context to view any nonprofit's data
- Access "All Organizations" consolidated view
- Manage fiscal sponsor distributions
- Configure system-wide settings
- Create and manage nonprofit entities
- Assign roles to users across all nonprofits

#### Organization Selector Behavior
- Dropdown shows: "All Organizations" + all 34 nonprofits
- Can switch between any organization at any time
- Selection persists across sessions
- "All Organizations" shows consolidated/aggregated data

---

## Nonprofit Role

**Role Name:** `nonprofit_user`  
**Display Name:** Nonprofit User  
**Organization Access:** SINGLE (assigned nonprofit only)  
**Data Scope:** Entity-specific - can only view/manage their nonprofit's data

### Access Level: FULL ACCESS TO ASSIGNED NONPROFIT ONLY

#### Visible Sidebar Items
✅ **Dashboard** - Access to their nonprofit only  
✅ **Donor Hub** - Full access to all tools (their data only)  
✅ **People** - Full access to all tools (their data only)  
✅ **Marketing** - Full access to all tools (their data only)  
✅ **Accounting** - Full access to all tools (their data only)  
✅ **Reports** - Full access to all reports (their data only)  
✅ **Administration** - LIMITED access (see below)

#### Specific Capabilities

**Dashboard:**
- View metrics for their nonprofit only
- NO "All Organizations" option
- Organization selector shows ONLY their nonprofit (locked)
- Customize dashboard layout
- Access all time period filters

**Donor Hub:**
- ✅ Donors CRM - View/edit donors for their nonprofit only
- ✅ Donations Manager - View/edit donations for their nonprofit only
- ✅ Donor Page Builder - Create/edit pages for their nonprofit only
- ✅ Donor Portal - View their donors' portals (admin view)

**People:**
- ✅ Personnel CRM - View/edit staff for their nonprofit only
- ✅ Volunteers CRM - View/edit volunteers for their nonprofit only
- ✅ Hour Tracking - View/approve hours for their nonprofit only

**Marketing:**
- ✅ Email Campaigns - Create/send campaigns for their nonprofit only
- ✅ Prospects List - View/manage prospects for their nonprofit only
- ✅ VideoBomb Manager - Create video pages for their nonprofit only

**Accounting:**
- ✅ Chart of Accounts - Manage accounts for their nonprofit only
- ✅ General Ledger - View transactions for their nonprofit only
- ✅ Journal Entry Manager - Create entries for their nonprofit only
- ✅ Expenses Manager - View/approve expenses for their nonprofit only
- ✅ Reimbursements Manager - View/approve reimbursements for their nonprofit only
- ✅ Check Deposit Manager - Process deposits for their nonprofit only
- ✅ Reconciliation Manager - Reconcile accounts for their nonprofit only

**Reports:**
- ✅ Balance Sheet - Generate for their nonprofit only
- ✅ Income Statement - Generate for their nonprofit only
- ✅ Profit & Loss - Generate for their nonprofit only
- ✅ Fund Accounting - View their fund allocations only
- ✅ Volunteer Hours Report - View hours for their nonprofit only
- ✅ All other reports - Their nonprofit only

**Administration:**
- ✅ User Management - Create/edit users for their nonprofit only
- ❌ Nonprofit Management - NO ACCESS (cannot edit nonprofit settings)
- ✅ Settings - Configure their nonprofit's settings only
- ❌ Distribution Manager - NO ACCESS (fiscal sponsor only)

#### Data Permissions

**Read Access:**
- ONLY donor records for their nonprofit
- ONLY donation records for their nonprofit
- ONLY personnel and volunteer records for their nonprofit
- ONLY financial transactions for their nonprofit
- ONLY campaigns for their nonprofit
- ONLY reports for their nonprofit

**Write Access:**
- Create/edit/delete donors for their nonprofit only
- Create/edit/delete donations for their nonprofit only
- Create/edit/delete personnel and volunteers for their nonprofit only
- Create/edit/delete financial transactions for their nonprofit only
- Create/edit/delete campaigns for their nonprofit only
- Approve expenses and reimbursements for their nonprofit only
- Reconcile accounts for their nonprofit only
- Manage users for their nonprofit only

**Restrictions:**
- ❌ CANNOT view data from other nonprofits
- ❌ CANNOT edit other nonprofits' data
- ❌ CANNOT access consolidated "All Organizations" view
- ❌ CANNOT manage fiscal sponsor distributions
- ❌ CANNOT create or configure nonprofit entities
- ❌ CANNOT assign users to other nonprofits

#### Organization Selector Behavior
- Dropdown shows ONLY their assigned nonprofit
- Selector is effectively locked (no switching)
- Cannot select "All Organizations"
- All API calls automatically filtered to their nonprofit

---

## Donor Role

**Role Name:** `donor`  
**Display Name:** Donor  
**Organization Access:** NONE (public access to own data)  
**Data Scope:** Self-only - can only view their own donor profile and donations

### Access Level: DONOR PORTAL ONLY

#### Visible Sidebar Items
❌ **Dashboard** - HIDDEN  
✅ **Donor Hub** - LIMITED (Donor Portal only)  
❌ **People** - HIDDEN  
❌ **Marketing** - HIDDEN  
❌ **Accounting** - HIDDEN  
❌ **Reports** - HIDDEN  
❌ **Administration** - HIDDEN

#### Specific Capabilities

**Donor Hub:**
- ❌ Donors CRM - HIDDEN
- ❌ Donations Manager - HIDDEN
- ❌ Donor Page Builder - HIDDEN
- ✅ **Donor Portal** - ONLY accessible feature

**Donor Portal Features:**
- ✅ View their own donation history
- ✅ Download receipts for their donations
- ✅ Generate annual tax statements
- ✅ Update their profile information
- ✅ Manage recurring donations (pause/resume/cancel)
- ✅ Update payment methods
- ✅ Set communication preferences
- ✅ View total giving summary

**All Other Modules:**
- Completely hidden from sidebar
- No access to any other features
- Attempting to access via URL redirects to Donor Portal

#### Data Permissions

**Read Access:**
- ONLY their own donor profile
- ONLY their own donation history
- ONLY their own payment methods
- ONLY their own communication preferences

**Write Access:**
- Update their own profile information
- Manage their own recurring donations
- Update their own payment methods
- Update their own communication preferences

**Restrictions:**
- ❌ CANNOT view other donors' information
- ❌ CANNOT view any nonprofit operational data
- ❌ CANNOT access financial reports
- ❌ CANNOT view personnel or volunteer information
- ❌ CANNOT access any administrative functions
- ❌ CANNOT view nonprofit's internal data

#### Authentication
- Separate donor authentication system
- Email + password login
- Password reset via email
- Optional: Social login (Google, Facebook)
- Session timeout for security

#### UI Behavior
- Simplified navigation (no sidebar or only Donor Portal)
- Custom donor-facing branding
- Mobile-optimized interface
- Public-facing design (not internal admin UI)

---

## Volunteer Role

**Role Name:** `volunteer`  
**Display Name:** Volunteer  
**Organization Access:** SINGLE (assigned nonprofit only)  
**Data Scope:** Self-only - can only view/manage their own hours

### Access Level: HOUR TRACKING ONLY

#### Visible Sidebar Items
❌ **Dashboard** - HIDDEN  
❌ **Donor Hub** - HIDDEN  
✅ **People** - LIMITED (Hour Tracking only)  
❌ **Marketing** - HIDDEN  
❌ **Accounting** - HIDDEN  
❌ **Reports** - HIDDEN  
❌ **Administration** - HIDDEN

#### Specific Capabilities

**People Hub:**
- ❌ Personnel CRM - HIDDEN
- ❌ Volunteers CRM - HIDDEN
- ✅ **Hour Tracking** - ONLY accessible feature

**Hour Tracking Features:**
- ✅ Submit hour entries for their volunteer work
- ✅ View their own hour history
- ✅ Edit pending (unapproved) hour entries
- ✅ Delete pending hour entries
- ✅ View approval status of submitted hours
- ✅ View total hours summary (approved hours)
- ✅ Filter their hours by date range
- ✅ Add notes/descriptions to hour entries

**All Other Modules:**
- Completely hidden from sidebar
- No access to any other features
- Attempting to access via URL redirects to Hour Tracking

#### Data Permissions

**Read Access:**
- ONLY their own hour entries
- ONLY their own volunteer profile (basic info)
- ONLY their own hour summary statistics

**Write Access:**
- Create new hour entries for themselves
- Edit their own pending (unapproved) hour entries
- Delete their own pending hour entries
- Update their own basic profile information (contact info)

**Restrictions:**
- ❌ CANNOT view other volunteers' hours
- ❌ CANNOT approve hour entries (even their own)
- ❌ CANNOT view personnel information
- ❌ CANNOT access donor or donation data
- ❌ CANNOT access financial data
- ❌ CANNOT view reports
- ❌ CANNOT access any administrative functions
- ❌ CANNOT view nonprofit's operational data

#### Authentication
- Standard user authentication
- Email + password login
- Password reset via email
- Linked to volunteer profile in Volunteers CRM

#### UI Behavior
- Simplified navigation (only Hour Tracking visible)
- Direct landing on Hour Tracking page after login
- Mobile-optimized for on-the-go hour entry
- Minimal UI (focused on hour entry task)

---

## Permission Matrix

### Feature Access by Role

| Feature | Fiscal Sponsor | Nonprofit User | Donor | Volunteer |
|---------|---------------|----------------|-------|-----------|
| **Dashboard** | ✅ All orgs | ✅ Own org | ❌ | ❌ |
| **Donors CRM** | ✅ All orgs | ✅ Own org | ❌ | ❌ |
| **Donations Manager** | ✅ All orgs | ✅ Own org | ❌ | ❌ |
| **Donor Page Builder** | ✅ All orgs | ✅ Own org | ❌ | ❌ |
| **Donor Portal** | ✅ Admin view | ✅ Admin view | ✅ Self only | ❌ |
| **Personnel CRM** | ✅ All orgs | ✅ Own org | ❌ | ❌ |
| **Volunteers CRM** | ✅ All orgs | ✅ Own org | ❌ | ❌ |
| **Hour Tracking** | ✅ All orgs | ✅ Own org | ❌ | ✅ Self only |
| **Email Campaigns** | ✅ All orgs | ✅ Own org | ❌ | ❌ |
| **Prospects List** | ✅ All orgs | ✅ Own org | ❌ | ❌ |
| **VideoBomb Manager** | ✅ All orgs | ✅ Own org | ❌ | ❌ |
| **Chart of Accounts** | ✅ All orgs | ✅ Own org | ❌ | ❌ |
| **General Ledger** | ✅ All orgs | ✅ Own org | ❌ | ❌ |
| **Journal Entries** | ✅ All orgs | ✅ Own org | ❌ | ❌ |
| **Expenses Manager** | ✅ All orgs | ✅ Own org | ❌ | ❌ |
| **Reimbursements** | ✅ All orgs | ✅ Own org | ❌ | ❌ |
| **Check Deposits** | ✅ All orgs | ✅ Own org | ❌ | ❌ |
| **Reconciliation** | ✅ All orgs | ✅ Own org | ❌ | ❌ |
| **Balance Sheet** | ✅ All orgs | ✅ Own org | ❌ | ❌ |
| **Income Statement** | ✅ All orgs | ✅ Own org | ❌ | ❌ |
| **Profit & Loss** | ✅ All orgs | ✅ Own org | ❌ | ❌ |
| **Volunteer Hours Report** | ✅ All orgs | ✅ Own org | ❌ | ❌ |
| **User Management** | ✅ All orgs | ✅ Own org | ❌ | ❌ |
| **Nonprofit Management** | ✅ | ❌ | ❌ | ❌ |
| **Settings** | ✅ Global | ✅ Own org | ❌ | ❌ |
| **Distribution Manager** | ✅ | ❌ | ❌ | ❌ |

### Data Scope by Role

| Data Type | Fiscal Sponsor | Nonprofit User | Donor | Volunteer |
|-----------|---------------|----------------|-------|-----------|
| **Donors** | All 34 orgs | Own org only | Self only | None |
| **Donations** | All 34 orgs | Own org only | Self only | None |
| **Personnel** | All 34 orgs | Own org only | None | None |
| **Volunteers** | All 34 orgs | Own org only | None | Self profile |
| **Hour Entries** | All 34 orgs | Own org only | None | Self only |
| **Financial Transactions** | All 34 orgs | Own org only | None | None |
| **Campaigns** | All 34 orgs | Own org only | None | None |
| **Reports** | All 34 orgs | Own org only | None | None |
| **Users** | All 34 orgs | Own org only | None | None |
| **Organizations** | All 34 orgs | Own org (read) | None | None |

---

## Data Isolation Rules

### Backend Enforcement (Critical)

All API endpoints MUST enforce data isolation:

```ruby
# Example: Donations Controller
def index
  case current_user.role
  when 'fiscal_sponsor'
    # Can access all organizations
    @donations = if params[:organization_id] == 'all'
      Donation.all
    else
      Donation.where(organization_id: params[:organization_id])
    end
  when 'nonprofit_user'
    # Can only access their organization
    @donations = Donation.where(organization_id: current_user.organization_id)
  when 'donor'
    # Can only access their own donations
    @donations = Donation.where(donor_id: current_user.donor_id)
  when 'volunteer'
    # No access to donations
    render json: { error: 'Unauthorized' }, status: :forbidden
  end
end
```

### Database-Level Security

Use PostgreSQL Row-Level Security (RLS):

```sql
-- Example: Donations table RLS policy
CREATE POLICY donations_isolation ON donations
  USING (
    CASE 
      WHEN current_user_role() = 'fiscal_sponsor' THEN true
      WHEN current_user_role() = 'nonprofit_user' THEN organization_id = current_user_organization_id()
      WHEN current_user_role() = 'donor' THEN donor_id = current_user_donor_id()
      ELSE false
    END
  );
```

### Frontend Filtering

Even though backend enforces, frontend should also filter:

```typescript
// Example: Filter sidebar items by role
const getSidebarItems = (userRole: UserRole) => {
  const allItems = [
    { name: 'Dashboard', page: 'dashboard' },
    { name: 'Donor Hub', page: 'donor-hub' },
    { name: 'People', page: 'personnel-hub' },
    // ... etc
  ];

  switch (userRole) {
    case 'fiscal_sponsor':
    case 'nonprofit_user':
      return allItems; // Show all
    case 'donor':
      return [{ name: 'Donor Hub', page: 'donor-hub' }]; // Only Donor Hub
    case 'volunteer':
      return [{ name: 'People', page: 'personnel-hub' }]; // Only People
    default:
      return [];
  }
};
```

---

## Implementation Guidelines

### User Creation

**Fiscal Sponsor:**
- Created by system administrator during initial setup
- Assigned to "InFocus Ministries" organization
- Role: `fiscal_sponsor`

**Nonprofit User:**
- Created by Fiscal Sponsor or existing Nonprofit User (for their org)
- Assigned to specific nonprofit organization
- Role: `nonprofit_user`

**Donor:**
- Self-registration via Donor Portal
- OR created by Nonprofit User/Fiscal Sponsor
- Linked to donor record in Donors CRM
- Role: `donor`

**Volunteer:**
- Created by Nonprofit User/Fiscal Sponsor
- Linked to volunteer record in Volunteers CRM
- Role: `volunteer`

### Role Assignment Rules

1. Users can have ONLY ONE role
2. Roles cannot be self-assigned
3. Role changes require administrator approval
4. Role changes take effect immediately (next login)
5. Audit log tracks all role changes

### Organization Assignment

- **Fiscal Sponsor:** No specific organization (access to all)
- **Nonprofit User:** ONE organization (cannot be changed without admin)
- **Donor:** No organization assignment (public access)
- **Volunteer:** ONE organization (linked to volunteer record)

### Authentication Flow

```
1. User logs in with email/password
2. Backend validates credentials
3. Backend returns JWT token with:
   - user_id
   - role
   - organization_id (if applicable)
   - permissions
4. Frontend stores token
5. Frontend renders UI based on role
6. All API calls include token
7. Backend validates token and enforces permissions
```

### Permission Checking

Every protected action should check:
1. Is user authenticated?
2. What is user's role?
3. What is user's organization?
4. Does user have permission for this action?
5. Does user have access to this data?

---

## Security Considerations

### Critical Rules

1. **Never trust frontend filtering** - Always enforce on backend
2. **Use database-level security** - RLS policies as last line of defense
3. **Audit all access** - Log who accessed what data when
4. **Validate organization context** - Ensure user can access requested org
5. **Token expiration** - Tokens should expire and require re-authentication

### Testing Requirements

Test each role thoroughly:
- ✅ Can access allowed features
- ✅ Cannot access restricted features
- ✅ Can only see their data
- ✅ Cannot see other organizations' data
- ✅ API returns 403 Forbidden for unauthorized access
- ✅ Direct URL access is blocked for restricted features

---

## Related Documentation

- `PRODUCT-REQUIREMENTS.md` - Overall product requirements
- `01-DATA-SCHEMA.md` - User and organization data models
- `02-API-REQUIREMENTS.md` - API authentication and authorization
- `pages/administration/01-USER-MANAGEMENT.md` - User management details

---

*This document defines the core security model for the IFM MVP platform. All features must adhere to these role and permission rules.*
