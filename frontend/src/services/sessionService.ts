import { Feedback, Progress, Session } from '../types';
import api from './api';

export const sessionService = {
  async getMySessions(): Promise<Session[]> {
    const { data } = await api.get<{ sessions: Session[] }>('/sessions/my');
    return data.sessions;
  },

  async getById(id: string): Promise<Session> {
    const { data } = await api.get<{ session: Session }>(`/sessions/${id}`);
    return data.session;
  },

  async start(id: string): Promise<Session> {
    const { data } = await api.patch<{ session: Session }>(`/sessions/${id}/start`);
    return data.session;
  },

  async complete(id: string): Promise<Session> {
    const { data } = await api.patch<{ session: Session }>(`/sessions/${id}/complete`);
    return data.session;
  },

  async addProgress(id: string, percentage: number, remarks: string): Promise<Progress> {
    const { data } = await api.post<{ progress: Progress }>(`/sessions/${id}/progress`, { percentage, remarks });
    return data.progress;
  },

  async addFeedback(id: string, rating: number, comment: string): Promise<Feedback> {
    const { data } = await api.post<{ feedback: Feedback }>(`/sessions/${id}/feedback`, { rating, comment });
    return data.feedback;
  },
};
