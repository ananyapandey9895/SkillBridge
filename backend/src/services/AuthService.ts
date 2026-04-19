import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';
import { IAuthenticatable } from '../interfaces/IAuthenticatable';
import { UserFactory } from '../factories/UserFactory';
import { UserRepository } from '../repositories/UserRepository';

interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  role: Role;
  learningGoals?: string;
}

export interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

export class AuthService implements IAuthenticatable {
  private userRepo: UserRepository;
  private readonly jwtSecret: string;

  constructor() {
    this.userRepo = new UserRepository();
    this.jwtSecret = process.env.JWT_SECRET ?? 'change_me';
  }

  async register(dto: RegisterDTO) {
    const existing = await this.userRepo.findByEmail(dto.email);
    if (existing) throw new Error('Email already in use');

    const defaults = UserFactory.create(dto.role);

    const user = await this.userRepo.save({
      ...defaults,
      name: dto.name,
      email: dto.email,
      password: await bcrypt.hash(dto.password, 10),
      isBlocked: false,
      learningGoals: dto.role === Role.learner ? (dto.learningGoals ?? null) : null,
    } as never);

    const { password: _pw, ...safe } = user;
    return safe;
  }

  async login(email: string, password: string): Promise<string> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new Error('Invalid credentials');
    if (user.isBlocked) throw new Error('Account is blocked');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error('Invalid credentials');

    return jwt.sign({ id: user.id, email: user.email, role: user.role }, this.jwtSecret, {
      expiresIn: '24h',
    });
  }

  logout(): void {}

  verifyToken(token: string): TokenPayload {
    return jwt.verify(token, this.jwtSecret) as TokenPayload;
  }
}
