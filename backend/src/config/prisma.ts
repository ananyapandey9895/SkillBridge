import { PrismaClient } from '@prisma/client';

// Singleton pattern — one PrismaClient shared across the app
export class PrismaConnection {
  private static instance: PrismaClient;

  private constructor() {}

  static getInstance(): PrismaClient {
    if (!PrismaConnection.instance) {
      PrismaConnection.instance = new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
      });
    }
    return PrismaConnection.instance;
  }

  static async connect(): Promise<PrismaClient> {
    const client = PrismaConnection.getInstance();
    await client.$connect();
    return client;
  }

  static async disconnect(): Promise<void> {
    await PrismaConnection.getInstance().$disconnect();
  }
}

export const prisma = PrismaConnection.getInstance();
