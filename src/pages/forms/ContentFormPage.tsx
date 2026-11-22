import { useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import EntityFormPage from '../../components/EntityFormPage';
import { useEntityForm } from '../../hooks/useEntityForm';
import contentService, { type ContentSection } from '../../services/content.service';
import {
  SECTION_TYPES,
  cleanList,
  getEmptyItem,
  getSectionIcon,
  validateRequired,
  type SectionType,
} from './contentFormShared';

type ListKey = 'navItems' | 'buttons' | 'footerNavLinks' | 'legalLinks' | 'socialLinks';

export default function ContentFormPage() {
  const { t } = useTranslation();
  const { id, sectionKey: sectionParam } = useParams();
  const [params] = useSearchParams();
  const sectionFromRoute = (sectionParam || params.get('section') || 'banner') as SectionType;
  const langFromRoute = params.get('lang') || 'es';

  const form = useEntityForm<ContentSection>({
    service: contentService,
    id,
    empty: () => getEmptyItem(sectionFromRoute, langFromRoute),
    backTo: '/content',
    createdMessage: t('Backoffice.Created'),
    updatedMessage: t('Backoffice.Updated'),
    errorMessage: t('Backoffice.Error'),
    validate: current => validateRequired(current, t),
    transform: current => ({
      ...current,
      navItems: cleanList(current.navItems, ['label', 'sectionId']),
      footerNavLinks: cleanList(current.footerNavLinks, ['label', 'sectionId']),
      legalLinks: cleanList(current.legalLinks, ['label', 'url']),
      socialLinks: cleanList(current.socialLinks, ['platform', 'url']),
      buttons: cleanList(current.buttons, ['text', 'url']),
      paragraphs: current.paragraphs?.filter(p => p?.trim()),
    }),
  });

  const sectionKey = (form.form.sectionKey || sectionFromRoute) as SectionType;
  const sectionLabel = t(`Backoffice.Section_${sectionKey}`);

  const list = (key: ListKey): any[] => (form.form[key] as any[]) || [];
  const setList = (key: ListKey, value: any[]) => form.setForm(prev => ({ ...prev, [key]: value }));
  const addList = (key: ListKey, value: any) => setList(key, [...list(key), value]);
  const updateListItem = (key: ListKey, index: number, field: string, value: any) => {
    const next = [...list(key)];
    next[index] = { ...next[index], [field]: value };
    setList(key, next);
  };
  const removeListItem = (key: ListKey, index: number) => {
    setList(key, list(key).filter((_, i) => i !== index));
  };

  const paragraphs = form.form.paragraphs || [];
  const setParagraphs = (value: string[]) => form.setForm(prev => ({ ...prev, paragraphs: value }));

  return (
    <EntityFormPage
      title={form.isNew ? `${t('Backoffice.New')} ${sectionLabel}` : `${t('Backoffice.Edit')} ${sectionLabel}`}
      subtitle={`${t('Backoffice.Content')} · ${sectionKey}`}
      backTo="/content"
      loading={form.loading}
      saving={form.saving}
      message={form.message}
      validationErrors={form.validationErrors}
      onSubmit={form.submit}
      onCancel={form.cancel}
    >
      <div className="form-grid">
        <div className="form-field">
          <label>{t('Backoffice.SectionType')}</label>
          <select className="form-control" value={sectionKey} disabled>
            {SECTION_TYPES.map(s => (
              <option key={s.key} value={s.key}>{t(`Backoffice.Section_${s.key}`)}</option>
            ))}
          </select>
        </div>
        <div className="form-field">
          <label>{t('Backoffice.Language')}</label>
          <select className="form-control" value={form.form.language || langFromRoute} onChange={e => form.setField('language', e.target.value)}>
            <option value="es">Español</option>
            <option value="en">English</option>
          </select>
        </div>
        <div className="form-field full">
          <label>{t('Backoffice.Title')} <span className="text-danger">*</span></label>
          <input className="form-control" value={form.form.title || ''} onChange={e => form.setField('title', e.target.value)} />
        </div>
      </div>

      {(sectionKey === 'banner' || sectionKey === 'contact' || sectionKey === 'footer') && (
        <div className="form-section">
          <div className="form-section-title"><i className={`fas ${getSectionIcon(sectionKey)}`} /> {sectionLabel}</div>
          <div className="form-grid">
            {sectionKey === 'banner' && (
              <div className="form-field full">
                <label>{t('Backoffice.Subtitle')} <span className="text-danger">*</span></label>
                <input className="form-control" value={form.form.subtitle || ''} onChange={e => form.setField('subtitle', e.target.value)} />
              </div>
            )}
            {sectionKey !== 'footer' && (
              <div className="form-field full">
                <label>{t('Backoffice.Description')} <span className="text-danger">*</span></label>
                <textarea className="form-control" rows={3} value={form.form.description || ''} onChange={e => form.setField('description', e.target.value)} />
              </div>
            )}
            <div className="form-field full">
              <label>{sectionKey === 'footer' ? t('Backoffice.ContactButton') : t('Backoffice.Buttons')} <span className="text-danger">*</span></label>
              {list('buttons').map((btn, i) => (
                <div key={i} className="repeat-row">
                  <div className="form-field span-4">
                    <label>{t('Backoffice.ButtonText')}</label>
                    <input className="form-control" value={btn.text || ''} onChange={e => updateListItem('buttons', i, 'text', e.target.value)} />
                  </div>
                  <div className="form-field span-4">
                    <label>URL</label>
                    <input className="form-control" value={btn.url || ''} onChange={e => updateListItem('buttons', i, 'url', e.target.value)} />
                  </div>
                  <div className="form-field span-3">
                    <label>{t('Backoffice.Target')}</label>
                    <select className="form-control" value={btn.target || '_self'} onChange={e => updateListItem('buttons', i, 'target', e.target.value)}>
                      <option value="_self">{t('Backoffice.SameTab')}</option>
                      <option value="_blank">{t('Backoffice.NewTab')}</option>
                    </select>
                  </div>
                  <button type="button" className="btn btn-sm btn-danger btn-remove" onClick={() => removeListItem('buttons', i)} aria-label={t('Backoffice.Delete')}>
                    <i className="fas fa-times" />
                  </button>
                </div>
              ))}
              <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => addList('buttons', { text: '', url: '#contact', variant: 'primary', target: '_self' })}>
                <i className="fas fa-plus" /> {t('Backoffice.AddButton')}
              </button>
            </div>
          </div>
        </div>
      )}

      {sectionKey === 'about' && (
        <div className="form-section">
          <div className="form-section-title"><i className="fas fa-paragraph" /> {t('Backoffice.Paragraphs')}</div>
          {paragraphs.map((p, i) => (
            <div key={i} className="repeat-row">
              <div className="form-field span-12">
                <label>{t('Backoffice.ParagraphN', { n: i + 1 })} <span className="text-danger">*</span></label>
                <textarea className="form-control" rows={2} value={p} onChange={e => setParagraphs(paragraphs.map((item, idx) => idx === i ? e.target.value : item))} />
              </div>
              <button type="button" className="btn btn-sm btn-danger btn-remove" onClick={() => setParagraphs(paragraphs.filter((_, idx) => idx !== i))} aria-label={t('Backoffice.Delete')}>
                <i className="fas fa-times" />
              </button>
            </div>
          ))}
          <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => setParagraphs([...paragraphs, ''])}>
            <i className="fas fa-plus" /> {t('Backoffice.AddParagraph')}
          </button>
        </div>
      )}

      {sectionKey === 'header' && (
        <div className="form-section">
          <div className="form-section-title"><i className="fas fa-bars" /> {t('Backoffice.NavItems')}</div>
          {list('navItems').map((nav, i) => (
            <div key={i} className="repeat-row">
              <div className="form-field span-6">
                <label>{t('Backoffice.NavLabel')}</label>
                <input className="form-control" value={nav.label || ''} onChange={e => updateListItem('navItems', i, 'label', e.target.value)} />
              </div>
              <div className="form-field span-5">
                <label>{t('Backoffice.SectionId')}</label>
                <input className="form-control" value={nav.sectionId || ''} onChange={e => updateListItem('navItems', i, 'sectionId', e.target.value)} />
              </div>
              <button type="button" className="btn btn-sm btn-danger btn-remove" onClick={() => removeListItem('navItems', i)} aria-label={t('Backoffice.Delete')}>
                <i className="fas fa-times" />
              </button>
            </div>
          ))}
          <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => addList('navItems', { label: '', sectionId: '' })}>
            <i className="fas fa-plus" /> {t('Backoffice.AddNavItem')}
          </button>
        </div>
      )}

      {sectionKey === 'footer' && (
        <>
          <div className="form-section">
            <div className="form-section-title"><i className="fas fa-shoe-prints" /> {t('Backoffice.Section_footer')}</div>
            <div className="form-grid">
              <div className="form-field">
                <label>{t('Backoffice.Slogan')} <span className="text-danger">*</span></label>
                <input className="form-control" value={form.form.slogan || ''} onChange={e => form.setField('slogan', e.target.value)} />
              </div>
              <div className="form-field">
                <label>{t('Backoffice.Copyright')} <span className="text-danger">*</span></label>
                <input className="form-control" value={form.form.copyrightText || ''} onChange={e => form.setField('copyrightText', e.target.value)} />
              </div>
              <div className="form-field">
                <label>{t('Backoffice.NavigationTitle')} <span className="text-danger">*</span></label>
                <input className="form-control" value={form.form.navigationTitle || ''} onChange={e => form.setField('navigationTitle', e.target.value)} />
              </div>
              <div className="form-field">
                <label>{t('Backoffice.ContactTitle')} <span className="text-danger">*</span></label>
                <input className="form-control" value={form.form.contactTitle || ''} onChange={e => form.setField('contactTitle', e.target.value)} />
              </div>
              <div className="form-field full">
                <label>{t('Backoffice.ContactEmail')}</label>
                <input type="email" className="form-control" value={form.form.contactEmail || ''} onChange={e => form.setField('contactEmail', e.target.value)} />
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="form-section-title"><i className="fas fa-link" /> {t('Backoffice.FooterNavLinks')}</div>
            {list('footerNavLinks').map((item, i) => (
              <div key={i} className="repeat-row">
                <div className="form-field span-5">
                  <label>{t('Backoffice.NavLabel')}</label>
                  <input className="form-control" value={item.label || ''} onChange={e => updateListItem('footerNavLinks', i, 'label', e.target.value)} />
                </div>
                <div className="form-field span-6">
                  <label>{t('Backoffice.SectionId')}</label>
                  <input className="form-control" value={item.sectionId || ''} onChange={e => updateListItem('footerNavLinks', i, 'sectionId', e.target.value)} />
                </div>
                <button type="button" className="btn btn-sm btn-danger btn-remove" onClick={() => removeListItem('footerNavLinks', i)} aria-label={t('Backoffice.Delete')}>
                  <i className="fas fa-times" />
                </button>
              </div>
            ))}
            <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => addList('footerNavLinks', { label: '', sectionId: '' })}>
              <i className="fas fa-plus" /> {t('Backoffice.AddFooterNav')}
            </button>
          </div>

          <div className="form-section">
            <div className="form-section-title"><i className="fas fa-gavel" /> {t('Backoffice.LegalLinks')}</div>
            {list('legalLinks').map((item, i) => (
              <div key={i} className="repeat-row">
                <div className="form-field span-5">
                  <label>{t('Backoffice.NavLabel')}</label>
                  <input className="form-control" value={item.label || ''} onChange={e => updateListItem('legalLinks', i, 'label', e.target.value)} />
                </div>
                <div className="form-field span-6">
                  <label>URL</label>
                  <input className="form-control" value={item.url || ''} onChange={e => updateListItem('legalLinks', i, 'url', e.target.value)} />
                </div>
                <button type="button" className="btn btn-sm btn-danger btn-remove" onClick={() => removeListItem('legalLinks', i)} aria-label={t('Backoffice.Delete')}>
                  <i className="fas fa-times" />
                </button>
              </div>
            ))}
            <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => addList('legalLinks', { label: '', url: '#' })}>
              <i className="fas fa-plus" /> {t('Backoffice.AddLegalLink')}
            </button>
          </div>

          <div className="form-section">
            <div className="form-section-title"><i className="fas fa-share-alt" /> {t('Backoffice.SocialLinks')}</div>
            {list('socialLinks').map((item, i) => (
              <div key={i} className="repeat-row">
                <div className="form-field span-3">
                  <label>{t('Backoffice.Platform')}</label>
                  <input className="form-control" value={item.platform || ''} onChange={e => updateListItem('socialLinks', i, 'platform', e.target.value)} />
                </div>
                <div className="form-field span-3">
                  <label>{t('Backoffice.SocialLabel')}</label>
                  <input className="form-control" value={item.label || ''} onChange={e => updateListItem('socialLinks', i, 'label', e.target.value)} />
                </div>
                <div className="form-field span-4">
                  <label>URL</label>
                  <input className="form-control" value={item.url || ''} onChange={e => updateListItem('socialLinks', i, 'url', e.target.value)} />
                </div>
                <div className="form-field span-2">
                  <label>{t('Backoffice.Icon')}</label>
                  <input className="form-control" placeholder="fab fa-..." value={item.icon || ''} onChange={e => updateListItem('socialLinks', i, 'icon', e.target.value)} />
                </div>
                <button type="button" className="btn btn-sm btn-danger btn-remove" onClick={() => removeListItem('socialLinks', i)} aria-label={t('Backoffice.Delete')}>
                  <i className="fas fa-times" />
                </button>
              </div>
            ))}
            <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => addList('socialLinks', { platform: '', url: '', icon: '', label: '' })}>
              <i className="fas fa-plus" /> {t('Backoffice.AddSocialLink')}
            </button>
          </div>
        </>
      )}

      <div className="form-section">
        <div className="form-section-title"><i className="fas fa-sliders-h" /> {t('Backoffice.General')}</div>
        <div className="form-grid">
          <div className="form-field">
            <label>{sectionKey === 'footer' ? t('Backoffice.LogoURL') : t('Backoffice.ImageURL')}</label>
            <input className="form-control" value={form.form.imageUrl || ''} onChange={e => form.setField('imageUrl', e.target.value)} />
          </div>
          {(sectionKey === 'banner' || sectionKey === 'about') && (
            <div className="form-field">
              <label>{t('Backoffice.VideoURL')}</label>
              <input className="form-control" value={form.form.videoUrl || ''} onChange={e => form.setField('videoUrl', e.target.value)} />
            </div>
          )}
          <div className="form-field">
            <label>{t('Backoffice.SortOrder')}</label>
            <input type="number" className="form-control" value={form.form.sortOrder ?? 0} onChange={e => form.setField('sortOrder', parseInt(e.target.value) || 0)} />
          </div>
        </div>
        <label className="checkbox-field">
          <input type="checkbox" checked={form.form.isActive ?? true} onChange={e => form.setField('isActive', e.target.checked)} />
          {t('Backoffice.Active')}
        </label>
      </div>
    </EntityFormPage>
  );
}
