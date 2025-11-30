# Mileage Tracker

**Component File:** `src/components/MileageTracker.tsx`  
**Route:** `/tools` (with tool='mileage-tracker')  
**Access Level:** Admin, Manager, Nonprofit Staff

## Overview
The Mileage Tracker allows nonprofit organizations to log business mileage for tax deduction purposes. Staff can record trips with date, miles driven, and purpose. The tool calculates estimated deduction values using the current IRS standard mileage rate ($0.70/mile for 2025). Data is attributed to the currently selected nonprofit from the entity selector.

## UI Features

### Main Features
- **Header:**
  - Tool title and subtitle
  - Add Mileage button
  - Back to Tools Hub button
- **Summary Metrics Cards:**
  - Total Miles (aggregate across filtered period)
  - Deduction Value (miles × IRS rate)
  - Total Entries (count of logged trips)
- **Search and Filter Bar:**
  - Search by purpose or organization
  - Date filter dropdown (All Time, This Month, This Year)
- **Mileage Log Table:**
  - Date, Purpose, Miles, Value, Organization (if InFocus view)
  - Edit and Delete actions per row
- **Add/Edit Mileage Dialog:**
  - Date picker
  - Miles input
  - Purpose textarea
  - Organization selector (InFocus view only)
  - Real-time deduction value preview

### Summary Cards Layout
```
┌─────────────────────┐ ┌─────────────────────┐ ┌─────────────────────┐
│ 🚗 Total Miles      │ │ 📍 Deduction Value  │ │ 📅 Total Entries    │
│ 1,245 miles         │ │ $871.50             │ │ 47 entries          │
└─────────────────────┘ └─────────────────────┘ └─────────────────────┘
```

### Mileage Log Table
```
Mileage Log

Date         | Purpose                    | Miles | Value    | Actions
-------------|----------------------------|-------|----------|--------
Oct 15, 2025 | Client visit               | 25    | $17.50   | ✏️ 🗑️
Oct 12, 2025 | Supply pickup              | 18    | $12.60   | ✏️ 🗑️
Oct 10, 2025 | Meeting with partner org   | 42    | $29.40   | ✏️ 🗑️
...
```

## Data Requirements

### Mileage Entry
- **id** (uuid) - Unique identifier
- **date** (date) - Date of trip
- **miles** (integer) - Miles driven
- **purpose** (string) - Business purpose description
- **entityId** (uuid) - Associated nonprofit
- **entityName** (string) - Nonprofit name (denormalized)
- **createdAt** (timestamp) - When entry was created

### Constants
- **IRS_MILEAGE_RATE** - $0.70/mile (2025 rate)

## API Endpoints

### List Mileage Entries
```
GET /api/mileage?entity_id={entity_id}&date_filter={filter}
```

### Create Mileage Entry
```
POST /api/mileage
Body: { date, miles, purpose, entity_id }
```

### Update Mileage Entry
```
PUT /api/mileage/{id}
Body: { date, miles, purpose }
```

### Delete Mileage Entry
```
DELETE /api/mileage/{id}
```

## State Management

### Local State
- `addEntryOpen` - Add dialog visibility
- `editEntry` - Entry being edited (null if none)
- `searchQuery` - Search filter text
- `dateFilter` - Date range filter ('all', 'this-month', 'this-year')
- `newEntry` - Form state for new entry

### Global State (AppContext)
- `selectedEntity` - Currently selected nonprofit
- `setToolsTool` - Function to navigate back to Tools Hub

## Business Rules

1. **Entity Attribution:**
   - Entries are attributed to the currently selected nonprofit
   - InFocus/All view allows selecting which nonprofit to attribute

2. **IRS Rate:**
   - Uses current year IRS standard mileage rate
   - Rate should be configurable for future year updates

3. **Validation:**
   - Date is required
   - Miles must be positive integer
   - Purpose is required

## Integration Points

- **Mileage Report:** Data flows to the Mileage Report for fiscal sponsor review
- **Export:** Entries can be exported via the Mileage Report
- **Entity Selector:** Respects selected nonprofit context

## Related Documentation
- [../reports/09-MILEAGE-REPORT.md](../reports/09-MILEAGE-REPORT.md)
- [00-TOOLS-HUB.md](./00-TOOLS-HUB.md)
