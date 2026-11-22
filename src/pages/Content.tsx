import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import contentService, { type ContentSection } from '../services/content.service';
import { getRouteMessage } from '../hooks/useEntityForm';
import { SECTION_TYPES, getSectionIcon, type SectionType } from './forms/contentFormShared';
import './CrudPages.css';

export default function Content() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [items, setItems] = useState<ContentSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState('es');
  const message = getRouteMessage(location);
  const [sectionFilter, setSectionFilter] = useState<SectionType | 'all'>('all');

  const load = async () => {
    setLoading(true);
    try {
      const res = await contentService.getAll({ lang });
      setItems(Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : []);
    } catch { setItems([]); }
    setLoading(false);
  };

  useEffect(() => { load(); }, [lang]);

  const filtered = items.filter(i => i.language === lang && (sectionFilter === 'all' || i.sectionKey === sectionFilter));

  const remove = async (id: number) => {
    if (!confirm(t('Backoffice.ConfirmDelete'))) return;
    await contentService.remove(id);
    load();
  };

  const openCreate = (section: SectionType) => {
    navigate(`/content/new/${section}?lang=${lang}`);
  };

  const openEdit = (item: ContentSection) => {
    navigate(`/content/${item.id}/edit?lang=${item.language}`);
  };

  return (
    <div>
      <div className="page-header">
        <h4>{t('Backoffice.Content')}</h4>
        <div className="content-header-actions">
          <select className="form-control" value={sectionFilter} onChange={e => setSectionFilter(e.target.value as any)}>
            <option value="all">{t('Backoffice.AllSections')}</option>
            {SECTION_TYPES.map(s => <option key={s.key} value={s.key}>{t('Backoffice.Section_' + s.key)}</option>)}
          </select>
          <details className="create-menu">
            <summary className="btn btn-primary"><i className="fas fa-plus" /> {t('Backoffice.New')}</summary>
            <div className="create-menu-list">
              {SECTION_TYPES.map(s => (
                <button key={s.key} type="button" onClick={() => openCreate(s.key)}>
                  <i className={`fas ${s.icon}`} /> {t('Backoffice.Section_' + s.key)}
                </button>
              ))}
            </div>
          </details>
        </div>
      </div>

      <div className="lang-tabs">
        <button className={`lang-tab ${lang === 'es' ? 'active' : ''}`} onClick={() => setLang('es')}>Español</button>
        <button className={`lang-tab ${lang === 'en' ? 'active' : ''}`} onClick={() => setLang('en')}>English</button>
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
                <th>{t('Backoffice.SectionType')}</th>
                <th>{t('Backoffice.Title')}</th>
                <th>{t('Backoffice.Language')}</th>
                <th>{t('Backoffice.Active')}</th>
                <th>{t('Backoffice.Actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>
                    <i className={`fas ${getSectionIcon(item.sectionKey)}`} style={{ color: '#7122d0', marginRight: 6 }} />
                    {t('Backoffice.Section_' + item.sectionKey) || item.sectionKey}
                  </td>
                  <td>{item.title}</td>
                  <td><span className="badge badge-secondary">{item.language?.toUpperCase()}</span></td>
                  <td><span className={`badge ${item.isActive ? 'badge-active' : 'badge-inactive'}`}>{item.isActive ? t('Backoffice.Active') : t('Backoffice.Inactive')}</span></td>
                  <td className="actions-cell">
                    <button className="btn btn-sm btn-outline-primary" title={t('Backoffice.Edit')} onClick={() => openEdit(item)}><i className="fas fa-edit" /></button>
                    <button className="btn btn-sm btn-outline-danger" title={t('Backoffice.Delete')} onClick={() => remove(item.id!)}><i className="fas fa-trash" /></button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={6} className="text-center text-muted">{t('Backoffice.NoContent')}</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
