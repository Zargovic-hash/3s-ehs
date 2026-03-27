import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText, Shield, Leaf, Wind, Droplets, Flame,
  ChevronRight, ArrowRight, CheckCircle, Send,
  Clock, Award, Users, BarChart2
} from 'lucide-react';

const services = [
  {
    id: 'eie',
    Icon: FileText,
    abbr: 'EIE',
    title: "Étude d'Impact sur l'Environnement",
    ref: 'Décret exécutif n° 07-145',
    color: '#4d8c60',
    desc: "Évaluation complète des impacts potentiels d'un projet sur l'environnement, conformément à la réglementation algérienne. Document essentiel pour l'obtention de l'autorisation d'exploitation.",
    process: [
      { step: '01', label: 'Cadrage', detail: 'Définition du périmètre et des enjeux environnementaux' },
      { step: '02', label: 'État initial', detail: "Inventaire exhaustif de l'environnement existant" },
      { step: '03', label: 'Analyse des impacts', detail: 'Évaluation qualitative et quantitative des rejets et nuisances' },
      { step: '04', label: 'Mesures ERC', detail: 'Évitement, réduction, compensation' },
      { step: '05', label: 'Rapport final', detail: 'Dossier réglementaire complet (PGE inclus)' },
    ],
    deliverables: [
      'Rapport EIE complet selon le décret 07-145',
      'Plan de Gestion Environnementale (PGE)',
      'Résumé non technique',
      'Annexes cartographiques et techniques',
    ],
    sectors: ['Industrie', 'BTP', 'Mines & Carrières', 'Énergie', 'Agro-alimentaire'],
    duration: '4 à 12 semaines',
  },
  {
    id: 'audit',
    Icon: Shield,
    abbr: 'ICPE',
    title: 'Audit Environnemental ICPE',
    ref: 'Décret exécutif n° 06-198',
    color: '#c9a84c',
    desc: "Diagnostic de conformité réglementaire de votre Installation Classée pour la Protection de l'Environnement. Identification des écarts et plan de mise en conformité priorisé.",
    process: [
      { step: '01', label: 'Visite de site', detail: 'Inspection terrain et revue documentaire' },
      { step: '02', label: 'Analyse réglementaire', detail: 'Identification des textes applicables' },
      { step: '03', label: 'Cartographie des écarts', detail: 'Non-conformités hiérarchisées' },
      { step: '04', label: 'Plan de mise en conformité', detail: 'Actions priorisées avec échéances' },
      { step: '05', label: 'Rapport d\'audit', detail: 'Document officiel et dossier de classement' },
    ],
    deliverables: [
      'Rapport d\'audit de conformité ICPE',
      'Matrice des non-conformités',
      'Plan d\'action priorisé',
      'Dossier de déclaration ou d\'autorisation',
    ],
    sectors: ['Cimenteries', 'Raffineries', 'Industries chimiques', 'Unités de stockage', 'Fonderies'],
    duration: '2 à 6 semaines',
  },
  {
    id: 'pandru',
    Icon: Leaf,
    abbr: 'PGD',
    title: 'Plan de Gestion des Déchets',
    ref: 'Loi n° 01-19',
    color: '#4d8c60',
    desc: "Élaboration du Plan de Gestion Interne des Déchets (PGID) — document réglementaire obligatoire pour la traçabilité et l'élimination des déchets spéciaux et dangereux.",
    process: [
      { step: '01', label: 'Inventaire des déchets', detail: 'Caractérisation, classification et quantification' },
      { step: '02', label: 'Analyse des flux', detail: 'Traçabilité, stockage et filières d\'élimination' },
      { step: '03', label: 'Plan de réduction', detail: 'Objectifs et indicateurs de performance' },
      { step: '04', label: 'Procédures opérationnelles', detail: 'Mise en place du registre des déchets' },
      { step: '05', label: 'Validation PGD', detail: 'Dépôt auprès de la Direction de l\'Environnement' },
    ],
    deliverables: [
      'PGID conforme à la Loi 01-19',
      'Registre de suivi des déchets',
      'Bordereaux de suivi des déchets (BSD)',
      'Procédures de gestion interne',
    ],
    sectors: ['Industries pharmaceutiques', 'Hôpitaux', 'Industries pétrolières', 'Tanneries', 'Traitement de surface'],
    duration: '3 à 8 semaines',
  },
  {
    id: 'nie',
    Icon: Wind,
    abbr: 'NIE',
    title: "Notice d'Impact sur l'Environnement",
    ref: 'Décret exécutif n° 07-145 (Art. 14)',
    color: '#a8c5a0',
    desc: "Étude simplifiée pour les projets de moindre envergure ne nécessitant pas une EIE complète. Procédure allégée pour une mise en conformité rapide et efficace.",
    process: [
      { step: '01', label: 'Évaluation préliminaire', detail: 'Détermination du régime applicable' },
      { step: '02', label: 'Description du projet', detail: 'Caractéristiques et implantation' },
      { step: '03', label: 'Analyse simplifiée', detail: 'Impacts principaux identifiés' },
      { step: '04', label: 'Mesures correctives', detail: 'Prescriptions environnementales' },
      { step: '05', label: 'Dépôt administratif', detail: 'Instruction par les services compétents' },
    ],
    deliverables: [
      'Notice d\'impact complète',
      'Formulaire administratif rempli',
      'Cartographie de localisation',
      'Mesures d\'accompagnement',
    ],
    sectors: ['PME', 'Artisanat', 'Commerce', 'Petits projets agricoles', 'Tourisme'],
    duration: '1 à 3 semaines',
  },
  {
    id: 'rejets',
    Icon: Droplets,
    abbr: 'Rejets',
    title: 'Suivi des Rejets & Émissions',
    ref: 'Décrets n° 06-141 & 06-138',
    color: '#c9a84c',
    desc: "Campagnes de prélèvements et analyses des rejets liquides, émissions atmosphériques et nuisances sonores, conformément aux valeurs limites réglementaires algériennes.",
    process: [
      { step: '01', label: 'Identification des sources', detail: 'Inventaire complet des rejets' },
      { step: '02', label: 'Protocole de mesure', detail: 'Plan de surveillance adapté' },
      { step: '03', label: 'Campagne de mesures', detail: 'Prélèvements et analyses en laboratoire' },
      { step: '04', label: 'Analyse des résultats', detail: 'Comparaison aux valeurs limites' },
      { step: '05', label: 'Rapport de surveillance', detail: 'Bilan annuel réglementaire' },
    ],
    deliverables: [
      'Rapport de mesures accrédité',
      'Comparatif aux normes algériennes',
      'Recommandations techniques',
      'Plan de surveillance pluriannuel',
    ],
    sectors: ['Agroalimentaire', 'Textile', 'Mécanique', 'Papeteries', 'Stations d\'épuration'],
    duration: '2 à 4 semaines',
  },
  {
    id: 'veille',
    Icon: Flame,
    abbr: 'ED/PII',
    title: 'Étude de Danger & PII',
    ref: 'Loi 04-20 & Décret 09-335',
    color: '#4d8c60',
    desc: "Évaluation des risques industriels majeurs, élaboration de l'Étude de Danger (ED), du Plan Interne d'Intervention (PII) et du Plan de Sûreté Interne (PSI).",
    process: [
      { step: '01', label: 'Identification des risques', detail: 'Méthodologie HAZOP / HAZID' },
      { step: '02', label: 'Évaluation et Modélisation', detail: 'Modélisation des scénarios d\'accidents' },
      { step: '03', label: 'Analyse des conséquences', detail: 'Impacts thermiques, toxiques et surpression' },
      { step: '04', label: 'Mesures de barrières', detail: 'Prévention, protection et intervention' },
      { step: '05', label: 'Dossier PII', detail: 'Procédures d\'urgence et organisation des secours' },
    ],
    deliverables: [
      'Étude de Danger (ED)',
      'Plan Interne d\'Intervention (PII)',
      'Plan de Sûreté Interne (PSI)',
      'Cartographie des zones à risques (ATEX)',
    ],
    sectors: ['Pétrole & Gaz', 'Chimie', 'Stockage de carburants', 'Centrales électriques', 'Industrie Lourde'],
    duration: '8 à 16 semaines',
  },
];

