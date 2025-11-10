# Donor Page Manager

**Component File:** `src/components/DonorPageManager.tsx`  
**Route:** `/donor-hub` (with tool='donor-page')  
**Access Level:** Admin, Manager, Marketing Staff

## Overview
The Donor Page Manager is an orchestration component that manages the workflow for creating, previewing, and managing custom donation landing pages. It coordinates between the Donor Page Builder (for creating/editing pages) and the Donor Page Preview (for viewing the public-facing page). This tool enables nonprofits to create beautiful, customized donation pages with preset amounts, custom copy, images, recurring donation options, and cryptocurrency support.

## UI Features

### Main Features
- **Three View Modes:**
  - List View (default) - Shows all created donor pages
  - Builder View - Create/edit donor pages
  - Preview View - View public-facing page
- **List View:**
  - Empty state with call-to-action
  - Grid of created donor pages
  - Page thumbnails
  - Page titles
  - Public URLs
  - Edit/Delete actions
  - Create New Page button
- **Navigation:**
  - Back to Donor Hub button
  - Seamless transitions between views
  - State preservation

### List View (Empty State)
```
┌─────────────────────────────────────────┐
│ Donor Pages                             │
│ Create and manage custom donation pages │
│                                         │
│         [+ Create Donor Page]           │
├─────────────────────────────────────────┤
│                                         │
│            🌐                           │
│                                         │
│     No donor pages yet                  │
│                                         │
│  Create beautiful, customized donation  │
│  pages with pre-templated amounts,      │
│  copy, photos, recurring donations,     │
│  and cryptocurrency support.            │
│                                         │
│  [+ Create Your First Donor Page]       │
│                                         │
└─────────────────────────────────────────┘
```

### List View (With Pages)
```
Donor Pages
Create and manage custom donation pages    [+ Create Donor Page]

┌────────────────────┐  ┌────────────────────┐  ┌────────────────────┐
│ [Page Thumbnail]   │  │ [Page Thumbnail]   │  │ [Page Thumbnail]   │
│                    │  │                    │  │                    │
│ Annual Campaign    │  │ Emergency Fund     │  │ Building Project   │
│ donate.org/annual  │  │ donate.org/emerg   │  │ donate.org/build   │
│                    │  │                    │  │                    │
│ [Edit] [Delete]    │  │ [Edit] [Delete]    │  │ [Edit] [Delete]    │
└────────────────────┘  └────────────────────┘  └────────────────────┘
```

## Data Requirements

### Donor Page Config
- **id** (uuid) - Unique identifier
- **organization_id** (uuid) - Organization
- **title** (string) - Page title
- **slug** (string) - URL slug
- **headline** (string) - Main headline
- **description** (string) - Page description
- **image_url** (string, nullable) - Hero image
- **goal_amount** (decimal, nullable) - Fundraising goal
- **preset_amounts** (array of integers) - Suggested amounts
- **allow_custom_amount** (boolean) - Allow custom input
- **allow_recurring** (boolean) - Enable recurring donations
- **recurring_frequencies** (array) - Available frequencies
- **accept_crypto** (boolean) - Enable cryptocurrency
- **crypto_currencies** (array) - Supported cryptocurrencies
- **thank_you_message** (string) - Post-donation message
- **public_url** (string) - Full public URL
- **status** (enum) - 'draft', 'published', 'archived'
- **created_by** (uuid) - Creator
- **created_at** (timestamp)
- **updated_at** (timestamp)

## API Endpoints Required

### GET /api/v1/donor_pages
```
Description: Get all donor pages
Query Parameters:
  - organization_id (required, uuid)
  - status (optional, enum) - 'draft', 'published', 'archived', 'all'
  - page (optional, integer)
  - per_page (optional, integer)

Response: {
  data: [
    {
      id: "uuid",
      organization_id: "uuid",
      title: "Annual Campaign 2025",
      slug: "annual-2025",
      headline: "Support Our Mission",
      description: "Help us reach our goals...",
      image_url: "https://...",
      goal_amount: 50000.00,
      preset_amounts: [25, 50, 100, 250, 500],
      public_url: "https://donate.org/annual-2025",
      status: "published",
      created_at: "2025-10-20T10:00:00Z"
    }
  ],
  meta: {
    total: 5,
    page: 1,
    per_page: 50
  }
}
```

### POST /api/v1/donor_pages
```
Description: Create a new donor page
Request Body: {
  organization_id: "uuid",
  title: "Annual Campaign 2025",
  slug: "annual-2025",
  headline: "Support Our Mission",
  description: "Help us reach our goals...",
  image_url: "https://...",
  goal_amount: 50000.00,
  preset_amounts: [25, 50, 100, 250, 500],
  allow_custom_amount: true,
  allow_recurring: true,
  recurring_frequencies: ["monthly", "quarterly", "annually"],
  accept_crypto: true,
  crypto_currencies: ["bitcoin", "ethereum", "usdc"],
  thank_you_message: "Thank you for your support!",
  status: "published"
}

Response: {
  data: {
    id: "uuid",
    public_url: "https://donate.org/annual-2025",
    ...created page
  },
  message: "Donor page created successfully"
}
```

### PUT /api/v1/donor_pages/:id
```
Description: Update donor page
Request Body: { ...updated fields }

Response: {
  data: { ...updated page },
  message: "Donor page updated successfully"
}
```

