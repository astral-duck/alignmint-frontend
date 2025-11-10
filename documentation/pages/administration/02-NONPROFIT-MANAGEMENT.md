# Nonprofit Management

**Component File:** `src/components/NonprofitManagement.tsx`  
**Route:** `/administration` (with tool='nonprofit-management')  
**Access Level:** Fiscal Sponsor Admin Only

## Overview
The Nonprofit Management component allows fiscal sponsor administrators to manage all nonprofit organizations within the platform. This includes adding new nonprofits, editing existing ones, activating/deactivating organizations, and controlling their visibility in the system. This is a critical administrative function for fiscal sponsors managing multiple entities.

## UI Features

### Main Features
- **Summary Statistics Cards:**
  - Total Nonprofits
  - Active Nonprofits
  - Inactive Nonprofits
  - Parent Organizations
- **Search & Filter:**
  - Search by nonprofit name
  - Real-time filtering
  - Alphabetical sorting
- **Nonprofits Table:**
  - Name
  - Type (Nonprofit/Parent)
  - Status (Active/Inactive toggle)
  - Date Added
  - Last Activity
  - Actions (Edit, Toggle Status)
- **Add Nonprofit Dialog:**
  - Nonprofit name input
  - Type selector (Nonprofit/Parent)
  - Add button
- **Edit Nonprofit Dialog:**
  - Edit name
  - Change type
  - Update button
- **Back to Administration Hub button**

### Summary Cards Layout
```
┌─────────────────────┐ ┌─────────────────────┐
│ 📊 Total Nonprofits │ │ ✅ Active           │
│ 34 organizations    │ │ 32 organizations    │
└─────────────────────┘ └─────────────────────┘

┌─────────────────────┐ ┌─────────────────────┐
│ ⏸️  Inactive         │ │ 🏢 Parent Orgs      │
│ 2 organizations     │ │ 1 organization      │
└─────────────────────┘ └─────────────────────┘
```

### Nonprofits Table
```
Name                    | Type      | Status    | Date Added | Last Activity | Actions
------------------------|-----------|-----------|------------|---------------|----------
Awakenings              | Nonprofit | [Active]  | 2024-01-01 | 2025-10-15   | [Edit]
Bloom Strong            | Nonprofit | [Active]  | 2024-01-02 | 2025-10-18   | [Edit]
Bonfire                 | Nonprofit | [Active]  | 2024-01-03 | 2025-10-20   | [Edit]
InFocus Ministries      | Parent    | [Active]  | 2024-01-00 | 2025-10-20   | [Edit]
...
```

### Add/Edit Dialog
- **Name Field:** Text input for nonprofit name
- **Type Selector:** Dropdown (Nonprofit/Parent)
- **Validation:** Name required, unique ID generation
- **Actions:** Cancel or Save

## Data Requirements

### Nonprofit Entity
- **id** (string) - Unique identifier (generated from name)
- **name** (string) - Organization name
- **type** (enum) - 'nonprofit' or 'parent'
- **is_active** (boolean) - Active status
- **date_added** (date) - When added to platform
- **last_activity** (date, nullable) - Last activity timestamp

### Summary Statistics
- **total** (integer) - Total count
- **active** (integer) - Active count
- **inactive** (integer) - Inactive count
- **parent** (integer) - Parent organization count

## API Endpoints Required

### GET /api/v1/nonprofits
```
Description: Get all nonprofits managed by fiscal sponsor
Query Parameters:
  - search (optional, string) - Search by name
  - status (optional, enum) - 'active', 'inactive', 'all'
  - type (optional, enum) - 'nonprofit', 'parent', 'all'
  - page (optional, integer)
  - per_page (optional, integer)

Response: {
  data: [
    {
      id: "awakenings",
      name: "Awakenings",
      type: "nonprofit",
      is_active: true,
      date_added: "2024-01-01",
      last_activity: "2025-10-15"
    },
    {
      id: "bloom-strong",
      name: "Bloom Strong",
      type: "nonprofit",
      is_active: true,
      date_added: "2024-01-02",
      last_activity: "2025-10-18"
    }
  ],
  meta: {
    total: 34,
    active: 32,
    inactive: 2,
    parent: 1,
    page: 1,
    per_page: 50
  }
}
```

