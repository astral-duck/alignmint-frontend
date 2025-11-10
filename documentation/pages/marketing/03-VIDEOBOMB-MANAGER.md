# VideoBomb Manager

**Component File:** `src/components/VideoBombManager.tsx`  
**Route:** `/marketing` (with tool='videobomb')  
**Access Level:** Admin, Manager, Marketing Staff

## Overview
The VideoBomb Manager enables users to create video-centric donation landing pages. Users can record videos directly using their webcam, upload pre-recorded videos, or use both. Each VideoBomb page is a personalized donation landing page featuring the video prominently, designed to increase donor engagement through personal storytelling. This tool is particularly effective for peer-to-peer fundraising and campaign launches.

## UI Features

### Main Features
- **Video Recording:**
  - Record button to start webcam recording
  - Live preview during recording
  - Pause/Resume controls
  - Stop recording button
  - Re-record option
- **Video Upload:**
  - Drag-and-drop file upload
  - File browser upload
  - Supported formats: MP4, WebM, MOV
  - File size limit display
- **VideoBomb Creation Dialog:**
  - Title input
  - Organization selector
  - Video preview
  - Create button
- **VideoBomb List:**
  - Thumbnail preview
  - Title
  - Organization
  - Created date
  - Public link
  - Copy link button
  - Delete button
- **Back to Marketing Hub button**

### Recording Interface
```
┌─────────────────────────────────────────┐
│ Create VideoBomb                        │
├─────────────────────────────────────────┤
│                                         │
│ ┌─────────────────────────────────┐   │
│ │                                 │   │
│ │     [Live Video Preview]        │   │
│ │                                 │   │
│ │                                 │   │
│ └─────────────────────────────────┘   │
│                                         │
│ [🔴 Record]  [⏸️ Pause]  [⏹️ Stop]      │
│                                         │
│ OR                                      │
│                                         │
│ [📤 Upload Video]                       │
│ Drag & drop or click to browse          │
│ Supported: MP4, WebM, MOV (max 100MB)  │
│                                         │
└─────────────────────────────────────────┘
```

### Create VideoBomb Dialog
```
┌─────────────────────────────────────────┐
│ Create VideoBomb Page                   │
├─────────────────────────────────────────┤
│                                         │
│ Title *                                 │
│ [My Fundraising Story               ]  │
│                                         │
│ Organization *                          │
│ [Awakenings                         ▼] │
│                                         │
│ Video Preview                           │
│ ┌─────────────────────────────────┐   │
│ │   [Video Thumbnail/Preview]     │   │
│ └─────────────────────────────────┘   │
│                                         │
│ [Cancel]              [Create VideoBomb]│
└─────────────────────────────────────────┘
```

### VideoBomb List
```
My VideoBombs

┌────────────────────┐  ┌────────────────────┐
│ [Video Thumbnail]  │  │ [Video Thumbnail]  │
│                    │  │                    │
│ My Story           │  │ Campaign Launch    │
│ Awakenings         │  │ Bloom Strong       │
│ Created: 10/15/25  │  │ Created: 10/18/25  │
│                    │  │                    │
│ [🔗 Copy Link]     │  │ [🔗 Copy Link]     │
│ [🗑️ Delete]        │  │ [🗑️ Delete]        │
└────────────────────┘  └────────────────────┘
```

## Data Requirements

### VideoBomb
- **id** (uuid) - Unique identifier
- **organization_id** (uuid) - Organization
- **title** (string) - VideoBomb title
- **video_url** (string) - Video file URL
- **thumbnail_url** (string) - Video thumbnail
- **public_url** (string) - Public landing page URL
- **created_by** (uuid) - Creator user ID
- **created_at** (timestamp) - Creation date
- **views** (integer) - Page view count
- **donations_count** (integer) - Donations from this page
- **donations_total** (decimal) - Total raised
- **status** (enum) - 'active', 'paused', 'archived'

### Video Upload
- **file** (binary) - Video file
- **filename** (string) - Original filename
- **file_size** (integer) - Size in bytes
- **mime_type** (string) - Video MIME type
- **duration** (integer) - Video duration in seconds

## API Endpoints Required

### POST /api/v1/videobombs/upload_video
```
Description: Upload video file to cloud storage
Request: multipart/form-data
  - video: File
  - organization_id: uuid

Response: {
  data: {
    video_url: "https://cdn.../video.mp4",
    thumbnail_url: "https://cdn.../thumbnail.jpg",
    duration: 120,
    file_size: 15728640
  },
  message: "Video uploaded successfully"
}
```

