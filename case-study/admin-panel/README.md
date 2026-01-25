# Admin Panel

React + TypeScript admin panel with role-based access control, real-time updates, and full i18n support.

## Tech Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **UI Library**: Ant Design
- **State Management**: Redux Toolkit with createAsyncThunk
- **Forms**: React Hook Form with custom field components
- **i18n**: react-i18next (TR/EN)
- **Routing**: React Router v6 with protected routes
- **HTTP Client**: Axios with JWT interceptors
- **Real-time**: Socket.IO with authentication
- **Styling**: SCSS with CSS Modules

## Project Structure

```
admin-panel/
├── src/
│   ├── pages/
│   │   ├── Login/                    # Login page with custom form components
│   │   ├── MainLayout/               # Main layout with navigation
│   │   ├── DashboardHome/            # Home page with statistics
│   │   ├── PendingTasks/             # Pending requests with filters
│   │   ├── AllTasks/                 # All requests with comprehensive filters
│   │   └── AdminUsers/               # Admin user management (Admin only)
│   ├── components/
│   │   ├── ProtectedRoute.tsx        # Route guard with role checking
│   │   └── TaskDetailModal/          # Modal for viewing request details
│   ├── store/
│   │   ├── index.ts                  # Redux store configuration
│   │   ├── authSlice.ts              # Authentication state
│   │   ├── tasksSlice.ts             # Tasks with async thunks
│   │   └── adminUsersSlice.ts        # Admin users with async thunks
│   ├── api.ts                        # Axios instance with interceptors
│   ├── socket.ts                     # Socket.IO client with auth
│   ├── types.ts                      # TypeScript type definitions
│   ├── App.tsx                       # Root component with routes
│   └── main.tsx                      # Entry point with i18n setup
├── public/
│   └── locales/
│       ├── tr/
│       │   └── translation.json      # Turkish translations
│       └── en/
│           └── translation.json      # English translations
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Features

### Authentication
- JWT-based authentication with secure login
- Custom PasswordField and InputField components
- Login error handling with i18n messages
- Automatic logout on token expiration (401)
- Protected routes with automatic redirect

### Dashboard
- Total pending tasks count
- Today's approved and rejected tasks (daily metrics)
- Priority-based distribution (low, normal, high, urgent)
- Real-time updates via Socket.IO
- Role-based navigation menu
- Language switcher (TR/EN)
- Responsive sidebar with mobile support

### Pending Requests (Talepler)
- View all pending requests
- Filter by priority and status
- Approve/reject actions (Admin & Moderator only)
- Rejection reason modal with validation
- Task detail modal
- Real-time updates when requests change
- Loading states from Redux

### All Requests
- View all requests in the system
- Comprehensive filtering:
  - Status (pending, approved, rejected)
  - Priority (low, normal, high, urgent)
  - Search by title
- Request detail modal
- Color-coded priority tags
- Real-time synchronization

### Admin User Management
- View all admin users (all roles)
- Create new admin users (Admin only)
- Edit admin user details (Admin only)
- Delete admin users (Admin only)
- Role assignment (Admin, Moderator, Viewer)
- Form validation with custom components
- Real-time updates across all connected clients

### Role-Based Access Control
- **Admin**: Full access to all features
- **Moderator**: Can approve/reject, read-only admin users
- **Viewer**: Read-only access to all data
- Disabled buttons with informative tooltips for unauthorized actions
- Route-level protection

## Redux Toolkit State Management

### authSlice
```typescript
State: {
  admin: AdminUser | null;
  token: string | null;
}

