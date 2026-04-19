import { NextFunction, Request, Response } from 'express';
import { UserRole } from '../entities/User';

export const requireRole = (...roles: UserRole[]) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as never as { user?: { role: UserRole } }).user;
    if (!user || !roles.includes(user.role)) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }
    next();
  };
