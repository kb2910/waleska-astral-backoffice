import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import contentService, { type ContentSection } from '../services/content.service';
import './CrudPages.css';

export default function Content() {
  const { t } = useTranslation();
  const [items, setItems] = useState<ContentSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState('es');
  const [editing, setEditing] = useState<Partial<ContentSection> | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await contentService.getAll({ lang });
      setItems(Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : []);
    } catch { setItems([]); }
    setLoading(false);
  };

  useEffect(() => { load(); }, [lang]);

  const filtered = items.filter(i => i.language === lang);

  const add = () => setEditing({ sectionKey: '', language: lang, title: '', subtitle: '', description: '', paragraphs: [], imageUrl: '', slogan: '', isActive: true, sortOrder: 0 });
  const edit = (item: ContentSection) => setEditing({ ...item, paragraphs: item.paragraphs ? [...item.paragraphs] : [] });
  const cancel = () => { setEditing(null); setMessage(''); };

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      if (editing.id) {
        await contentService.update(editing.id, editing);
        setMessage(t('Backoffice.Updated'));
      } else {
        await contentService.create(editing);
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
    await contentService.remove(id);
    load();
  };

  const addParagraph = () => {
    if (editing) setEditing({ ...editing, paragraphs: [...(editing.paragraphs || []), ''] });
  };

  const updateParagraph = (index: number, value: string) => {
    if (!editing) return;
    const p = [...(editing.paragraphs || [])];
    p[index] = value;
    setEditing({ ...editing, paragraphs: p });
  };

  const removeParagraph = (index: number) => {
    if (!editing) return;
    const p = [...(editing.paragraphs || [])];
    p.splice(index, 1);
    setEditing({ ...editing, paragraphs: p });
  };

  return (
    <div>
      <div className="page-header">
        <h4>{t('Backoffice.Content')}</h4>
        <button className="btn btn-primary" onClick={add}><i className="fas fa-plus" /> {t('Backoffice.CreateNewSection')}</button>
      </div>

      <div className="lang-tabs">
        <button className={`lang-tab ${lang === 'es' ? 'active' : ''}`} onClick={() => setLang('es')}>Español</button>
        <button className={`lang-tab ${lang === 'en' ? 'active' : ''}`} onClick={() => setLang('en')}>English</button>
      </div>

      {message && <div className={`alert ${message.startsWith(t('Backoffice.Error')) ? 'alert-danger' : 'alert-success'}`}>{message}</div>}

      {editing && (
        <div className="edit-card">
          <div className="card-header-custom">
            {editing.id ? t('Backoffice.Edit') : t('Backoffice.New')} {t('Backoffice.Content')}
          </div>
          <div className="card-body-custom">
            <div className="form-row">
              <div className="form-group flex-1">
                <label>{t('Backoffice.SectionKey')}</label>
                <input className="form-control" value={editing.sectionKey || ''} onChange={e => setEditing({ ...editing, sectionKey: e.target.value })} placeholder="e.g. hero, about, contact" />
              </div>
              <div className="form-group flex-1">
                <label>{t('Backoffice.Language')}</label>
                <select className="form-control" value={editing.language || lang} onChange={e => setEditing({ ...editing, language: e.target.value })}>
                  <option value="es">Español</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group flex-1">
                <label>{t('Backoffice.Title')}</label>
                <input className="form-control" value={editing.title || ''} onChange={e => setEditing({ ...editing, title: e.target.value })} />
              </div>
              <div className="form-group flex-1">
                <label>{t('Backoffice.Subtitle')}</label>
                <input className="form-control" value={editing.subtitle || ''} onChange={e => setEditing({ ...editing, subtitle: e.target.value })} />
              </div>
            </div>
            <div className="form-group">
              <label>{t('Backoffice.Description')}</label>
              <textarea className="form-control" rows={3} value={editing.description || ''} onChange={e => setEditing({ ...editing, description: e.target.value })} />
            </div>
            <div className="form-row">
              <div className="form-group flex-1">
                <label>{t('Backoffice.ImageURL')}</label>
                <input className="form-control" value={editing.imageUrl || ''} onChange={e => setEditing({ ...editing, imageUrl: e.target.value })} />
              </div>
              <div className="form-group flex-1">
                <label>{t('Backoffice.Slogan')}</label>
                <input className="form-control" value={editing.slogan || ''} onChange={e => setEditing({ ...editing, slogan: e.target.value })} />
              </div>
            </div>
            <div className="form-group">
              <label>{t('Backoffice.SortOrder')}</label>
              <input type="number" className="form-control" value={editing.sortOrder || 0} onChange={e => setEditing({ ...editing, sortOrder: parseInt(e.target.value) || 0 })} />
            </div>
            <div className="form-group">
              <label>{t('Backoffice.Paragraphs')}</label>
              {(editing.paragraphs || []).map((p, i) => (
                <div key={i} className="paragraph-row">
                  <textarea className="form-control" rows={2} value={p} onChange={e => updateParagraph(i, e.target.value)} />
                  <button className="btn btn-sm btn-danger" onClick={() => removeParagraph(i)}><i className="fas fa-times" /></button>
                </div>
              ))}
              <button className="btn btn-sm btn-outline-primary mt-1" onClick={addParagraph}><i className="fas fa-plus" /> {t('Backoffice.AddParagraph')}</button>
            </div>
            <div className="form-group">
              <label><input type="checkbox" checked={editing.isActive ?? true} onChange={e => setEditing({ ...editing, isActive: e.target.checked })} /> {t('Backoffice.Active')}</label>
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
              <th>Key</th>
              <th>{t('Backoffice.Title')}</th>
              <th>{t('Backoffice.Active')}</th>
              <th>{t('Backoffice.Actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.sectionKey}</td>
                <td>{item.title}</td>
                <td><span className={`badge ${item.isActive ? 'badge-active' : 'badge-inactive'}`}>{item.isActive ? t('Backoffice.Active') : t('Backoffice.Inactive')}</span></td>
                <td>
                  <button className="btn btn-sm btn-outline-primary" onClick={() => edit(item)}><i className="fas fa-edit" /></button>
                  {' '}
                  <button className="btn btn-sm btn-outline-danger" onClick={() => remove(item.id!)}><i className="fas fa-trash" /></button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={5} className="text-center text-muted">{t('Backoffice.NoContent')}</td></tr>}
          </tbody>
        </table>
      )}
    </div>
  );
}
