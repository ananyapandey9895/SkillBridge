import type { Session } from '@prisma/client';
import { SessionStatus } from '@prisma/client';

export { SessionStatus } from '@prisma/client';
export type { Session } from '@prisma/client';

// Domain class — encapsulates session lifecycle rules
export class SessionDomain {
  constructor(private readonly data: Session) {}

  get id(): string { return this.data.id; }
  get status(): SessionStatus { return this.data.status; }
  get requestId(): string { return this.data.requestId; }

  startSession(): SessionStatus {
    if (this.data.status !== SessionStatus.scheduled) {
      throw new Error('Only scheduled sessions can be started');
    }
    return SessionStatus.active;
  }

  completeSession(): SessionStatus {
    if (this.data.status !== SessionStatus.active) {
      throw new Error('Only active sessions can be completed');
    }
    return SessionStatus.completed;
  }
}
