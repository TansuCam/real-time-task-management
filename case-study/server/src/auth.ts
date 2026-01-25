import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const JWT_SECRET = process.env.JWT_SECRET || 'local-development-secret-key';

interface JWTPayload {
  type: 'user' | 'admin';
  userId?: string;
  adminId?: string;
  email?: string;
  role?: string;
}

export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
};

export const verifyUserToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    if (decoded.type !== 'user') {
      return res.status(403).json({ message: 'Invalid token type' });
    }
    req.body.userId = decoded.userId;
    req.body.userEmail = decoded.email;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const verifyAdminToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    if (decoded.type !== 'admin') {
      return res.status(403).json({ message: 'Invalid token type' });
    }
    req.body.adminId = decoded.adminId;
    req.body.adminRole = decoded.role;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const verifyAdminRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = req.body.adminRole;
    if (!allowedRoles.includes(role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    next();
  };
};
