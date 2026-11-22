import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import testimonialService, { type Testimonial } from '../services/testimonial.service';
import { getRouteMessage } from '../hooks/useEntityForm';
import './CrudPages.css';

export default function Testimonials() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const message = getRouteMessage(location);

  const load = async () => {
    setLoading(true);
    try {
      const res = await testimonialService.getAll();
      setItems(Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : []);
    } catch { setItems([]); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const remove = async (id: number) => {
    if (!confirm(t('Backoffice.ConfirmDelete'))) return;
    await testimonialService.remove(id);
    load();
  };

  return (
    <div>
      <div className="page-header">
        <h4>{t('Backoffice.Testimonials')}</h4>
        <button className="btn btn-primary" onClick={() => navigate('/testimonials/new')}>
          <i className="fas fa-plus" /> {t('Backoffice.CreateNewTestimonial')}
        </button>
      </div>

      {message && <div className={`alert ${message.startsWith(t('Backoffice.Error')) ? 'alert-danger' : 'alert-success'}`}>{message}</div>}

      {loading ? (
        <div className="text-center py-4"><i className="fas fa-spinner fa-spin fa-2x" style={{ color: '#7122d0' }} /></div>
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('Backoffice.ID')}</th>
                <th>{t('Backoffice.Client')}</th>
                <th>{t('Backoffice.Content')}</th>
                <th>{t('Backoffice.Rating')}</th>
                <th>{t('Backoffice.Language')}</th>
                <th>{t('Backoffice.Active')}</th>
                <th>{t('Backoffice.Actions')}</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.clientName}</td>
                  <td className="content-preview">{item.content?.substring(0, 80)}{item.content && item.content.length > 80 ? '...' : ''}</td>
                  <td>
                    {Array.from({ length: 5 }, (_, i) => (
                      <i key={i} className="fas fa-star" style={{ color: i < (item.rating || 0) ? '#ffc107' : '#333', fontSize: '11px' }} />
                    ))}
                  </td>
                  <td>{item.language?.toUpperCase()}</td>
                  <td><span className={`badge ${item.isActive ? 'badge-active' : 'badge-inactive'}`}>{item.isActive ? t('Backoffice.Active') : t('Backoffice.Inactive')}</span></td>
                  <td className="actions-cell">
                    <button className="btn btn-sm btn-outline-primary" title={t('Backoffice.Edit')} onClick={() => navigate(`/testimonials/${item.id}/edit`)}><i className="fas fa-edit" /></button>
                    <button className="btn btn-sm btn-outline-danger" title={t('Backoffice.Delete')} onClick={() => remove(item.id!)}><i className="fas fa-trash" /></button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && <tr><td colSpan={7} className="text-center text-muted">{t('Backoffice.NoTestimonials')}</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
