import { Request, Response } from 'express';
import { SkillRequestService } from '../services/SkillRequestService';

type AuthReq = Request & { user: { id: string } };

export class SkillRequestController {
  private requestService: SkillRequestService;

  constructor() {
    this.requestService = new SkillRequestService();
  }

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const request = await this.requestService.createRequest({
        skillId: (req.body as { skillId: string }).skillId,
        requesterId: (req as AuthReq).user.id,
      });
      res.status(201).json({ request });
    } catch (err: unknown) {
      res.status(400).json({ error: (err as Error).message });
    }
  };

  accept = async (req: Request, res: Response): Promise<void> => {
    try {
      const session = await this.requestService.acceptRequest(req.params.id, (req as AuthReq).user.id);
      res.json({ session });
    } catch (err: unknown) {
      res.status(400).json({ error: (err as Error).message });
    }
  };

  reject = async (req: Request, res: Response): Promise<void> => {
    try {
      const request = await this.requestService.rejectRequest(req.params.id, (req as AuthReq).user.id);
      res.json({ request });
    } catch (err: unknown) {
      res.status(400).json({ error: (err as Error).message });
    }
  };

  getSent = async (req: Request, res: Response): Promise<void> => {
    try {
      const requests = await this.requestService.getSentRequests((req as AuthReq).user.id);
      res.json({ requests });
    } catch (err: unknown) {
      res.status(500).json({ error: (err as Error).message });
    }
  };

  getReceived = async (req: Request, res: Response): Promise<void> => {
    try {
      const requests = await this.requestService.getReceivedRequests((req as AuthReq).user.id);
      res.json({ requests });
    } catch (err: unknown) {
      res.status(500).json({ error: (err as Error).message });
    }
  };

  getPending = async (req: Request, res: Response): Promise<void> => {
    try {
      const requests = await this.requestService.getPendingRequests((req as AuthReq).user.id);
      res.json({ requests });
    } catch (err: unknown) {
      res.status(500).json({ error: (err as Error).message });
    }
  };
}
