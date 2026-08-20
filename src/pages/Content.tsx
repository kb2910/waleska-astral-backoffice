import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import contentService, { type ContentSection } from '../services/content.service';
import './CrudPages.css';

type SectionType = 'header' | 'banner' | 'about' | 'contact' | 'footer';

const SECTION_TYPES: { key: SectionType; icon: string; defaultSort: number }[] = [
  { key: 'header',  icon: 'fa-bars',           defaultSort: 0 },
  { key: 'banner',  icon: 'fa-image',          defaultSort: 1 },
  { key: 'about',   icon: 'fa-user',           defaultSort: 2 },
  { key: 'contact', icon: 'fa-envelope',       defaultSort: 3 },
  { key: 'footer',  icon: 'fa-shoe-prints',    defaultSort: 4 },
];

function getEmptyItem(sectionKey: SectionType, lang: string): Partial<ContentSection> {
  const base: Partial<ContentSection> = {
    sectionKey,
    language: lang,
    isActive: true,
    sortOrder: SECTION_TYPES.find(s => s.key === sectionKey)?.defaultSort ?? 10,
  };
  switch (sectionKey) {
    case 'header':
      return { ...base, title: 'Waleska Astral', navItems: [{ label: '', sectionId: '' }] };
    case 'banner':
      return { ...base, title: '', subtitle: '', description: '', buttons: [{ text: '', url: '#contact', variant: 'primary', target: '_self' }] };
    case 'about':
      return { ...base, title: '', paragraphs: [''] };
    case 'contact':
      return { ...base, title: '', subtitle: '', description: '', buttons: [{ text: '', url: '', variant: 'primary', target: '_blank' }] };
    case 'footer':
      return { ...base, title: 'Waleska Astral', slogan: '', copyrightText: '', footerNavLinks: [{ label: '', sectionId: '' }], socialLinks: [{ platform: '', url: '', icon: '' }] };
    default:
      return base;
  }
}

function validateRequired(editing: Partial<ContentSection>, t: any): string[] {
  const errors: string[] = [];
  if (!editing.title?.trim()) errors.push(t('Backoffice.TitleRequired'));
  switch (editing.sectionKey as SectionType) {
    case 'header':
      if (!editing.navItems?.length || editing.navItems.every(n => !n.label.trim())) errors.push(t('Backoffice.NavItemsRequired'));
      break;
    case 'banner':
      if (!editing.subtitle?.trim()) errors.push(t('Backoffice.SubtitleRequired'));
      if (!editing.description?.trim()) errors.push(t('Backoffice.DescriptionRequired'));
      break;
    case 'about':
      if (!editing.paragraphs?.length || editing.paragraphs.every(p => !p.trim())) errors.push(t('Backoffice.ParagraphsRequired'));
      break;
    case 'contact':
      if (!editing.description?.trim()) errors.push(t('Backoffice.DescriptionRequired'));
      if (!editing.buttons?.length || editing.buttons.every(b => !b.text.trim())) errors.push(t('Backoffice.ButtonTextRequired'));
      break;
    case 'footer':
      if (!editing.slogan?.trim()) errors.push(t('Backoffice.SloganRequired'));
      if (!editing.copyrightText?.trim()) errors.push(t('Backoffice.CopyrightRequired'));
      break;
  }
  return errors;
}

