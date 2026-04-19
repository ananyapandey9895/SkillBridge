import { SkillLevel } from '@prisma/client';
import { SkillRepository } from '../repositories/SkillRepository';

interface CreateSkillDTO {
  skillName: string;
  description?: string;
  level: SkillLevel;
  userId: string;
}

export class SkillService {
  private skillRepo: SkillRepository;

  constructor() {
    this.skillRepo = new SkillRepository();
  }

  async createSkill(dto: CreateSkillDTO) {
    return this.skillRepo.save({
      skillName: dto.skillName,
      description: dto.description ?? '',
      level: dto.level,
      userId: dto.userId,
      isActive: true,
    } as never);
  }

  async getSkillById(id: string) {
    const skill = await this.skillRepo.findById(id);
    if (!skill) throw new Error('Skill not found');
    return skill;
  }

  async getAllActiveSkills() {
    return this.skillRepo.findActive();
  }

  async getUserSkills(userId: string) {
    return this.skillRepo.findByUserId(userId);
  }

  async updateSkill(id: string, userId: string, partial: Record<string, unknown>) {
    const skill = await this.skillRepo.findById(id);
    if (!skill) throw new Error('Skill not found');
    if (skill.userId !== userId) throw new Error('Forbidden');
    const updated = await this.skillRepo.update(id, partial as never);
    if (!updated) throw new Error('Update failed');
    return updated;
  }

  async deleteSkill(id: string, userId: string): Promise<void> {
    const skill = await this.skillRepo.findById(id);
    if (!skill) throw new Error('Skill not found');
    if (skill.userId !== userId) throw new Error('Forbidden');
    await this.skillRepo.update(id, { isActive: false } as never);
  }

  async moderateSkill(id: string, isActive: boolean) {
    const updated = await this.skillRepo.update(id, { isActive } as never);
    if (!updated) throw new Error('Skill not found');
    return updated;
  }
}