### POST /api/v1/videobombs
```
Description: Create a new VideoBomb page
Request Body: {
  organization_id: "uuid",
  title: "My Fundraising Story",
  video_url: "https://cdn.../video.mp4",
  thumbnail_url: "https://cdn.../thumbnail.jpg"
}

Response: {
  data: {
    id: "uuid",
    organization_id: "uuid",
    title: "My Fundraising Story",
    video_url: "https://cdn.../video.mp4",
    thumbnail_url: "https://cdn.../thumbnail.jpg",
    public_url: "https://donate.org/vb/abc123",
    created_by: "uuid",
    created_at: "2025-10-20T10:00:00Z",
    status: "active"
  },
  message: "VideoBomb created successfully"
}
```

### GET /api/v1/videobombs
```
Description: Get all VideoBombs
Query Parameters:
  - organization_id (required, uuid)
  - status (optional, enum) - 'active', 'paused', 'archived', 'all'
  - page (optional, integer)
  - per_page (optional, integer)

Response: {
  data: [
    {
      id: "uuid",
      organization_id: "uuid",
      organization_name: "Awakenings",
      title: "My Fundraising Story",
      video_url: "https://cdn.../video.mp4",
      thumbnail_url: "https://cdn.../thumbnail.jpg",
      public_url: "https://donate.org/vb/abc123",
      created_at: "2025-10-20T10:00:00Z",
      views: 245,
      donations_count: 12,
      donations_total: 3450.00,
      status: "active"
    }
  ],
  meta: {
    total: 8,
    page: 1,
    per_page: 50
  }
}
```

### GET /api/v1/videobombs/:id
```
Description: Get VideoBomb details
Response: {
  data: {
    id: "uuid",
    organization_id: "uuid",
    organization_name: "Awakenings",
    title: "My Fundraising Story",
    video_url: "https://cdn.../video.mp4",
    thumbnail_url: "https://cdn.../thumbnail.jpg",
    public_url: "https://donate.org/vb/abc123",
    created_by: "uuid",
    created_by_name: "John Doe",
    created_at: "2025-10-20T10:00:00Z",
    views: 245,
    donations_count: 12,
    donations_total: 3450.00,
    status: "active"
  }
}
```

### PATCH /api/v1/videobombs/:id
```
Description: Update VideoBomb
Request Body: {
  title: "Updated Title",
  status: "paused"
}

Response: {
  data: { ...updated videobomb },
  message: "VideoBomb updated successfully"
}
```

### DELETE /api/v1/videobombs/:id
```
Description: Delete VideoBomb
Response: {
  message: "VideoBomb deleted successfully"
}
```

### GET /api/v1/videobombs/:id/analytics
```
Description: Get VideoBomb analytics
Response: {
  data: {
    views: 245,
    unique_visitors: 180,
    donations_count: 12,
    donations_total: 3450.00,
    conversion_rate: 6.67,
    avg_donation: 287.50,
    views_by_day: [...],
    donations_by_day: [...]
  }
}
```

## Request/Response Schemas

```typescript
interface VideoBomb {
  id: string;
  organization_id: string;
  organization_name: string;
  title: string;
  video_url: string;
  thumbnail_url: string;
  public_url: string;
  created_by: string;
  created_by_name: string;
  created_at: string;
  views: number;
  donations_count: number;
  donations_total: number;
  status: 'active' | 'paused' | 'archived';
}

interface VideoBombFormData {
  title: string;
  organization_id: string;
  video_url: string;
  thumbnail_url: string;
}
```

## Authentication & Authorization

### Required Permissions
- `videobombs:read` - View VideoBombs
- `videobombs:create` - Create VideoBombs
- `videobombs:update` - Edit VideoBombs
- `videobombs:delete` - Delete VideoBombs

### Role-Based Access
- **Fiscal Sponsor:** View VideoBombs across all nonprofits
- **Nonprofit User:** Create and manage their nonprofit's VideoBombs
- **Marketing Staff:** Full access
- **Donor/Volunteer:** No access (can view public pages)

## Business Logic & Validations

### Frontend Validations
- Title required (max 100 characters)
- Organization required
- Video required (either recorded or uploaded)
- File size limit: 100MB
- Supported formats: MP4, WebM, MOV
- Camera permissions check

### Backend Validations (Rails)
- Valid organization access
- Video file validation
- File size limit enforcement
- Virus scanning on upload
- Thumbnail generation
- URL uniqueness for public_url

