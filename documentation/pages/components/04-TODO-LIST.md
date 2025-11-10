# Todo List Component

**Component File:** Part of Dashboard  
**Usage:** Task management widget on dashboard  
**Access Level:** All authenticated users

## Overview
The Todo List component displays a list of tasks and action items for the user. It appears on the dashboard and allows users to add, complete, and delete tasks. Tasks are user-specific and persist across sessions.

## UI Features

### Features
- Add new todo
- Mark as complete (checkbox)
- Delete todo
- Task list with completion status
- Empty state message

### Task Display
- Checkbox for completion
- Task text
- Delete button (trash icon)
- Strikethrough for completed tasks

## Todo Structure

### Todo Object
- **id** (uuid) - Unique identifier
- **text** (string) - Task description
- **completed** (boolean) - Completion status
- **created_at** (datetime) - When created
- **user_id** (uuid) - Owner

## State Management

### Global State (AppContext)
- `todos` - Array of todos
- `addTodo(text)` - Add new todo
- `toggleTodo(id)` - Toggle completion
- `deleteTodo(id)` - Remove todo

## API Endpoints Required

### GET /api/v1/todos
```
Description: Get user's todos
Response: {
  data: [
    {
      id: "uuid",
      text: "Follow up with donor",
      completed: false,
      created_at: "2025-10-20T10:00:00Z"
    }
  ]
}
```

### POST /api/v1/todos
```
Description: Create new todo
Request Body: {
  text: "Follow up with donor"
}
```

### PATCH /api/v1/todos/:id
```
Description: Update todo
Request Body: {
  completed: true
}
```

### DELETE /api/v1/todos/:id
```
Description: Delete todo
```

## Related Documentation
- [../dashboard/01-MAIN-DASHBOARD.md](../dashboard/01-MAIN-DASHBOARD.md)
- [03-NOTIFICATION-PANEL.md](./03-NOTIFICATION-PANEL.md)
