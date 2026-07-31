import React from 'react';
import { Link } from 'react-router-dom';
import {
  Database, FlaskConical, HardHat, CheckCircle, Send, ArrowRight,
  Sparkles, History, Users2, ShieldCheck, Bell, BarChart3,
} from 'lucide-react';

const pillars = [
  {
    Icon: Sparkles,
    title: 'Simplicité',
    desc: "Une interface claire remplace les fichiers Excel dispersés et les circuits papier — vos équipes gagnent du temps dès le premier jour.",
  },
  {
    Icon: History,
    title: 'Traçabilité',
    desc: "Chaque action est historisée : qui, quoi, quand. Une preuve opposable en cas de contrôle ou d'audit.",
  },
  {
    Icon: Users2,
    title: 'Autonomie',
    desc: "Vos équipes pilotent leur conformité au quotidien, sans dépendre en permanence d'un consultant externe.",
  },
];

const products = [
  {
    id: 'reglo-plus',
    Icon: Database,
    category: 'Conformité réglementaire EHS',
    name: 'Reglo+',
    tagline: 'Toute la réglementation EHS algérienne, centralisée et pilotée.',
    desc: "Reglo+ transforme des centaines de textes réglementaires épars — Environnement, Air, Eau, Déchets, Produits chimiques, Produits dangereux, Sécurité, Santé au travail — en une base de données structurée et actionnable. Chaque exigence est reliée à un statut de conformité, un plan d'action, une échéance et un responsable : fini les audits reconstitués à la main.",
    features: [
      'Base réglementaire algérienne EHS structurée en 10 domaines (~623 exigences)',
      'Audit de conformité exigence par exigence : statut, priorité, faisabilité, risque',
      'Plan d\'action avec échéance et responsable assigné',
      'Tableaux de bord : taux de conformité et de complétion, par domaine',
      'Export de rapports PDF / Excel / CSV en un clic',
      'Gestion multi-utilisateurs avec rôles (administrateur / utilisateur)',
    ],
    audience: ['Directions HSE / QHSE', 'Sites classés ICPE', 'Cabinets de conseil'],
  },
  {
    id: 'chimique',
    Icon: FlaskConical,
    category: 'Produits chimiques réglementés',
    name: 'Gestion des Produits Chimiques Dangereux',
    tagline: "De l'autorisation d'achat au stock disponible, en toute traçabilité.",
    desc: "Une application dédiée aux entreprises qui manipulent des produits chimiques soumis à autorisation. Elle couvre tout le cycle de vie : création de fiches produits, gestion des autorisations d'acquisition, suivi des achats et des utilisations, et calcul en temps réel du stock disponible — avec des alertes automatiques avant chaque échéance ou rupture.",
    features: [
      'Fiches produits réutilisables avec identification chimique (N° ONU, CAS, CEE)',
      "Autorisations d'achat avec état calculé automatiquement (active, presque épuisée, expirée…)",
      "Contrôle des achats et utilisations avec blocage anti-dépassement de quantité autorisée",
      'Stock disponible par autorisation, en temps réel',
      'Alertes automatiques : échéances à 90/60/30 jours, seuils de rupture de stock',
      'Rapports réglementaires prêts à l\'emploi (déclaration mensuelle, historique des achats…)',
      'Piste d\'audit complète (qui, quoi, quand)',
    ],
    audience: ['Industries chimiques', 'Laboratoires', 'Hôpitaux', 'Sites pétroliers'],
  },
  {
    id: 'permis-travail',
    Icon: HardHat,
    category: 'Sécurité opérationnelle',
    name: 'Permis de Travail Digital',
    tagline: 'Sécurisez vos travaux à risque, sans papier ni approximation.',
    desc: "Une plateforme pour émettre, valider et suivre vos permis de travail — feu, espace confiné, électrique, travaux en hauteur, excavation, consignation LOTO — avec un workflow de validation HSE structuré et une traçabilité complète. Fini les permis papier égarés ou signés sans vérification réelle des conditions de sécurité.",
    features: [
      'Types de permis prédéfinis : feu, espace confiné, électrique, hauteur, excavation, LOTO',
      'Workflow de validation par statut (brouillon → en attente → validé → en cours → clôturé)',
      'Gestion par zone avec responsable dédié',
      'Conditions préalables, mesures de prévention et tests atmosphériques rattachés au permis',
      'Notifications automatiques et piste d\'audit complète',
      'Génération de rapports PDF et gestion des justificatifs',
    ],
    audience: ['Sites industriels', 'Chantiers', 'Maintenance', 'Sous-traitants'],
  },
];

