import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Linkedin, Facebook, Twitter, ExternalLink } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ background: 'var(--c-surface)', borderTop: '1px solid var(--c-border)' }}>
      <div style={{ height: 2, background: 'linear-gradient(90deg, transparent, var(--c-gold), transparent)', opacity: 0.6 }} />

      <div className="container mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">

          {/* ── Brand ── */}
          <div className="md:col-span-4">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.25rem' }}>
              <div style={{ position: 'relative', width: 32, height: 32, flexShrink: 0 }}>
                <div style={{ width: 32, height: 32, border: '2px solid var(--c-gold)', transform: 'rotate(45deg)', position: 'absolute' }} />
                <div style={{ width: 14, height: 14, background: 'var(--c-gold)', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(45deg)', opacity: 0.85 }} />
              </div>
              <div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.05rem', fontWeight: 700, color: 'var(--c-white)', lineHeight: 1.1 }}>Bureau d'Études</div>
                <div style={{ fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--c-gold)' }}>3S · HSE & Environnement</div>
              </div>
            </div>
            <p style={{ color: 'var(--c-muted)', fontSize: '0.85rem', lineHeight: 1.75, maxWidth: '26rem', marginBottom: '1.5rem' }}>
              Bureau d'études agréé, spécialisé dans les études d'impact, les études de danger et la conformité réglementaire HSE en Algérie. Certifié Loi n° 03-10 et Loi n° 01-19.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              {[{ Icon: Linkedin, href: '#' }, { Icon: Facebook, href: '#' }, { Icon: Twitter, href: '#' }].map(({ Icon, href }, i) => (
                <a key={i} href={href} style={{ width: 34, height: 34, border: '1px solid var(--c-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--c-muted)', transition: 'all 0.2s ease' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--c-gold)'; e.currentTarget.style.color = 'var(--c-gold)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--c-border)'; e.currentTarget.style.color = 'var(--c-muted)'; }}
                ><Icon size={14} /></a>
              ))}
            </div>
          </div>

          {/* ── Services ── */}
          <div className="md:col-span-3">
            <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1rem', fontWeight: 600, color: 'var(--c-white)', letterSpacing: '0.04em', marginBottom: '1.25rem' }}>Nos Services</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {[
                ['Étude d\'Impact sur l\'Environnement (EIE)', '/services#eie'],
                ['Audit Environnemental ICPE', '/services#audit'],
                ['Plan de Gestion des Déchets (PGD)', '/services#pandru'],
                ['Notice d\'Impact sur l\'Environnement (NIE)', '/services#nie'],
                ['Suivi Rejets & Émissions', '/services#rejets'],
                ['Études de Danger & PII', '/services#veille'],
              ].map(([label, to], i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <span style={{ display: 'inline-block', width: 4, height: 4, background: 'var(--c-gold)', borderRadius: '50%', flexShrink: 0, marginTop: 6 }} />
                  <Link to={to} style={{ color: 'var(--c-muted)', fontSize: '0.78rem', lineHeight: 1.5, textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--c-gold)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--c-muted)'}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Navigation ── */}
          <div className="md:col-span-2">
            <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1rem', fontWeight: 600, color: 'var(--c-white)', letterSpacing: '0.04em', marginBottom: '1.25rem' }}>Navigation</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {[
                ['Accueil', '/'],
                ['Services', '/services'],
                ['À propos', '/about'],
                ['Veille Réglementaire', '/blog'],
                ['Espace Client', '/client'],
                ['Connexion', '/login'],
              ].map(([label, to], i) => (
                <li key={i}>
                  <Link to={to} style={{ color: 'var(--c-muted)', fontSize: '0.78rem', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--c-gold)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--c-muted)'}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact ── */}
          <div className="md:col-span-3">
            <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1rem', fontWeight: 600, color: 'var(--c-white)', letterSpacing: '0.04em', marginBottom: '1.25rem' }}>Contact</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { Icon: MapPin, text: 'Alger, Algérie' },
                { Icon: Phone, text: '+213 557 03 89 00' },
                { Icon: Mail, text: 'contact@3s-ehs.com' },
              ].map(({ Icon, text }, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, color: 'var(--c-muted)', fontSize: '0.78rem' }}>
                  <Icon size={14} style={{ color: 'var(--c-gold)', flexShrink: 0, marginTop: 2 }} />
                  {text}
                </li>
              ))}
            </ul>

            {/* Agrément badge */}
            <div style={{ marginTop: '1.75rem', padding: '0.875rem', border: '1px solid rgba(201,168,76,0.2)', background: 'rgba(201,168,76,0.04)' }}>
              <div style={{ fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--c-gold)', marginBottom: '0.4rem' }}>Agréé officiellement</div>
              <div style={{ color: 'var(--c-muted)', fontSize: '0.72rem', lineHeight: 1.6 }}>
                Ministère de l'Environnement et des Énergies Renouvelables (MEER) · Algérie
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom ── */}
        <div style={{ borderTop: '1px solid var(--c-border)', marginTop: '3rem', paddingTop: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, textAlign: 'center' }}>
          <p style={{ color: 'var(--c-muted)', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
            © {currentYear} Bureau d'Études 3S — Tous droits réservés
          </p>
          <p style={{ color: 'var(--c-border)', fontSize: '0.7rem', letterSpacing: '0.05em' }}>
            Conforme aux cadres réglementaires HSE et protection de l'environnement en Algérie
          </p>
        </div>
      </div>
    </footer>
  );
}