import api from './api';

export interface Promotion {
  id: number;
  code: string;
  title: string;
  description?: string;
  language: string;
  discountType: string;
  discountValue: number;
  minPurchase?: number;
  maxUses?: number;
  currentUses: number;
  startDate: string;
  endDate: string;
  bannerImageUrl?: string;
  isActive: boolean;
  applicableProductIds?: number[];
  createdAt: string;
  updatedAt: string;
}

class PromotionService {
  async getAll(params?: { page?: number; limit?: number }) {
    const { data } = await api.get('/promotions', { params: { limit: 500, ...params } });
    return data;
  }

  async getById(id: number) {
    const { data } = await api.get(`/promotions/${id}`);
    return data as Promotion;
  }

  async create(payload: Partial<Promotion>) {
    const { data } = await api.post('/promotions', payload);
    return data as Promotion;
  }

  async update(id: number, payload: Partial<Promotion>) {
    const { data } = await api.patch(`/promotions/${id}`, payload);
    return data as Promotion;
  }

  async remove(id: number) {
    await api.delete(`/promotions/${id}`);
  }
}

export default new PromotionService();
