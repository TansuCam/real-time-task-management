# Server - Backend API

Express.js + TypeScript backend with Socket.IO real-time communication, JWT authentication, and role-based access control.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Real-time**: Socket.IO with authentication middleware
- **Authentication**: JWT (jsonwebtoken)
- **Security**: bcryptjs for password hashing
- **Development**: ts-node-dev for hot reload

## Project Structure

```
server/
├── src/
│   ├── index.ts          # Main server file with Express + Socket.IO setup
│   ├── auth.ts           # JWT middleware and authentication utilities
│   ├── data.ts           # In-memory data storage and seed data
│   └── types.ts          # TypeScript type definitions
├── .env.example          # Environment variable template
├── .env                  # Environment configuration (create from .env.example)
├── package.json
└── tsconfig.json
```

## Environment Setup

Create a `.env` file in the server directory:

```env
JWT_SECRET=your-very-strong-secret-key-here
PORT=4000
```

**Important**: Use a strong random secret in production. Generate one using:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Installation

```bash
npm install
```

## Running the Server

**Development mode (with hot reload):**
```bash
npm run dev
```

**Build for production:**
```bash
npm run build
```

**Run production build:**
```bash
npm start
```

## API Endpoints

### Authentication

#### `POST /auth/user/login`
User login endpoint.

**Request Body:**
```json
{
  "email": "user1@test.com",
  "password": "123456"
}
```

**Response:**
```json
{
  "token": "jwt-token-string",
  "user": {
    "id": "user-id",
    "name": "User Name",
    "email": "user1@test.com"
  }
}
```

**Validation:**
- Email and password required
- Returns 401 for invalid credentials

---

#### `POST /auth/admin/login`
Admin login endpoint.

**Request Body:**
```json
{
  "email": "admin@test.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "jwt-token-string",
  "admin": {
    "id": "admin-id",
    "name": "Admin Name",
    "email": "admin@test.com",
    "role": "Admin"
  }
}
```

### Tasks (Requests)

All task endpoints require JWT authentication via `Authorization: Bearer <token>` header.

#### `GET /tasks`
Get current user's tasks.

**Response:**
```json
[
  {
    "id": "task-id",
    "title": "Task Title",
    "description": "Task description",
    "priority": "high",
    "category": "Teknik Destek",
    "status": "pending",
    "createdBy": "user-id",
    "createdAt": "2026-01-23T10:00:00.000Z",
    "rejectionReason": null
  }
]
```

---

#### `GET /admin/tasks`
Get all tasks (admin only).

**Response:** Array of all tasks in the system.

---

#### `POST /tasks`
Create a new task.

**Request Body:**
```json
{
  "title": "Request Title",
  "description": "Detailed description",
  "priority": "high",
  "category": "Teknik Destek"
}
```

**Validation:**
- title: required, min 3 characters
- description: required, min 10 characters
- priority: must be one of ['low', 'normal', 'high', 'urgent']
- category: must be one of ['Teknik Destek', 'İzin Talebi', 'Satın Alma', 'Diğer']

**Response:** Created task object

**Socket.IO Event:** Emits `task:created` to all connected clients

---

#### `PATCH /tasks/:id/approve`
Approve a pending task (Admin/Moderator only).

**Authorization:** Admin or Moderator role required

**Response:** Updated task with status 'approved'

**Socket.IO Event:** Emits `task:updated` to all connected clients

---

#### `PATCH /tasks/:id/reject`
Reject a pending task with a reason (Admin/Moderator only).

**Request Body:**
```json
{
  "rejectionReason": "Reason for rejection"
}
```

**Validation:**
- rejectionReason: required, min 5 characters

**Response:** Updated task with status 'rejected' and rejectionReason

**Socket.IO Event:** Emits `task:updated` to all connected clients

### Admin Users

All admin user endpoints require JWT authentication and Admin role.

#### `GET /admin-users`
Get all admin users.

**Response:**
```json
[
  {
    "id": "admin-id",
    "name": "Admin Name",
    "email": "admin@test.com",
    "role": "Admin"
  }
]
```

---

#### `POST /admin-users`
Create a new admin user (Admin only).

**Request Body:**
```json
{
  "name": "New Admin",
  "email": "newadmin@test.com",
  "password": "password123",
  "role": "Moderator"
}
```

**Validation:**
- name: required, min 2 characters
- email: required, valid email format
- password: required, min 6 characters
- role: must be one of ['Admin', 'Moderator', 'Viewer']

**Response:** Created admin user (password not included)

**Socket.IO Event:** Emits `adminUser:changed` with type 'created'

---

#### `PUT /admin-users/:id`
Update an admin user (Admin only).

**Request Body:**
```json
{
  "name": "Updated Name",
  "email": "updated@test.com",
  "role": "Admin"
}
```

**Validation:**
- name: optional, min 2 characters if provided
- email: optional, valid email format if provided
- role: optional, must be valid role if provided

**Response:** Updated admin user

**Socket.IO Event:** Emits `adminUser:changed` with type 'updated'

---

#### `DELETE /admin-users/:id`
Delete an admin user (Admin only).

**Response:** Success message

**Socket.IO Event:** Emits `adminUser:changed` with type 'deleted'

## Socket.IO Events

### Authentication

Socket.IO connections require authentication via JWT token:

```javascript
const socket = io('http://localhost:4000', {
  auth: {
    token: 'jwt-token-string'
  }
});
```

Failed authentication will disconnect the socket with an error.

### Server-to-Client Events

#### `task:created`
Emitted when a new task is created.

**Payload:** Task object

---

#### `task:updated`
Emitted when a task is approved or rejected.

**Payload:** Updated task object

---

#### `adminUser:changed`
Emitted when an admin user is created, updated, or deleted.

**Payload:**
```json
{
  "type": "created" | "updated" | "deleted",
  "data": AdminUser,  // for created/updated
  "id": "admin-id"    // for deleted
}
```

## Role-Based Access Control

### User
- Can create tasks
- Can view own tasks only
- No access to admin endpoints

### Viewer (Admin Panel)
- Read-only access to all data
- Cannot approve/reject tasks
- Cannot manage admin users

### Moderator (Admin Panel)
- Can approve/reject tasks
- Read-only access to admin users
- Cannot manage admin users

### Admin (Admin Panel)
- Full access to all features
- Can manage admin users
- Can approve/reject tasks

## Security Features

- **JWT Authentication**: All protected routes verify JWT tokens
- **Password Hashing**: bcryptjs with 10 salt rounds
- **Input Validation**: All POST/PUT/PATCH endpoints validate input
- **Socket.IO Auth**: Middleware validates JWT for socket connections
- **Environment Variables**: Secrets stored in .env file
- **Role Verification**: Endpoints check user roles before allowing actions

## Test Accounts

### Users
- `user1@test.com` / `123456`
- `user2@test.com` / `123456`

### Admin Users
- `admin@test.com` / `admin123` (Admin)
- `moderator@test.com` / `mod123` (Moderator)
- `viewer@test.com` / `viewer123` (Viewer)

## Data Storage

Currently uses in-memory storage with seed data. Data is reset on server restart.

**Seed Data:**
- 2 regular users
- 3 admin users
- 20 sample tasks with various statuses

## Port

Default port: **4000**

Can be changed via `PORT` environment variable in `.env` file.
