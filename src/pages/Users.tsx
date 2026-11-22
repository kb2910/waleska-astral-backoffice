import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import userService, { type AdminUser } from '../services/user.service';
import { getRouteMessage } from '../hooks/useEntityForm';
import './CrudPages.css';

export default function Users() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [items, setItems] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const message = getRouteMessage(location);

  const load = async () => {
    setLoading(true);
    try {
      const res = await userService.getAll();
      setItems(Array.isArray(res?.data) ? res.data : []);
    } catch { setItems([]); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const remove = async (id: number) => {
    if (!confirm(t('Backoffice.ConfirmDelete'))) return;
    try {
      await userService.remove(id);
      load();
    } catch (e: any) {
      alert(`${t('Backoffice.Error')}: ${e?.response?.data?.message || e?.message || ''}`);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h4>{t('Backoffice.Users')}</h4>
        <button className="btn btn-primary" onClick={() => navigate('/users/new')}>
          <i className="fas fa-plus" /> {t('Backoffice.CreateNewUser')}
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
                <th>{t('Backoffice.Name')}</th>
                <th>{t('Backoffice.Email')}</th>
                <th>{t('Backoffice.Phone')}</th>
                <th>{t('Backoffice.Role')}</th>
                <th>{t('Backoffice.Active')}</th>
                <th>{t('Backoffice.Actions')}</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.phone || '-'}</td>
                  <td><span className="badge badge-secondary">{item.role === 'admin' ? t('Backoffice.RoleAdmin') : t('Backoffice.RoleUser')}</span></td>
                  <td><span className={`badge ${item.is_active ? 'badge-active' : 'badge-inactive'}`}>{item.is_active ? t('Backoffice.Active') : t('Backoffice.Inactive')}</span></td>
                  <td className="actions-cell">
                    <button className="btn btn-sm btn-outline-primary" title={t('Backoffice.Edit')} onClick={() => navigate(`/users/${item.id}/edit`)}><i className="fas fa-edit" /></button>
                    <button className="btn btn-sm btn-outline-danger" title={t('Backoffice.Delete')} onClick={() => remove(item.id)}><i className="fas fa-trash" /></button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && <tr><td colSpan={7} className="text-center text-muted">{t('Backoffice.NoUsers')}</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
