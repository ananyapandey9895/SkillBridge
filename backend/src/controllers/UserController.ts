import { Request, Response } from 'express';
import { UserService } from '../services/UserService';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  getMe = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await this.userService.getUserById((req as never as { user: { id: string } }).user.id);
      res.json({ user });
    } catch (err: unknown) {
      res.status(404).json({ error: (err as Error).message });
    }
  };

  getAll = async (_req: Request, res: Response): Promise<void> => {
    try {
      const users = await this.userService.getAllUsers();
      res.json({ users });
    } catch (err: unknown) {
      res.status(500).json({ error: (err as Error).message });
    }
  };

  getMentors = async (_req: Request, res: Response): Promise<void> => {
    try {
      const mentors = await this.userService.getMentors();
      res.json({ mentors });
    } catch (err: unknown) {
      res.status(500).json({ error: (err as Error).message });
    }
  };

  updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = (req as never as { user: { id: string } }).user.id;
      const user = await this.userService.updateProfile(id, req.body as { name?: string; learningGoals?: string });
      res.json({ user });
    } catch (err: unknown) {
      res.status(400).json({ error: (err as Error).message });
    }
  };

  blockUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await this.userService.blockUser(req.params.id);
      res.json({ user });
    } catch (err: unknown) {
      res.status(400).json({ error: (err as Error).message });
    }
  };

  unblockUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await this.userService.unblockUser(req.params.id);
      res.json({ user });
    } catch (err: unknown) {
      res.status(400).json({ error: (err as Error).message });
    }
  };
}
