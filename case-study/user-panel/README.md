# User Panel

React + TypeScript user panel for creating and managing personal requests with real-time updates and full i18n support.

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
user-panel/
├── src/
│   ├── pages/
│   │   ├── Login/                    # Login page with custom components
│   │   ├── MainLayout/               # Main layout with navigation
│   │   ├── DashboardHome/            # Home page with statistics
│   │   ├── CreateTask/               # Create new request form
│   │   └── MyTasks/                  # View personal requests
│   ├── components/
│   │   └── ProtectedRoute.tsx        # Route guard component
│   ├── store/
│   │   ├── index.ts                  # Redux store configuration
│   │   ├── authSlice.ts              # Authentication state
│   │   └── tasksSlice.ts             # Tasks with async thunks
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
- Protected routes with automatic redirect to login

### Dashboard
- Personal request statistics (total, pending, approved, rejected)
- Recent tasks summary table (last 5 tasks)
- Color-coded priority and status tags
- Real-time updates via Socket.IO
- Language switcher (TR/EN)
- Responsive sidebar with mobile support

### Create Request (Talep Oluştur)
- Create new requests using custom form components
- Fields:
  - Title (InputField)
  - Description (TextAreaField)
  - Priority (SelectField): low, normal, high, urgent
  - Category (SelectField): Teknik Destek, İzin Talebi, Satın Alma, Diğer
- Form validation with React Hook Form
- Success message with i18n support
- Automatic redirect to My Requests after creation
- Real-time update to all connected clients

### My Requests (Taleplerim)
- View all personal requests
- Filter by status (all, pending, approved, rejected)
- Color-coded status and priority tags
- Display rejection reason for rejected requests
- Real-time updates when request status changes
- Empty state with create button

## Redux Toolkit State Management

### authSlice
```typescript
State: {
  user: User | null;
  token: string | null;
}

Actions:
- loginSuccess(payload: { user, token })
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
- fetchTasks() // GET /tasks (user's tasks only)
- createTask(taskData) // POST /tasks

Reducers:
- addTask(task) // For Socket.IO events
- updateTask(task) // For Socket.IO events
```

## Custom Form Components

### InputField
```tsx
<InputField
  name="title"
  control={control}
  label={t('createTask.title')}
  placeholder={t('createTask.titlePlaceholder')}
  error={errors.title?.message}
  required
/>
```

**Props:**
- `name`: Field name for React Hook Form
- `control`: React Hook Form control object
- `label`: Display label (i18n key)
- `placeholder`: Input placeholder
- `error`: Error message to display
- `required`: Shows required indicator

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

**Features:**
- Eye icon toggle for show/hide password
- All InputField props supported

### SelectField
```tsx
<SelectField
  name="priority"
  control={control}
  label={t('createTask.priority')}
  options={priorityOptions}
  error={errors.priority?.message}
  required
/>
```

**Props:**
- All InputField props
- `options`: Array of `{ value, label }` objects

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

**Props:**
- All InputField props
- `rows`: Number of text rows (default: 4)

## i18n Implementation

### Using Translations
```typescript
import { useTranslation } from 'react-i18next';

const { t, i18n } = useTranslation();

// Display translated text
<Title>{t('dashboard.title')}</Title>

// Change language
i18n.changeLanguage('en'); // or 'tr'

// Get current language
const currentLang = i18n.language;
```

### Translation Structure
```json
{
  "menu": {
    "dashboard": "Dashboard",
    "createTask": "Create Request",
    "myTasks": "My Requests"
  },
  "createTask": {
    "title": "Title",
    "description": "Description",
    "priority": "Priority",
    "category": "Category",
    "submit": "Create Request"
  },
  "status": {
    "pending": "Pending",
    "approved": "Approved",
    "rejected": "Rejected"
  }
}
```

### Supported Languages
- **Turkish (tr)**: Default language
- **English (en)**: Full translation coverage

All UI elements are translated including:
- Navigation menu
- Form labels and placeholders
- Button text
- Status labels
- Validation messages
- Error messages
- Success notifications

## Real-Time Updates (Socket.IO)

### Connection
Socket.IO automatically connects when user logs in, passing JWT token for authentication:

```typescript
// socket.ts
const socket = io('http://localhost:4000', {
  auth: {
    token: localStorage.getItem('token')
  }
});
```

### Event Handlers
```typescript
// Listen for new tasks
socket.on('task:created', (task) => {
  dispatch(addTask(task));
});

// Listen for task updates (approval/rejection)
socket.on('task:updated', (task) => {
  dispatch(updateTask(task));
});
```

### When Events Fire
- **task:created**: When user creates a new request
- **task:updated**: When admin approves or rejects a request

## Form Validation

Using React Hook Form with custom validation:

```typescript
const { control, handleSubmit, formState: { errors } } = useForm({
  defaultValues: {
    title: '',
    description: '',
    priority: 'normal',
    category: ''
  }
});

// Validation rules
<InputField
  name="title"
  control={control}
  rules={{
    required: t('validation.required'),
    minLength: { value: 3, message: t('validation.minLength', { count: 3 }) }
  }}
/>
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

Default port: **3000**

Access the user panel at: http://localhost:3000

## Test Accounts

- **User 1**: `user1@test.com` / `123456`
- **User 2**: `user2@test.com` / `123456`

## Environment Requirements

- Node.js 16+
- Server running on http://localhost:4000

## API Integration

### Axios Configuration
```typescript
// api.ts
const api = axios.create({
  baseURL: 'http://localhost:4000',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - adds JWT token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handles 401 errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      dispatch(logout());
      navigate('/login');
    }
    return Promise.reject(error);
  }
);
```

### API Endpoints Used
- `POST /auth/user/login` - User login
- `GET /tasks` - Fetch user's tasks
- `POST /tasks` - Create new task

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
  "socket.io-client": "^4.x",
  "sass": "^1.x"
}
```

## Code Style

- **TypeScript strict mode** enabled
- **SCSS with CSS Modules** for component styling
- **Component folder pattern** (component + styles together)
- **No direct Ant Design Form** usage (custom wrappers only)
- **Redux Toolkit best practices** with createAsyncThunk
- **Type-safe Redux** with RootState and AppDispatch types

## Task Status Flow

1. **User creates request** → Status: `pending`
2. **Admin reviews** → Approves or Rejects
3. **If approved** → Status: `approved`
4. **If rejected** → Status: `rejected` + rejection reason
5. **Real-time update** → User sees updated status immediately

## Priority Levels

- **Low (Düşük)**: Minor requests
- **Normal (Normal)**: Standard priority
- **High (Yüksek)**: Important requests
- **Urgent (Acil)**: Critical requests requiring immediate attention

## Categories

- **Teknik Destek**: Technical support requests
- **İzin Talebi**: Leave/permission requests
- **Satın Alma**: Purchase requests
- **Diğer**: Other types of requests

## Notable Features

✅ Redux Toolkit with createAsyncThunk pattern  
✅ Custom form components (no direct antd Form)  
✅ Full i18n support (TR/EN)  
✅ Real-time updates via Socket.IO  
✅ JWT authentication with auto-logout  
✅ Protected routes  
✅ Form validation with React Hook Form  
✅ Status filtering on My Requests  
✅ Loading states from Redux  
✅ Type-safe Redux with TypeScript  
✅ Responsive design with Ant Design  
