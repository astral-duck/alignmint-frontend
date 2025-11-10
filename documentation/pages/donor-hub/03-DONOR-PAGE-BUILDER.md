# Donor Page Builder

**Component File:** `src/components/DonorPageBuilder.tsx`  
**Route:** `/donor-hub` (with tool='donor-page')  
**Access Level:** Admin, Manager

## Overview
The Donor Page Builder allows organizations to create custom, branded donation landing pages with drag-and-drop functionality. Users can customize page layout, add content blocks (text, images, videos), configure donation amounts, and publish pages with unique URLs.

## UI Features

### Main Features
- **Page List View:**
  - List of all donation pages
  - Page status (Draft, Published, Archived)
  - Page URL
  - Creation date
  - Actions (Edit, Preview, Publish, Archive, Delete)
- **Page Builder Interface:**
  - Drag-and-drop component editor
  - Live preview pane
  - Component library sidebar
  - Page settings panel
- **Available Components:**
  - Hero section with image/video
  - Text blocks (rich text editor)
  - Image blocks
  - Video embeds (YouTube, Vimeo)
  - Donation form
  - Progress bar (goal tracking)
  - Testimonials
  - FAQ accordion
  - Call-to-action buttons
- **Page Settings:**
  - Page title
  - URL slug
  - Meta description (SEO)
  - Featured image
  - Primary color
  - Font selection
  - Custom CSS (optional)

### Component Properties
Each component has customizable properties:
- **Hero Section:**
  - Background image/video
  - Headline text
  - Subheadline text
  - Button text and link
- **Donation Form:**
  - Preset amounts
  - Allow custom amount
  - Recurring donation option
  - Payment methods
  - Required fields

### Page Management Table
- Page Name
- URL Slug
- Status Badge
- Views Count
- Donations Count
- Total Raised
- Last Modified
- Actions dropdown

## Data Requirements

### Donor Page Data
- **id** (uuid) - Unique identifier
- **organization_id** (uuid) - Organization owner
- **name** (string) - Page name (internal)
- **slug** (string) - URL slug (unique)
- **title** (string) - Public page title
- **description** (text, nullable) - Meta description
- **featured_image_url** (string, nullable) - Featured image
- **status** (string) - 'draft', 'published', 'archived'
- **theme** (json) - Theme settings (colors, fonts)
- **components** (json) - Page components array
- **settings** (json) - Page settings
- **goal_amount** (decimal, nullable) - Fundraising goal
- **views_count** (integer) - Page views
- **donations_count** (integer) - Donations received
- **total_raised** (decimal) - Total amount raised
- **published_at** (datetime, nullable) - When published
- **created_by_id** (uuid) - User who created
- **created_at** (datetime) - When created
- **updated_at** (datetime) - When updated

### Component Schema (JSON)
```json
{
  "id": "component-uuid",
  "type": "hero|text|image|video|donation-form|progress|testimonial|faq|cta",
  "order": 1,
  "properties": {
    // Component-specific properties
  }
}
```

### Data Mutations
- **Create Page:** Create new donation page
- **Update Page:** Edit page content and settings
- **Delete Page:** Delete page
- **Publish Page:** Make page live
- **Archive Page:** Hide page from public
- **Duplicate Page:** Clone existing page
- **Update Components:** Add/remove/reorder components

## API Endpoints Required

### GET /api/v1/donor_pages
```
Description: Fetch donation pages
Query Parameters:
  - organization_id (required, uuid)
  - status (optional, string) - 'draft', 'published', 'archived', 'all'
  - page (optional, integer, default: 1)
  - per_page (optional, integer, default: 25)
  - sort_by (optional, string, default: 'updated_desc')

Response: {
  data: [
    {
      id: "uuid",
      organization_id: "uuid",
      name: "Annual Gala 2024",
      slug: "annual-gala-2024",
      title: "Support Our Annual Gala",
      description: "Join us for our annual fundraising gala",
      featured_image_url: "https://...",
      status: "published",
      goal_amount: 50000.00,
      views_count: 1250,
      donations_count: 87,
      total_raised: 32450.00,
      published_at: "2024-10-01T00:00:00Z",
      created_by: "Jane Smith",
      created_at: "2024-09-15T10:00:00Z",
      updated_at: "2024-11-08T14:30:00Z"
    }
  ],
  meta: {
    total: 12,
    page: 1,
    per_page: 25,
    total_pages: 1
  }
}
```

