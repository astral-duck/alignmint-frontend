# Frontend-Backend Integration Overview

## Current State

### Frontend Architecture
- **Framework**: React 18 + TypeScript + Vite
- **UI Library**: shadcn/ui (Radix UI primitives)
- **Styling**: TailwindCSS
- **State Management**: React Context (AppContext)
- **Data**: Currently using mock data from `src/lib/mockData.ts` and `src/lib/financialData.ts`

### Backend Target
- **Framework**: Ruby on Rails
- **API Style**: RESTful JSON API
- **Authentication**: TBD (JWT, session-based, OAuth?)
- **Authorization**: Role-based access control (RBAC)

## Integration Approach

### Phase 1: Documentation (Current)
1. Document all frontend pages and their data requirements
2. Define complete data schema for all entities
3. Specify all required API endpoints
4. Create request/response schemas

### Phase 2: Backend API Development
1. Rails backend team implements API endpoints
2. Set up authentication/authorization
3. Create database migrations and models
4. Implement business logic and validations

### Phase 3: Frontend Integration
1. Remove mock data dependencies
2. Create API client service layer
3. Implement API calls in components
4. Add error handling and loading states
5. Update AppContext to use real API data
6. Remove Vite backend dependencies (if any)

### Phase 4: Testing & Deployment
1. Integration testing
2. End-to-end testing
3. Performance optimization
4. Production deployment

## Key Technical Decisions Needed

### 1. Authentication Strategy
- [ ] JWT tokens (stateless)
- [ ] Session-based (stateful)
- [ ] OAuth 2.0
- [ ] Token refresh mechanism

### 2. API Versioning
- [ ] URL versioning (`/api/v1/...`)
- [ ] Header versioning
- [ ] No versioning (breaking changes handled differently)

### 3. Error Handling
- [ ] Standard error response format
- [ ] HTTP status codes strategy
- [ ] Validation error format

### 4. Pagination
- [ ] Offset-based pagination
- [ ] Cursor-based pagination
- [ ] Page size limits

### 5. File Uploads
- [ ] Direct upload to Rails
- [ ] Cloud storage (S3, etc.) with signed URLs
- [ ] Maximum file sizes

### 6. Real-time Updates
- [ ] Polling
- [ ] WebSockets
- [ ] Server-Sent Events (SSE)
- [ ] Not needed initially

## API Client Architecture

### Proposed Structure
```typescript
// src/api/client.ts - Base API client
// src/api/auth.ts - Authentication endpoints
// src/api/donors.ts - Donor-related endpoints
// src/api/accounting.ts - Accounting endpoints
// src/api/personnel.ts - Personnel endpoints
// ... etc
```

### Features Needed
- Automatic token injection
- Request/response interceptors
- Error handling
- Loading state management
- Retry logic
- Request cancellation

## Environment Configuration

### Required Environment Variables
```
VITE_API_BASE_URL=https://api.example.com
VITE_API_VERSION=v1
VITE_AUTH_TOKEN_KEY=ifm_auth_token
```

## CORS Configuration
Rails backend will need to configure CORS to allow requests from the frontend domain.

## Multi-Tenant Considerations
The application appears to support multiple nonprofits. Backend needs to:
- Isolate data by organization/nonprofit
- Ensure users can only access their organization's data
- Support organization switching if applicable

## Next Steps
1. Review and approve this integration approach
2. Make key technical decisions (authentication, etc.)
3. Begin detailed page-by-page documentation
4. Define complete data schema
