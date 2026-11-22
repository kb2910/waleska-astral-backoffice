import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import EntityFormPage from '../../components/EntityFormPage';
import { useEntityForm } from '../../hooks/useEntityForm';
import serviceService, { type ServiceEntity } from '../../services/service.service';

const emptyService = (): Partial<ServiceEntity> => ({
  title: '', tab: '', language: 'es', duration: '', price: '',
  categorySlug: '', shortDescription: '', description: '',
  isActive: true, isFeatured: false, showInHeader: false, sortOrder: 0,
});

export default function ServiceFormPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const form = useEntityForm<ServiceEntity>({
    service: serviceService,
    id,
    empty: emptyService,
    backTo: '/services',
    createdMessage: t('Backoffice.Created'),
    updatedMessage: t('Backoffice.Updated'),
    errorMessage: t('Backoffice.Error'),
  });

  return (
    <EntityFormPage
      title={form.isNew ? t('Backoffice.CreateNewService') : `${t('Backoffice.Edit')} ${t('Backoffice.Service')}`}
      subtitle={t('Backoffice.Services')}
      backTo="/services"
      loading={form.loading}
      saving={form.saving}
      message={form.message}
      onSubmit={form.submit}
      onCancel={form.cancel}
    >
      <div className="form-grid">
        <div className="form-field">
          <label>{t('Backoffice.Title')}</label>
          <input className="form-control" value={form.form.title || ''} onChange={e => form.setField('title', e.target.value)} />
        </div>
        <div className="form-field">
          <label>{t('Backoffice.Tab')}</label>
          <input className="form-control" value={form.form.tab || ''} onChange={e => form.setField('tab', e.target.value)} placeholder="e.g. tarot, consultas" />
        </div>
        <div className="form-field">
          <label>{t('Backoffice.Language')}</label>
          <select className="form-control" value={form.form.language || 'es'} onChange={e => form.setField('language', e.target.value)}>
            <option value="es">Español</option>
            <option value="en">English</option>
          </select>
        </div>
        <div className="form-field">
          <label>{t('Backoffice.Duration')}</label>
          <input className="form-control" value={form.form.duration || ''} onChange={e => form.setField('duration', e.target.value)} placeholder="e.g. 60 min" />
        </div>
        <div className="form-field">
          <label>{t('Backoffice.Price')}</label>
          <input className="form-control" value={form.form.price || ''} onChange={e => form.setField('price', e.target.value)} placeholder="$100" />
        </div>
        <div className="form-field">
          <label>{t('Backoffice.CategorySlug')}</label>
          <input className="form-control" value={form.form.categorySlug || ''} onChange={e => form.setField('categorySlug', e.target.value)} />
        </div>
        <div className="form-field full">
          <label>{t('Backoffice.ShortDescription')}</label>
          <textarea className="form-control" rows={2} value={form.form.shortDescription || ''} onChange={e => form.setField('shortDescription', e.target.value)} />
        </div>
        <div className="form-field full">
          <label>{t('Backoffice.Description')}</label>
          <textarea className="form-control" rows={4} value={form.form.description || ''} onChange={e => form.setField('description', e.target.value)} />
        </div>
        <div className="form-field">
          <label>{t('Backoffice.SortOrder')}</label>
          <input type="number" className="form-control" value={form.form.sortOrder ?? 0} onChange={e => form.setField('sortOrder', parseInt(e.target.value) || 0)} />
        </div>
      </div>

      <div className="form-section">
        <div className="form-section-title"><i className="fas fa-toggle-on" /> {t('Backoffice.Actions')}</div>
        <div className="checkbox-grid">
          <label className="checkbox-field">
            <input type="checkbox" checked={form.form.isActive ?? true} onChange={e => form.setField('isActive', e.target.checked)} />
            {t('Backoffice.Active')}
          </label>
          <label className="checkbox-field">
            <input type="checkbox" checked={form.form.isFeatured ?? false} onChange={e => form.setField('isFeatured', e.target.checked)} />
            {t('Backoffice.Featured')}
          </label>
          <label className="checkbox-field">
            <input type="checkbox" checked={form.form.showInHeader ?? false} onChange={e => form.setField('showInHeader', e.target.checked)} />
            {t('Backoffice.ShowInHeader')}
          </label>
        </div>
      </div>
    </EntityFormPage>
  );
}