### GET /api/v1/donor_pages/:id
```
Description: Get donation page with full content
Path Parameters:
  - id (required, uuid)
Query Parameters:
  - organization_id (required, uuid)

Response: {
  data: {
    id: "uuid",
    organization_id: "uuid",
    name: "Annual Gala 2024",
    slug: "annual-gala-2024",
    title: "Support Our Annual Gala",
    description: "Join us for our annual fundraising gala",
    featured_image_url: "https://...",
    status: "published",
    theme: {
      primary_color: "#3B82F6",
      font_family: "Inter",
      custom_css: ""
    },
    components: [
      {
        id: "comp-1",
        type: "hero",
        order: 1,
        properties: {
          background_image: "https://...",
          headline: "Support Our Mission",
          subheadline: "Every donation makes a difference",
          button_text: "Donate Now",
          button_link: "#donate"
        }
      },
      {
        id: "comp-2",
        type: "donation-form",
        order: 2,
        properties: {
          preset_amounts: [25, 50, 100, 250, 500],
          allow_custom: true,
          allow_recurring: true,
          required_fields: ["name", "email"]
        }
      }
    ],
    settings: {
      thank_you_message: "Thank you for your donation!",
      redirect_url: null,
      email_receipt: true
    },
    goal_amount: 50000.00,
    views_count: 1250,
    donations_count: 87,
    total_raised: 32450.00,
    published_at: "2024-10-01T00:00:00Z",
    created_by: "Jane Smith",
    created_at: "2024-09-15T10:00:00Z",
    updated_at: "2024-11-08T14:30:00Z"
  }
}
```

### GET /api/v1/donor_pages/by_slug/:slug
```
Description: Get public donation page by slug (for rendering)
Path Parameters:
  - slug (required, string)

Response: {
  data: {
    // Same as GET by ID, but publicly accessible
  }
}

Note: This endpoint is public (no auth required)
```

### POST /api/v1/donor_pages
```
Description: Create new donation page
Request Body: {
  organization_id: "uuid",
  name: "Annual Gala 2024",
  slug: "annual-gala-2024",
  title: "Support Our Annual Gala",
  description: "Join us for our annual fundraising gala",
  status: "draft",
  theme: {
    primary_color: "#3B82F6",
    font_family: "Inter"
  },
  components: [],
  settings: {},
  goal_amount: 50000.00
}

Response: {
  data: {
    id: "uuid",
    ...all page fields
  },
  message: "Donation page created successfully"
}
```

### PUT /api/v1/donor_pages/:id
```
Description: Update donation page
Path Parameters:
  - id (required, uuid)
Request Body: {
  organization_id: "uuid",
  name: "Updated Name",
  title: "Updated Title",
  components: [...updated components],
  ...other fields
}

Response: {
  data: {
    id: "uuid",
    ...updated fields
  },
  message: "Donation page updated successfully"
}
```

### DELETE /api/v1/donor_pages/:id
```
Description: Delete donation page
Path Parameters:
  - id (required, uuid)
Query Parameters:
  - organization_id (required, uuid)

Response: {
  message: "Donation page deleted successfully"
}

Note: Cannot delete published pages with donations
```

### POST /api/v1/donor_pages/:id/publish
```
Description: Publish donation page
Path Parameters:
  - id (required, uuid)
Request Body: {
  organization_id: "uuid"
}

Response: {
  data: {
    id: "uuid",
    status: "published",
    published_at: "2024-11-08T15:00:00Z",
    public_url: "https://donate.example.com/annual-gala-2024"
  },
  message: "Donation page published successfully"
}
```

### POST /api/v1/donor_pages/:id/archive
```
Description: Archive donation page
Path Parameters:
  - id (required, uuid)
Request Body: {
  organization_id: "uuid"
}

Response: {
  data: {
    id: "uuid",
    status: "archived"
  },
  message: "Donation page archived successfully"
}
```

### POST /api/v1/donor_pages/:id/duplicate
```
Description: Duplicate donation page
Path Parameters:
  - id (required, uuid)
Request Body: {
  organization_id: "uuid",
  new_name: "Copy of Annual Gala 2024",
  new_slug: "annual-gala-2024-copy"
}

Response: {
  data: {
    id: "new-uuid",
    ...duplicated page fields
  },
  message: "Donation page duplicated successfully"
}
```

### POST /api/v1/donor_pages/:id/upload_image
```
Description: Upload image for page
Path Parameters:
  - id (required, uuid)
Request Body: {
  organization_id: "uuid",
  file: "multipart/form-data",
  type: "featured|component" // Where image will be used
}

Response: {
  data: {
    image_url: "https://..."
  },
  message: "Image uploaded successfully"
}
```

### GET /api/v1/donor_pages/:id/analytics
```
Description: Get page analytics
Path Parameters:
  - id (required, uuid)
Query Parameters:
  - organization_id (required, uuid)
  - start_date (optional, date)
  - end_date (optional, date)

Response: {
  data: {
    views: {
      total: 1250,
      by_date: [
        { date: "2024-11-01", count: 45 },
        { date: "2024-11-02", count: 52 }
      ]
    },
    donations: {
      total_count: 87,
      total_amount: 32450.00,
      average_amount: 373.00,
      by_date: [
        { date: "2024-11-01", count: 3, amount: 450.00 }
      ]
    },
    conversion_rate: 0.0696, // 6.96%
    top_referrers: [
      { source: "facebook", count: 450 },
      { source: "email", count: 320 }
    ]
  }
}
```

