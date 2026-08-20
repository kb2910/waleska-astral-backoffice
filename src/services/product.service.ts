import api from './api';

export interface Product {
  id: number;
  name: string;
  description: string;
  language: string;
  type: string;
  price: number;
  currency?: string;
  imageUrl?: string;
  galleryImages?: string[];
  features?: string[];
  externalUrl?: string;
  isActive: boolean;
  sortOrder: number;
  stock: number;
  meta?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

class ProductService {
  async getAll(params?: { page?: number; limit?: number; lang?: string; type?: string }) {
    const { data } = await api.get('/products', { params: { limit: 500, ...params } });
    return data;
  }

  async getById(id: number) {
    const { data } = await api.get(`/products/${id}`);
    return data as Product;
  }

  async create(payload: Partial<Product>) {
    const { data } = await api.post('/products', payload);
    return data as Product;
  }

  async update(id: number, payload: Partial<Product>) {
    const { data } = await api.patch(`/products/${id}`, payload);
    return data as Product;
  }

  async remove(id: number) {
    await api.delete(`/products/${id}`);
  }
}

export default new ProductService();
