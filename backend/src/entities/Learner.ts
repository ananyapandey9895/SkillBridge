import type { User } from '@prisma/client';

export type Learner = User & { role: 'learner'; learningGoals: string | null };
