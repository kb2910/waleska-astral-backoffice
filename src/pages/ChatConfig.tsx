import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import chatConfigService, { type ChatConfig as ChatConfigType } from '../services/chat-config.service';
import './CrudPages.css';

export default function ChatConfig() {
  const { t } = useTranslation();
  const [items, setItems] = useState<ChatConfigType[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<ChatConfigType> | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await chatConfigService.getAll();
      setItems(Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : []);
    } catch { setItems([]); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const add = () => setEditing({ language: 'es', model: 'gemini-2.5-flash', maxQuestions: 5, systemPrompt: '', welcomeMessage: '', limitReachedMessage: '', keywords: [], isActive: true });
  const edit = (item: ChatConfigType) => setEditing({ ...item });
  const cancel = () => { setEditing(null); setMessage(''); };

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      if (editing.id) {
        await chatConfigService.update(editing.id, editing);
        setMessage(t('Backoffice.Updated'));
      } else {
        await chatConfigService.create(editing);
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
    await chatConfigService.remove(id);
    load();
  };

  const updateField = (key: string, value: any) => {
    if (!editing) return;
    setEditing({ ...editing, [key]: value });
  };

  return (
    <div>
      <div className="page-header">
        <h4>{t('Backoffice.ChatConfig')}</h4>
        <button className="btn btn-primary" onClick={add}><i className="fas fa-plus" /> {t('Backoffice.CreateNewChatConfig')}</button>
      </div>

      {message && <div className={`alert ${message.startsWith(t('Backoffice.Error')) ? 'alert-danger' : 'alert-success'}`}>{message}</div>}

      {editing && (
        <div className="edit-card">
          <div className="card-header-custom">
            {editing.id ? t('Backoffice.Edit') : t('Backoffice.New')} {t('Backoffice.ChatConfig')}
          </div>
          <div className="card-body-custom">
            <div className="form-row">
              <div className="form-group flex-1">
                <label>{t('Backoffice.Language')}</label>
                <select className="form-control" value={editing.language || 'es'} onChange={e => updateField('language', e.target.value)}>
                  <option value="es">Español</option>
                  <option value="en">English</option>
                </select>
              </div>
              <div className="form-group flex-1">
                <label>{t('Backoffice.Model')}</label>
                <select className="form-control" value={editing.model || 'gpt-3.5-turbo'} onChange={e => updateField('model', e.target.value)}>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  <option value="gpt-4">GPT-4</option>
                  <option value="gpt-4-turbo">GPT-4 Turbo</option>
                  <option value="gpt-4o">GPT-4o</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>{t('Backoffice.MaxQuestions')}</label>
              <input type="number" className="form-control" value={editing.maxQuestions || 10} onChange={e => updateField('maxQuestions', parseInt(e.target.value) || 10)} />
            </div>
            <div className="form-group">
              <label>{t('Backoffice.SystemPrompt')}</label>
              <textarea className="form-control" rows={5} value={editing.systemPrompt || ''} onChange={e => updateField('systemPrompt', e.target.value)} placeholder={t('Backoffice.SystemPromptPlaceholder')} />
            </div>
            <div className="form-group">
              <label>{t('Backoffice.WelcomeMessage')}</label>
              <textarea className="form-control" rows={2} value={editing.welcomeMessage || ''} onChange={e => updateField('welcomeMessage', e.target.value)} />
            </div>
            <div className="form-group">
              <label>{t('Backoffice.LimitReachedMessage')}</label>
              <textarea className="form-control" rows={2} value={editing.limitReachedMessage || ''} onChange={e => updateField('limitReachedMessage', e.target.value)} />
            </div>
            <div className="form-group">
              <label>{t('Backoffice.Keywords')}</label>
              <input className="form-control" value={editing.keywords || ''} onChange={e => updateField('keywords', e.target.value)} placeholder={t('Backoffice.KeywordsPlaceholder')} />
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
              <th>{t('Backoffice.Language')}</th>
              <th>{t('Backoffice.Model')}</th>
              <th>{t('Backoffice.MaxQuestions')}</th>
              <th>{t('Backoffice.Active')}</th>
              <th>{t('Backoffice.Actions')}</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.language?.toUpperCase()}</td>
                <td><code>{item.model}</code></td>
                <td>{item.maxQuestions}</td>
                <td><span className={`badge ${item.isActive ? 'badge-active' : 'badge-inactive'}`}>{item.isActive ? t('Backoffice.Active') : t('Backoffice.Inactive')}</span></td>
                <td>
                  <button className="btn btn-sm btn-outline-primary" onClick={() => edit(item)}><i className="fas fa-edit" /></button>
                  {' '}
                  <button className="btn btn-sm btn-outline-danger" onClick={() => remove(item.id!)}><i className="fas fa-trash" /></button>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={6} className="text-center text-muted">{t('Backoffice.NoChatConfigs')}</td></tr>}
          </tbody>
        </table>
      )}
    </div>
  );
}
