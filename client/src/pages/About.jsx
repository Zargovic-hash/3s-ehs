import React from 'react';
import { Link } from 'react-router-dom';
import { Award, BookOpen, Users, CheckCircle, ArrowRight, MapPin, Send } from 'lucide-react';

// ✅ AMÉLIORATION: avatars générés via ui-avatars.com avec photo style
// Remplacez les URL par de vraies photos une fois disponibles
const team = [
  {
  name: 'ECHCHAOUI SEIFEEDINE',
    role: "Directeur & ingénieur d'état",
    expertise: "Gestion des risques industriels et QHSE",
    years: "7 ans d'expérience",
    initials: 'SE',
    // Remplacer par une vraie photo : photoUrl: '/images/team/karim-bensalem.jpg'
    photoUrl: 'https://ui-avatars.com/api/?name=Karim+Bensalem&size=200&background=1a2d1e&color=c9a84c&bold=true&font-size=0.38',
    color: '#4d8c60',
  },
];

const values = [
  { title: 'Rigueur scientifique', desc: "Nos études s'appuient sur des méthodologies éprouvées et une approche rigoureusement documentée." },
  { title: 'Indépendance', desc: "Nos conclusions sont indépendantes et objectives. Nous ne servons que l'intérêt de la conformité réglementaire." },
  { title: 'Proximité client', desc: "Chaque mission est suivie par un expert dédié, joignable et impliqué de la prise de contact à la livraison." },
  { title: 'Engagement national', desc: "Nous contribuons à la protection de l'environnement algérien à travers chaque étude que nous réalisons." },
];

const timeline = [
  { year: '2019', event: "Création du Bureau d'Études 3S à Alger" },
  { year: '2024', event: "Obtention de l'agrément Ministère de l'Environnement" },
  { year: '2025', event: "Lancement de la veille réglementaire en ligne" },
  { year: '2025', event: "Ouverture de la plateforme client digitale" },
  { year: '2026', event: "Lancement du site web de gestion des permis de travail" },
];

