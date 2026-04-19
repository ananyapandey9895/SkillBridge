import type { SkillRequest } from '@prisma/client';
import { RequestStatus } from '@prisma/client';

export { RequestStatus } from '@prisma/client';
export type { SkillRequest } from '@prisma/client';

// Domain class — wraps the Prisma record and encapsulates state-transition rules
export class SkillRequestDomain {
  constructor(private readonly data: SkillRequest) {}

  get id(): string { return this.data.id; }
  get status(): RequestStatus { return this.data.status; }
  get requesterId(): string { return this.data.requesterId; }
  get providerId(): string { return this.data.providerId; }

  accept(): RequestStatus {
    if (this.data.status !== RequestStatus.pending) {
      throw new Error('Only pending requests can be accepted');
    }
    return RequestStatus.accepted;
  }

  reject(): RequestStatus {
    if (this.data.status !== RequestStatus.pending) {
      throw new Error('Only pending requests can be rejected');
    }
    return RequestStatus.rejected;
  }
}
