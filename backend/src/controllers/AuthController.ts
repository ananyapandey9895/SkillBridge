import { Request, Response } from 'express';
import { UserRole } from '../entities/User';
import { AuthService } from '../services/AuthService';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, email, password, role, learningGoals } = req.body as {
        name: string;
        email: string;
        password: string;
        role: UserRole;
        learningGoals?: string;
      };
      if (!name || !email || !password) {
        res.status(400).json({ error: 'name, email and password are required' });
        return;
      }
      const validRole = Object.values(UserRole).includes(role) ? role : UserRole.LEARNER;
      const user = await this.authService.register({ name, email, password, role: validRole, learningGoals });
      res.status(201).json({ user });
    } catch (err: unknown) {
      res.status(400).json({ error: (err as Error).message });
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body as { email: string; password: string };
      if (!email || !password) {
        res.status(400).json({ error: 'email and password are required' });
        return;
      }
      const token = await this.authService.login(email, password);
      res.json({ token });
    } catch (err: unknown) {
      res.status(401).json({ error: (err as Error).message });
    }
  };
}
