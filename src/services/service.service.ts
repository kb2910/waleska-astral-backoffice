import api from './api';

export interface ServiceEntity {
  id: number;
  title: string;
  tab: string;
  language: string;
  sortOrder: number;
  duration?: string;
  price?: string;
  shortDescription?: string;
  description?: string;
  imageUrl?: string;
  images?: string[];
  tags?: string[];
  isActive: boolean;
  isFeatured: boolean;
  showInHeader: boolean;
  categorySlug?: string;
  meta?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

class ServiceService {
  async getAll(params?: { page?: number; limit?: number; lang?: string; category?: string }) {
    const { data } = await api.get('/services', { params: { limit: 500, ...params } });
    return data;
  }

  async getById(id: number) {
    const { data } = await api.get(`/services/${id}`);
    return data as ServiceEntity;
  }

  async create(payload: Partial<ServiceEntity>) {
    const { data } = await api.post('/services', payload);
    return data as ServiceEntity;
  }

  async update(id: number, payload: Partial<ServiceEntity>) {
    const { data } = await api.patch(`/services/${id}`, payload);
    return data as ServiceEntity;
  }

  async remove(id: number) {
    await api.delete(`/services/${id}`);
  }
}

export default new ServiceService();
