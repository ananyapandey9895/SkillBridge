export enum UserRole {
  MENTOR = 'mentor',
  LEARNER = 'learner',
  ADMIN = 'admin',
}

export enum SkillLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

export enum RequestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

export enum SessionStatus {
  SCHEDULED = 'scheduled',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isBlocked: boolean;
  rating?: number;
  learningGoals?: string;
  createdAt: string;
}

export interface Skill {
  id: string;
  skillName: string;
  description: string;
  level: SkillLevel;
  isActive: boolean;
  userId: string;
  user?: User;
  createdAt: string;
}

export interface SkillRequest {
  id: string;
  status: RequestStatus;
  requesterId: string;
  providerId: string;
  skillId: string;
  requester?: User;
  provider?: User;
  skill?: Skill;
  session?: Session;
  createdAt: string;
}

export interface Session {
  id: string;
  scheduledTime: string;
  status: SessionStatus;
  requestId: string;
  request?: SkillRequest;
  progressRecords?: Progress[];
  feedbacks?: Feedback[];
  createdAt: string;
}

export interface Progress {
  id: string;
  percentage: number;
  remarks: string;
  sessionId: string;
  createdAt: string;
}

export interface Feedback {
  id: string;
  rating: number;
  comment: string;
  fromUserId: string;
  sessionId: string;
  createdAt: string;
}
