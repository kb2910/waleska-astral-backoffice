import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import bookingService, { type Booking } from '../services/booking.service';
import { getRouteMessage } from '../hooks/useEntityForm';
import './CrudPages.css';

type StatusFilter = 'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled';

export default function Bookings() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [items, setItems] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [message, setMessage] = useState(getRouteMessage(location));

  const load = async () => {
    setLoading(true);
    try {
      const res = await bookingService.getAll();
      setItems(Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : []);
    } catch { setItems([]); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = filter === 'all' ? items : items.filter(i => i.status === filter);

  const updateStatus = async (id: number, status: string) => {
    try {
      await bookingService.update(id, { status });
      setMessage(t('Backoffice.Updated'));
      load();
    } catch (e: any) {
      setMessage(t('Backoffice.Error') + ': ' + (e.response?.data?.message || e.message));
    }
  };

  const remove = async (id: number) => {
    if (!confirm(t('Backoffice.ConfirmDelete'))) return;
    await bookingService.remove(id);
    load();
  };

  const statusFilters: { key: StatusFilter; label: string }[] = [
    { key: 'all', label: t('Backoffice.All') },
    { key: 'pending', label: t('Backoffice.Pending') },
    { key: 'confirmed', label: t('Backoffice.Confirmed') },
    { key: 'completed', label: t('Backoffice.Completed') },
    { key: 'cancelled', label: t('Backoffice.Cancelled') },
  ];

  const getBadgeClass = (status: string) => {
    switch (status) {
      case 'pending': return 'badge-pending';
      case 'confirmed': return 'badge-confirmed';
      case 'completed': return 'badge-completed';
      case 'cancelled': return 'badge-cancelled';
      default: return 'badge-inactive';
    }
  };

  return (
    <div>
      <div className="page-header">
        <h4>{t('Backoffice.Bookings')}</h4>
      </div>

      {message && <div className={`alert ${message.startsWith(t('Backoffice.Error')) ? 'alert-danger' : 'alert-success'}`}>{message}</div>}

      <div className="filter-bar">
        {statusFilters.map(f => (
          <button
            key={f.key}
            className={`filter-btn ${filter === f.key ? 'active' : ''}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
            {f.key !== 'all' && (
              <span className="filter-count">
                {items.filter(i => i.status === f.key).length}
              </span>
            )}
            {f.key === 'all' && (
              <span className="filter-count">{items.length}</span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-4"><i className="fas fa-spinner fa-spin fa-2x" style={{ color: '#7122d0' }} /></div>
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('Backoffice.ID')}</th>
                <th>{t('Backoffice.Client')}</th>
                <th>{t('Backoffice.Email')}</th>
                <th>{t('Backoffice.Service')}</th>
                <th>{t('Backoffice.Date')}</th>
                <th>{t('Backoffice.Time')}</th>
                <th>{t('Backoffice.Status')}</th>
                <th>{t('Backoffice.Actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.clientName}</td>
                <td>{item.clientEmail}</td>
                <td>{item.serviceTitle}</td>
                <td>{item.appointmentDate}</td>
                <td>{item.appointmentTime || '-'}</td>
                <td>
                  <span className={`badge ${getBadgeClass(item.status)}`}>
                    {t(`Backoffice.${item.status.charAt(0).toUpperCase() + item.status.slice(1)}`)}
                  </span>
                </td>
                <td className="actions-cell">
                  <button className="btn btn-sm btn-outline-primary" title={t('Backoffice.Edit')} onClick={() => navigate(`/bookings/${item.id}/edit`)}>
                    <i className="fas fa-edit" />
                  </button>
                  {item.status === 'pending' && (
                    <button className="btn btn-sm btn-outline-success" onClick={() => updateStatus(item.id, 'confirmed')}>
                      <i className="fas fa-check" /> {t('Backoffice.Confirm')}
                    </button>
                  )}
                  {item.status === 'confirmed' && (
                    <button className="btn btn-sm btn-outline-success" onClick={() => updateStatus(item.id, 'completed')}>
                      <i className="fas fa-check-double" /> {t('Backoffice.Complete')}
                    </button>
                  )}
                  {(item.status === 'pending' || item.status === 'confirmed') && (
                    <button className="btn btn-sm btn-outline-danger" onClick={() => updateStatus(item.id, 'cancelled')}>
                      <i className="fas fa-times" /> {t('Backoffice.Cancel')}
                    </button>
                  )}
                  <button className="btn btn-sm btn-outline-danger" onClick={() => remove(item.id!)} title={t('Backoffice.Delete')}>
                    <i className="fas fa-trash" />
                  </button>
                </td>
              </tr>
            ))}
              {filtered.length === 0 && <tr><td colSpan={8} className="text-center text-muted">{t('Backoffice.NoBookings')}</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
