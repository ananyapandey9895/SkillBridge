import { NextFunction, Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

const authService = new AuthService();

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  try {
    const payload = authService.verifyToken(header.split(' ')[1]);
    (req as never as { user: typeof payload }).user = payload;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};
