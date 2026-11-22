import type { FormEvent, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import './EntityFormPage.css';

interface EntityFormPageProps {
  title: string;
  subtitle?: string;
  backTo: string;
  backLabel?: string;
  loading?: boolean;
  saving?: boolean;
  message?: string;
  validationErrors?: string[];
  onSubmit: (event: FormEvent) => void;
  onCancel: () => void;
  children: ReactNode;
}

/** Estructura común de todas las pantallas nuevas de crear/editar. */
export default function EntityFormPage({
  title,
  subtitle,
  backTo,
  backLabel,
  loading,
  saving,
  message,
  validationErrors = [],
  onSubmit,
  onCancel,
  children,
}: EntityFormPageProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isError = Boolean(message?.startsWith(t('Backoffice.Error')));

  return (
    <div className="entity-form-page">
      <div className="page-header entity-form-header">
        <div className="entity-form-heading">
          <button type="button" className="back-link" onClick={() => backTo ? onCancel() : navigate(-1)}>
            <i className="fas fa-arrow-left" /> {backLabel || t('Backoffice.BackToList')}
          </button>
          <h4>{title}</h4>
          {subtitle && <p className="entity-form-subtitle">{subtitle}</p>}
        </div>
      </div>

      {message && (
        <div className={`alert ${isError ? 'alert-danger' : 'alert-success'}`}>{message}</div>
      )}

      {validationErrors.length > 0 && (
        <div className="alert alert-danger">
          <ul className="validation-list">
            {validationErrors.map((error, index) => <li key={index}>{error}</li>)}
          </ul>
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <i className="fas fa-spinner fa-spin fa-2x" style={{ color: '#7122d0' }} />
        </div>
      ) : (
        <form className="edit-card entity-form-card" onSubmit={onSubmit} noValidate>
          <div className="card-header-custom entity-form-card-header">
            <i className="fas fa-edit" /> {title}
          </div>
          <div className="card-body-custom entity-form-card-body">
            {children}
          </div>
          <div className="form-actions form-actions-sticky">
            <button type="submit" className="btn btn-success" disabled={saving}>
              <i className="fas fa-save" /> {saving ? t('Backoffice.Saving') : t('Backoffice.Save')}
            </button>
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              {t('Backoffice.Cancel')}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