export default function About() {
  return (
    <div style={{ background: 'var(--c-bg)', minHeight: '100vh' }}>

      {/* ── Hero ── */}
      <section style={{
        position: 'relative', overflow: 'hidden',
        padding: 'clamp(4rem,10vw,8rem) 0 clamp(3rem,6vw,5rem)',
        borderBottom: '1px solid var(--c-border)',
      }}>
        <div className="geo-bg" />
        <div className="container mx-auto px-6 lg:px-8" style={{ position: 'relative' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
            <div>
              <div className="section-label">Notre Cabinet</div>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.2rem,5vw,4rem)', fontWeight: 700, color: 'var(--c-white)', lineHeight: 1.1, marginBottom: '1.25rem' }}>
                Bureau d'Études <em style={{ color: 'var(--c-gold)', fontStyle: 'italic' }}>3S</em>
              </h1>
              <p style={{ color: 'var(--c-muted)', fontSize: '0.95rem', lineHeight: 1.85, marginBottom: '2rem' }}>
                Depuis 2019, nous accompagnons les entreprises algériennes dans leurs obligations environnementales réglementaires. Notre équipe d'ingénieurs et de docteurs spécialisés met son expertise au service de votre conformité avec la Loi n° 03-10.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--c-muted)', fontSize: '0.8rem' }}>
                <MapPin size={14} style={{ color: 'var(--c-gold)' }} />
                Alger, Algérie — Interventions à l'échelle nationale
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, background: 'var(--c-border)' }}>
              {[
                { v: '7+', l: "Années d'expérience" },
                { v: '20+', l: 'Missions réalisées' },
                { v: '20', l: 'Wilayas couvertes' },
                { v: '4', l: 'Application Web développées' },
              ].map((s, i) => (
                <div key={i} style={{ background: 'var(--c-card)', padding: '1.75rem 1.25rem', textAlign: 'center' }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.5rem', color: 'var(--c-gold)', fontWeight: 700, lineHeight: 1 }}>{s.v}</div>
                  <div style={{ fontSize: '0.62rem', color: 'var(--c-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 6 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section style={{ padding: 'clamp(3.5rem,7vw,6rem) 0' }}>
        <div className="container mx-auto px-6 lg:px-8">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="section-label" style={{ justifyContent: 'center' }}>Ce qui nous guide</div>
            <h2 className="section-title">Nos <span>Valeurs</span></h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 2 }}>
            {values.map((v, i) => (
              <div key={i} className="card">
                <span className="accent-line" />
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.25rem', fontWeight: 700, color: 'var(--c-white)', marginBottom: '0.75rem' }}>{v.title}</div>
                <div style={{ color: 'var(--c-muted)', fontSize: '0.83rem', lineHeight: 1.75 }}>{v.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ── ✅ AMÉLIORATION: cartes avec photo */}
      <section style={{ padding: 'clamp(3rem,6vw,5rem) 0', background: 'var(--c-surface)', borderTop: '1px solid var(--c-border)' }}>
        <div className="container mx-auto px-6 lg:px-8">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="section-label" style={{ justifyContent: 'center' }}>Notre équipe</div>
            <h2 className="section-title">Les <span>Experts</span> 3S</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {team.map((m, i) => (
              <div
                key={i}
                style={{
                  background: 'var(--c-card)',
                  border: '1px solid var(--c-border)',
                  overflow: 'hidden',
                  transition: 'border-color 0.25s, transform 0.25s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--c-accent)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--c-border)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* ✅ Photo / Avatar */}
                <div style={{ position: 'relative', height: 200, overflow: 'hidden', background: 'var(--c-surface)' }}>
                  <img
                    src={m.photoUrl}
                    alt={m.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    onError={(e) => {
                      // Fallback si l'image ne charge pas
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  {/* Fallback initiales si image absente */}
                  <div style={{
                    display: 'none', position: 'absolute', inset: 0,
                    alignItems: 'center', justifyContent: 'center',
                    background: 'linear-gradient(135deg, var(--c-surface), var(--c-card))',
                  }}>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '3rem', color: 'var(--c-gold)', fontWeight: 700 }}>
                      {m.initials}
                    </span>
                  </div>
                  {/* Barre couleur en bas de la photo */}
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: m.color }} />
                </div>

                {/* Infos */}
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ color: 'var(--c-white)', fontWeight: 600, fontSize: '0.95rem', marginBottom: 4 }}>{m.name}</div>
                  <div style={{ color: 'var(--c-gold)', fontSize: '0.72rem', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>{m.role}</div>
                  <div style={{ color: 'var(--c-muted)', fontSize: '0.78rem', marginBottom: 6 }}>{m.expertise}</div>
                  <div style={{
                    display: 'inline-block',
                    fontSize: '0.65rem', color: m.color,
                    letterSpacing: '0.06em',
                    border: `1px solid ${m.color}33`,
                    padding: '2px 8px',
                  }}>
                    {m.years}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ✅ Note pour remplacer les photos */}
          <p style={{ textAlign: 'center', color: 'var(--c-muted)', fontSize: '0.72rem', marginTop: '2rem', fontStyle: 'italic' }}>
            * Pour ajouter de vraies photos : placez-les dans <code style={{ color: 'var(--c-gold)' }}>client/public/images/team/</code> et mettez à jour les <code style={{ color: 'var(--c-gold)' }}>photoUrl</code> dans About.jsx
          </p>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section style={{ padding: 'clamp(3.5rem,7vw,6rem) 0' }}>
        <div className="container mx-auto px-6 lg:px-8">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="section-label" style={{ justifyContent: 'center' }}>Depuis 2019</div>
            <h2 className="section-title">Notre <span>Histoire</span></h2>
          </div>
          <div style={{ maxWidth: '640px', margin: '0 auto', position: 'relative' }}>
            <div style={{ position: 'absolute', left: 47, top: 0, bottom: 0, width: 1, background: 'var(--c-border)' }} />
            {timeline.map((t, i) => (
              <div key={i} style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', alignItems: 'flex-start' }}>
                <div style={{ width: 94, flexShrink: 0, textAlign: 'right' }}>
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.95rem', color: 'var(--c-gold)', fontWeight: 600 }}>{t.year}</span>
                </div>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--c-gold)', flexShrink: 0, marginTop: 5, position: 'relative', zIndex: 1 }} />
                <div style={{ color: 'var(--c-muted)', fontSize: '0.85rem', lineHeight: 1.6, paddingBottom: '0.5rem' }}>{t.event}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Agréments ── */}
      <section style={{ padding: 'clamp(3rem,5vw,4.5rem) 0', background: 'var(--c-surface)', borderTop: '1px solid var(--c-border)' }}>
        <div className="container mx-auto px-6 lg:px-8">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 2 }}>
            {[
              { Icon: Award, title: 'Agréments officiels', desc: "Bureau d'études agréé par le Ministère de l'Environnement et des Énergies Renouvelables pour la réalisation d'EIE et d'audits environnementaux." },
              { Icon: BookOpen, title: 'Conformité Loi 03-10', desc: "Toutes nos prestations sont réalisées dans le strict respect de la Loi n° 03-10 et des décrets d'application en vigueur en Algérie." },
              { Icon: Users, title: "Ingénieurs d'État", desc: "Notre équipe est composée exclusivement d'ingénieurs et de docteurs en sciences de l'environnement diplômés d'universités algériennes et européennes." },
            ].map(({ Icon, title, desc }, i) => (
              <div key={i} style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)', padding: '2rem' }}>
                <Icon size={20} style={{ color: 'var(--c-gold)', marginBottom: '1rem' }} />
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', color: 'var(--c-white)', marginBottom: '0.75rem' }}>{title}</div>
                <div style={{ color: 'var(--c-muted)', fontSize: '0.82rem', lineHeight: 1.7 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: 'clamp(3.5rem,7vw,6rem) 0', borderTop: '1px solid var(--c-border)', position: 'relative', overflow: 'hidden' }}>
        <div className="geo-bg" />
        <div className="container mx-auto px-6 lg:px-8" style={{ position: 'relative', textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: 700, color: 'var(--c-white)', marginBottom: '1rem' }}>
            Travaillons ensemble sur votre <em style={{ color: 'var(--c-gold)', fontStyle: 'italic' }}>projet</em>
          </h2>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: '1.5rem' }}>
            <Link to="/" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><Send size={13} /> Nous contacter</Link>
            <Link to="/services" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>Nos services <ArrowRight size={13} /></Link>
          </div>
        </div>
      </section>
    </div>
  );
}