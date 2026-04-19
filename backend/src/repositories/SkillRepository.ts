import type { Skill } from '@prisma/client';
import { prisma } from '../config/prisma';
import { BaseRepository } from './BaseRepository';

export class SkillRepository extends BaseRepository<Skill> {
  constructor() {
    super(prisma.skill);
  }

  async findById(id: string) {
    return prisma.skill.findUnique({ where: { id }, include: { user: true } });
  }

  async findByUserId(userId: string) {
    return prisma.skill.findMany({ where: { userId }, include: { user: true } });
  }

  async findActive() {
    return prisma.skill.findMany({ where: { isActive: true }, include: { user: true } });
  }
}
