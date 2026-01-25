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

export interface User {
  id: string;
  email: string;
}
