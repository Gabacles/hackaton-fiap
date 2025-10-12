import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';

// Defines a custom property on the Express request interface for attaching
// authenticated user information. When TypeScript compiles, this module
// merges declarations and adds the user property to the Request type.
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
      };
    }
  }
}

// Middleware that verifies the presence and validity of the JWT provided in
// the Authorization header. If valid, it attaches the decoded user info
// to the request object; otherwise it responds with a 401 Unauthorized.
export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Missing authorization header' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as any;
    req.user = { id: decoded.id, role: decoded.role };
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

// Middleware that restricts access to teacher-only routes. It assumes that
// the authenticate middleware has already attached req.user. If the user
// does not have a teacher role, a 403 Forbidden response is sent.
export function requireTeacher(req: Request, res: Response, next: NextFunction) {
  if (req.user?.role !== 'TEACHER') {
    return res.status(403).json({ message: 'Forbidden: teachers only' });
  }
  return next();
}