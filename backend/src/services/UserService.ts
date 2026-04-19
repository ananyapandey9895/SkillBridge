import type { User } from '@prisma/client';
import { UserRepository } from '../repositories/UserRepository';

type SafeUser = Omit<User, 'password'>;

const strip = ({ password: _pw, ...safe }: User): SafeUser => safe;

export class UserService {
  private userRepo: UserRepository;

  constructor() {
    this.userRepo = new UserRepository();
  }

  async getUserById(id: string): Promise<SafeUser> {
    const user = await this.userRepo.findById(id);
    if (!user) throw new Error('User not found');
    return strip(user);
  }

  async getAllUsers(): Promise<SafeUser[]> {
    return (await this.userRepo.findAll()).map(strip);
  }

  async getMentors(): Promise<SafeUser[]> {
    return (await this.userRepo.findByRole('mentor')).map(strip);
  }

  async blockUser(id: string): Promise<SafeUser | null> {
    const user = await this.userRepo.blockUser(id);
    return user ? strip(user) : null;
  }

  async unblockUser(id: string): Promise<SafeUser | null> {
    const user = await this.userRepo.unblockUser(id);
    return user ? strip(user) : null;
  }

  async updateProfile(id: string, data: { name?: string; learningGoals?: string }): Promise<SafeUser> {
    const updated = await this.userRepo.update(id, data);
    if (!updated) throw new Error('User not found');
    return strip(updated);
  }
}
