import api from './api';

export interface Testimonial {
  id: number;
  clientName: string;
  clientAvatar?: string;
  content: string;
  rating?: number;
  language: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

class TestimonialService {
  async getAll(params?: { page?: number; limit?: number; lang?: string }) {
    const { data } = await api.get('/testimonials', { params: { limit: 500, ...params } });
    return data;
  }

  async getById(id: number) {
    const { data } = await api.get(`/testimonials/${id}`);
    return data as Testimonial;
  }

  async create(payload: Partial<Testimonial>) {
    const { data } = await api.post('/testimonials', payload);
    return data as Testimonial;
  }

  async update(id: number, payload: Partial<Testimonial>) {
    const { data } = await api.patch(`/testimonials/${id}`, payload);
    return data as Testimonial;
  }

  async remove(id: number) {
    await api.delete(`/testimonials/${id}`);
  }
}

export default new TestimonialService();
