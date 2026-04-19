import type { User } from '@prisma/client';

export type Admin = User & { role: 'admin' };
