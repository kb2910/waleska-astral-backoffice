import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Content from './pages/Content';
import Services from './pages/Services';
import Products from './pages/Products';
import Promotions from './pages/Promotions';
import Bookings from './pages/Bookings';
import Testimonials from './pages/Testimonials';
import Settings from './pages/Settings';
import ChatConfig from './pages/ChatConfig';
import Media from './pages/Media';
import Users from './pages/Users';
import ContentFormPage from './pages/forms/ContentFormPage';
import ServiceFormPage from './pages/forms/ServiceFormPage';
import ProductFormPage from './pages/forms/ProductFormPage';
import PromotionFormPage from './pages/forms/PromotionFormPage';
import TestimonialFormPage from './pages/forms/TestimonialFormPage';
import ChatConfigFormPage from './pages/forms/ChatConfigFormPage';
import BookingFormPage from './pages/forms/BookingFormPage';
import UserFormPage from './pages/forms/UserFormPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="loading-screen"><i className="fas fa-spinner fa-spin fa-2x" /></div>;
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="content" element={<Content />} />
          <Route path="content/new/:sectionKey" element={<ContentFormPage />} />
          <Route path="content/:id/edit" element={<ContentFormPage />} />
          <Route path="services" element={<Services />} />
          <Route path="services/new" element={<ServiceFormPage />} />
          <Route path="services/:id/edit" element={<ServiceFormPage />} />
          <Route path="products" element={<Products />} />
          <Route path="products/new" element={<ProductFormPage />} />
          <Route path="products/:id/edit" element={<ProductFormPage />} />
          <Route path="promotions" element={<Promotions />} />
          <Route path="promotions/new" element={<PromotionFormPage />} />
          <Route path="promotions/:id/edit" element={<PromotionFormPage />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="bookings/:id/edit" element={<BookingFormPage />} />
          <Route path="testimonials" element={<Testimonials />} />
          <Route path="testimonials/new" element={<TestimonialFormPage />} />
          <Route path="testimonials/:id/edit" element={<TestimonialFormPage />} />
          <Route path="settings" element={<Settings />} />
          <Route path="chat-config" element={<ChatConfig />} />
          <Route path="chat-config/new" element={<ChatConfigFormPage />} />
          <Route path="chat-config/:id/edit" element={<ChatConfigFormPage />} />
          <Route path="media" element={<Media />} />
          <Route path="users" element={<Users />} />
          <Route path="users/new" element={<UserFormPage />} />
          <Route path="users/:id/edit" element={<UserFormPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
