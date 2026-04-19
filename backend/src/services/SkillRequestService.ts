import { RequestStatus, SessionStatus } from '@prisma/client';
import { SkillRequestDomain } from '../entities/SkillRequest';
import { SkillRequestRepository } from '../repositories/SkillRequestRepository';
import { SkillRepository } from '../repositories/SkillRepository';
import { SessionRepository } from '../repositories/SessionRepository';
import { NotificationEvents, NotificationService } from './NotificationService';

interface CreateRequestDTO {
  skillId: string;
  requesterId: string;
}

export class SkillRequestService {
  private requestRepo: SkillRequestRepository;
  private skillRepo: SkillRepository;
  private sessionRepo: SessionRepository;
  private notifications: NotificationService;

  constructor() {
    this.requestRepo = new SkillRequestRepository();
    this.skillRepo = new SkillRepository();
    this.sessionRepo = new SessionRepository();
    this.notifications = NotificationService.getInstance();
  }

  async createRequest(dto: CreateRequestDTO) {
    const skill = await this.skillRepo.findById(dto.skillId);
    if (!skill) throw new Error('Skill not found');
    if (!skill.isActive) throw new Error('Skill is not available');
    if (skill.userId === dto.requesterId) throw new Error('Cannot request your own skill');

    const request = await this.requestRepo.save({
      skillId: dto.skillId,
      requesterId: dto.requesterId,
      providerId: skill.userId,
      status: RequestStatus.pending,
    } as never);

    await this.notifications.sendNotification(
      `New skill request for "${skill.skillName}"`,
      skill.userId
    );
    return request;
  }

  async acceptRequest(requestId: string, providerId: string) {
    const raw = await this.requestRepo.findById(requestId);
    if (!raw) throw new Error('Request not found');
    if (raw.providerId !== providerId) throw new Error('Forbidden');

    const domain = new SkillRequestDomain(raw);
    const newStatus = domain.accept(); // validates + returns new status

    await this.requestRepo.update(requestId, { status: newStatus });

    const session = await this.sessionRepo.save({
      requestId,
      scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
      status: SessionStatus.scheduled,
    } as never);

    await this.notifications.notify(NotificationEvents.REQUEST_ACCEPTED, {
      requestId,
      sessionId: session.id,
    });
    await this.notifications.sendNotification(
      'Your skill request was accepted! A session has been scheduled.',
      raw.requesterId
    );
    return session;
  }

  async rejectRequest(requestId: string, providerId: string) {
    const raw = await this.requestRepo.findById(requestId);
    if (!raw) throw new Error('Request not found');
    if (raw.providerId !== providerId) throw new Error('Forbidden');

    const domain = new SkillRequestDomain(raw);
    const newStatus = domain.reject();

    const updated = await this.requestRepo.update(requestId, { status: newStatus });
    await this.notifications.sendNotification('Your skill request was rejected.', raw.requesterId);
    return updated;
  }

  async getSentRequests(requesterId: string) {
    return this.requestRepo.findByRequesterId(requesterId);
  }

  async getReceivedRequests(providerId: string) {
    return this.requestRepo.findByProviderId(providerId);
  }

  async getPendingRequests(providerId: string) {
    return this.requestRepo.findPendingByProviderId(providerId);
  }
}
