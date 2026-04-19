import { Request, Response } from 'express';
import { SkillLevel } from '../entities/Skill';
import { SkillService } from '../services/SkillService';

type AuthReq = Request & { user: { id: string; role: string } };

export class SkillController {
  private skillService: SkillService;

  constructor() {
    this.skillService = new SkillService();
  }

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const { skillName, description, level } = req.body as { skillName: string; description?: string; level?: SkillLevel };
      const userId = (req as AuthReq).user.id;
      const skill = await this.skillService.createSkill({
        skillName,
        description,
        level: level ?? SkillLevel.beginner,
        userId,
      });
      res.status(201).json({ skill });
    } catch (err: unknown) {
      res.status(400).json({ error: (err as Error).message });
    }
  };

  getAll = async (_req: Request, res: Response): Promise<void> => {
    try {
      const skills = await this.skillService.getAllActiveSkills();
      res.json({ skills });
    } catch (err: unknown) {
      res.status(500).json({ error: (err as Error).message });
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const skill = await this.skillService.getSkillById(req.params.id);
      res.json({ skill });
    } catch (err: unknown) {
      res.status(404).json({ error: (err as Error).message });
    }
  };

  getMySkills = async (req: Request, res: Response): Promise<void> => {
    try {
      const skills = await this.skillService.getUserSkills((req as AuthReq).user.id);
      res.json({ skills });
    } catch (err: unknown) {
      res.status(500).json({ error: (err as Error).message });
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const skill = await this.skillService.updateSkill(req.params.id, (req as AuthReq).user.id, req.body as never);
      res.json({ skill });
    } catch (err: unknown) {
      res.status(400).json({ error: (err as Error).message });
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.skillService.deleteSkill(req.params.id, (req as AuthReq).user.id);
      res.json({ message: 'Skill deactivated' });
    } catch (err: unknown) {
      res.status(400).json({ error: (err as Error).message });
    }
  };

  moderate = async (req: Request, res: Response): Promise<void> => {
    try {
      const skill = await this.skillService.moderateSkill(req.params.id, (req.body as { isActive: boolean }).isActive);
      res.json({ skill });
    } catch (err: unknown) {
      res.status(400).json({ error: (err as Error).message });
    }
  };
}
