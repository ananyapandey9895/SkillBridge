import type { SkillRequest } from '@prisma/client';
import { RequestStatus } from '@prisma/client';
import { prisma } from '../config/prisma';
import { BaseRepository } from './BaseRepository';

const relations = { skill: true, requester: true, provider: true, session: true };

export class SkillRequestRepository extends BaseRepository<SkillRequest> {
  constructor() {
    super(prisma.skillRequest);
  }

  async findById(id: string) {
    return prisma.skillRequest.findUnique({ where: { id }, include: relations });
  }

  async findByRequesterId(requesterId: string) {
    return prisma.skillRequest.findMany({ where: { requesterId }, include: relations });
  }

  async findByProviderId(providerId: string) {
    return prisma.skillRequest.findMany({ where: { providerId }, include: relations });
  }

  async findPendingByProviderId(providerId: string) {
    return prisma.skillRequest.findMany({
      where: { providerId, status: RequestStatus.pending },
      include: { skill: true, requester: true },
    });
  }
}
