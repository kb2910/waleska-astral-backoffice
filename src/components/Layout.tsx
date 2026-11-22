import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import './Layout.css';

const NAV_ITEMS = [
  { labelKey: 'Backoffice.Dashboard', icon: 'fas fa-tachometer-alt', route: '/', keywords: 'dashboard panel inicio home' },
  { labelKey: 'Backoffice.Content', icon: 'fas fa-file-alt', route: '/content', keywords: 'content contenido texto banner about header footer' },
  { labelKey: 'Backoffice.Services', icon: 'fas fa-concierge-bell', route: '/services', keywords: 'services servicios sesiones carta tirada tarot' },
  //{ labelKey: 'Backoffice.Products', icon: 'fas fa-box', route: '/products', keywords: 'products productos tarot curso deck' },
  { labelKey: 'Backoffice.Promotions', icon: 'fas fa-tags', route: '/promotions', keywords: 'promotions promociones descuento coupon' },
  { labelKey: 'Backoffice.Bookings', icon: 'fas fa-calendar-check', route: '/bookings', keywords: 'bookings reservas citas calendar' },
  { labelKey: 'Backoffice.Testimonials', icon: 'fas fa-quote-right', route: '/testimonials', keywords: 'testimonials testimonios reviews' },
  { labelKey: 'Backoffice.Settings', icon: 'fas fa-cog', route: '/settings', keywords: 'settings configuracion config setup' },
  { labelKey: 'Backoffice.ChatConfig', icon: 'fas fa-robot', route: '/chat-config', keywords: 'chat config bot ai inteligencia' },
  { labelKey: 'Backoffice.Media', icon: 'fas fa-images', route: '/media', keywords: 'media imagenes archivos upload' },
  { labelKey: 'Backoffice.Users', icon: 'fas fa-users', route: '/users', keywords: 'users usuarios admin roles acceso login' },
];

export default function Layout() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { lang, changeLang } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');

  // El drawer se cierra al cambiar de pantalla (también desde enlaces del dashboard).
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const filtered = NAV_ITEMS.filter(item => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const label = t(item.labelKey).toLowerCase();
    return label.includes(q) || item.keywords.includes(q);
  });

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className={`layout ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
      {mobileOpen && (
        <button
          type="button"
          className="sidebar-backdrop"
          aria-label={t('Backoffice.CloseMenu')}
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside className="sidebar">
        <div className="sidebar-brand">
          {!collapsed && <h4>{t('Backoffice.AdminPanel')}</h4>}
          {collapsed && <h4>{t('Backoffice.AdminPanelShort')}</h4>}
          <button className="btn-toggle" onClick={() => setCollapsed(!collapsed)} title={collapsed ? t('Backoffice.OpenMenu') : t('Backoffice.CloseMenu')}>
            <i className={`fas ${collapsed ? 'fa-angle-right' : 'fa-angle-left'}`} />
          </button>
          <button className="sidebar-close" onClick={() => setMobileOpen(false)} aria-label={t('Backoffice.CloseMenu')}>
            <i className="fas fa-times" />
          </button>
        </div>
        {!collapsed && (
          <div className="sidebar-search">
            <div className="search-wrapper">
              <i className="fas fa-search search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder={t('Backoffice.Search')}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && <i className="fas fa-times search-clear" onClick={() => setSearch('')} />}
            </div>
          </div>
        )}
        <nav className="sidebar-nav">
          {filtered.map(item => (
            <NavLink
              key={item.route}
              to={item.route}
              end={item.route === '/'}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              <i className={item.icon} />
              {!collapsed && <span>{t(item.labelKey)}</span>}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="main-area">
        <header className="topbar">
          <div className="topbar-title">
            <button
              type="button"
              className="mobile-menu-toggle"
              aria-label={t('Backoffice.OpenMenu')}
              onClick={() => setMobileOpen(true)}
            >
              <i className="fas fa-bars" />
            </button>
            <h5>Waleska Astral - {t('Backoffice.AdminPanel')}</h5>
          </div>
          <div className="topbar-actions">
            <div className="lang-switcher">
              <span className={`lang-pill ${lang === 'es' ? 'active' : ''}`} onClick={() => changeLang('es')}>ES</span>
              <span className={`lang-pill ${lang === 'en' ? 'active' : ''}`} onClick={() => changeLang('en')}>EN</span>
            </div>
            <a href="/" target="_blank" rel="noreferrer" className="btn-view-site">
              <i className="fas fa-external-link-alt" /> {t('Backoffice.ViewSite')}
            </a>
            <span className="user-email">{user?.email}</span>
            <button className="btn-logout" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt" /> {t('Backoffice.Logout')}
            </button>
          </div>
        </header>
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
