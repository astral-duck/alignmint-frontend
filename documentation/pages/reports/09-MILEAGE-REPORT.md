# Mileage Report

**Component File:** `src/components/MileageReport.tsx`  
**Route:** `/reports` (with tool='mileage')  
**Access Level:** Admin, Manager

## Overview
The Mileage Report provides a comprehensive summary of business mileage logged across all nonprofits for tax deduction purposes. It aggregates data from the Mileage Tracker tool and calculates total deduction values using the IRS standard mileage rate. The report is designed for fiscal sponsors to review annual mileage across all managed nonprofits.

## UI Features

### Main Features
- **Report Header:**
  - Report title and subtitle
  - Export button (multi-nonprofit support)
  - Back to Reports Hub button
- **Summary Metrics Cards:**
  - Total Miles (aggregate across all nonprofits)
  - Total Deduction Value (miles × IRS rate)
  - Total Entries (count of all logged trips)
  - Nonprofits (count with mileage data)
- **Search and Filter Bar:**
  - Search nonprofits by name
  - Year selector dropdown (current year and 4 prior years)
- **Mileage by Nonprofit Table:**
  - Nonprofit name, Entries, Total Miles, Deduction Value, Last Entry
  - Clickable rows to view detailed entries
  - Total row at bottom
- **Detail Drawer (slide-out):**
  - Nonprofit name and year
  - Summary cards (Total Miles, Deduction Value)
  - All entries table (Date, Purpose, Miles, Value)
  - IRS rate note
- **Tax Deduction Summary Card:**
  - Total deduction value
  - IRS rate disclosure
  - Tax advice disclaimer

### Summary Cards Layout
```
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ Total Miles     │ │ Deduction Value │ │ Total Entries   │ │ Nonprofits      │
│ 8,450           │ │ $5,915.00       │ │ 156             │ │ 12              │
└─────────────────┘ └─────────────────┘ └─────────────────┘ └─────────────────┘
```

### Mileage by Nonprofit Table
```
Mileage by Nonprofit

Nonprofit           | Entries | Total Miles | Deduction Value | Last Entry
--------------------|---------|-------------|-----------------|-------------
Awakenings          | 18      | 845         | $591.50         | Oct 15, 2025
Bloom Strong        | 15      | 620         | $434.00         | Oct 12, 2025
Bonfire             | 22      | 1,120       | $784.00         | Oct 18, 2025
Child & Youth Care  | 28      | 1,450       | $1,015.00       | Oct 20, 2025
...
--------------------|---------|-------------|-----------------|-------------
TOTAL               | 156     | 8,450       | $5,915.00       | —
```

### Detail Drawer View
```
┌─────────────────────────────────────────────────────────┐
│ Awakenings                                         [X]  │
│ 2025 Mileage Details                                    │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────────┐ ┌─────────────────┐                 │
│ │ Total Miles     │ │ Deduction Value │                 │
│ │ 845             │ │ $591.50         │                 │
│ └─────────────────┘ └─────────────────┘                 │
│                                                         │
│ All Entries (18)                                        │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Date         | Purpose              | Miles | Value │ │
│ │ Oct 15, 2025 | Client visit         | 25    | $17.50│ │
│ │ Oct 12, 2025 | Supply pickup        | 18    | $12.60│ │
│ │ ...                                                 │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ Calculated using IRS rate of $0.70/mile for 2025       │
└─────────────────────────────────────────────────────────┘
```

## Data Requirements

### Summary Metrics
- **total_miles** (integer) - Total miles across all nonprofits
- **total_value** (decimal) - Total deduction value (miles × rate)
- **total_entries** (integer) - Count of all mileage entries
- **nonprofit_count** (integer) - Number of nonprofits with data

### Mileage Summary (by Nonprofit)
- **nonprofit** (string) - Nonprofit name
- **nonprofitId** (uuid) - Nonprofit identifier
- **totalMiles** (integer) - Total miles for this nonprofit
- **totalValue** (decimal) - Deduction value for this nonprofit
- **entryCount** (integer) - Number of entries
- **lastEntry** (date) - Date of most recent entry

### Mileage Entry Detail
- **id** (uuid) - Entry identifier
- **date** (date) - Date of trip
- **miles** (integer) - Miles driven
- **purpose** (string) - Business purpose
- **entityId** (uuid) - Nonprofit identifier
- **entityName** (string) - Nonprofit name

### Constants
- **IRS_MILEAGE_RATE** - $0.70/mile (2025 rate)

## API Endpoints

### Get Mileage Report Summary
```
GET /api/reports/mileage?year={year}
Response: { summaries: MileageSummary[], entries: MileageEntry[] }
```

### Export Mileage Report
```
GET /api/reports/mileage/export?year={year}&nonprofit_ids={ids}&format={xlsx|pdf}
```

## State Management

### Local State
- `reportYear` - Selected year filter
- `exportDialogOpen` - Export dialog visibility
- `searchQuery` - Nonprofit search filter
- `selectedNonprofit` - Nonprofit selected for detail view (null if none)

### Global State (AppContext)
- `setReportTool` - Function to navigate back to Reports Hub

### Computed State
- `allEntries` - All mileage entries from shared data source
- `summaries` - Aggregated summaries by nonprofit
- `filteredEntries` - Entries filtered by year
- `filteredSummaries` - Summaries filtered by year and search
- `selectedNonprofitEntries` - Entries for selected nonprofit

## Business Rules

1. **Year Filtering:**
   - Default to current year
   - Support 5 years of history
   - Summaries recalculated based on filtered entries

2. **IRS Rate:**
   - Uses current year IRS standard mileage rate
   - Rate displayed in report for transparency

3. **Export:**
   - Supports multi-nonprofit export
   - Available in Excel and PDF formats
   - Includes IRS rate in export header

4. **Read-Only:**
   - Report is read-only
   - Mileage entries are managed via Mileage Tracker

## Integration Points

- **Mileage Tracker:** Source of all mileage data
- **Shared Data Source:** Uses `getAllMileageEntries()` from mockData
- **Multi-Nonprofit Export:** Uses `MultiNonprofitExportDialog` component
- **Export Utils:** Uses `exportToExcel` and `exportToPDF` functions

## Related Documentation
- [../tools/03-MILEAGE-TRACKER.md](../tools/03-MILEAGE-TRACKER.md)
- [00-REPORTS-HUB.md](./00-REPORTS-HUB.md)
- [05-VOLUNTEER-HOURS-REPORT.md](./05-VOLUNTEER-HOURS-REPORT.md)