### Business Rules
- Each VideoBomb has unique public URL
- Videos stored in cloud storage (S3, CloudFlare, etc.)
- Thumbnails auto-generated from video
- Public pages are SEO-optimized
- Analytics tracked automatically
- Videos transcoded for web optimization
- Donation button integrated on public page

## State Management

### Local State
- `isRecording` - Recording status
- `isPaused` - Pause status
- `recordedVideo` - Recorded video blob URL
- `uploadedVideo` - Uploaded video file
- `showCreateDialog` - Dialog visibility
- `videoBombTitle` - Form title
- `videoBombEntity` - Selected organization
- `isDragging` - Drag-and-drop state
- `videoRef` - Video element reference
- `mediaRecorderRef` - MediaRecorder reference
- `streamRef` - MediaStream reference

### Global State (AppContext)
- `videoBombs` - Array of VideoBombs
- `addVideoBomb` - Function to add
- `deleteVideoBomb` - Function to delete

## Dependencies

### Internal Dependencies
- `AppContext` - Global state
- UI components (Card, Button, Dialog, Input, etc.)

### External Libraries
- `lucide-react` - Icons
- `sonner` - Toast notifications
- Browser MediaRecorder API - Video recording
- Browser MediaDevices API - Camera access

## Error Handling

### Error Scenarios
1. **Camera Access Denied:** Show toast "Camera access denied. Please upload a video instead."
2. **No Camera Found:** Show toast "No camera found. Please upload a video instead."
3. **File Too Large:** Show error "File exceeds 100MB limit"
4. **Invalid Format:** Show error "Unsupported video format"
5. **Upload Failed:** Show toast "Failed to upload video"
6. **Create Failed:** Show toast "Failed to create VideoBomb"
7. **Permission Error:** Show toast "You don't have permission"

## Loading States
- **Recording:** Live preview with recording indicator
- **Upload:** Progress bar during upload
- **Processing:** Processing indicator after upload
- **Create:** Button loading state

## Mock Data to Remove
- `AppContext.tsx` - `videoBombs` array (move to API)
- `VideoBombManager.tsx` - Local state management (use API)
- Move interfaces to `src/types/videobombs.ts`

## Migration Notes

### Phase 1: Video Upload
1. Integrate with cloud storage (S3, CloudFlare R2)
2. Implement video upload endpoint
3. Add thumbnail generation
4. Test file validation

### Phase 2: VideoBomb Creation
1. Implement CRUD endpoints
2. Generate unique public URLs
3. Create public landing page template
4. Test donation integration

### Phase 3: Analytics
1. Implement view tracking
2. Track donation attribution
3. Add analytics dashboard
4. Generate reports

### Phase 4: Optimization
1. Video transcoding for web
2. Adaptive bitrate streaming
3. CDN integration
4. Performance optimization

## Related Documentation
- [01-MARKETING-CAMPAIGNS.md](./01-MARKETING-CAMPAIGNS.md)
- [02-PROSPECTS-LIST.md](./02-PROSPECTS-LIST.md)
- [../donor-hub/02-DONATIONS-MANAGER.md](../donor-hub/02-DONATIONS-MANAGER.md)
- [01-DATA-SCHEMA.md](../../01-DATA-SCHEMA.md)

## Additional Notes

### Public Landing Page Features
- Video player (autoplay on mobile)
- Compelling headline
- Donation form
- Progress bar (if campaign goal set)
- Social sharing buttons
- Creator information
- Organization branding

### Video Recording Best Practices
- Good lighting
- Clear audio
- 1-3 minutes optimal length
- Personal storytelling
- Clear call-to-action
- Test before recording

### Use Cases
1. **Peer-to-Peer Fundraising:** Supporters create personal appeals
2. **Campaign Launches:** Announce new initiatives
3. **Impact Stories:** Share beneficiary testimonials
4. **Event Promotion:** Promote fundraising events
5. **Thank You Videos:** Donor appreciation

### Technical Specifications
**Supported Formats:**
- MP4 (H.264 codec)
- WebM (VP8/VP9 codec)
- MOV (QuickTime)

**Recommended Settings:**
- Resolution: 1080p or 720p
- Frame rate: 30fps
- Bitrate: 5-10 Mbps
- Audio: AAC, 128kbps

**Browser Compatibility:**
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (with permissions)
- Mobile: Upload only (recording limited)

### Integration with Donations
- Public page includes donation form
- Donations attributed to VideoBomb
- Creator notified of donations
- Analytics track conversion rate
- Social proof (recent donations shown)

### SEO Optimization
- Meta tags for social sharing
- Open Graph tags
- Twitter Card tags
- Schema.org markup
- Optimized page load speed
