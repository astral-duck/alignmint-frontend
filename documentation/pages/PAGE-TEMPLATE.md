# [Page Name]

**Component File:** `src/components/[ComponentName].tsx`  
**Route:** `/[route-path]`  
**Access Level:** [Admin/Manager/Staff/All]

## Overview
Brief description of what this page does and its purpose in the application.

## UI Features
- Feature 1
- Feature 2
- Feature 3

## Data Requirements

### Data Displayed
List all data that needs to be fetched and displayed:
- **Field Name** (Type) - Description

### Data Mutations
List all data that can be created, updated, or deleted:
- **Create:** What can be created
- **Update:** What can be updated
- **Delete:** What can be deleted

## API Endpoints Required

### GET Endpoints
```
GET /api/v1/[resource]
Description: Fetch list of resources
Query Parameters:
  - organization_id (required)
  - page (optional, default: 1)
  - per_page (optional, default: 25)
  - filters (optional)
Response: {
  data: [...],
  meta: { total, page, per_page }
}
```

### POST Endpoints
```
POST /api/v1/[resource]
Description: Create new resource
Request Body: {
  field1: value,
  field2: value
}
Response: {
  data: { id, ...fields }
}
```

### PUT/PATCH Endpoints
```
PUT /api/v1/[resource]/:id
Description: Update existing resource
Request Body: {
  field1: new_value
}
Response: {
  data: { id, ...updated_fields }
}
```

### DELETE Endpoints
```
DELETE /api/v1/[resource]/:id
Description: Delete resource
Response: {
  message: "Resource deleted successfully"
}
```

## Request/Response Schemas

### Resource Schema
```typescript
interface Resource {
  id: string;
  field1: string;
  field2: number;
  created_at: string;
  updated_at: string;
}
```

## Authentication & Authorization

### Required Permissions
- Permission 1
- Permission 2

### Role-Based Access
- **Admin:** Full access
- **Manager:** Can view and edit
- **Staff:** Can view only
- **Volunteer:** No access

## Business Logic & Validations

### Frontend Validations
- Validation rule 1
- Validation rule 2

### Backend Validations (Rails)
- Validation rule 1
- Validation rule 2

### Business Rules
- Business rule 1
- Business rule 2

## State Management

### Local State
- State variable 1
- State variable 2

### Global State (AppContext)
- Context variable 1
- Context variable 2

## Dependencies

### Internal Dependencies
- Component 1
- Component 2

### External Libraries
- Library 1
- Library 2

## Error Handling

### Error Scenarios
1. **Network Error:** Show error toast, allow retry
2. **Validation Error:** Show field-level errors
3. **Permission Error:** Redirect to unauthorized page
4. **Not Found:** Show 404 message

## Loading States
- Initial load: Show skeleton/spinner
- Pagination: Show loading indicator
- Form submission: Disable button, show spinner

## Mock Data to Remove
List specific mock data references in this component:
- `mockData.ts` - function/variable name
- `financialData.ts` - function/variable name

## Migration Notes
Special considerations for migrating this page to use real API.

## Related Documentation
- Link to related pages
- Link to related data models
