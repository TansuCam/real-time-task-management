import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { users, adminUsers, tasks } from './data';
import { generateToken, verifyUserToken, verifyAdminToken, verifyAdminRole } from './auth';
import { Task, AdminUser } from './types';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST']
  }
});

// Socket.IO Authentication Middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  
  if (!token) {
    return next(new Error('Authentication error'));
  }
  
  try {
    const jwt = require('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET || 'local-development-secret-key';
    const decoded = jwt.verify(token, JWT_SECRET);
    socket.data.user = decoded;
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
});

app.use(cors());
app.use(express.json());

// Auth endpoints
app.post('/auth/user/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = generateToken({ userId: user.id, email: user.email, type: 'user' });
  res.json({ token, user: { id: user.id, email: user.email } });
});

app.post('/auth/admin/login', (req, res) => {
  const { email, password } = req.body;
  const admin = adminUsers.find(a => a.email === email);
  
  if (!admin || !bcrypt.compareSync(password, admin.password)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = generateToken({ adminId: admin.id, email: admin.email, role: admin.role, type: 'admin' });
  const { password: _, ...adminData } = admin;
  res.json({ token, admin: adminData });
});

// Task endpoints
app.get('/tasks', verifyUserToken, (req, res) => {
  const userEmail = req.body.userEmail;
  const userTasks = tasks.filter(t => t.createdBy === userEmail);
  res.json(userTasks);
});

app.get('/admin/tasks', verifyAdminToken, (req, res) => {
  res.json(tasks);
});

app.post('/tasks', verifyUserToken, (req, res) => {
  const { title, description, priority, category } = req.body;
  const userEmail = req.body.userEmail;

  // Input validation
  if (!title || !description || !priority || !category) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  if (title.length > 200 || description.length > 1000) {
    return res.status(400).json({ message: 'Field length exceeded' });
  }

  const validPriorities = ['low', 'normal', 'high', 'urgent'];
  if (!validPriorities.includes(priority)) {
    return res.status(400).json({ message: 'Invalid priority value' });
  }

  const newTask: Task = {
    id: uuidv4(),
    title,
    description,
    priority,
    category,
    status: 'pending',
    createdBy: userEmail,
    createdAt: new Date().toISOString()
  };

  tasks.push(newTask);
  io.emit('task:created', newTask);
  res.status(201).json(newTask);
});

app.patch('/tasks/:id/approve', verifyAdminToken, verifyAdminRole(['Admin', 'Moderator']), (req, res) => {
  const { id } = req.params;
  const task = tasks.find(t => t.id === id);

  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  task.status = 'approved';
  task.rejectionReason = undefined;
  io.emit('task:updated', task);
  res.json(task);
});

app.patch('/tasks/:id/reject', verifyAdminToken, verifyAdminRole(['Admin', 'Moderator']), (req, res) => {
  const { id } = req.params;
  const { rejectionReason } = req.body;
  const task = tasks.find(t => t.id === id);

  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  // Input validation for rejection reason
  if (!rejectionReason || rejectionReason.trim().length === 0) {
    return res.status(400).json({ message: 'Rejection reason is required' });
  }

  if (rejectionReason.length > 500) {
    return res.status(400).json({ message: 'Rejection reason too long' });
  }

  task.status = 'rejected';
  task.rejectionReason = rejectionReason;
  io.emit('task:updated', task);
  res.json(task);
});

// Admin user endpoints
app.get('/admin-users', verifyAdminToken, (req, res) => {
  const sanitized = adminUsers.map(({ password, ...rest }) => rest);
  res.json(sanitized);
});

app.post('/admin-users', verifyAdminToken, verifyAdminRole(['Admin']), (req, res) => {
  const { name, email, role, password } = req.body;

  // Input validation
  if (!name || !email || !role || !password) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  // Check duplicate email
  if (adminUsers.some(a => a.email === email)) {
    return res.status(409).json({ message: 'Email already exists' });
  }

  // Password strength validation
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  const validRoles = ['Admin', 'Moderator', 'Viewer'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  const newAdmin: AdminUser = {
    id: uuidv4(),
    name,
    email,
    role,
    password: bcrypt.hashSync(password, 10)
  };

  adminUsers.push(newAdmin);
  const { password: _, ...adminData } = newAdmin;
  io.emit('adminUser:changed', { type: 'created', data: adminData });
  res.status(201).json(adminData);
});

app.put('/admin-users/:id', verifyAdminToken, verifyAdminRole(['Admin']), (req, res) => {
  const { id } = req.params;
  const { name, email, role, password } = req.body;
  const admin = adminUsers.find(a => a.id === id);

  if (!admin) {
    return res.status(404).json({ message: 'Admin user not found' });
  }

  admin.name = name;
  admin.email = email;
  admin.role = role;
  if (password) {
    admin.password = bcrypt.hashSync(password, 10);
  }

  const { password: _, ...adminData } = admin;
  io.emit('adminUser:changed', { type: 'updated', data: adminData });
  res.json(adminData);
});

app.delete('/admin-users/:id', verifyAdminToken, verifyAdminRole(['Admin']), (req, res) => {
  const { id } = req.params;
  const index = adminUsers.findIndex(a => a.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Admin user not found' });
  }

  adminUsers.splice(index, 1);
  io.emit('adminUser:changed', { type: 'deleted', id });
  res.status(204).send();
});

// Socket.IO
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = 4000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