Actions:
- loginSuccess(payload: { admin, token })
- logout()
```

### tasksSlice
```typescript
State: {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

Async Thunks:
- fetchTasks() // GET /admin/tasks
- approveTask(taskId) // PATCH /tasks/:id/approve
- rejectTask({ taskId, reason }) // PATCH /tasks/:id/reject

Reducers:
- addTask(task) // For Socket.IO events
- updateTask(task) // For Socket.IO events
```

### adminUsersSlice
```typescript
State: {
  adminUsers: AdminUser[];
  loading: boolean;
  error: string | null;
}

Async Thunks:
- fetchAdminUsers() // GET /admin-users
- createAdminUser(userData) // POST /admin-users
- updateAdminUserAsync({ id, data }) // PUT /admin-users/:id
- deleteAdminUser(id) // DELETE /admin-users/:id

Reducers:
- addAdminUser(user) // For Socket.IO events
- updateAdminUser(user) // For Socket.IO events
- removeAdminUser(id) // For Socket.IO events
```

## Custom Form Components

Located in each page's folder, these components wrap Ant Design inputs with React Hook Form:

### InputField
```tsx
<InputField
  name="email"
  control={control}
  label={t('login.email')}
  placeholder={t('login.emailPlaceholder')}
  error={errors.email?.message}
  required
/>
```

### PasswordField
```tsx
<PasswordField
  name="password"
  control={control}
  label={t('login.password')}
  placeholder={t('login.passwordPlaceholder')}
  error={errors.password?.message}
  required
/>
```

### SelectField
```tsx
<SelectField
  name="role"
  control={control}
  label={t('adminUsers.role')}
  options={roleOptions}
  error={errors.role?.message}
  required
/>
```

### TextAreaField
```tsx
<TextAreaField
  name="description"
  control={control}
  label={t('createTask.description')}
  placeholder={t('createTask.descriptionPlaceholder')}
  error={errors.description?.message}
  rows={4}
  required
/>
```

## i18n Implementation

### Language Switching
```typescript
import { useTranslation } from 'react-i18next';

const { t, i18n } = useTranslation();

// Change language
i18n.changeLanguage('en');

// Use translations
<Title>{t('dashboard.title')}</Title>
```

### Translation Files
- `public/locales/tr/translation.json` - Turkish
- `public/locales/en/translation.json` - English

All UI text is fully translated including:
- Menu labels
- Page titles
- Form labels and placeholders
- Button text
- Validation messages
- Status labels
- Tooltips
- Error messages

## Real-Time Updates (Socket.IO)

### Connection Setup
```typescript
import socket from './socket';

// Socket connects automatically with JWT token
socket.on('task:created', (task) => {
  dispatch(addTask(task));
});

socket.on('task:updated', (task) => {
  dispatch(updateTask(task));
});

socket.on('adminUser:changed', (data) => {
  if (data.type === 'created') dispatch(addAdminUser(data.data));
  if (data.type === 'updated') dispatch(updateAdminUser(data.data));
  if (data.type === 'deleted') dispatch(removeAdminUser(data.id));
});
```

## Installation

```bash
npm install
```

## Running the Application

**Development mode:**
```bash
npm run dev
```

**Build for production:**
```bash
npm run build
```

**Preview production build:**
```bash
npm run preview
```

## Port

Default port: **3001**

Access the admin panel at: http://localhost:3001

## Test Accounts

- **Admin**: `admin@test.com` / `admin123`
- **Moderator**: `moderator@test.com` / `mod123`
- **Viewer**: `viewer@test.com` / `viewer123`

## Environment Requirements

- Node.js 16+
- Server running on http://localhost:4000

## Key Dependencies

```json
{
  "react": "^18.x",
  "react-router-dom": "^6.x",
  "@reduxjs/toolkit": "^2.x",
  "react-redux": "^9.x",
  "react-hook-form": "^7.x",
  "react-i18next": "^14.x",
  "antd": "^5.x",
  "axios": "^1.x",
  "socket.io-client": "^4.x"
}
```

## Code Style

- **TypeScript strict mode** enabled
- **SCSS with CSS Modules** for styling
- **Component folder pattern** (component + styles in same folder)
- **No direct Ant Design Form** usage (custom components only)
- **Redux Toolkit best practices** with createAsyncThunk
- **.unwrap()** for promise handling in components

## Notable Features

✅ Full Redux Toolkit async thunk pattern  
✅ Custom form components throughout  
✅ Complete i18n support (TR/EN)  
✅ Role-based UI with disabled states  
✅ Socket.IO with JWT authentication  
✅ Comprehensive filtering on list pages  
✅ TaskDetailModal component  
✅ Axios 401 interceptor for auto-logout  
✅ Loading states from Redux  
✅ Type-safe dispatch with AppDispatch  
✅ Protected routes with role checking  
