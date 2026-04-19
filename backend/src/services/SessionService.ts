import { Role } from '@prisma/client';
import { SessionDomain } from '../entities/Session';
import { FeedbackRepository } from '../repositories/FeedbackRepository';
import { ProgressRepository } from '../repositories/ProgressRepository';
import { SessionRepository } from '../repositories/SessionRepository';
import { UserRepository } from '../repositories/UserRepository';
import { NotificationEvents, NotificationService } from './NotificationService';

export class SessionService {
  private sessionRepo: SessionRepository;
  private progressRepo: ProgressRepository;
  private feedbackRepo: FeedbackRepository;
  private userRepo: UserRepository;
  private notifications: NotificationService;

  constructor() {
    this.sessionRepo = new SessionRepository();
    this.progressRepo = new ProgressRepository();
    this.feedbackRepo = new FeedbackRepository();
    this.userRepo = new UserRepository();
    this.notifications = NotificationService.getInstance();
  }

  async getSession(id: string) {
    const session = await this.sessionRepo.findById(id);
    if (!session) throw new Error('Session not found');
    return session;
  }

  async getUserSessions(userId: string) {
    return this.sessionRepo.findByParticipant(userId);
  }

  async startSession(id: string, userId: string) {
    const raw = await this.sessionRepo.findById(id);
    if (!raw) throw new Error('Session not found');

    const isParticipant =
      raw.request.requesterId === userId || raw.request.providerId === userId;
    if (!isParticipant) throw new Error('Forbidden');

    const domain = new SessionDomain(raw);
    const newStatus = domain.startSession();

    const updated = await this.sessionRepo.update(id, { status: newStatus });
    await this.notifications.notify(NotificationEvents.SESSION_STARTED, { sessionId: id });
    return updated;
  }

  async completeSession(id: string, userId: string) {
    const raw = await this.sessionRepo.findById(id);
    if (!raw) throw new Error('Session not found');

    const isParticipant =
      raw.request.requesterId === userId || raw.request.providerId === userId;
    if (!isParticipant) throw new Error('Forbidden');

    const domain = new SessionDomain(raw);
    const newStatus = domain.completeSession();

    const updated = await this.sessionRepo.update(id, { status: newStatus });
    await this.notifications.notify(NotificationEvents.SESSION_COMPLETED, { sessionId: id });
    return updated;
  }

  async addProgress(sessionId: string, userId: string, percentage: number, remarks?: string) {
    const session = await this.sessionRepo.findById(sessionId);
    if (!session) throw new Error('Session not found');
    if (session.request.requesterId !== userId) throw new Error('Only the learner can log progress');

    return this.progressRepo.save({
      sessionId,
      percentage: Math.min(100, Math.max(0, percentage)),
      remarks: remarks ?? '',
    } as never);
  }

  async addFeedback(sessionId: string, fromUserId: string, rating: number, comment?: string) {
    const session = await this.sessionRepo.findById(sessionId);
    if (!session) throw new Error('Session not found');

    const isParticipant =
      session.request.requesterId === fromUserId || session.request.providerId === fromUserId;
    if (!isParticipant) throw new Error('Forbidden');

    const feedback = await this.feedbackRepo.save({
      sessionId,
      fromUserId,
      rating: Math.min(5, Math.max(1, rating)),
      comment: comment ?? '',
    } as never);

    // Update mentor's rating when the learner submits feedback
    if (session.request.requesterId === fromUserId) {
      const mentor = await this.userRepo.findById(session.request.providerId);
      if (mentor?.role === Role.mentor) {
        const current = mentor.rating ?? 0;
        await this.userRepo.update(mentor.id, {
          rating: current === 0 ? rating : (current + rating) / 2,
        });
      }
    }

    return feedback;
  }
}
