import { IRepository } from '../interfaces/IRepository';

// BaseRepository — delegates to the Prisma model delegate passed by concrete repos
export abstract class BaseRepository<T extends { id: string }> implements IRepository<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(protected delegate: any) {}

  async findById(id: string): Promise<T | null> {
    return (this.delegate.findUnique({ where: { id } })) as Promise<T | null>;
  }

  async findAll(): Promise<T[]> {
    return (this.delegate.findMany()) as Promise<T[]>;
  }

  async save(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    return (this.delegate.create({ data })) as Promise<T>;
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    try {
      return (await this.delegate.update({ where: { id }, data })) as T;
    } catch {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.delegate.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}
