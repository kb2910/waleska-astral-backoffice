import api from './api';

export type UserRole = 'admin' | 'user';

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  /** Solo se usa en el formulario; la API nunca lo devuelve. */
  hash?: string;
  role: UserRole;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PaginatedUsers {
  data: AdminUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

class UserService {
  async getAll(params?: { page?: number; limit?: number }) {
    const { data } = await api.get<PaginatedUsers>('/user', {
      params: { page: 1, limit: 500, ...params },
    });
    return data;
  }

  async getById(id: number) {
    const { data } = await api.get<AdminUser>(`/user/${id}`);
    return data;
  }

  async create(payload: Partial<AdminUser>) {
    const { data } = await api.post<AdminUser>('/user', payload);
    return data;
  }

  async update(id: number, payload: Partial<AdminUser>) {
    const { data } = await api.patch<AdminUser>(`/user/${id}`, payload);
    return data;
  }

  async remove(id: number) {
    await api.delete(`/user/${id}`);
  }
}

export default new UserService();
