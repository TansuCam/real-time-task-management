export interface Task {
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

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Moderator' | 'Viewer';
  password: string;
}

export interface User {
  id: string;
  email: string;
  password: string;
}
