import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import serviceService, { type ServiceEntity } from '../services/service.service';
import './CrudPages.css';

export default function Services() {
  const { t } = useTranslation();
  const [items, setItems] = useState<ServiceEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<ServiceEntity> | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await serviceService.getAll();
      setItems(Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : []);
    } catch { setItems([]); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const add = () => setEditing({ title: '', tab: '', language: 'es', duration: '', price: '0', categorySlug: '', shortDescription: '', description: '', isActive: true, isFeatured: false, sortOrder: 0 });
  const edit = (item: ServiceEntity) => setEditing({ ...item });
  const cancel = () => { setEditing(null); setMessage(''); };

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      if (editing.id) {
        await serviceService.update(editing.id, editing);
        setMessage(t('Backoffice.Updated'));
      } else {
        await serviceService.create(editing);
        setMessage(t('Backoffice.Created'));
      }
      setEditing(null);
      load();
    } catch (e: any) {
      setMessage(t('Backoffice.Error') + ': ' + (e.response?.data?.message || e.message));
    }
    setSaving(false);
  };

  const remove = async (id: number) => {
    if (!confirm(t('Backoffice.ConfirmDelete'))) return;
    await serviceService.remove(id);
    load();
  };

  const updateField = (key: string, value: any) => {
    if (!editing) return;
    setEditing({ ...editing, [key]: value });
  };

  return (
    <div>
      <div className="page-header">
        <h4>{t('Backoffice.Services')}</h4>
        <button className="btn btn-primary" onClick={add}><i className="fas fa-plus" /> {t('Backoffice.CreateNewService')}</button>
      </div>

      {message && <div className={`alert ${message.startsWith(t('Backoffice.Error')) ? 'alert-danger' : 'alert-success'}`}>{message}</div>}

      {editing && (
        <div className="edit-card">
          <div className="card-header-custom">
            {editing.id ? t('Backoffice.Edit') : t('Backoffice.New')} {t('Backoffice.Service')}
          </div>
          <div className="card-body-custom">
            <div className="form-row">
              <div className="form-group flex-1">
                <label>{t('Backoffice.Title')}</label>
                <input className="form-control" value={editing.title || ''} onChange={e => updateField('title', e.target.value)} />
              </div>
              <div className="form-group flex-1">
                <label>{t('Backoffice.Tab')}</label>
                <input className="form-control" value={editing.tab || ''} onChange={e => updateField('tab', e.target.value)} placeholder="e.g. tarot, consultas" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group flex-1">
                <label>{t('Backoffice.Language')}</label>
                <select className="form-control" value={editing.language || 'es'} onChange={e => updateField('language', e.target.value)}>
                  <option value="es">Español</option>
                  <option value="en">English</option>
                </select>
              </div>
              <div className="form-group flex-1">
                <label>{t('Backoffice.Duration')}</label>
                <input className="form-control" value={editing.duration || ''} onChange={e => updateField('duration', e.target.value)} placeholder="e.g. 60 min" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group flex-1">
                <label>{t('Backoffice.Price')}</label>
                <input type="number" className="form-control" value={editing.price || 0} onChange={e => updateField('price', parseFloat(e.target.value) || 0)} />
              </div>
              <div className="form-group flex-1">
                <label>{t('Backoffice.CategorySlug')}</label>
                <input className="form-control" value={editing.categorySlug || ''} onChange={e => updateField('categorySlug', e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label>{t('Backoffice.ShortDescription')}</label>
              <textarea className="form-control" rows={2} value={editing.shortDescription || ''} onChange={e => updateField('shortDescription', e.target.value)} />
            </div>
            <div className="form-group">
              <label>{t('Backoffice.Description')}</label>
              <textarea className="form-control" rows={4} value={editing.description || ''} onChange={e => updateField('description', e.target.value)} />
            </div>
            <div className="form-group">
              <label>{t('Backoffice.SortOrder')}</label>
              <input type="number" className="form-control" value={editing.sortOrder || 0} onChange={e => updateField('sortOrder', parseInt(e.target.value) || 0)} />
            </div>
            <div className="form-row">
              <div className="form-group flex-1">
                <label><input type="checkbox" checked={editing.isActive ?? true} onChange={e => updateField('isActive', e.target.checked)} /> {t('Backoffice.Active')}</label>
              </div>
              <div className="form-group flex-1">
                <label><input type="checkbox" checked={editing.isFeatured ?? false} onChange={e => updateField('isFeatured', e.target.checked)} /> {t('Backoffice.Featured')}</label>
              </div>
            </div>
            <div className="form-actions">
              <button className="btn btn-success" onClick={save} disabled={saving}><i className="fas fa-save" /> {saving ? t('Backoffice.Saving') : t('Backoffice.Save')}</button>
              <button className="btn btn-secondary" onClick={cancel}>{t('Backoffice.Cancel')}</button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-4"><i className="fas fa-spinner fa-spin fa-2x" style={{ color: '#7122d0' }} /></div>
      ) : (
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
                <td>
                  <button className="btn btn-sm btn-outline-primary" onClick={() => edit(item)}><i className="fas fa-edit" /></button>
                  {' '}
                  <button className="btn btn-sm btn-outline-danger" onClick={() => remove(item.id!)}><i className="fas fa-trash" /></button>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={8} className="text-center text-muted">{t('Backoffice.NoServices')}</td></tr>}
          </tbody>
        </table>
      )}
    </div>
  );
}
