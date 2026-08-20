import api from './api';

export interface MediaAsset {
  id: number;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  alt?: string;
  folder?: string;
  uploadedBy?: string;
  createdAt: string;
}

class MediaService {
  async getAll(params?: { page?: number; limit?: number; folder?: string }) {
    const { data } = await api.get('/uploads', { params: { limit: 500, ...params } });
    return data;
  }

  async upload(file: File, folder?: string, alt?: string) {
    const formData = new FormData();
    formData.append('file', file);
    const params: Record<string, string> = {};
    if (folder) params.folder = folder;
    if (alt) params.alt = alt;
    const { data } = await api.post('/uploads', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      params,
    });
    return data as MediaAsset;
  }

  async remove(id: number) {
    await api.delete(`/uploads/${id}`);
  }
}

export default new MediaService();
