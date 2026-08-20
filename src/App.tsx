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
          <Route path="services" element={<Services />} />
          <Route path="products" element={<Products />} />
          <Route path="promotions" element={<Promotions />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="testimonials" element={<Testimonials />} />
          <Route path="settings" element={<Settings />} />
          <Route path="chat-config" element={<ChatConfig />} />
          <Route path="media" element={<Media />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
