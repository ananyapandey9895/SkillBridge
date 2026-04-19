import type { Session } from '@prisma/client';
import { prisma } from '../config/prisma';
import { BaseRepository } from './BaseRepository';

const relations = {
  request: { include: { requester: true, provider: true, skill: true } },
  progressRecords: true,
  feedbacks: true,
};

export class SessionRepository extends BaseRepository<Session> {
  constructor() {
    super(prisma.session);
  }

  async findById(id: string) {
    return prisma.session.findUnique({ where: { id }, include: relations });
  }

  async findByParticipant(userId: string) {
    return prisma.session.findMany({
      where: {
        OR: [
          { request: { requesterId: userId } },
          { request: { providerId: userId } },
        ],
      },
      include: relations,
    });
  }
}
