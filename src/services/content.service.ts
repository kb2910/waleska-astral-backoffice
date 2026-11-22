import api from './api';

export interface ContentSection {
  id: number;
  sectionKey: string;
  language: string;
  title: string;
  subtitle?: string;
  description?: string;
  paragraphs?: string[];
  imageUrl?: string;
  videoUrl?: string;
  buttons?: { text: string; url: string; variant: string; target?: string }[];
  socialLinks?: { platform: string; url: string; icon?: string; label?: string }[];
  navItems?: { label: string; sectionId: string; isDropdown?: boolean; children?: { label: string; sectionId: string }[] }[];
  legalLinks?: { label: string; url: string }[];
  footerNavLinks?: { label: string; sectionId: string }[];
  slogan?: string;
  copyrightText?: string;
  navigationTitle?: string;
  contactTitle?: string;
  contactEmail?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

class ContentService {
  async getAll(params?: { page?: number; limit?: number; lang?: string; sectionKey?: string }) {
    const { data } = await api.get('/content', { params: { limit: 500, ...params } });
    return data;
  }

  async getById(id: number) {
    const { data } = await api.get(`/content/${id}`);
    return data as ContentSection;
  }

  async create(payload: Partial<ContentSection>) {
    const { data } = await api.post('/content', payload);
    return data as ContentSection;
  }

  async update(id: number, payload: Partial<ContentSection>) {
    const { data } = await api.patch(`/content/${id}`, payload);
    return data as ContentSection;
  }

  async remove(id: number) {
    await api.delete(`/content/${id}`);
  }
}

export default new ContentService();
