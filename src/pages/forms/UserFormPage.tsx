import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import EntityFormPage from '../../components/EntityFormPage';
import { useEntityForm } from '../../hooks/useEntityForm';
import userService, { type AdminUser, type UserRole } from '../../services/user.service';

const emptyUser = (): Partial<AdminUser> => ({
  name: '',
  email: '',
  hash: '',
  phone: '',
  address: '',
  role: 'user',
  is_active: true,
});

export default function UserFormPage() {
  const { t } = useTranslation();
  const { id } = useParams();

  const form = useEntityForm<AdminUser>({
    service: userService,
    id,
    empty: emptyUser,
    backTo: '/users',
    createdMessage: t('Backoffice.Created'),
    updatedMessage: t('Backoffice.Updated'),
    errorMessage: t('Backoffice.Error'),
    validate: current => {
      const errors: string[] = [];
      if (!current.name?.trim()) errors.push(t('Backoffice.NameRequired'));
      if (!current.email?.trim()) errors.push(t('Backoffice.EmailRequired'));
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(current.email)) errors.push(t('Backoffice.InvalidEmail'));
      if (!current.phone?.trim()) errors.push(t('Backoffice.PhoneRequired'));
      if (!current.address?.trim()) errors.push(t('Backoffice.AddressRequired'));
      if (!current.id) {
        if (!current.hash?.trim()) errors.push(t('Backoffice.PasswordRequired'));
        else if (current.hash.trim().length < 8) errors.push(t('Backoffice.PasswordMinLength'));
      } else if (current.hash?.trim() && current.hash.trim().length < 8) {
        errors.push(t('Backoffice.PasswordMinLength'));
      }
      return errors;
    },
    transform: current => {
      // La API usa whitelist estricta: no acepta id ni fechas en el body.
      const { id: _id, created_at, updated_at, ...rest } = current;
      void _id; void created_at; void updated_at;
      const payload: Partial<AdminUser> = { ...rest, role: rest.role || 'user' };
      // La API no devuelve el hash, así que el campo empieza vacío.
      // Solo se envía si el usuario escribió una contraseña nueva; vacío = no cambiar.
      if (!payload.hash?.trim()) delete payload.hash;
      return payload;
    },
  });

  return (
    <EntityFormPage
      title={form.isNew ? t('Backoffice.CreateNewUser') : `${t('Backoffice.Edit')} ${t('Backoffice.User')}`}
      subtitle={t('Backoffice.Users')}
      backTo="/users"
      loading={form.loading}
      saving={form.saving}
      message={form.message}
      validationErrors={form.validationErrors}
      onSubmit={form.submit}
      onCancel={form.cancel}
    >
      <div className="form-grid">
        <div className="form-field">
          <label>{t('Backoffice.Name')} <span className="text-danger">*</span></label>
          <input className="form-control" value={form.form.name || ''} onChange={e => form.setField('name', e.target.value)} />
        </div>
        <div className="form-field">
          <label>{t('Backoffice.Email')} <span className="text-danger">*</span></label>
          <input type="email" className="form-control" value={form.form.email || ''} onChange={e => form.setField('email', e.target.value)} />
        </div>
        <div className="form-field">
          <label>
            {form.isNew ? t('Backoffice.Password') : t('Backoffice.NewPassword')}
            {form.isNew && <span className="text-danger"> *</span>}
          </label>
          <input
            type="password"
            className="form-control"
            autoComplete="new-password"
            value={form.form.hash || ''}
            onChange={e => form.setField('hash', e.target.value)}
            placeholder={form.isNew ? '' : t('Backoffice.LeaveBlank')}
          />
        </div>
        <div className="form-field">
          <label>{t('Backoffice.Phone')} <span className="text-danger">*</span></label>
          <input className="form-control" value={form.form.phone || ''} onChange={e => form.setField('phone', e.target.value)} />
        </div>
        <div className="form-field full">
          <label>{t('Backoffice.Address')} <span className="text-danger">*</span></label>
          <input className="form-control" value={form.form.address || ''} onChange={e => form.setField('address', e.target.value)} />
        </div>
        <div className="form-field">
          <label>{t('Backoffice.Role')}</label>
          <select
            className="form-control"
            value={form.form.role || 'user'}
            onChange={e => form.setField('role', e.target.value as UserRole)}
          >
            <option value="user">{t('Backoffice.RoleUser')}</option>
            <option value="admin">{t('Backoffice.RoleAdmin')}</option>
          </select>
        </div>
      </div>

      <div className="form-section">
        <label className="checkbox-field">
          <input type="checkbox" checked={form.form.is_active ?? true} onChange={e => form.setField('is_active', e.target.checked)} />
          {t('Backoffice.Active')}
        </label>
        {form.form.role === 'admin' && (
          <p className="entity-form-subtitle" style={{ marginTop: 10 }}>
            <i className="fas fa-info-circle" /> {t('Backoffice.AdminRoleHint')}
          </p>
        )}
      </div>
    </EntityFormPage>
  );
}
