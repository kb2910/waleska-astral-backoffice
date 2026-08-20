import api from './api';

export interface Booking {
  id: number;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  serviceTitle: string;
  appointmentDate: string;
  appointmentTime?: string;
  status: string;
  notes?: string;
  timezone?: string;
  calendlyEventId?: string;
  confirmationToken?: string;
  createdAt: string;
  updatedAt: string;
}

class BookingService {
  async getAll(params?: { page?: number; limit?: number; status?: string }) {
    const { data } = await api.get('/bookings', { params: { limit: 500, ...params } });
    return data;
  }

  async getById(id: number) {
    const { data } = await api.get(`/bookings/${id}`);
    return data as Booking;
  }

  async update(id: number, payload: Partial<Booking>) {
    const { data } = await api.patch(`/bookings/${id}`, payload);
    return data as Booking;
  }

  async remove(id: number) {
    await api.delete(`/bookings/${id}`);
  }
}

export default new BookingService();