### POST /api/v1/nonprofits
```
Description: Add a new nonprofit to the platform
Request Body: {
  name: "New Nonprofit Organization",
  type: "nonprofit" // or "parent"
}

Response: {
  data: {
    id: "new-nonprofit-organization",
    name: "New Nonprofit Organization",
    type: "nonprofit",
    is_active: true,
    date_added: "2025-10-20",
    last_activity: null
  },
  message: "Nonprofit added successfully"
}
```

### PUT /api/v1/nonprofits/:id
```
Description: Update nonprofit details
Request Body: {
  name: "Updated Nonprofit Name",
  type: "nonprofit"
}

Response: {
  data: {
    id: "updated-nonprofit-name",
    name: "Updated Nonprofit Name",
    type: "nonprofit",
    is_active: true,
    date_added: "2024-01-01",
    last_activity: "2025-10-15"
  },
  message: "Nonprofit updated successfully"
}
```

### PATCH /api/v1/nonprofits/:id/toggle_status
```
Description: Activate or deactivate a nonprofit
Request Body: {
  is_active: false
}

Response: {
  data: {
    id: "nonprofit-id",
    is_active: false
  },
  message: "Nonprofit status updated"
}
```

### GET /api/v1/nonprofits/:id/stats
```
Description: Get statistics for a specific nonprofit
Response: {
  data: {
    total_donations: 125000.00,
    total_expenses: 98000.00,
    active_volunteers: 18,
    total_hours: 425,
    last_activity: "2025-10-15"
  }
}
```

## Request/Response Schemas

```typescript
interface Nonprofit {
  id: string;
  name: string;
  type: 'nonprofit' | 'parent';
  is_active: boolean;
  date_added: string;
  last_activity?: string;
}

interface NonprofitStats {
  total: number;
  active: number;
  inactive: number;
  parent: number;
}

interface NonprofitFormData {
  name: string;
  type: 'nonprofit' | 'parent';
}
```

## Authentication & Authorization

### Required Permissions
- `nonprofits:read` - View nonprofits
- `nonprofits:create` - Add new nonprofits
- `nonprofits:update` - Edit nonprofits
- `nonprofits:toggle_status` - Activate/deactivate

### Role-Based Access
- **Fiscal Sponsor:** Full access to all functions
- **Nonprofit User:** No access (cannot manage other nonprofits)
- **Staff:** View-only access
- **Donor/Volunteer:** No access

### Special Rules
- InFocus Ministries (parent) cannot be deactivated
- Cannot delete nonprofits (only deactivate)
- Deactivating a nonprofit hides it from dropdowns but preserves data
- Only fiscal sponsor can access this feature

## Business Logic & Validations

### Frontend Validations
- Name required (cannot be empty)
- Name must be unique
- ID generated from name (lowercase, alphanumeric, hyphens)
- Cannot deactivate parent organization
- Type must be 'nonprofit' or 'parent'

### Backend Validations (Rails)
- Name uniqueness check
- Valid type enum
- Cannot delete nonprofit with existing data
- Deactivation cascades to hide from user selections
- Audit log all changes

### Business Rules
- New nonprofits start as active
- ID generated from name (sanitized)
- Deactivating hides from entity selector
- Last activity updated on any transaction
- Parent organization always visible
- Search is case-insensitive
- Results sorted alphabetically

## State Management

### Local State
- `nonprofits` - Array of nonprofit entities
- `searchQuery` - Search filter text
- `dialogType` - 'add', 'edit', or null
- `selectedNonprofit` - Nonprofit being edited
- `formData` - Form input values (name, type)

