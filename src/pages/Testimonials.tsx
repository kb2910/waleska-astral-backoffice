import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import testimonialService, { type Testimonial } from '../services/testimonial.service';
import './CrudPages.css';

export default function Testimonials() {
  const { t } = useTranslation();
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Testimonial> | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await testimonialService.getAll();
      setItems(Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : []);
    } catch { setItems([]); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const add = () => setEditing({ clientName: '', language: 'es', rating: 5, content: '', clientAvatar: '', isActive: true, sortOrder: 0 });
  const edit = (item: Testimonial) => setEditing({ ...item });
  const cancel = () => { setEditing(null); setMessage(''); };

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      if (editing.id) {
        await testimonialService.update(editing.id, editing);
        setMessage(t('Backoffice.Updated'));
      } else {
        await testimonialService.create(editing);
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
    await testimonialService.remove(id);
    load();
  };

  const updateField = (key: string, value: any) => {
    if (!editing) return;
    setEditing({ ...editing, [key]: value });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <i
        key={i}
        className={`fas fa-star`}
        style={{ color: i < rating ? '#ffc107' : '#333', fontSize: '12px', cursor: 'pointer' }}
        onClick={() => editing && updateField('rating', i + 1)}
      />
    ));
  };

  return (
    <div>
      <div className="page-header">
        <h4>{t('Backoffice.Testimonials')}</h4>
        <button className="btn btn-primary" onClick={add}><i className="fas fa-plus" /> {t('Backoffice.CreateNewTestimonial')}</button>
      </div>

      {message && <div className={`alert ${message.startsWith(t('Backoffice.Error')) ? 'alert-danger' : 'alert-success'}`}>{message}</div>}

      {editing && (
        <div className="edit-card">
          <div className="card-header-custom">
            {editing.id ? t('Backoffice.Edit') : t('Backoffice.New')} {t('Backoffice.Testimonial')}
          </div>
          <div className="card-body-custom">
            <div className="form-row">
              <div className="form-group flex-1">
                <label>{t('Backoffice.ClientName')}</label>
                <input className="form-control" value={editing.clientName || ''} onChange={e => updateField('clientName', e.target.value)} />
              </div>
              <div className="form-group flex-1">
                <label>{t('Backoffice.Language')}</label>
                <select className="form-control" value={editing.language || 'es'} onChange={e => updateField('language', e.target.value)}>
                  <option value="es">Español</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group flex-1">
                <label>{t('Backoffice.Rating')}</label>
                <div style={{ display: 'flex', gap: '4px', paddingTop: '6px' }}>
                  {renderStars(editing.rating || 5)}
                </div>
              </div>
              <div className="form-group flex-1">
                <label>{t('Backoffice.SortOrder')}</label>
                <input type="number" className="form-control" value={editing.sortOrder || 0} onChange={e => updateField('sortOrder', parseInt(e.target.value) || 0)} />
              </div>
            </div>
            <div className="form-group">
              <label>{t('Backoffice.Content')}</label>
              <textarea className="form-control" rows={4} value={editing.content || ''} onChange={e => updateField('content', e.target.value)} />
            </div>
            <div className="form-group">
              <label>{t('Backoffice.AvatarURL')}</label>
              <input className="form-control" value={editing.clientAvatar || ''} onChange={e => updateField('clientAvatar', e.target.value)} placeholder="https://..." />
            </div>
            <div className="form-group">
              <label><input type="checkbox" checked={editing.isActive ?? true} onChange={e => updateField('isActive', e.target.checked)} /> {t('Backoffice.Active')}</label>
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
                <td>
                  <button className="btn btn-sm btn-outline-primary" onClick={() => edit(item)}><i className="fas fa-edit" /></button>
                  {' '}
                  <button className="btn btn-sm btn-outline-danger" onClick={() => remove(item.id!)}><i className="fas fa-trash" /></button>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={7} className="text-center text-muted">{t('Backoffice.NoTestimonials')}</td></tr>}
          </tbody>
        </table>
      )}
    </div>
  );
}
