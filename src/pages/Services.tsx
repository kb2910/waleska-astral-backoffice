import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import serviceService, { type ServiceEntity } from '../services/service.service';
import { getRouteMessage } from '../hooks/useEntityForm';
import './CrudPages.css';

export default function Services() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [items, setItems] = useState<ServiceEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const message = getRouteMessage(location);

  const load = async () => {
    setLoading(true);
    try {
      const res = await serviceService.getAll();
      setItems(Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : []);
    } catch { setItems([]); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const remove = async (id: number) => {
    if (!confirm(t('Backoffice.ConfirmDelete'))) return;
    await serviceService.remove(id);
    load();
  };

  return (
    <div>
      <div className="page-header">
        <h4>{t('Backoffice.Services')}</h4>
        <button className="btn btn-primary" onClick={() => navigate('/services/new')}>
          <i className="fas fa-plus" /> {t('Backoffice.CreateNewService')}
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
                <th>{t('Backoffice.Title')}</th>
                <th>{t('Backoffice.Tab')}</th>
                <th>{t('Backoffice.Language')}</th>
                <th>{t('Backoffice.Price')}</th>
                <th>{t('Backoffice.Active')}</th>
                <th>{t('Backoffice.Featured')}</th>
                <th>{t('Backoffice.HeaderMenu')}</th>
                <th>{t('Backoffice.Actions')}</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.title}</td>
                  <td>{item.tab}</td>
                  <td>{item.language?.toUpperCase()}</td>
                  <td>${item.price}</td>
                  <td><span className={`badge ${item.isActive ? 'badge-active' : 'badge-inactive'}`}>{item.isActive ? t('Backoffice.Active') : t('Backoffice.Inactive')}</span></td>
                  <td>{item.isFeatured ? <i className="fas fa-star" style={{ color: '#ffc107' }} /> : <i className="fas fa-star" style={{ color: '#333' }} />}</td>
                  <td><span className={`badge ${item.showInHeader ? 'badge-active' : 'badge-inactive'}`}>{item.showInHeader ? t('Backoffice.Active') : t('Backoffice.Inactive')}</span></td>
                  <td className="actions-cell">
                    <button className="btn btn-sm btn-outline-primary" title={t('Backoffice.Edit')} onClick={() => navigate(`/services/${item.id}/edit`)}><i className="fas fa-edit" /></button>
                    <button className="btn btn-sm btn-outline-danger" title={t('Backoffice.Delete')} onClick={() => remove(item.id!)}><i className="fas fa-trash" /></button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && <tr><td colSpan={9} className="text-center text-muted">{t('Backoffice.NoServices')}</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
