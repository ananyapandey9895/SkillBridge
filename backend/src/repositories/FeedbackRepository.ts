import type { Feedback } from '@prisma/client';
import { prisma } from '../config/prisma';
import { BaseRepository } from './BaseRepository';

export class FeedbackRepository extends BaseRepository<Feedback> {
  constructor() {
    super(prisma.feedback);
  }

  async findBySessionId(sessionId: string): Promise<Feedback[]> {
    return prisma.feedback.findMany({ where: { sessionId } });
  }
}