export default function Content() {
  const { t } = useTranslation();
  const [items, setItems] = useState<ContentSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState('es');
  const [editing, setEditing] = useState<Partial<ContentSection> | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
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

  const add = (type: SectionType) => {
    setEditing(getEmptyItem(type, lang));
    setValidationErrors([]);
  };
  const edit = (item: ContentSection) => {
    setEditing({ ...item, paragraphs: item.paragraphs ? [...item.paragraphs] : [], navItems: item.navItems ? item.navItems.map(n => ({ ...n })) : [], buttons: item.buttons ? item.buttons.map(b => ({ ...b })) : [], footerNavLinks: item.footerNavLinks ? item.footerNavLinks.map(f => ({ ...f })) : [], socialLinks: item.socialLinks ? item.socialLinks.map(s => ({ ...s })) : [] });
    setValidationErrors([]);
  };
  const cancel = () => { setEditing(null); setMessage(''); setValidationErrors([]); };

  const save = async () => {
    if (!editing) return;
    const errors = validateRequired(editing, t);
    if (errors.length > 0) { setValidationErrors(errors); return; }
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

  const updateField = (field: string, value: any) => { if (editing) setEditing({ ...editing, [field]: value }); };

  const addNavItem = () => { if (editing) setEditing({ ...editing, navItems: [...(editing.navItems || []), { label: '', sectionId: '' }] }); };
  const updateNavItem = (i: number, field: string, value: string) => { if (!editing) return; const n = [...(editing.navItems || [])]; (n[i] as any)[field] = value; setEditing({ ...editing, navItems: n }); };
  const removeNavItem = (i: number) => { if (!editing) return; const n = [...(editing.navItems || [])]; n.splice(i, 1); setEditing({ ...editing, navItems: n }); };

  const addParagraph = () => { if (editing) setEditing({ ...editing, paragraphs: [...(editing.paragraphs || []), ''] }); };
  const updateParagraph = (i: number, value: string) => { if (!editing) return; const p = [...(editing.paragraphs || [])]; p[i] = value; setEditing({ ...editing, paragraphs: p }); };
  const removeParagraph = (i: number) => { if (!editing) return; const p = [...(editing.paragraphs || [])]; p.splice(i, 1); setEditing({ ...editing, paragraphs: p }); };

  const addButton = () => { if (editing) setEditing({ ...editing, buttons: [...(editing.buttons || []), { text: '', url: '', variant: 'primary', target: '_self' }] }); };
  const updateButton = (i: number, field: string, value: string) => { if (!editing) return; const b = [...(editing.buttons || [])]; (b[i] as any)[field] = value; setEditing({ ...editing, buttons: b }); };
  const removeButton = (i: number) => { if (!editing) return; const b = [...(editing.buttons || [])]; b.splice(i, 1); setEditing({ ...editing, buttons: b }); };

  const addFooterNav = () => { if (editing) setEditing({ ...editing, footerNavLinks: [...(editing.footerNavLinks || []), { label: '', sectionId: '' }] }); };
  const updateFooterNav = (i: number, field: string, value: string) => { if (!editing) return; const f = [...(editing.footerNavLinks || [])]; (f[i] as any)[field] = value; setEditing({ ...editing, footerNavLinks: f }); };
  const removeFooterNav = (i: number) => { if (!editing) return; const f = [...(editing.footerNavLinks || [])]; f.splice(i, 1); setEditing({ ...editing, footerNavLinks: f }); };

  const addSocialLink = () => { if (editing) setEditing({ ...editing, socialLinks: [...(editing.socialLinks || []), { platform: '', url: '', icon: '' }] }); };
  const updateSocialLink = (i: number, field: string, value: string) => { if (!editing) return; const s = [...(editing.socialLinks || [])]; (s[i] as any)[field] = value; setEditing({ ...editing, socialLinks: s }); };
  const removeSocialLink = (i: number) => { if (!editing) return; const s = [...(editing.socialLinks || [])]; s.splice(i, 1); setEditing({ ...editing, socialLinks: s }); };

  return (
    <div>
      <div className="page-header">
        <h4>{t('Backoffice.Content')}</h4>
        <div className="d-flex gap-2">
          <select className="form-control" style={{ width: 'auto' }} value={sectionFilter} onChange={e => setSectionFilter(e.target.value as any)}>
            <option value="all">{t('Backoffice.AllSections')}</option>
            {SECTION_TYPES.map(s => <option key={s.key} value={s.key}>{t('Backoffice.Section_' + s.key)}</option>)}
          </select>
          <div className="dropdown">
            <button className="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown"><i className="fas fa-plus" /> {t('Backoffice.New')}</button>
            <ul className="dropdown-menu">
              {SECTION_TYPES.map(s => (
                <li key={s.key}><button className="dropdown-item" onClick={() => add(s.key)}><i className={`fas ${s.icon} me-2`} />{t('Backoffice.Section_' + s.key)}</button></li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="lang-tabs">
        <button className={`lang-tab ${lang === 'es' ? 'active' : ''}`} onClick={() => setLang('es')}>Español</button>
        <button className={`lang-tab ${lang === 'en' ? 'active' : ''}`} onClick={() => setLang('en')}>English</button>
      </div>

      {message && <div className={`alert ${message.startsWith(t('Backoffice.Error')) ? 'alert-danger' : 'alert-success'}`}>{message}</div>}

      {validationErrors.length > 0 && (
        <div className="alert alert-danger">
          <ul className="mb-0">{validationErrors.map((e, i) => <li key={i}>{e}</li>)}</ul>
        </div>
      )}

      {editing && (
        <div className="edit-card">
          <div className="card-header-custom">
            <i className={`fas ${SECTION_TYPES.find(s => s.key === editing.sectionKey)?.icon || 'fa-file'} me-2`} />
            {editing.id ? t('Backoffice.Edit') : t('Backoffice.New')} {t('Backoffice.Section_' + (editing.sectionKey as SectionType))}
            <span className="badge bg-secondary ms-2">{editing.sectionKey}</span>
          </div>
          <div className="card-body-custom">
            <div className="form-row">
              <div className="form-group flex-1">
                <label>{t('Backoffice.SectionType')}</label>
                <select className="form-control" value={editing.sectionKey || ''} disabled>
                  {SECTION_TYPES.map(s => <option key={s.key} value={s.key}>{t('Backoffice.Section_' + s.key)}</option>)}
                </select>
              </div>
              <div className="form-group flex-1">
                <label>{t('Backoffice.Language')}</label>
                <select className="form-control" value={editing.language || lang} onChange={e => updateField('language', e.target.value)}>
                  <option value="es">Español</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>

            {/* Title — required for all */}
            <div className="form-group">
              <label>{t('Backoffice.Title')} <span className="text-danger">*</span></label>
              <input className="form-control" value={editing.title || ''} onChange={e => updateField('title', e.target.value)} />
            </div>

            {/* BANNER & CONTACT: subtitle, description, buttons */}
            {(editing.sectionKey === 'banner' || editing.sectionKey === 'contact') && (
              <>
                {editing.sectionKey === 'banner' && (
                  <div className="form-group">
                    <label>{t('Backoffice.Subtitle')} <span className="text-danger">*</span></label>
                    <input className="form-control" value={editing.subtitle || ''} onChange={e => updateField('subtitle', e.target.value)} />
                  </div>
                )}
                <div className="form-group">
                  <label>{t('Backoffice.Description')} <span className="text-danger">*</span></label>
                  <textarea className="form-control" rows={3} value={editing.description || ''} onChange={e => updateField('description', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>{t('Backoffice.Buttons')}</label>
                  {(editing.buttons || []).map((btn, i) => (
                    <div key={i} className="paragraph-row" style={{ gap: 8 }}>
                      <input className="form-control" style={{ flex: 2 }} placeholder={t('Backoffice.ButtonText')} value={btn.text} onChange={e => updateButton(i, 'text', e.target.value)} />
                      <input className="form-control" style={{ flex: 3 }} placeholder="URL" value={btn.url} onChange={e => updateButton(i, 'url', e.target.value)} />
                      <select className="form-control" style={{ flex: 1 }} value={btn.target || '_self'} onChange={e => updateButton(i, 'target', e.target.value)}>
                        <option value="_self">{t('Backoffice.SameTab')}</option>
                        <option value="_blank">{t('Backoffice.NewTab')}</option>
                      </select>
                      <button className="btn btn-sm btn-danger" onClick={() => removeButton(i)}><i className="fas fa-times" /></button>
                    </div>
                  ))}
                  <button className="btn btn-sm btn-outline-primary mt-1" onClick={addButton}><i className="fas fa-plus" /> {t('Backoffice.AddButton')}</button>
                </div>
              </>
            )}

            {/* ABOUT: paragraphs */}
            {editing.sectionKey === 'about' && (
              <div className="form-group">
                <label>{t('Backoffice.Paragraphs')} <span className="text-danger">*</span></label>
                {(editing.paragraphs || []).map((p, i) => (
                  <div key={i} className="paragraph-row">
                    <textarea className="form-control" rows={2} value={p} onChange={e => updateParagraph(i, e.target.value)} placeholder={t('Backoffice.ParagraphN', { n: i + 1 })} />
                    <button className="btn btn-sm btn-danger" onClick={() => removeParagraph(i)}><i className="fas fa-times" /></button>
                  </div>
                ))}
                <button className="btn btn-sm btn-outline-primary mt-1" onClick={addParagraph}><i className="fas fa-plus" /> {t('Backoffice.AddParagraph')}</button>
              </div>
            )}

            {/* HEADER: navItems */}
            {editing.sectionKey === 'header' && (
              <div className="form-group">
                <label>{t('Backoffice.NavItems')} <span className="text-danger">*</span></label>
                {(editing.navItems || []).map((nav, i) => (
                  <div key={i} className="paragraph-row" style={{ gap: 8 }}>
                    <input className="form-control" style={{ flex: 2 }} placeholder={t('Backoffice.NavLabel')} value={nav.label} onChange={e => updateNavItem(i, 'label', e.target.value)} />
                    <input className="form-control" style={{ flex: 2 }} placeholder={t('Backoffice.SectionId')} value={nav.sectionId} onChange={e => updateNavItem(i, 'sectionId', e.target.value)} />
                    <button className="btn btn-sm btn-danger" onClick={() => removeNavItem(i)}><i className="fas fa-times" /></button>
                  </div>
                ))}
                <button className="btn btn-sm btn-outline-primary mt-1" onClick={addNavItem}><i className="fas fa-plus" /> {t('Backoffice.AddNavItem')}</button>
              </div>
            )}

            {/* FOOTER: slogan, copyrightText, footerNavLinks, socialLinks */}
            {editing.sectionKey === 'footer' && (
              <>
                <div className="form-row">
                  <div className="form-group flex-1">
                    <label>{t('Backoffice.Slogan')} <span className="text-danger">*</span></label>
                    <input className="form-control" value={editing.slogan || ''} onChange={e => updateField('slogan', e.target.value)} />
                  </div>
                  <div className="form-group flex-1">
                    <label>{t('Backoffice.Copyright')} <span className="text-danger">*</span></label>
                    <input className="form-control" value={editing.copyrightText || ''} onChange={e => updateField('copyrightText', e.target.value)} />
                  </div>
                </div>
                <div className="form-group">
                  <label>{t('Backoffice.FooterNavLinks')}</label>
                  {(editing.footerNavLinks || []).map((f, i) => (
                    <div key={i} className="paragraph-row" style={{ gap: 8 }}>
                      <input className="form-control" style={{ flex: 2 }} placeholder={t('Backoffice.NavLabel')} value={f.label} onChange={e => updateFooterNav(i, 'label', e.target.value)} />
                      <input className="form-control" style={{ flex: 2 }} placeholder={t('Backoffice.SectionId')} value={f.sectionId} onChange={e => updateFooterNav(i, 'sectionId', e.target.value)} />
                      <button className="btn btn-sm btn-danger" onClick={() => removeFooterNav(i)}><i className="fas fa-times" /></button>
                    </div>
                  ))}
                  <button className="btn btn-sm btn-outline-primary mt-1" onClick={addFooterNav}><i className="fas fa-plus" /> {t('Backoffice.AddFooterNav')}</button>
                </div>
                <div className="form-group">
                  <label>{t('Backoffice.SocialLinks')}</label>
                  {(editing.socialLinks || []).map((s, i) => (
                    <div key={i} className="paragraph-row" style={{ gap: 8 }}>
                      <input className="form-control" style={{ flex: 1 }} placeholder={t('Backoffice.Platform')} value={s.platform} onChange={e => updateSocialLink(i, 'platform', e.target.value)} />
                      <input className="form-control" style={{ flex: 2 }} placeholder="URL" value={s.url} onChange={e => updateSocialLink(i, 'url', e.target.value)} />
                      <input className="form-control" style={{ flex: 1 }} placeholder="Icon (fab fa-...)" value={s.icon} onChange={e => updateSocialLink(i, 'icon', e.target.value)} />
                      <button className="btn btn-sm btn-danger" onClick={() => removeSocialLink(i)}><i className="fas fa-times" /></button>
                    </div>
                  ))}
                  <button className="btn btn-sm btn-outline-primary mt-1" onClick={addSocialLink}><i className="fas fa-plus" /> {t('Backoffice.AddSocialLink')}</button>
                </div>
              </>
            )}

            {/* Common fields */}
            <div className="form-row">
              <div className="form-group flex-1">
                <label>{t('Backoffice.ImageURL')}</label>
                <input className="form-control" value={editing.imageUrl || ''} onChange={e => updateField('imageUrl', e.target.value)} />
              </div>
              <div className="form-group flex-1">
                <label>{t('Backoffice.SortOrder')}</label>
                <input type="number" className="form-control" value={editing.sortOrder || 0} onChange={e => updateField('sortOrder', parseInt(e.target.value) || 0)} />
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
                  <i className={`fas ${SECTION_TYPES.find(s => s.key === item.sectionKey)?.icon || 'fa-file'} me-1`} style={{ color: '#7122d0' }} />
                  {t('Backoffice.Section_' + item.sectionKey) || item.sectionKey}
                </td>
                <td>{item.title}</td>
                <td><span className="badge bg-secondary">{item.language?.toUpperCase()}</span></td>
                <td><span className={`badge ${item.isActive ? 'badge-active' : 'badge-inactive'}`}>{item.isActive ? t('Backoffice.Active') : t('Backoffice.Inactive')}</span></td>
                <td>
                  <button className="btn btn-sm btn-outline-primary" onClick={() => edit(item)}><i className="fas fa-edit" /></button>
                  {' '}
                  <button className="btn btn-sm btn-outline-danger" onClick={() => remove(item.id!)}><i className="fas fa-trash" /></button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={6} className="text-center text-muted">{t('Backoffice.NoContent')}</td></tr>}
          </tbody>
        </table>
      )}
    </div>
  );
}
