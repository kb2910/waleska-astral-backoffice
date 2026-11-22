import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import EntityFormPage from '../../components/EntityFormPage';
import { useEntityForm } from '../../hooks/useEntityForm';
import productService, { type Product } from '../../services/product.service';

const emptyProduct = (): Partial<Product> => ({
  name: '', description: '', language: 'es', type: '', price: 0,
  currency: 'USD', stock: 0, imageUrl: '', externalUrl: '',
  isActive: true, sortOrder: 0,
});

export default function ProductFormPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const form = useEntityForm<Product>({
    service: productService,
    id,
    empty: emptyProduct,
    backTo: '/products',
    createdMessage: t('Backoffice.Created'),
    updatedMessage: t('Backoffice.Updated'),
    errorMessage: t('Backoffice.Error'),
  });

  return (
    <EntityFormPage
      title={form.isNew ? t('Backoffice.CreateNewProduct') : `${t('Backoffice.Edit')} ${t('Backoffice.Product')}`}
      subtitle={t('Backoffice.Products')}
      backTo="/products"
      loading={form.loading}
      saving={form.saving}
      message={form.message}
      onSubmit={form.submit}
      onCancel={form.cancel}
    >
      <div className="form-grid">
        <div className="form-field">
          <label>{t('Backoffice.Name')}</label>
          <input className="form-control" value={form.form.name || ''} onChange={e => form.setField('name', e.target.value)} />
        </div>
        <div className="form-field">
          <label>{t('Backoffice.Type')}</label>
          <input className="form-control" value={form.form.type || ''} onChange={e => form.setField('type', e.target.value)} placeholder="e.g. tarot, curso, deck" />
        </div>
        <div className="form-field full">
          <label>{t('Backoffice.Description')}</label>
          <textarea className="form-control" rows={3} value={form.form.description || ''} onChange={e => form.setField('description', e.target.value)} />
        </div>
        <div className="form-field">
          <label>{t('Backoffice.Language')}</label>
          <select className="form-control" value={form.form.language || 'es'} onChange={e => form.setField('language', e.target.value)}>
            <option value="es">Español</option>
            <option value="en">English</option>
          </select>
        </div>
        <div className="form-field">
          <label>{t('Backoffice.Currency')}</label>
          <select className="form-control" value={form.form.currency || 'USD'} onChange={e => form.setField('currency', e.target.value)}>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="VES">VES</option>
          </select>
        </div>
        <div className="form-field">
          <label>{t('Backoffice.Price')}</label>
          <input type="number" className="form-control" value={form.form.price ?? 0} onChange={e => form.setField('price', parseFloat(e.target.value) || 0)} />
        </div>
        <div className="form-field">
          <label>{t('Backoffice.Stock')}</label>
          <input type="number" className="form-control" value={form.form.stock ?? 0} onChange={e => form.setField('stock', parseInt(e.target.value) || 0)} />
        </div>
        <div className="form-field full">
          <label>{t('Backoffice.ImageURL')}</label>
          <input className="form-control" value={form.form.imageUrl || ''} onChange={e => form.setField('imageUrl', e.target.value)} />
        </div>
        <div className="form-field full">
          <label>{t('Backoffice.ExternalURL')}</label>
          <input className="form-control" value={form.form.externalUrl || ''} onChange={e => form.setField('externalUrl', e.target.value)} />
        </div>
        <div className="form-field">
          <label>{t('Backoffice.SortOrder')}</label>
          <input type="number" className="form-control" value={form.form.sortOrder ?? 0} onChange={e => form.setField('sortOrder', parseInt(e.target.value) || 0)} />
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
