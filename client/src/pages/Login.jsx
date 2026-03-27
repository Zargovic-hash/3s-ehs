import React, { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { LogIn, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated()) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/client'} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    if (result.success) {
      navigate(result.user.role === 'admin' ? '/admin' : '/client');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--c-bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Grid texture */}
      <div className="geo-bg" />

      {/* Glow blob */}
      <div style={{
        position: 'absolute',
        top: '20%', left: '50%',
        transform: 'translateX(-50%)',
        width: 500, height: 400,
        background: 'radial-gradient(ellipse, rgba(77,140,96,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: 440, position: 'relative' }}>

        {/* ── Header ── */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          {/* Geometric logo */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            marginBottom: '1.5rem',
          }}>
            <div style={{ position: 'relative', width: 42, height: 42 }}>
              <div style={{
                width: 42, height: 42,
                border: '2px solid var(--c-gold)',
                transform: 'rotate(45deg)',
                position: 'absolute',
              }} />
              <div style={{
                width: 20, height: 20,
                background: 'var(--c-gold)',
                position: 'absolute',
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%) rotate(45deg)',
                opacity: 0.85,
              }} />
            </div>
            <div>
              <div style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1.2rem', fontWeight: 700,
                color: 'var(--c-white)', lineHeight: 1.1,
              }}>
                Bureau d'Études
              </div>
              <div style={{
                fontSize: '0.6rem', letterSpacing: '0.18em',
                textTransform: 'uppercase', color: 'var(--c-gold)',
              }}>
                Environnemental
              </div>
            </div>
          </div>

          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '1.7rem', fontWeight: 700,
            color: 'var(--c-white)', marginBottom: '0.5rem',
          }}>
            Espace Client
          </h1>
          <p style={{ color: 'var(--c-muted)', fontSize: '0.82rem', letterSpacing: '0.06em' }}>
            Connexion sécurisée à votre espace personnel
          </p>
        </div>

        {/* ── Card ── */}
        <div style={{
          background: 'var(--c-card)',
          border: '1px solid var(--c-border)',
          padding: 'clamp(1.75rem, 5vw, 2.5rem)',
        }}>
          {/* Gold top accent */}
          <div style={{
            height: 2,
            background: 'linear-gradient(90deg, var(--c-gold), transparent)',
            marginBottom: '2rem',
          }} />

          {error && (
            <div style={{
              marginBottom: '1.5rem',
              padding: '0.875rem 1rem',
              border: '1px solid rgba(239,68,68,0.4)',
              background: 'rgba(239,68,68,0.05)',
              color: '#fca5a5',
              fontSize: '0.82rem',
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label className="field-label">Adresse email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="field"
                placeholder="votre.email@exemple.dz"
              />
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label className="field-label">Mot de passe</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="field"
                  placeholder="••••••••"
                  style={{ paddingRight: '3rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: 'absolute', right: 12, top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--c-muted)',
                    background: 'none', border: 'none', cursor: 'pointer',
                  }}
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{
                width: '100%',
                opacity: loading ? 0.65 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? (
                'Connexion en cours...'
              ) : (
                <>
                  <LogIn size={14} style={{ marginRight: 8 }} />
                  Se connecter
                </>
              )}
            </button>
          </form>
          <div className="mt-4 flex items-center justify-between text-sm">
            <Link to="/forgot-password" className="text-emerald-700 hover:underline">
              Mot de passe oublié ?
            </Link>
            <Link to="/register" className="text-emerald-700 hover:underline">
              Créer un compte
            </Link>
          </div>
        </div>

        <p style={{
          textAlign: 'center',
          marginTop: '1.5rem',
          color: 'var(--c-muted)',
          fontSize: '0.75rem',
        }}>
          Problème de connexion ? Contactez votre administrateur
        </p>
      </div>
    </div>
  );
};

export default Login;