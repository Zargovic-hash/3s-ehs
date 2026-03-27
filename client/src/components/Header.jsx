import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Menu, X, LogIn, LogOut, FileText, LayoutDashboard,
  ChevronDown, Shield, Leaf, Wind, Droplets, Flame,
  Lock, Globe, Users, ArrowRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// ── IMPORTATION DE VOTRE IMAGE ICI ──
// Ajustez le chemin selon l'emplacement réel de votre fichier image
import logo3SImage from '../assets/3s.png'; 

const serviceItems = [
  { Icon: FileText, label: "Étude d'Impact (EIE)", abbr: 'EIE', to: '/services#eie' },
  { Icon: Shield, label: 'Audit ICPE', abbr: 'ICPE', to: '/services#audit' },
  { Icon: Leaf, label: 'Plan de Gestion (PANDRU)', abbr: 'PANDRU', to: '/services#pandru' },
  { Icon: Wind, label: "Notice d'Impact (NIE)", abbr: 'NIE', to: '/services#nie' },
  { Icon: Droplets, label: 'Suivi Rejets & Émissions', abbr: 'Rejets', to: '/services#rejets' },
  { Icon: Flame, label: 'Veille Réglementaire', abbr: 'Veille', to: '/services#veille' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const dropRef = useRef(null);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setServicesOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Close menu on route change
  useEffect(() => { setIsMenuOpen(false); setServicesOpen(false); }, [location]);

  // ── FIX CONTACT : scroll vers #contact depuis n'importe quelle page ──
  const handleContactClick = (e) => {
    e.preventDefault();
    setIsMenuOpen(false);
    setServicesOpen(false);

    const scrollToContact = () => {
      const el = document.getElementById('contact');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        setTimeout(() => {
          document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      }
    };

    if (location.pathname === '/') {
      scrollToContact();
    } else {
      navigate('/', { state: { scrollTo: 'contact' } });
    }
  };

  const handleLogout = () => { logout(); navigate('/'); };
  const isActive = (href) => location.pathname === href;

  return (
    <header style={{
      background: scrolled ? 'rgba(248,249,252,0.97)' : 'transparent',
      borderBottom: scrolled ? '1px solid var(--c-border)' : '1px solid transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      transition: 'all 0.35s ease',
      position: 'sticky', top: 0, zIndex: 50,
    }}>
      <nav className="container mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* ── Logo : Version Image ── */}
          <Link to="/" className="flex items-center group" style={{ textDecoration: 'none' }}>
            <div className="transition-transform duration-300 group-hover:scale-105" style={{ display: 'flex', alignItems: 'center' }}>
              {/* L'image contient déjà le casque, le '3S' et le texte "SMART SAFETY SOLUTION".
                Nous n'avons donc pas besoin d'ajouter de texte à côté.
                Nous ajustons la hauteur pour qu'elle s'intègre bien dans la barre de 80px (h-20).
              */}
              <img 
                src={logo3SImage} 
                alt="3S SMART SAFETY SOLUTION Logo" 
                style={{ 
                  height: '60px', // Hauteur ajustée pour la barre de navigation
                  width: 'auto',   // Conserve le ratio d'aspect
                  display: 'block' 
                }} 
              />
            </div>
          </Link>

          {/* ── Desktop Nav ── */}
          <div className="hidden md:flex items-center gap-7">
            <Link to="/" className="nav-link" style={isActive('/') ? { color: 'var(--c-text)' } : {}}>Accueil</Link>

            {/* Services dropdown */}
            <div ref={dropRef} style={{ position: 'relative' }}>
              <button
                className="nav-link"
                style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: isActive('/services') ? 'var(--c-text)' : undefined,
                }}
                onClick={() => setServicesOpen(!servicesOpen)}
              >
                Services
                <ChevronDown size={12} style={{ transition: 'transform 0.2s', transform: servicesOpen ? 'rotate(180deg)' : 'none' }} />
              </button>

              {servicesOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 12px)', left: '50%', transform: 'translateX(-50%)',
                  background: 'var(--c-card)', border: '1px solid var(--c-border)',
                  padding: '1rem', minWidth: '420px',
                  boxShadow: '0 20px 48px rgba(10,14,40,0.18)',
                  zIndex: 100,
                }}>
                  <div style={{ height: 2, background: 'linear-gradient(90deg, var(--c-primary), var(--c-secondary), transparent)', marginBottom: '0.875rem' }} />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'var(--c-border)', marginBottom: '0.875rem' }}>
                    {serviceItems.map(({ Icon, label, abbr, to }) => (
                      <Link key={to} to={to} style={{ textDecoration: 'none' }} onClick={() => setServicesOpen(false)}>
                        <div
                          style={{
                            display: 'flex', alignItems: 'center', gap: 10,
                            padding: '0.875rem 1rem', background: 'var(--c-surface)',
                            transition: 'background 0.2s', cursor: 'pointer',
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = 'var(--c-card)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'var(--c-surface)'}
                        >
                          <div style={{
                            width: 28, height: 28, border: '1px solid var(--c-border)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                            background: 'var(--c-primary-bg)',
                          }}>
                            <Icon size={13} style={{ color: 'var(--c-primary)' }} />
                          </div>
                          <div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--c-text)', fontWeight: 400 }}>{label}</div>
                            <div style={{ fontSize: '0.58rem', color: 'var(--c-primary)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500 }}>{abbr}</div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <Link to="/services" onClick={() => setServicesOpen(false)} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0.6rem 0.75rem', fontSize: '0.72rem',
                    color: 'var(--c-primary)', letterSpacing: '0.08em', textTransform: 'uppercase',
                    background: 'var(--c-primary-bg)', border: '1px solid var(--c-primary-line)',
                    textDecoration: 'none', transition: 'background 0.2s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(30,82,204,0.12)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'var(--c-primary-bg)'}
                  >
                    Voir tous les services <ArrowRight size={12} />
                  </Link>
                </div>
              )}
            </div>

            <Link to="/about" className="nav-link" style={isActive('/about') ? { color: 'var(--c-text)' } : {}}>À propos</Link>
            <Link to="/blog" className="nav-link" style={isActive('/blog') ? { color: 'var(--c-text)' } : {}}>Veille Réglementaire</Link>
            <Link to="/client" className="nav-link" style={isActive('/client') ? { color: 'var(--c-text)' } : {}}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <Globe size={12} style={{ color: 'var(--c-primary)' }} /> Espace Client
              </span>
            </Link>

            <button
              onClick={handleContactClick}
              className="nav-link"
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'inherit', padding: '0.25rem 0',
              }}
            >
              Contact
            </button>
          </div>

          {/* ── Actions ── */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated() ? (
              <>
                <Link
                  to={user?.role === 'admin' ? '/admin' : '/client'}
                  className="btn-ghost flex items-center gap-2"
                  style={{ fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.5rem 1rem' }}
                >
                  {user?.role === 'admin' ? <LayoutDashboard size={13} /> : <FileText size={13} />}
                  {user?.role === 'admin' ? 'Admin' : 'Mes docs'}
                </Link>
                <button
                  onClick={handleLogout}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: 'var(--c-muted)', background: 'none', border: 'none', cursor: 'pointer',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--c-red)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--c-muted)'}
                >
                  <LogOut size={13} /> Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-primary flex items-center gap-2" style={{ padding: '0.5rem 1.25rem', fontSize: '0.72rem' }}>
                  <Lock size={13} /> Connexion
                </Link>
                <Link to="/register" className="btn-ghost flex items-center gap-2" style={{ padding: '0.5rem 1rem', fontSize: '0.72rem' }}>
                  <Users size={13} /> Inscription
                </Link>
              </>
            )}
          </div>

          {/* ── Mobile toggle ── */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden"
            style={{ color: 'var(--c-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* ── Mobile Menu ── */}
        {isMenuOpen && (
          <div style={{
            background: 'var(--c-surface)', borderTop: '1px solid var(--c-border)',
            padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.875rem',
          }}>
            {[
              { label: 'Accueil', to: '/' },
              { label: 'Services', to: '/services' },
              { label: 'À propos', to: '/about' },
              { label: 'Veille Réglementaire', to: '/blog' },
              { label: 'Espace Client', to: '/client' },
            ].map(({ label, to }) => (
              <Link
                key={to} to={to}
                style={{
                  color: isActive(to) ? 'var(--c-text)' : 'var(--c-muted)',
                  fontSize: '0.82rem', letterSpacing: '0.08em', textDecoration: 'none',
                }}
              >
                {label}
              </Link>
            ))}

            <button
              onClick={handleContactClick}
              style={{
                color: 'var(--c-muted)', fontSize: '0.82rem', letterSpacing: '0.08em',
                background: 'none', border: 'none', cursor: 'pointer',
                textAlign: 'left', padding: 0, fontFamily: 'inherit',
              }}
            >
              Contact
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}