### Global State (AppContext)
- `entities` - Global list of all entities (read from this component)

## Dependencies

### Internal Dependencies
- `AppContext` - Global state and entities list
- Mock data - **TO BE REMOVED** - `generateInitialNonprofits()` from entities
- UI components (Card, Button, Table, Dialog, Switch, etc.)

### External Libraries
- `lucide-react` - Icons
- `sonner` - Toast notifications

## Error Handling

### Error Scenarios
1. **Network Error:** Show toast "Unable to load nonprofits"
2. **Duplicate Name:** Show toast "Nonprofit already exists"
3. **Empty Name:** Show toast "Please enter a name"
4. **Add Failed:** Show toast "Failed to add nonprofit"
5. **Update Failed:** Show toast "Failed to update nonprofit"
6. **Toggle Failed:** Show toast "Failed to update status"
7. **Cannot Deactivate Parent:** Show toast "Cannot deactivate parent organization"

## Loading States
- **Initial load:** Skeleton table
- **Search:** Instant filtering (no loading)
- **Add/Edit:** Button loading state
- **Toggle status:** Switch loading state

## Mock Data to Remove
- `NonprofitManagement.tsx` - `generateInitialNonprofits()` function
- `AppContext.tsx` - `entities` array (move to API)
- Move interfaces to `src/types/nonprofits.ts`

## Migration Notes

### Phase 1: API Integration
1. Create `src/api/nonprofits.ts`
2. Create `src/types/nonprofits.ts`
3. Implement list endpoint
4. Test CRUD operations

### Phase 2: Status Management
1. Implement toggle status endpoint
2. Test deactivation cascades
3. Verify entity selector updates
4. Test parent protection

### Phase 3: Statistics
1. Implement stats endpoint
2. Add activity tracking
3. Test last activity updates
4. Add usage analytics

### Phase 4: Advanced Features
1. Add bulk operations
2. Implement export
3. Add audit history
4. Implement search improvements

## Related Documentation
- [01-USER-MANAGEMENT.md](./01-USER-MANAGEMENT.md)
- [03-SETTINGS.md](./03-SETTINGS.md)
- [04-DISTRIBUTION-MANAGER.md](./04-DISTRIBUTION-MANAGER.md)
- [../../../04-USER-ROLES-AND-PERMISSIONS.md](../../04-USER-ROLES-AND-PERMISSIONS.md)
- [01-DATA-SCHEMA.md](../../01-DATA-SCHEMA.md)

## Additional Notes

### ID Generation
IDs are generated from nonprofit names:
- Convert to lowercase
- Remove special characters
- Replace spaces with hyphens
- Truncate to 50 characters
- Example: "New Hope Community Center" → "new-hope-community-center"

### Active vs Inactive
**Active nonprofits:**
- Visible in entity selector
- Can receive donations
- Can create transactions
- Users can log in
- Appears in reports

**Inactive nonprofits:**
- Hidden from entity selector
- Cannot receive new donations
- Historical data preserved
- Users cannot log in
- Excluded from reports (unless specifically included)

### Parent Organization
- InFocus Ministries is the parent/fiscal sponsor
- Cannot be deactivated
- Always visible
- Has special permissions
- Manages all other nonprofits

### Visibility Control
Deactivating a nonprofit:
1. Sets `is_active` to false
2. Removes from entity dropdown
3. Prevents new transactions
4. Preserves all historical data
5. Can be reactivated later

### Use Cases
1. **Onboarding:** Add new nonprofits to platform
2. **Offboarding:** Deactivate nonprofits leaving fiscal sponsor
3. **Maintenance:** Update names or types
4. **Reporting:** View activity and statistics
5. **Compliance:** Maintain accurate organization list

### Integration Points
- **User Management:** Users assigned to nonprofits
- **Entity Selector:** Dropdown populated from active nonprofits
- **Reports:** Filter by nonprofit
- **Donations:** Tagged with nonprofit
- **All Transactions:** Tagged with entity_id
