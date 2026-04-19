export interface INotificationStrategy {
  send(userId: string, message: string): Promise<void>;
}
