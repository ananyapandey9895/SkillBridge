import type { User } from '@prisma/client';
import { prisma } from '../config/prisma';
import { BaseRepository } from './BaseRepository';

export class UserRepository extends BaseRepository<User> {
  constructor() {
    super(prisma.user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async findByRole(role: string): Promise<User[]> {
    return prisma.user.findMany({ where: { role: role as never } });
  }

  async blockUser(id: string): Promise<User | null> {
    return this.update(id, { isBlocked: true });
  }

  async unblockUser(id: string): Promise<User | null> {
    return this.update(id, { isBlocked: false });
  }
}
