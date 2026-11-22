import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import EntityFormPage from '../../components/EntityFormPage';
import { useEntityForm } from '../../hooks/useEntityForm';
import promotionService, { type Promotion } from '../../services/promotion.service';

const emptyPromotion = (): Partial<Promotion> => ({
  code: '', title: '', language: 'es', discountType: 'percentage',
  discountValue: 0, minPurchase: 0, maxUses: 0, startDate: '',
  endDate: '', bannerImageUrl: '', isActive: true,
});

export default function PromotionFormPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const form = useEntityForm<Promotion>({
    service: promotionService,
    id,
    empty: emptyPromotion,
    backTo: '/promotions',
    createdMessage: t('Backoffice.Created'),
    updatedMessage: t('Backoffice.Updated'),
    errorMessage: t('Backoffice.Error'),
  });

  return (
    <EntityFormPage
      title={form.isNew ? t('Backoffice.CreateNewPromotion') : `${t('Backoffice.Edit')} ${t('Backoffice.Promotion')}`}
      subtitle={t('Backoffice.Promotions')}
      backTo="/promotions"
      loading={form.loading}
      saving={form.saving}
      message={form.message}
      onSubmit={form.submit}
      onCancel={form.cancel}
    >
      <div className="form-grid">
        <div className="form-field">
          <label>{t('Backoffice.Code')}</label>
          <input className="form-control" value={form.form.code || ''} onChange={e => form.setField('code', e.target.value)} placeholder="e.g. LUNA20" />
        </div>
        <div className="form-field">
          <label>{t('Backoffice.Title')}</label>
          <input className="form-control" value={form.form.title || ''} onChange={e => form.setField('title', e.target.value)} />
        </div>
        <div className="form-field">
          <label>{t('Backoffice.Language')}</label>
          <select className="form-control" value={form.form.language || 'es'} onChange={e => form.setField('language', e.target.value)}>
            <option value="es">Español</option>
            <option value="en">English</option>
          </select>
        </div>
        <div className="form-field">
          <label>{t('Backoffice.DiscountType')}</label>
          <select className="form-control" value={form.form.discountType || 'percentage'} onChange={e => form.setField('discountType', e.target.value)}>
            <option value="percentage">{t('Backoffice.Percentage')}</option>
            <option value="fixed">{t('Backoffice.Fixed')}</option>
          </select>
        </div>
        <div className="form-field">
          <label>{t('Backoffice.DiscountValue')}</label>
          <input type="number" className="form-control" value={form.form.discountValue ?? 0} onChange={e => form.setField('discountValue', parseFloat(e.target.value) || 0)} />
        </div>
        <div className="form-field">
          <label>{t('Backoffice.MinPurchase')}</label>
          <input type="number" className="form-control" value={form.form.minPurchase ?? 0} onChange={e => form.setField('minPurchase', parseFloat(e.target.value) || 0)} />
        </div>
        <div className="form-field">
          <label>{t('Backoffice.MaxUses')}</label>
          <input type="number" className="form-control" value={form.form.maxUses ?? 0} onChange={e => form.setField('maxUses', parseInt(e.target.value) || 0)} />
        </div>
        <div className="form-field">
          <label>{t('Backoffice.BannerImageURL')}</label>
          <input className="form-control" value={form.form.bannerImageUrl || ''} onChange={e => form.setField('bannerImageUrl', e.target.value)} />
        </div>
        <div className="form-field">
          <label>{t('Backoffice.StartDate')}</label>
          <input type="date" className="form-control" value={form.form.startDate || ''} onChange={e => form.setField('startDate', e.target.value)} />
        </div>
        <div className="form-field">
          <label>{t('Backoffice.EndDate')}</label>
          <input type="date" className="form-control" value={form.form.endDate || ''} onChange={e => form.setField('endDate', e.target.value)} />
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
