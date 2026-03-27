import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Layout Components
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Blog from './pages/Blog';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ClientDashboard from './pages/ClientDashboard';
import AdminDashboard from './pages/AdminDashboard';

// New Pages
import Services from './pages/Services';
import About from './pages/About';
import ArticlePage from './pages/ArticlePage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              {/* ── Routes publiques ── */}
              <Route path="/" element={<Home />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<ArticlePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/services" element={<Services />} />
              <Route path="/webapp" element={<Navigate to="/client" replace />} />
              <Route path="/about" element={<About />} />

              {/* ── Routes protégées - Client ── */}
              <Route
                path="/client"
                element={
                  <ProtectedRoute>
                    <ClientDashboard />
                  </ProtectedRoute>
                }
              />

              {/* ── Routes protégées - Admin ── */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* ── 404 ── */}
              <Route
                path="*"
                element={
                  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--c-bg)', position: 'relative', overflow: 'hidden' }}>
                    <div className="geo-bg" />
                    <div style={{ textAlign: 'center', position: 'relative' }}>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '8rem', fontWeight: 700, color: 'var(--c-border)', lineHeight: 1 }}>404</div>
                      <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', color: 'var(--c-white)', marginBottom: '1rem' }}>Page introuvable</h1>
                      <p style={{ color: 'var(--c-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>La page que vous cherchez n'existe pas ou a été déplacée.</p>
                      <a href="/" className="btn-primary">Retour à l'accueil</a>
                    </div>
                  </div>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;