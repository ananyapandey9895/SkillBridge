import { Role } from '@prisma/client';

interface UserDefaults {
  role: Role;
  rating?: number;
  learningGoals?: string;
}

// Factory Pattern — supplies role-specific default fields for user creation
export class UserFactory {
  static create(role: Role): UserDefaults {
    switch (role) {
      case Role.mentor:
        return { role: Role.mentor, rating: 0 };
      case Role.learner:
        return { role: Role.learner };
      case Role.admin:
        return { role: Role.admin };
      default:
        throw new Error(`Unknown role: ${role as string}`);
    }
  }
}
