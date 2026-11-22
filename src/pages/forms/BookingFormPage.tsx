import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import EntityFormPage from '../../components/EntityFormPage';
import { useEntityForm } from '../../hooks/useEntityForm';
import bookingService, { type Booking } from '../../services/booking.service';

export default function BookingFormPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const form = useEntityForm<Booking>({
    service: bookingService,
    id,
    empty: () => ({}),
    backTo: '/bookings',
    createdMessage: t('Backoffice.Created'),
    updatedMessage: t('Backoffice.Updated'),
    errorMessage: t('Backoffice.Error'),
  });

  return (
    <EntityFormPage
      title={t('Backoffice.EditBooking')}
      subtitle={t('Backoffice.BookingDetails')}
      backTo="/bookings"
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
          <label>{t('Backoffice.Email')}</label>
          <input type="email" className="form-control" value={form.form.clientEmail || ''} onChange={e => form.setField('clientEmail', e.target.value)} />
        </div>
        <div className="form-field">
          <label>{t('Backoffice.Phone')}</label>
          <input className="form-control" value={form.form.clientPhone || ''} onChange={e => form.setField('clientPhone', e.target.value)} />
        </div>
        <div className="form-field">
          <label>{t('Backoffice.ServiceTitle')}</label>
          <input className="form-control" value={form.form.serviceTitle || ''} onChange={e => form.setField('serviceTitle', e.target.value)} />
        </div>
        <div className="form-field">
          <label>{t('Backoffice.Date')}</label>
          <input type="date" className="form-control" value={form.form.appointmentDate || ''} onChange={e => form.setField('appointmentDate', e.target.value)} />
        </div>
        <div className="form-field">
          <label>{t('Backoffice.Time')}</label>
          <input className="form-control" value={form.form.appointmentTime || ''} onChange={e => form.setField('appointmentTime', e.target.value)} />
        </div>
        <div className="form-field">
          <label>{t('Backoffice.Status')}</label>
          <select className="form-control" value={form.form.status || 'pending'} onChange={e => form.setField('status', e.target.value)}>
            <option value="pending">{t('Backoffice.Pending')}</option>
            <option value="confirmed">{t('Backoffice.Confirmed')}</option>
            <option value="completed">{t('Backoffice.Completed')}</option>
            <option value="cancelled">{t('Backoffice.Cancelled')}</option>
          </select>
        </div>
        <div className="form-field">
          <label>{t('Backoffice.Timezone')}</label>
          <input className="form-control" value={form.form.timezone || ''} onChange={e => form.setField('timezone', e.target.value)} />
        </div>
        <div className="form-field full">
          <label>{t('Backoffice.Notes')}</label>
          <textarea className="form-control" rows={5} value={form.form.notes || ''} onChange={e => form.setField('notes', e.target.value)} />
        </div>
      </div>
    </EntityFormPage>
  );
}