### DELETE /api/v1/donor_pages/:id
```
Description: Delete donor page
Response: {
  message: "Donor page deleted successfully"
}
```

### GET /api/v1/donor_pages/:slug/public
```
Description: Get public donor page by slug (for rendering)
Response: {
  data: {
    ...page config,
    organization_name: "Awakenings",
    organization_logo: "https://...",
    current_amount: 16500.00,
    donor_count: 45
  }
}
```

## Request/Response Schemas

```typescript
interface DonorPageConfig {
  id: string;
  organization_id: string;
  title: string;
  slug: string;
  headline: string;
  description: string;
  image_url?: string;
  goal_amount?: number;
  preset_amounts: number[];
  allow_custom_amount: boolean;
  allow_recurring: boolean;
  recurring_frequencies: ('weekly' | 'monthly' | 'quarterly' | 'annually')[];
  accept_crypto: boolean;
  crypto_currencies: ('bitcoin' | 'ethereum' | 'usdc')[];
  thank_you_message: string;
  public_url: string;
  status: 'draft' | 'published' | 'archived';
  created_by: string;
  created_at: string;
  updated_at: string;
}
```

## Authentication & Authorization

### Required Permissions
- `donor_pages:read` - View donor pages
- `donor_pages:create` - Create donor pages
- `donor_pages:update` - Edit donor pages
- `donor_pages:delete` - Delete donor pages

### Role-Based Access
- **Fiscal Sponsor:** View pages across all nonprofits
- **Nonprofit User:** Create and manage their nonprofit's pages
- **Marketing Staff:** Full access
- **Donor/Volunteer:** No access (can view public pages)

## Business Logic & Validations

### Frontend Validations
- Title required
- Slug required and unique
- Headline required
- At least one preset amount
- Goal amount must be positive (if set)
- Valid image URL format
- Slug format (lowercase, hyphens, alphanumeric)

### Backend Validations (Rails)
- Unique slug per organization
- Valid organization access
- Valid status transitions
- Image URL accessibility
- Crypto wallet addresses valid (if crypto enabled)

### Business Rules
- Slug auto-generated from title if not provided
- Public URL format: `https://donate.org/{slug}`
- Draft pages not publicly accessible
- Published pages immediately live
- Archived pages redirect to main donation page
- Analytics tracked per page
- SEO metadata auto-generated

## State Management

### Local State
- `viewMode` - 'list', 'builder', or 'preview'
- `donorPages` - Array of created pages
- `previewPage` - Page being previewed

### Global State (AppContext)
- `selectedEntity` - Current organization

## Dependencies

### Internal Dependencies
- `DonorPageBuilder` - Page creation/editing component
- `DonorPagePreview` - Public page preview component
- UI components (Card, Button, Badge, etc.)

### External Libraries
- `lucide-react` - Icons
- `sonner` - Toast notifications

## Error Handling

### Error Scenarios
1. **Network Error:** Show toast "Unable to load donor pages"
2. **Create Failed:** Show toast "Failed to create donor page"
3. **Duplicate Slug:** Show error "This URL is already in use"
4. **Delete Failed:** Show toast "Failed to delete donor page"
5. **Permission Error:** Show toast "You don't have permission"

## Loading States
- **Initial load:** Skeleton grid
- **Create:** Button loading state
- **Delete:** Confirmation dialog with loading
- **View transitions:** Smooth fade transitions

## Mock Data to Remove
- `DonorPageManager.tsx` - Local `donorPages` state (use API)
- Move interfaces to `src/types/donor-pages.ts`

## Migration Notes

### Phase 1: API Integration
1. Create `src/api/donor-pages.ts`
2. Create `src/types/donor-pages.ts`
3. Implement CRUD endpoints
4. Test page creation workflow

### Phase 2: Public Pages
1. Create public page rendering
2. Implement donation processing
3. Add analytics tracking
4. Test payment flows

### Phase 3: Advanced Features
1. Add A/B testing
2. Implement page templates
3. Add social sharing
4. Implement page analytics dashboard

## Related Documentation
- [03-DONOR-PAGE-BUILDER.md](./03-DONOR-PAGE-BUILDER.md)
- [06-DONOR-PAGE-PREVIEW.md](./06-DONOR-PAGE-PREVIEW.md)
- [02-DONATIONS-MANAGER.md](./02-DONATIONS-MANAGER.md)
- [01-DATA-SCHEMA.md](../../01-DATA-SCHEMA.md)

## Additional Notes

### Workflow
1. **Create:** User clicks "Create Donor Page"
2. **Build:** DonorPageBuilder opens with form
3. **Preview:** User can preview before publishing
4. **Publish:** Page goes live with public URL
5. **Share:** URL shared via email, social media
6. **Track:** Analytics monitor performance
7. **Edit:** Can edit and republish anytime

### URL Structure
- **Format:** `https://donate.org/{slug}`
- **Slug Rules:** Lowercase, hyphens only, alphanumeric
- **Examples:**
  - `annual-campaign-2025`
  - `emergency-relief`
  - `building-fund`

### Integration Points
- **Donations Manager:** Tracks donations from pages
- **Marketing Campaigns:** Link to donor pages
- **Analytics:** Page performance metrics
- **Social Sharing:** OG tags for sharing

### Best Practices
- Clear, compelling headlines
- High-quality images
- Specific fundraising goals
- Multiple preset amounts
- Enable recurring donations
- Thank donors personally
- Track and optimize performance
