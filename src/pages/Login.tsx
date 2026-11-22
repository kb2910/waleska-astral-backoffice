import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';

export default function Login() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login({ email, password });
      navigate('/');
    } catch {
      setError(t('Backoffice.InvalidCredentials'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-brand">
          <img src="/favicon.ico" alt="Logo" style={{ width: '100px', height: '100px' }} />
        </div>
        <h3 className="login-title">Waleska Astral</h3>
        <p className="login-subtitle">{t('Backoffice.AdminPanel')}</p>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t('Backoffice.Email')}</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Correo electrónico"
              required
            />
          </div>
          <div className="form-group">
            <label>{t('Backoffice.Password')}</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={t('Backoffice.Password')}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block login-btn" disabled={loading}>
            {loading ? (
              <><i className="fas fa-spinner fa-spin" /> {t('Backoffice.LoggingIn')}</>
            ) : (
              <><i className="fas fa-sign-in-alt" /> {t('Backoffice.Login')}</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
