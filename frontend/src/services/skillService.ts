import { Skill, SkillLevel } from '../types';
import api from './api';

export const skillService = {
  async getAll(): Promise<Skill[]> {
    const { data } = await api.get<{ skills: Skill[] }>('/skills');
    return data.skills;
  },

  async getMySkills(): Promise<Skill[]> {
    const { data } = await api.get<{ skills: Skill[] }>('/skills/my/skills');
    return data.skills;
  },

  async create(skillName: string, description: string, level: SkillLevel): Promise<Skill> {
    const { data } = await api.post<{ skill: Skill }>('/skills', { skillName, description, level });
    return data.skill;
  },

  async update(id: string, partial: Partial<Pick<Skill, 'skillName' | 'description' | 'level'>>): Promise<Skill> {
    const { data } = await api.put<{ skill: Skill }>(`/skills/${id}`, partial);
    return data.skill;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/skills/${id}`);
  },
};
