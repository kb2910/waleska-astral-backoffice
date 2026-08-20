import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import promotionService, { type Promotion } from '../services/promotion.service';
import './CrudPages.css';

export default function Promotions() {
  const { t } = useTranslation();
  const [items, setItems] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Promotion> | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await promotionService.getAll();
      setItems(Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : []);
    } catch { setItems([]); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const add = () => setEditing({ code: '', title: '', language: 'es', discountType: 'percentage', discountValue: 0, minPurchase: 0, maxUses: 0, startDate: '', endDate: '', bannerImageUrl: '', isActive: true });
  const edit = (item: Promotion) => setEditing({ ...item });
  const cancel = () => { setEditing(null); setMessage(''); };

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      if (editing.id) {
        await promotionService.update(editing.id, editing);
        setMessage(t('Backoffice.Updated'));
      } else {
        await promotionService.create(editing);
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
    await promotionService.remove(id);
    load();
  };

  const updateField = (key: string, value: any) => {
    if (!editing) return;
    setEditing({ ...editing, [key]: value });
  };

  return (
    <div>
      <div className="page-header">
        <h4>{t('Backoffice.Promotions')}</h4>
        <button className="btn btn-primary" onClick={add}><i className="fas fa-plus" /> {t('Backoffice.CreateNewPromotion')}</button>
      </div>

      {message && <div className={`alert ${message.startsWith(t('Backoffice.Error')) ? 'alert-danger' : 'alert-success'}`}>{message}</div>}

      {editing && (
        <div className="edit-card">
          <div className="card-header-custom">
            {editing.id ? t('Backoffice.Edit') : t('Backoffice.New')} {t('Backoffice.Promotion')}
          </div>
          <div className="card-body-custom">
            <div className="form-row">
              <div className="form-group flex-1">
                <label>{t('Backoffice.Code')}</label>
                <input className="form-control" value={editing.code || ''} onChange={e => updateField('code', e.target.value)} placeholder="e.g. LUNA20" />
              </div>
              <div className="form-group flex-1">
                <label>{t('Backoffice.Title')}</label>
                <input className="form-control" value={editing.title || ''} onChange={e => updateField('title', e.target.value)} />
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
                <label>{t('Backoffice.DiscountType')}</label>
                <select className="form-control" value={editing.discountType || 'percentage'} onChange={e => updateField('discountType', e.target.value)}>
                  <option value="percentage">{t('Backoffice.Percentage')}</option>
                  <option value="fixed">{t('Backoffice.Fixed')}</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group flex-1">
                <label>{t('Backoffice.DiscountValue')}</label>
                <input type="number" className="form-control" value={editing.discountValue || 0} onChange={e => updateField('discountValue', parseFloat(e.target.value) || 0)} />
              </div>
              <div className="form-group flex-1">
                <label>{t('Backoffice.MinPurchase')}</label>
                <input type="number" className="form-control" value={editing.minPurchase || 0} onChange={e => updateField('minPurchase', parseFloat(e.target.value) || 0)} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group flex-1">
                <label>{t('Backoffice.MaxUses')}</label>
                <input type="number" className="form-control" value={editing.maxUses || 0} onChange={e => updateField('maxUses', parseInt(e.target.value) || 0)} />
              </div>
              <div className="form-group flex-1">
                <label>{t('Backoffice.BannerImageURL')}</label>
                <input className="form-control" value={editing.bannerImageUrl || ''} onChange={e => updateField('bannerImageUrl', e.target.value)} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group flex-1">
                <label>{t('Backoffice.StartDate')}</label>
                <input type="date" className="form-control" value={editing.startDate || ''} onChange={e => updateField('startDate', e.target.value)} />
              </div>
              <div className="form-group flex-1">
                <label>{t('Backoffice.EndDate')}</label>
                <input type="date" className="form-control" value={editing.endDate || ''} onChange={e => updateField('endDate', e.target.value)} />
              </div>
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
              <th>{t('Backoffice.Code')}</th>
              <th>{t('Backoffice.Title')}</th>
              <th>{t('Backoffice.Type')}</th>
              <th>{t('Backoffice.Value')}</th>
              <th>{t('Backoffice.Uses')}</th>
              <th>{t('Backoffice.Active')}</th>
              <th>{t('Backoffice.Actions')}</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td><code>{item.code}</code></td>
                <td>{item.title}</td>
                <td>{item.discountType}</td>
                <td>{item.discountType === 'percentage' ? `${item.discountValue}%` : `$${item.discountValue}`}</td>
                <td>{item.currentUses || 0}/{item.maxUses || '∞'}</td>
                <td><span className={`badge ${item.isActive ? 'badge-active' : 'badge-inactive'}`}>{item.isActive ? t('Backoffice.Active') : t('Backoffice.Inactive')}</span></td>
                <td>
                  <button className="btn btn-sm btn-outline-primary" onClick={() => edit(item)}><i className="fas fa-edit" /></button>
                  {' '}
                  <button className="btn btn-sm btn-outline-danger" onClick={() => remove(item.id!)}><i className="fas fa-trash" /></button>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={8} className="text-center text-muted">{t('Backoffice.NoPromotions')}</td></tr>}
          </tbody>
        </table>
      )}
    </div>
  );
}