export default function Produits() {
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
          background: 'linear-gradient(135deg, transparent 40%, rgba(30,82,204,0.05) 100%)',
          pointerEvents: 'none',
        }} />
        <div className="container mx-auto px-6 lg:px-8" style={{ position: 'relative' }}>
          <div className="section-label">Solutions digitales</div>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(2.2rem,5vw,4rem)',
            fontWeight: 700, color: 'var(--c-text)',
            lineHeight: 1.1, marginBottom: '1.25rem', maxWidth: '44rem',
          }}>
            Notre expertise HSE,{' '}
            <em style={{ color: 'var(--c-gold)', fontStyle: 'italic' }}>transformée en logiciels</em>
          </h1>
          <p style={{ color: 'var(--c-muted)', fontSize: '0.95rem', maxWidth: '40rem', lineHeight: 1.8, marginBottom: '2.5rem' }}>
            En tant que bureau d'études, nous vivons la complexité réglementaire de nos clients au quotidien.
            Nous avons donc développé nos propres outils digitaux pour la réduire : trois applications conçues
            pour piloter votre conformité EHS sans jargon ni friction, en autonomie.
          </p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <a href="#reglo-plus" className="btn-primary">Découvrir les outils <ArrowRight size={14} /></a>
            <Link to="/" state={{ scrollTo: 'contact' }} className="btn-secondary">
              <Send size={14} /> Demander une démo
            </Link>
          </div>

          {/* Stats */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: 1, marginTop: '3.5rem', background: 'var(--c-border)', maxWidth: '46rem',
          }}>
            {[
              { v: '3', l: 'Outils digitaux' },
              { v: '623+', l: 'Exigences EHS centralisées' },
              { v: '6', l: 'Types de permis pris en charge' },
              { v: '100%', l: 'Traçabilité des actions' },
            ].map((s, i) => (
              <div key={i} style={{ background: 'var(--c-card)', padding: '1.5rem 1.25rem', textAlign: 'center' }}>
                <div className="stat-num" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}>{s.v}</div>
                <div style={{ fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--c-muted)', marginTop: 6 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pourquoi des outils digitaux ── */}
      <section style={{ padding: 'clamp(3rem,6vw,5rem) 0' }}>
        <div className="container mx-auto px-6 lg:px-8">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="section-label" style={{ justifyContent: 'center' }}>Notre conviction</div>
            <h2 className="section-title">Pourquoi des <span>outils digitaux</span> ?</h2>
            <p className="section-subtitle">
              La réglementation ne se simplifie pas toute seule. Nous construisons les outils qui le font pour vous.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {pillars.map(({ Icon, title, desc }, i) => (
              <div key={i} className="card">
                <span className="accent-line" />
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '0.75rem' }}>
                  <Icon size={18} style={{ color: 'var(--c-gold)' }} />
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', fontWeight: 700, color: 'var(--c-text)' }}>{title}</div>
                </div>
                <div style={{ color: 'var(--c-muted)', fontSize: '0.85rem', lineHeight: 1.75 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Produits ── */}
      {products.map(({ id, Icon, category, name, tagline, desc, features, audience }, i) => (
        <section
          key={id}
          id={id}
          style={{
            padding: 'clamp(3.5rem,7vw,6rem) 0',
            background: i % 2 === 1 ? 'var(--c-surface)' : 'var(--c-bg)',
            borderTop: '1px solid var(--c-border)',
            scrollMarginTop: '5.5rem',
          }}
        >
          <div className="container mx-auto px-6 lg:px-8">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 2 }}>

              {/* Left — description */}
              <div style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)', padding: 'clamp(1.75rem, 4vw, 2.5rem)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.25rem' }}>
                  <div style={{ width: 44, height: 44, border: '1px solid var(--c-border)', background: 'var(--c-gold-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={20} style={{ color: 'var(--c-gold)' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--c-gold)', fontWeight: 500 }}>{category}</div>
                    <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.6rem', fontWeight: 700, color: 'var(--c-text)', lineHeight: 1.2 }}>{name}</h2>
                  </div>
                </div>

                <p style={{ color: 'var(--c-text-sec)', fontSize: '0.92rem', fontWeight: 500, lineHeight: 1.6, marginBottom: '1rem' }}>{tagline}</p>
                <p style={{ color: 'var(--c-muted)', fontSize: '0.85rem', lineHeight: 1.8, marginBottom: '1.75rem' }}>{desc}</p>

                <div style={{ marginBottom: '1.75rem' }}>
                  <div style={{ fontSize: '0.62rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--c-muted)', marginBottom: '0.75rem' }}>Pour qui ?</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {audience.map((a, j) => (
                      <span key={j} className="tag tag-blue">{a}</span>
                    ))}
                  </div>
                </div>

                <Link to="/" state={{ scrollTo: 'contact' }} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <Send size={13} /> Demander une démo
                </Link>
              </div>

              {/* Right — features */}
              <div style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)', padding: 'clamp(1.75rem, 4vw, 2.5rem)' }}>
                <div style={{ fontSize: '0.62rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--c-gold)', marginBottom: '1.5rem', fontWeight: 500 }}>
                  Ce que l'outil apporte
                </div>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {features.map((f, j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <CheckCircle size={14} style={{ color: 'var(--c-accent)', flexShrink: 0, marginTop: 2 }} />
                      <span style={{ color: 'var(--c-text-sec)', fontSize: '0.85rem', lineHeight: 1.6 }}>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* ── Bandeau garanties ── */}
      <section style={{ borderTop: '1px solid var(--c-border)', borderBottom: '1px solid var(--c-border)', background: 'var(--c-surface)', padding: '2rem 0' }}>
        <div className="container mx-auto px-6 lg:px-8">
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2.5rem' }}>
            {[
              { Icon: ShieldCheck, text: 'Conçus par des experts HSE, pas par des développeurs seuls' },
              { Icon: Bell, text: 'Alertes automatiques sur vos échéances réglementaires' },
              { Icon: BarChart3, text: 'Tableaux de bord pensés pour la décision' },
            ].map(({ Icon, text }, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--c-muted)', fontSize: '0.78rem', letterSpacing: '0.03em', maxWidth: '20rem' }}>
                <Icon size={16} style={{ color: 'var(--c-gold)', flexShrink: 0 }} />
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: 'clamp(3.5rem,7vw,6rem) 0', position: 'relative', overflow: 'hidden' }}>
        <div className="geo-bg" />
        <div className="container mx-auto px-6 lg:px-8" style={{ position: 'relative', textAlign: 'center' }}>
          <div className="section-label" style={{ justifyContent: 'center' }}>Passez à l'action</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: 700, color: 'var(--c-text)', marginBottom: '1rem' }}>
            Un outil vous intéresse ?{' '}
            <em style={{ color: 'var(--c-gold)', fontStyle: 'italic' }}>Parlons-en.</em>
          </h2>
          <p style={{ color: 'var(--c-muted)', maxWidth: '32rem', margin: '0 auto 2rem', lineHeight: 1.7, fontSize: '0.9rem' }}>
            Démonstration gratuite et sans engagement. Nous adaptons chaque outil au contexte réel de votre site.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/" state={{ scrollTo: 'contact' }} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Send size={13} /> Demander une démo
            </Link>
            <Link to="/services" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              Nos prestations d'expertise <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
