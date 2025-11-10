# Vite Backend Removal Plan

## Current Situation

Vite is currently being used as the **development server and build tool** for the frontend application. It does NOT provide a backend - it's purely a frontend build tool.

### What Vite Does
- ✅ Serves the React application during development
- ✅ Hot Module Replacement (HMR) for fast development
- ✅ Builds optimized production bundles
- ✅ Handles TypeScript compilation
- ✅ Processes CSS/Tailwind

### What Vite Does NOT Do
- ❌ Provide a backend API
- ❌ Handle database operations
- ❌ Manage authentication
- ❌ Store data

## Clarification

**There is no "Vite backend" to remove.** The application currently uses:
1. **Vite** - Frontend build tool (KEEP THIS)
2. **Mock Data** - Hardcoded data in `src/lib/mockData.ts` and `src/lib/financialData.ts` (REMOVE THIS)
3. **React Context** - Client-side state management (KEEP THIS, but connect to real API)

## What Actually Needs to Change

### 1. Remove Mock Data Dependencies
**Files to modify/remove:**
- `src/lib/mockData.ts` - Contains fake metrics, donations, orders data
- `src/lib/financialData.ts` - Contains fake balance sheet, P&L data
- `src/lib/emailTemplates.ts` - May be fine, just templates
- `src/lib/exportUtils.ts` - Utility functions, likely OK

**Action:** Replace mock data imports with API calls

### 2. Create API Client Layer
**New files to create:**
```
src/
  api/
    client.ts          # Base API client with axios/fetch
    config.ts          # API configuration
    types.ts           # Shared API types
    auth.ts            # Authentication endpoints
    donors.ts          # Donor endpoints
    donations.ts       # Donation endpoints
    accounting.ts      # Accounting endpoints
    personnel.ts       # Personnel endpoints
    marketing.ts       # Marketing endpoints
    reports.ts         # Reports endpoints
    admin.ts           # Admin endpoints
```

### 3. Update AppContext
**File:** `src/contexts/AppContext.tsx`

**Changes needed:**
- Replace hardcoded entity list with API call
- Replace mock notifications with API call
- Replace mock todos with API call
- Add API loading states
- Add error handling
- Add authentication state

### 4. Update All Components
Each component currently using mock data needs to:
1. Import API client instead of mock data
2. Add loading states
3. Add error handling
4. Handle empty states
5. Implement proper data fetching (useEffect, React Query, etc.)

## Recommended Approach

### Phase 1: Setup API Infrastructure
1. Install API client library (axios or fetch wrapper)
2. Create base API client with interceptors
3. Set up environment variables for API URL
4. Create TypeScript types for all API responses

### Phase 2: Authentication
1. Implement login/logout functionality
2. Token storage and management
3. Protected route wrapper
4. Automatic token refresh

### Phase 3: Incremental Migration
Migrate one section at a time:
1. **Start with Donors** (simpler CRUD)
2. **Then Donations** (related to donors)
3. **Then Accounting** (more complex)
4. **Then Personnel**
5. **Then Marketing**
6. **Finally Reports** (depends on all other data)

### Phase 4: Remove Mock Data
Once all components are using real API:
1. Delete `src/lib/mockData.ts`
2. Delete `src/lib/financialData.ts`
3. Remove any remaining mock data references
4. Clean up unused code

## Technology Recommendations

### Option 1: Axios (Recommended)
```bash
npm install axios
```
**Pros:**
- Popular and well-documented
- Built-in interceptors
- Automatic JSON transformation
- Better error handling

### Option 2: React Query + Fetch
```bash
npm install @tanstack/react-query
```
**Pros:**
- Built-in caching
- Automatic refetching
- Loading/error states
- Optimistic updates
- Best for complex data fetching

### Option 3: SWR
```bash
npm install swr
```
**Pros:**
- Lightweight
- Built-in caching
- Revalidation strategies
- Good for real-time data

## Environment Variables

**Create:** `.env.local`
```bash
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_API_TIMEOUT=30000
VITE_ENABLE_API_LOGGING=true
```

**Create:** `.env.production`
```bash
VITE_API_BASE_URL=https://api.yourapp.com/api/v1
VITE_API_TIMEOUT=30000
VITE_ENABLE_API_LOGGING=false
```

## Example API Client Structure

```typescript
// src/api/client.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

## Migration Checklist

### Setup
- [ ] Choose API client library (Axios recommended)
- [ ] Install dependencies
- [ ] Create API client base
- [ ] Set up environment variables
- [ ] Create TypeScript types for API responses

### Authentication
- [ ] Create login page/component
- [ ] Implement authentication API calls
- [ ] Add token storage
- [ ] Create protected route wrapper
- [ ] Add logout functionality

### Data Migration (by section)
- [ ] Donors & Donations
- [ ] Accounting (Chart of Accounts, Journal Entries)
- [ ] Deposits & Expenses
- [ ] Personnel & Volunteers
- [ ] Marketing & Campaigns
- [ ] Reports
- [ ] Administration

### Cleanup
- [ ] Remove mock data files
- [ ] Remove unused imports
- [ ] Update documentation
- [ ] Test all features
- [ ] Performance optimization

## Important Notes

1. **Keep Vite** - It's your build tool, not a backend
2. **Keep React Context** - Just populate it with real API data instead of mocks
3. **Keep UI Components** - They're fine, just need different data sources
4. **Add Loading States** - Real APIs take time, unlike instant mock data
5. **Add Error Handling** - Network requests can fail
6. **Consider Caching** - Use React Query or SWR to avoid excessive API calls

## Timeline Estimate

- **API Infrastructure Setup:** 1-2 days
- **Authentication:** 2-3 days
- **Per Section Migration:** 2-4 days each
- **Testing & Cleanup:** 3-5 days
- **Total:** 4-6 weeks for complete migration

## Next Steps

1. Review this plan with the team
2. Coordinate with Rails backend team on API readiness
3. Choose API client library
4. Set up development environment
5. Begin with authentication implementation
