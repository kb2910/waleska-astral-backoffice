import api from './api';

export interface ChatConfig {
  id: number;
  language: string;
  systemPrompt: string;
  maxQuestions: number;
  welcomeMessage?: string;
  limitReachedMessage?: string;
  model: string;
  keywords?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

class ChatConfigService {
  async getAll(params?: { page?: number; limit?: number }) {
    const { data } = await api.get('/chat-config', { params: { limit: 500, ...params } });
    return data;
  }

  async getById(id: number) {
    const { data } = await api.get(`/chat-config/${id}`);
    return data as ChatConfig;
  }

  async create(payload: Partial<ChatConfig>) {
    const { data } = await api.post('/chat-config', payload);
    return data as ChatConfig;
  }

  async update(id: number, payload: Partial<ChatConfig>) {
    const { data } = await api.patch(`/chat-config/${id}`, payload);
    return data as ChatConfig;
  }

  async remove(id: number) {
    await api.delete(`/chat-config/${id}`);
  }
}

export default new ChatConfigService();
