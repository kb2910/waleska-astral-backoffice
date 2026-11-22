import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import EntityFormPage from '../../components/EntityFormPage';
import { useEntityForm } from '../../hooks/useEntityForm';
import testimonialService, { type Testimonial } from '../../services/testimonial.service';

const emptyTestimonial = (): Partial<Testimonial> => ({
  clientName: '', language: 'es', rating: 5, content: '',
  clientAvatar: '', isActive: true, sortOrder: 0,
});

export default function TestimonialFormPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const form = useEntityForm<Testimonial>({
    service: testimonialService,
    id,
    empty: emptyTestimonial,
    backTo: '/testimonials',
    createdMessage: t('Backoffice.Created'),
    updatedMessage: t('Backoffice.Updated'),
    errorMessage: t('Backoffice.Error'),
  });

  return (
    <EntityFormPage
      title={form.isNew ? t('Backoffice.CreateNewTestimonial') : `${t('Backoffice.Edit')} ${t('Backoffice.Testimonial')}`}
      subtitle={t('Backoffice.Testimonials')}
      backTo="/testimonials"
      loading={form.loading}
      saving={form.saving}
      message={form.message}
      onSubmit={form.submit}
      onCancel={form.cancel}
    >
      <div className="form-grid">
        <div className="form-field">
          <label>{t('Backoffice.ClientName')}</label>
          <input className="form-control" value={form.form.clientName || ''} onChange={e => form.setField('clientName', e.target.value)} />
        </div>
        <div className="form-field">
          <label>{t('Backoffice.Language')}</label>
          <select className="form-control" value={form.form.language || 'es'} onChange={e => form.setField('language', e.target.value)}>
            <option value="es">Español</option>
            <option value="en">English</option>
          </select>
        </div>
        <div className="form-field">
          <label>{t('Backoffice.Rating')}</label>
          <div className="star-rating">
            {Array.from({ length: 5 }, (_, i) => (
              <button
                type="button"
                key={i}
                aria-label={`${i + 1} ${t('Backoffice.Rating')}`}
                onClick={() => form.setField('rating', i + 1)}
              >
                <i className="fas fa-star" style={{ color: i < (form.form.rating || 5) ? '#ffc107' : '#333' }} />
              </button>
            ))}
          </div>
        </div>
        <div className="form-field">
          <label>{t('Backoffice.SortOrder')}</label>
          <input type="number" className="form-control" value={form.form.sortOrder ?? 0} onChange={e => form.setField('sortOrder', parseInt(e.target.value) || 0)} />
        </div>
        <div className="form-field full">
          <label>{t('Backoffice.Content')}</label>
          <textarea className="form-control" rows={5} value={form.form.content || ''} onChange={e => form.setField('content', e.target.value)} />
        </div>
        <div className="form-field full">
          <label>{t('Backoffice.AvatarURL')}</label>
          <input className="form-control" value={form.form.clientAvatar || ''} onChange={e => form.setField('clientAvatar', e.target.value)} placeholder="https://..." />
        </div>
      </div>

      <div className="form-section">
        <label className="checkbox-field">
          <input type="checkbox" checked={form.form.isActive ?? true} onChange={e => form.setField('isActive', e.target.checked)} />
          {t('Backoffice.Active')}
        </label>
      </div>
    </EntityFormPage>
  );
}
