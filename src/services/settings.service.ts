import api from './api';

export interface SiteSetting {
  id: number;
  key: string;
  value: string;
  type: string;
  description?: string;
  group?: string;
  createdAt: string;
  updatedAt: string;
}

class SettingsService {
  async getAll(group?: string) {
    const params = group ? { group } : {};
    const { data } = await api.get('/settings', { params });
    return data as SiteSetting[];
  }

  async getByKey(key: string) {
    const { data } = await api.get(`/settings/${key}`);
    return data as SiteSetting;
  }

  async update(key: string, payload: { value: string; type?: string; description?: string; group?: string }) {
    const { data } = await api.patch(`/settings/${key}`, payload);
    return data as SiteSetting;
  }

  async bulkUpdate(settings: { key: string; value: string }[]) {
    const { data } = await api.post('/settings/bulk', { settings });
    return data as SiteSetting[];
  }

  async remove(key: string) {
    await api.delete(`/settings/${key}`);
  }
}

export default new SettingsService();
