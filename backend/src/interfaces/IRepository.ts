export interface IRepository<T> {
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  save(entity: T): Promise<T>;
  update(id: string, partial: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}
