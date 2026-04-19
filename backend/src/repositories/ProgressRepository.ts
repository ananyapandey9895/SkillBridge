import type { Progress } from '@prisma/client';
import { prisma } from '../config/prisma';
import { BaseRepository } from './BaseRepository';

export class ProgressRepository extends BaseRepository<Progress> {
  constructor() {
    super(prisma.progress);
  }

  async findBySessionId(sessionId: string): Promise<Progress[]> {
    return prisma.progress.findMany({ where: { sessionId } });
  }
}