const stats = [
  { Icon: BarChart2, value: '100+', label: 'Missions réalisées' },
  { Icon: Award, value: '15+', label: "Années d'expertise" },
  { Icon: Users, value: '60+', label: 'Clients industriels' },
  { Icon: Clock, value: '48h', label: 'Délai de réponse' },
];

export default function Services() {
  const [active, setActive] = useState('eie');
  const current = services.find(s => s.id === active);

  return (
    <div style={{ background: 'var(--c-bg)', minHeight: '100vh' }}>

      {/* ── Hero ── */}
      <section style={{
        position: 'relative', overflow: 'hidden',
        padding: 'clamp(4rem,10vw,8rem) 0 clamp(3rem,6vw,5rem)',
        borderBottom: '1px solid var(--c-border)',
      }}>
        <div className="geo-bg" />
        <div style={{
          position: 'absolute', top: 0, right: 0,
          width: '45%', height: '100%',
          background: 'linear-gradient(135deg, transparent 40%, rgba(77,140,96,0.05) 100%)',
          pointerEvents: 'none',
        }} />
        <div className="container mx-auto px-6 lg:px-8" style={{ position: 'relative' }}>
          <div className="section-label">Nos Prestations</div>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(2.2rem,5vw,4rem)',
            fontWeight: 700, color: 'var(--c-white)',
            lineHeight: 1.1, marginBottom: '1.25rem', maxWidth: '42rem',
          }}>
            Services d'Expertise{' '}
            <em style={{ color: 'var(--c-gold)', fontStyle: 'italic' }}>HSE & Environnement</em>
          </h1>
          <p style={{ color: 'var(--c-muted)', fontSize: '0.95rem', maxWidth: '38rem', lineHeight: 1.8, marginBottom: '2.5rem' }}>
            Bureau d'études agréé en Environnement et HSE par le Ministère de l'Environnement et des Énergies Renouvelables (MEER). Nous accompagnons les industriels dans toutes leurs obligations réglementaires en Algérie.
          </p>
          {/* Stats row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 1, maxWidth: '42rem', background: 'var(--c-border)' }}>
            {stats.map(({ Icon, value, label }, i) => (
              <div key={i} style={{ background: 'var(--c-card)', padding: '1.25rem 1.5rem', flex: '1 1 120px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <Icon size={18} style={{ color: 'var(--c-gold)', flexShrink: 0 }} />
                <div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.6rem', fontWeight: 700, color: 'var(--c-gold)', lineHeight: 1 }}>{value}</div>
                  <div style={{ fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--c-muted)', marginTop: 3 }}>{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Interactive service explorer ── */}
      <section style={{ padding: 'clamp(3rem,6vw,6rem) 0' }}>
        <div className="container mx-auto px-6 lg:px-8">
          <div style={{ display: 'flex', gap: 2, flexWrap: 'wrap', marginBottom: '0.5rem' }}>
            {services.map(s => (
              <button key={s.id} onClick={() => setActive(s.id)} style={{
                padding: '0.6rem 1.1rem',
                fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500,
                cursor: 'pointer', border: '1px solid',
                borderColor: active === s.id ? 'var(--c-gold)' : 'var(--c-border)',
                color: active === s.id ? 'var(--c-gold)' : 'var(--c-muted)',
                background: active === s.id ? 'rgba(201,168,76,0.07)' : 'transparent',
                transition: 'all 0.2s ease',
              }}>
                {s.abbr}
              </button>
            ))}
          </div>

          {current && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 2, marginTop: 2 }}>

              {/* Left — description */}
              <div style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)', padding: '2.5rem', gridColumn: 'span 1' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.5rem' }}>
                  <div style={{ width: 44, height: 44, border: '1px solid var(--c-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <current.Icon size={20} style={{ color: 'var(--c-gold)' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--c-gold)', fontWeight: 500 }}>{current.abbr}</div>
                    <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', fontWeight: 700, color: 'var(--c-white)', lineHeight: 1.2 }}>{current.title}</h2>
                  </div>
                </div>
                <p style={{ fontSize: '0.7rem', color: 'var(--c-gold)', letterSpacing: '0.08em', marginBottom: '1rem', opacity: 0.8 }}>Réf. {current.ref}</p>
                <p style={{ color: 'var(--c-muted)', fontSize: '0.875rem', lineHeight: 1.8, marginBottom: '1.75rem' }}>{current.desc}</p>

                <div style={{ marginBottom: '1.75rem' }}>
                  <div style={{ fontSize: '0.62rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--c-gold)', marginBottom: '0.875rem', fontWeight: 500 }}>Livrables</div>
                  {current.deliverables.map((d, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
                      <CheckCircle size={13} style={{ color: 'var(--c-accent)', flexShrink: 0, marginTop: 2 }} />
                      <span style={{ color: 'var(--c-muted)', fontSize: '0.8rem' }}>{d}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.75rem' }}>
                  <div>
                    <div style={{ fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--c-muted)', marginBottom: 4 }}>Durée estimée</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--c-white)', fontWeight: 500 }}>{current.duration}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--c-muted)', marginBottom: 4 }}>Secteurs concernés</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {current.sectors.slice(0, 3).map((s, i) => (
                        <span key={i} style={{ fontSize: '0.65rem', padding: '2px 8px', border: '1px solid var(--c-border)', color: 'var(--c-muted)' }}>{s}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <a href="#contact" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <Send size={13} /> Demander un devis
                </a>
              </div>

              {/* Right — process */}
              <div style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)', padding: '2.5rem' }}>
                <div style={{ fontSize: '0.62rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--c-gold)', marginBottom: '1.75rem', fontWeight: 500 }}>
                  Notre méthodologie
                </div>
                <div style={{ position: 'relative' }}>
                  {/* Vertical line */}
                  <div style={{ position: 'absolute', left: 19, top: 20, bottom: 20, width: 1, background: 'var(--c-border)' }} />
                  {current.process.map((p, i) => (
                    <div key={i} style={{ display: 'flex', gap: '1.25rem', marginBottom: '1.75rem', position: 'relative' }}>
                      <div style={{
                        width: 38, height: 38, flexShrink: 0,
                        background: 'var(--c-card)', border: '1px solid var(--c-border)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: "'Cormorant Garamond', serif", fontSize: '0.85rem', color: 'var(--c-gold)', fontWeight: 600,
                        position: 'relative', zIndex: 1,
                      }}>
                        {p.step}
                      </div>
                      <div>
                        <div style={{ color: 'var(--c-white)', fontSize: '0.875rem', fontWeight: 500, marginBottom: 3 }}>{p.label}</div>
                        <div style={{ color: 'var(--c-muted)', fontSize: '0.78rem', lineHeight: 1.6 }}>{p.detail}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── All services grid ── */}
      <section style={{ padding: 'clamp(2rem,5vw,5rem) 0', background: 'var(--c-surface)', borderTop: '1px solid var(--c-border)' }}>
        <div className="container mx-auto px-6 lg:px-8">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="section-label" style={{ justifyContent: 'center' }}>Vue d'ensemble</div>
            <h2 className="section-title">Tous nos <span>Services</span></h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 2 }}>
            {services.map((s) => (
              <button key={s.id} onClick={() => { setActive(s.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                style={{
                  background: 'var(--c-card)', border: '1px solid var(--c-border)',
                  padding: '1.75rem', textAlign: 'left', cursor: 'pointer',
                  transition: 'border-color 0.25s, transform 0.25s',
                  display: 'flex', flexDirection: 'column', gap: '0.75rem',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--c-gold)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--c-border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ width: 36, height: 36, border: '1px solid var(--c-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <s.Icon size={16} style={{ color: 'var(--c-gold)' }} />
                </div>
                <div style={{ fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--c-gold)' }}>{s.abbr}</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.15rem', fontWeight: 700, color: 'var(--c-white)', lineHeight: 1.25 }}>{s.title}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--c-accent2)', fontSize: '0.72rem', letterSpacing: '0.08em', marginTop: 'auto' }}>
                  Voir le détail <ChevronRight size={12} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: 'clamp(3rem,7vw,6rem) 0', borderTop: '1px solid var(--c-border)', position: 'relative', overflow: 'hidden' }}>
        <div className="geo-bg" />
        <div className="container mx-auto px-6 lg:px-8" style={{ position: 'relative', textAlign: 'center' }}>
          <div className="section-label" style={{ justifyContent: 'center' }}>Passez à l'action</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: 700, color: 'var(--c-white)', marginBottom: '1rem' }}>
            Votre projet mérite une <em style={{ color: 'var(--c-gold)', fontStyle: 'italic' }}>expertise certifiée</em>
          </h2>
          <p style={{ color: 'var(--c-muted)', maxWidth: '32rem', margin: '0 auto 2rem', lineHeight: 1.7, fontSize: '0.9rem' }}>
            Réponse garantie sous 48h. Devis gratuit et sans engagement pour toute demande.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Send size={13} /> Demander un devis
            </Link>
            <Link to="/blog" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              Veille Réglementaire HSE <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}