## Request/Response Schemas

### DonorPage Schema
```typescript
interface DonorPage {
  id: string;
  organization_id: string;
  name: string;
  slug: string;
  title: string;
  description?: string;
  featured_image_url?: string;
  status: 'draft' | 'published' | 'archived';
  theme: PageTheme;
  components: PageComponent[];
  settings: PageSettings;
  goal_amount?: number;
  views_count: number;
  donations_count: number;
  total_raised: number;
  published_at?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface PageTheme {
  primary_color: string;
  font_family: string;
  custom_css?: string;
}

interface PageComponent {
  id: string;
  type: 'hero' | 'text' | 'image' | 'video' | 'donation-form' | 'progress' | 'testimonial' | 'faq' | 'cta';
  order: number;
  properties: Record<string, any>;
}

interface PageSettings {
  thank_you_message?: string;
  redirect_url?: string;
  email_receipt: boolean;
}
```

## Authentication & Authorization

### Required Permissions
- `donor_pages:read` - View donation pages
- `donor_pages:write` - Create and edit pages
- `donor_pages:delete` - Delete pages
- `donor_pages:publish` - Publish pages

### Role-Based Access
- **Admin:** Full access to all operations
- **Manager:** Can create, edit, publish
- **Staff:** Can view and edit drafts
- **Volunteer:** No access
- **Public:** Can view published pages (no auth)

## Business Logic & Validations

### Frontend Validations
- Page name required
- Slug required and must be unique
- Slug format: lowercase, hyphens only
- Title required
- At least one component required to publish
- Donation form component required to accept donations
- Goal amount must be positive if set

### Backend Validations (Rails)
- Slug uniqueness per organization
- Valid slug format (alphanumeric and hyphens)
- Cannot delete published pages with donations
- Cannot publish without donation form component
- Image file size limits (e.g., 5MB)
- Valid image formats (JPG, PNG, WebP)
- Component JSON schema validation

### Business Rules
- Draft pages not publicly accessible
- Published pages have public URLs
- Archived pages hidden but data retained
- Page views tracked for analytics
- Donations linked to page for tracking
- Slug cannot be changed after publishing
- Components can be reordered via drag-and-drop
- Theme changes apply to entire page

## State Management

### Local State
- `pages` - List of donation pages
- `selectedPage` - Currently editing page
- `components` - Array of page components
- `draggedComponent` - Component being dragged
- `previewMode` - Preview vs edit mode
- `settingsOpen` - Settings panel state
- `componentLibraryOpen` - Component library state
- `selectedComponent` - Component being edited

### Global State (AppContext)
- `selectedEntity` - Current organization

## Dependencies

### Internal Dependencies
- `AppContext` - Global state
- UI components (Card, Button, Dialog, etc.)
- Rich text editor component
- Drag-and-drop library

### External Libraries
- `lucide-react` - Icons
- `sonner` - Toast notifications
- `react-beautiful-dnd` or `@dnd-kit` - Drag and drop
- Rich text editor (e.g., TipTap, Quill)
- Color picker component

## Error Handling

### Error Scenarios
1. **Network Error:** Show toast "Unable to load pages", retry
2. **Slug Taken:** Show error "This URL is already in use"
3. **Upload Failed:** Show toast "Image upload failed"
4. **Cannot Publish:** Show error "Add a donation form to publish"
5. **Cannot Delete:** Show error "Cannot delete page with donations"
6. **Permission Error:** Show toast "You don't have permission"

## Loading States
- **Initial load:** Skeleton table
- **Page builder:** Loading spinner while fetching page
- **Image upload:** Progress bar
- **Publish:** Show confirmation with spinner
- **Preview:** Loading indicator

## Mock Data to Remove
- `DonorPageBuilder.tsx` - Any mock page data
- Move interfaces to `src/types/donor-page.ts`

## Migration Notes

### Phase 1: API Integration
1. Create `src/api/donor-pages.ts`
2. Create `src/types/donor-page.ts`
3. Implement page list
4. Implement create/edit page

### Phase 2: Page Builder
1. Implement drag-and-drop
2. Implement component library
3. Implement component properties editor
4. Test component reordering

### Phase 3: Publishing
1. Implement publish flow
2. Implement public page rendering
3. Test public URLs
4. Implement analytics tracking

### Phase 4: Advanced Features
1. Implement page duplication
2. Implement custom CSS
3. Implement A/B testing (future)
4. Implement page templates (future)

## Related Documentation
- [04-DONOR-PORTAL.md](./04-DONOR-PORTAL.md) - Public donation pages
- [02-DONATIONS-MANAGER.md](./02-DONATIONS-MANAGER.md) - Donation tracking
- [01-DONORS-CRM.md](./01-DONORS-CRM.md) - Donor management
- [01-DATA-SCHEMA.md](../../01-DATA-SCHEMA.md) - Donor page data model
