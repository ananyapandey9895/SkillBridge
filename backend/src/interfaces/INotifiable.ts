export interface INotifiable {
  sendNotification(message: string, userId: string): Promise<void>;
}
