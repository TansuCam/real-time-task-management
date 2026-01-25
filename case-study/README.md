# Case Study - Real-Time Task Management System

A monorepo project with real-time communication between user and admin panels using WebSocket. Full i18n support (TR/EN) with custom form components and Redux Toolkit async thunks.

## Project Structure

```
case-study/
├── server/          # Node.js + TypeScript + Express + Socket.IO
├── user-panel/      # React + TypeScript + Vite + Ant Design
├── admin-panel/     # React + TypeScript + Vite + Ant Design
└── README.md
```

## Tech Stack

- **Backend**: Node.js, TypeScript, Express, Socket.IO, JWT, bcryptjs
- **Frontend**: React 18, TypeScript, Vite, Ant Design
- **Forms**: React Hook Form with custom field components (InputField, PasswordField, SelectField, TextAreaField)
- **State**: Redux Toolkit with createAsyncThunk for all async operations
- **i18n**: react-i18next with full TR/EN support
- **Routing**: React Router with protected routes
- **HTTP**: Axios with JWT interceptors
- **Real-time**: Socket.IO with authentication middleware
- **Styling**: SCSS with CSS Modules
- **Auth**: JWT authentication with environment variable secrets

## Ports

- **Server**: 4000
- **User Panel**: 3000
- **Admin Panel**: 3001

## Languages

- **Turkish (TR)**: Default language
- **English (EN)**: Full translation support
- Language switcher available in all panels

## Test Accounts

### User Panel
- `user1@test.com` / `123456`
- `user2@test.com` / `123456`

### Admin Panel
- `admin@test.com` / `admin123` (Admin - full access)
- `moderator@test.com` / `mod123` (Moderator - can approve/reject tasks)
- `viewer@test.com` / `viewer123` (Viewer - read-only)

## Installation & Setup

### 1. Install Dependencies

```powershell
# Install server dependencies
cd server
npm install

# Install user-panel dependencies
cd ../user-panel
npm install

# Install admin-panel dependencies
cd ../admin-panel
npm install
```

### 2. Environment Configuration

**Server Setup:**

```powershell
cd server
cp .env.example .env
```

Then edit the `.env` file and set a strong JWT secret:

```env
JWT_SECRET=your-very-strong-secret-key-here
PORT=3001
```

> **Important**: Generate a strong random string for `JWT_SECRET` in production. You can use tools like:
> - `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
> - Online generators like [randomkeygen.com](https://randomkeygen.com)

### 3. Run the Applications

Open **3 separate terminals** and run:

**Terminal 1 - Server:**
```powershell
cd server
npm run dev
```

**Terminal 2 - User Panel:**
```powershell
cd user-panel
npm run dev
```

**Terminal 3 - Admin Panel:**
```powershell
cd admin-panel
npm run dev
```

### 3. Access the Applications

- **User Panel**: http://localhost:3000
- **Admin Panel**: http://localhost:3001
- **Server API**: http://localhost:4000

## Features

### User Panel
- User authentication with JWT and secure login error handling
- Dashboard with request statistics ("Talep" terminology)
- Create new requests using custom form components (InputField, TextAreaField, SelectField)
- View personal requests with status filters
- Real-time updates via authenticated WebSocket
- Full i18n support with language switcher
- Protected routes with automatic redirect

### Admin Panel
- Admin authentication with role-based access and custom login components
- Dashboard with system statistics using Redux Toolkit async thunks
- View and manage pending requests with priority/status filters
- Approve/reject requests with reason (Moderator & Admin only)
- View all requests with comprehensive filtering
- Admin user management with full CRUD operations (Admin only)
- Real-time synchronization via authenticated Socket.IO
- Role-based UI with disabled states and i18n tooltips
- Request detail modal component for viewing full information
- All state management via Redux Toolkit createAsyncThunk
- Full i18n support with language switcher

### Real-Time Features (Socket.IO with Authentication)
- New request notifications
- Request status updates (approval/rejection)
- Admin user changes synchronization (create/update/delete)
- Authenticated socket connections with JWT token validation
- Automatic reconnection handling

## Data Models

### Task (Talep/Request)
```typescript
{
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  category: 'Teknik Destek' | 'İzin Talebi' | 'Satın Alma' | 'Diğer';
  status: 'pending' | 'approved' | 'rejected';
  createdBy: string;
  createdAt: string;
  rejectionReason?: string;
}
```

### AdminUser
```typescript
{
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Moderator' | 'Viewer';
}
```

## API Endpoints

### Authentication
- `POST /auth/user/login` - User login (with validation)
- `POST /auth/admin/login` - Admin login (with validation)

### Tasks (Requests)
- `GET /tasks` - Get user's tasks
- `GET /admin/tasks` - Get all tasks (admin)
- `POST /tasks` - Create new task (with input validation)
- `PATCH /tasks/:id/approve` - Approve task (admin/moderator only)
- `PATCH /tasks/:id/reject` - Reject task with reason (admin/moderator only, validated)

### Admin Users
- `GET /admin-users` - Get all admin users
- `POST /admin-users` - Create admin user (admin only, validated)
- `PUT /admin-users/:id` - Update admin user (admin only, validated)
- `DELETE /admin-users/:id` - Delete admin user (admin only)

### Security Features
- All endpoints protected with JWT middleware
- Role-based access control
- Input validation on all POST/PUT/PATCH endpoints
- Password hashing with bcryptjs
- Socket.IO authentication middleware

## Role Permissions

### Admin
- Full access to all features
- Can manage admin users
- Can approve/reject tasks

### Moderator
- Can approve/reject tasks
- Read-only access to admin users

### Viewer
- Read-only access to all data
- Cannot approve/reject tasks
- Cannot manage admin users

## Architecture & Best Practices

### Redux Toolkit State Management
- All async operations use `createAsyncThunk`
- Centralized loading/error states in Redux slices
- Type-safe dispatch with `AppDispatch`
- Components use `.unwrap()` for promise handling
- Three main slices:
  - **authSlice**: User/admin authentication state
  - **tasksSlice**: Task/request management with async thunks (fetch, create, approve, reject)
  - **adminUsersSlice**: Admin user CRUD with async thunks

### Custom Form Components
- **InputField**: Wrapper for text inputs with i18n validation
- **PasswordField**: Secure password input with eye toggle
- **SelectField**: Dropdown with i18n options
- **TextAreaField**: Multi-line text with i18n placeholder
- All components use React Hook Form Controller
- No direct Ant Design Form imports in pages

### i18n Implementation
- Full coverage of all UI text (TR/EN)
- Dynamic validation messages
- Language switcher in header
- Persisted language preference
- Menu labels, buttons, form fields all translated

### Security Features
- JWT_SECRET stored in environment variable (.env)
- Socket.IO authentication middleware validates tokens
- Server-side input validation on all mutations
- Password hashing with bcryptjs (10 rounds)
- 401 interceptor for automatic logout
- Protected routes with redirect to login

### Development Notes
- Server seeds 20 requests on startup
- JWT tokens expire after 24 hours
- Axios interceptors handle token expiration
- Role-based UI with disabled states and i18n tooltips
- Component folder pattern for SCSS modules
- TypeScript strict mode enabled
