import { INotifiable } from '../interfaces/INotifiable';
import { INotificationStrategy } from '../interfaces/INotificationStrategy';

// Strategy Pattern — swap delivery mechanism without changing callers
export class ConsoleNotificationStrategy implements INotificationStrategy {
  async send(userId: string, message: string): Promise<void> {
    console.log(`[Notification → ${userId}]: ${message}`);
  }
}

// Observer Pattern interfaces
export interface IObserver {
  update(event: string, data: Record<string, unknown>): Promise<void>;
}

export interface ISubject {
  subscribe(event: string, observer: IObserver): void;
  unsubscribe(event: string, observer: IObserver): void;
  notify(event: string, data: Record<string, unknown>): Promise<void>;
}

export const NotificationEvents = {
  REQUEST_ACCEPTED: 'REQUEST_ACCEPTED',
  REQUEST_REJECTED: 'REQUEST_REJECTED',
  SESSION_CREATED: 'SESSION_CREATED',
  SESSION_STARTED: 'SESSION_STARTED',
  SESSION_COMPLETED: 'SESSION_COMPLETED',
} as const;

// Singleton + Observer + Strategy
export class NotificationService implements INotifiable, ISubject {
  private static instance: NotificationService;
  private strategy: INotificationStrategy;
  private observers: Map<string, IObserver[]> = new Map();

  private constructor(strategy: INotificationStrategy) {
    this.strategy = strategy;
  }

  static getInstance(strategy?: INotificationStrategy): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService(
        strategy ?? new ConsoleNotificationStrategy()
      );
    }
    return NotificationService.instance;
  }

  setStrategy(strategy: INotificationStrategy): void {
    this.strategy = strategy;
  }

  async sendNotification(message: string, userId: string): Promise<void> {
    await this.strategy.send(userId, message);
  }

  subscribe(event: string, observer: IObserver): void {
    this.observers.set(event, [...(this.observers.get(event) ?? []), observer]);
  }

  unsubscribe(event: string, observer: IObserver): void {
    this.observers.set(event, (this.observers.get(event) ?? []).filter((o) => o !== observer));
  }

  async notify(event: string, data: Record<string, unknown>): Promise<void> {
    await Promise.all((this.observers.get(event) ?? []).map((o) => o.update(event, data)));
  }
}
