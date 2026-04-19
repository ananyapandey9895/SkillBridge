import { Request, Response } from 'express';
import { SessionService } from '../services/SessionService';

type AuthReq = Request & { user: { id: string } };

export class SessionController {
  private sessionService: SessionService;

  constructor() {
    this.sessionService = new SessionService();
  }

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const session = await this.sessionService.getSession(req.params.id);
      res.json({ session });
    } catch (err: unknown) {
      res.status(404).json({ error: (err as Error).message });
    }
  };

  getMySessions = async (req: Request, res: Response): Promise<void> => {
    try {
      const sessions = await this.sessionService.getUserSessions((req as AuthReq).user.id);
      res.json({ sessions });
    } catch (err: unknown) {
      res.status(500).json({ error: (err as Error).message });
    }
  };

  start = async (req: Request, res: Response): Promise<void> => {
    try {
      const session = await this.sessionService.startSession(req.params.id, (req as AuthReq).user.id);
      res.json({ session });
    } catch (err: unknown) {
      res.status(400).json({ error: (err as Error).message });
    }
  };

  complete = async (req: Request, res: Response): Promise<void> => {
    try {
      const session = await this.sessionService.completeSession(req.params.id, (req as AuthReq).user.id);
      res.json({ session });
    } catch (err: unknown) {
      res.status(400).json({ error: (err as Error).message });
    }
  };

  addProgress = async (req: Request, res: Response): Promise<void> => {
    try {
      const { percentage, remarks } = req.body as { percentage: number; remarks?: string };
      const progress = await this.sessionService.addProgress(
        req.params.id,
        (req as AuthReq).user.id,
        percentage,
        remarks
      );
      res.status(201).json({ progress });
    } catch (err: unknown) {
      res.status(400).json({ error: (err as Error).message });
    }
  };

  addFeedback = async (req: Request, res: Response): Promise<void> => {
    try {
      const { rating, comment } = req.body as { rating: number; comment?: string };
      const feedback = await this.sessionService.addFeedback(
        req.params.id,
        (req as AuthReq).user.id,
        rating,
        comment
      );
      res.status(201).json({ feedback });
    } catch (err: unknown) {
      res.status(400).json({ error: (err as Error).message });
    }
  };
}
