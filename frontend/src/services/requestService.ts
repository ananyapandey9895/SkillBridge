import { Session, SkillRequest } from '../types';
import api from './api';

export const requestService = {
  async create(skillId: string): Promise<SkillRequest> {
    const { data } = await api.post<{ request: SkillRequest }>('/requests', { skillId });
    return data.request;
  },

  async getSent(): Promise<SkillRequest[]> {
    const { data } = await api.get<{ requests: SkillRequest[] }>('/requests/sent');
    return data.requests;
  },

  async getReceived(): Promise<SkillRequest[]> {
    const { data } = await api.get<{ requests: SkillRequest[] }>('/requests/received');
    return data.requests;
  },

  async getPending(): Promise<SkillRequest[]> {
    const { data } = await api.get<{ requests: SkillRequest[] }>('/requests/pending');
    return data.requests;
  },

  async accept(id: string): Promise<Session> {
    const { data } = await api.patch<{ session: Session }>(`/requests/${id}/accept`);
    return data.session;
  },

  async reject(id: string): Promise<SkillRequest> {
    const { data } = await api.patch<{ request: SkillRequest }>(`/requests/${id}/reject`);
    return data.request;
  },
};
