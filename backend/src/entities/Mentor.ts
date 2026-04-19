import type { User } from '@prisma/client';

export type Mentor = User & { role: 'mentor'; rating: number };
