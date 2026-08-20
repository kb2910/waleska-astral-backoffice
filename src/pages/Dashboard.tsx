import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import serviceService from '../services/service.service';
import productService from '../services/product.service';
import bookingService from '../services/booking.service';
import testimonialService from '../services/testimonial.service';
import promotionService from '../services/promotion.service';
import './Dashboard.css';

export default function Dashboard() {
  const { t } = useTranslation();
  const [stats, setStats] = useState({ services: 0, products: 0, bookings: 0, testimonials: 0, promotions: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      serviceService.getAll().catch(() => ({ data: [] })),
      productService.getAll().catch(() => ({ data: [] })),
      bookingService.getAll().catch(() => ({ data: [] })),
      testimonialService.getAll().catch(() => ({ data: [] })),
      promotionService.getAll().catch(() => ({ data: [] })),
    ]).then(([s, p, b, t, pr]) => {
      setStats({
        services: Array.isArray(s?.data) ? s.data.length : 0,
        products: Array.isArray(p?.data) ? p.data.length : 0,
        bookings: Array.isArray(b?.data) ? b.data.length : 0,
        testimonials: Array.isArray(t?.data) ? t.data.length : 0,
        promotions: Array.isArray(pr?.data) ? pr.data.length : 0,
      });
      setLoading(false);
    });
  }, []);

  const cards = [
    { label: t('Backoffice.Services'), value: stats.services, icon: 'fas fa-concierge-bell', route: '/services', color: 'purple' },
    { label: t('Backoffice.Products'), value: stats.products, icon: 'fas fa-box', route: '/products', color: 'green' },
    { label: t('Backoffice.Bookings'), value: stats.bookings, icon: 'fas fa-calendar-check', route: '/bookings', color: 'yellow' },
    { label: t('Backoffice.Testimonials'), value: stats.testimonials, icon: 'fas fa-quote-right', route: '/testimonials', color: 'blue' },
    { label: t('Backoffice.Promotions'), value: stats.promotions, icon: 'fas fa-tags', route: '/promotions', color: 'red' },
  ];

  const actions = [
    { label: t('Backoffice.EditContent'), icon: 'fas fa-file-alt', route: '/content', color: 'primary' },
    { label: t('Backoffice.AddService'), icon: 'fas fa-plus', route: '/services', color: 'success' },
    { label: t('Backoffice.ViewBookings'), icon: 'fas fa-calendar', route: '/bookings', color: 'warning' },
    { label: t('Backoffice.UploadMedia'), icon: 'fas fa-upload', route: '/media', color: 'info' },
  ];

  return (
    <div className="dashboard">
      <h4 className="page-title">{t('Backoffice.Dashboard')}</h4>
      {loading ? (
        <div className="text-center py-5"><i className="fas fa-spinner fa-spin fa-2x" style={{ color: '#7122d0' }} /></div>
      ) : (
        <>
          <div className="stats-grid">
            {cards.map(c => (
              <Link key={c.route + c.label} to={c.route} className={`stat-card stat-${c.color}`}>
                <i className={`${c.icon} stat-icon`} />
                <h3>{c.value}</h3>
                <small>{c.label}</small>
              </Link>
            ))}
          </div>
          <h5 className="section-title">{t('Backoffice.QuickActions')}</h5>
          <div className="actions-grid">
            {actions.map(a => (
              <Link key={a.route} to={a.route} className={`btn btn-outline-${a.color} action-btn`}>
                <i className={a.icon} /> {a.label}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
