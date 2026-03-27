import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FileText, CheckCircle, Users, Award,
  BookOpen, Shield, Leaf, TrendingUp, Send, ArrowRight,
  Recycle, Factory, BarChart3, Phone, Mail, MapPin,
  AlertCircle, CheckCircle2
} from 'lucide-react';
import { contactService } from '../services/api';

/* ── Animated counter ── */
const Counter = ({ end, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let start = 0;
        const step = Math.ceil(end / 60);
        const timer = setInterval(() => {
          start += step;
          if (start >= end) { setCount(end); clearInterval(timer); }
          else setCount(start);
        }, 20);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);

  return <span ref={ref}>{count}{suffix}</span>;
};

/* ── Field component with validation state ── */
const Field = ({ label, name, type = 'text', required, value, onChange, error, placeholder }) => (
  <div>
    <label className="field-label">{label}{required && <span style={{ color: 'var(--c-gold)', marginLeft: 2 }}>*</span>}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      className={`field${error ? ' field-error' : ''}`}
      aria-invalid={error ? 'true' : 'false'}
      aria-describedby={error ? `${name}-error` : undefined}
    />
    {error && (
      <p id={`${name}-error`} className="field-error-msg">{error}</p>
    )}
  </div>
);

const INITIAL_FORM = {
  nom: '', entreprise: '', email: '',
  telephone: '', message: '', sujet: 'Demande de devis'
};

const Home = () => {
  const location = useLocation();

  // ── FIX CONTACT : déclenché quand le Header navigue vers / avec state.scrollTo ──
  useEffect(() => {
    if (location.state?.scrollTo === 'contact') {
      // On laisse le DOM se monter (100ms suffisent après le changement de route)
      const timer = setTimeout(() => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null); // null | 'loading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Effacer l'erreur du champ dès que l'utilisateur tape
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  /* ── Validation client-side ── */
  const validate = () => {
    const errors = {};
    if (!formData.nom.trim()) errors.nom = 'Le nom est requis';
    if (!formData.email.trim()) {
      errors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Adresse email invalide';
    }
    if (!formData.message.trim()) errors.message = 'Le message est requis';
    else if (formData.message.trim().length < 20) errors.message = 'Message trop court (minimum 20 caractères)';
    return errors;
  };

  /* ── BUG FIX: handleSubmit robuste avec validation + feedback amélioré ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus(null);
    setErrorMessage('');

    // Validation locale avant envoi
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      // Focus le premier champ en erreur
      const firstError = Object.keys(errors)[0];
      document.querySelector(`[name="${firstError}"]`)?.focus();
      return;
    }

    setSubmitStatus('loading');
    try {
      await contactService.sendContactForm({
        nom: formData.nom.trim(),
        entreprise: formData.entreprise.trim(),
        email: formData.email.trim().toLowerCase(),
        telephone: formData.telephone.trim(),
        message: formData.message.trim(),
        sujet: formData.sujet,
      });
      setSubmitStatus('success');
      setFormData(INITIAL_FORM);
      setFieldErrors({});
    } catch (error) {
      setSubmitStatus('error');
      // Gestion fine des erreurs réseau vs serveur
      if (!error.response) {
        setErrorMessage('Impossible de joindre le serveur. Vérifiez votre connexion et réessayez.');
      } else if (error.response.status >= 500) {
        setErrorMessage('Erreur interne du serveur. Veuillez réessayer plus tard.');
      } else {
        setErrorMessage(error.response?.data?.error || 'Erreur lors de l\'envoi du message.');
      }
    }
  };

  const services = [
    {
      Icon: FileText,
      title: 'Étude d\'Impact sur l\'Environnement',
      abbr: 'EIE',
      ref: 'Décret exécutif n° 07-145',
      desc: 'Études d\'impact conformes à la réglementation algérienne pour tous types de projets industriels et d\'infrastructure.',
      items: [
        'Analyse de l\'état initial du site',
        'Évaluation des impacts potentiels',
        'Mesures d\'atténuation et compensation',
        'Plan de Gestion Environnementale (PGE)',
      ],
    },
    {
      Icon: Shield,
      title: 'Audit Environnemental ICPE',
      abbr: 'ICPE',
      ref: 'Décret exécutif n° 06-198',
      desc: 'Audit environnemental et mise en conformité des Installations Classées pour la Protection de l\'Environnement.',
      items: [
        'Diagnostic de conformité réglementaire',
        'Analyse des rejets et émissions',
        'Plan de mise en conformité',
        'Suivi et accompagnement administratif',
      ],
    },
    {
      Icon: Leaf,
      title: 'Plan de Gestion des Déchets',
      abbr: 'PGD',
      ref: 'Loi n° 01-19',
      desc: 'Élaboration de plans de gestion interne des déchets (PGID) conformes à la Loi 01-19.',
      items: [
        'Inventaire et classification des déchets',
        'Mise en place du registre des déchets',
        'Élaboration des bordereaux de suivi (BSD)',
        'Filières d\'élimination et valorisation',
      ],
    },
  ];

  const stats = [
    { end: 4, suffix: '+', label: 'Sites Web développés' },
    { end: 7,  suffix: '+', label: 'Années d\'expérience' },
    { end: 24,  suffix: 'h', label: 'Délai de réponse' },
    { end: 100, suffix: '%', label: 'Conformité garantie' },
  ];

  const circularPillars = [
    {
      Icon: Recycle,
      title: 'Réduction et valorisation des déchets',
      desc: 'Plans de tri, filières de valorisation et optimisation des flux pour diminuer les coûts environnementaux.',
      image: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=1200&q=80'
    },
    {
      Icon: Factory,
      title: 'Industrie plus propre',
      desc: 'Accompagnement des sites industriels vers une production responsable et conforme aux exigences réglementaires.',
      image: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=1200&q=80'
    },
    {
      Icon: BarChart3,
      title: 'Suivi d\'impact mesurable',
      desc: 'Indicateurs clairs sur les émissions, l\'eau, l\'énergie et la performance environnementale globale.',
      image: 'https://images.unsplash.com/photo-1460472178825-e5240623afd5?auto=format&fit=crop&w=1200&q=80'
    },
  ];

  const contactInfos = [
    { Icon: Phone, label: 'Téléphone', value: '+213 (0) 557 03 89 00', href: 'tel:+213557038900' },
    { Icon: Mail,  label: 'Email',     value: 'contact@3s-ehs.com', href: 'mailto:contact@3s-ehs.com' },
    { Icon: MapPin,label: 'Adresse',   value: 'Alger, Algérie', href: null },
  ];

  return (
    <div style={{ background: 'var(--c-bg)', minHeight: '100vh' }}>

      {/* ══ HERO ══════════════════════════════════════════════ */}
      <section style={{
        position: 'relative',
        overflow: 'hidden',
        padding: 'clamp(5rem, 12vw, 9rem) 0 clamp(4rem, 8vw, 7rem)',
      }}>
        <div className="geo-bg" />

        {/* Gradient diagonal */}
        <div style={{
          position: 'absolute', top: 0, right: 0,
          width: '45%', height: '100%',
          background: 'linear-gradient(135deg, transparent 35%, rgba(30,122,82,0.05) 100%)',
          pointerEvents: 'none',
        }} />

        {/* Ligne verticale or */}
        <div style={{
          position: 'absolute', top: 0, left: '50%',
          width: 1, height: '100%',
          background: 'linear-gradient(180deg, transparent, rgba(176,125,32,0.18), transparent)',
          pointerEvents: 'none',
        }} />

        <div className="container mx-auto px-6 lg:px-8" style={{ position: 'relative' }}>
          <div style={{ maxWidth: '52rem' }}>
            <div className="section-label animate-fadeUp">
              Cabinet spécialisé · Algérie
            </div>

            <h1
              className="animate-fadeUp delay-1"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(2.6rem, 6vw, 5rem)',
                fontWeight: 700,
                color: 'var(--c-text)',
                lineHeight: 1.1,
                marginBottom: '1.5rem',
              }}
            >
              Expertise en{' '}
              <em style={{ color: 'var(--c-gold)', fontStyle: 'italic' }}>
                Conformité
              </em>
              <br />HSE & Environnementale
            </h1>

            <p
              className="animate-fadeUp delay-2"
              style={{
                color: 'var(--c-muted)',
                fontSize: '1.05rem',
                lineHeight: 1.8,
                maxWidth: '36rem',
                marginBottom: '2.5rem',
              }}
            >
              Bureau d'études agréé, spécialisé dans les études d'impact, les études de danger et la
              conformité réglementaire. Nous accompagnons les entreprises algériennes
              dans le respect de la Loi n° 03-10 et Loi n° 01-19.
            </p>

            <div className="animate-fadeUp delay-3" style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <a href="#contact" className="btn-primary">
                <Send size={14} />
                Demander un devis
              </a>
              <a href="#expertise" className="btn-secondary">
                Nos expertises
                <ArrowRight size={14} />
              </a>
            </div>
          </div>

          {/* ── Stats ── */}
          <div
            className="animate-fadeUp delay-4"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: 1,
              marginTop: '5rem',
              background: 'var(--c-border)',
              maxWidth: '44rem',
            }}
          >
            {stats.map(({ end, suffix, label }, i) => (
              <div
                key={i}
                style={{
                  background: 'var(--c-card)',
                  padding: '1.5rem 1.25rem',
                  textAlign: 'center',
                  transition: 'background 0.2s ease',
                }}
              >
                <div className="stat-num">
                  <Counter end={end} suffix={suffix} />
                </div>
                <div style={{
                  fontSize: '0.63rem',
                  letterSpacing: '0.13em',
                  textTransform: 'uppercase',
                  color: 'var(--c-muted)',
                  marginTop: 7,
                  fontWeight: 400,
                }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CIRCULAR ECONOMY VISUALS ═════════════════════════ */}
      <section style={{ padding: 'clamp(3rem, 7vw, 5.5rem) 0' }}>
        <div className="container mx-auto px-6 lg:px-8">
          <div style={{ textAlign: 'center', marginBottom: '2.75rem' }}>
            <div className="section-label" style={{ justifyContent: 'center' }}>
              Économie circulaire
            </div>
            <h2 className="section-title">
              Transition <span>durable</span> et performante
            </h2>
            <p className="section-subtitle">
              Nous intégrons les principes de l'économie circulaire dans les stratégies environnementales de nos clients.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {circularPillars.map(({ Icon, title, desc, image }, i) => (
              <article key={i} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div className="img-overlay" style={{ height: 180 }}>
                  <img
                    src={image}
                    alt={title}
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                    onMouseEnter={e => e.target.style.transform = 'scale(1.04)'}
                    onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                  />
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '0.75rem' }}>
                    <div style={{
                      width: 32, height: 32, background: 'var(--c-accent-bg)',
                      border: '1px solid rgba(30,122,82,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <Icon size={15} style={{ color: 'var(--c-accent)' }} />
                    </div>
                    <h3 style={{ color: 'var(--c-text)', fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: '1.05rem', lineHeight: 1.2 }}>{title}</h3>
                  </div>
                  <p style={{ color: 'var(--c-muted)', fontSize: '0.86rem', lineHeight: 1.7 }}>{desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ══ BADGES ════════════════════════════════════════════ */}
      <section style={{
        borderTop: '1px solid var(--c-border)',
        borderBottom: '1px solid var(--c-border)',
        background: 'var(--c-surface)',
        padding: '2rem 0',
      }}>
        <div className="container mx-auto px-6 lg:px-8">
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2.5rem' }}>
            {[
              { Icon: Award,      text: 'Agréé par le Ministère (MEER)' },
              { Icon: Shield,     text: 'Conforme à la Loi n° 03-10' },
              { Icon: Users,      text: 'Ingénieurs d\'État HSE' },
              { Icon: TrendingUp, text: '+100 Projets Validés' },
            ].map(({ Icon, text }, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                color: 'var(--c-muted)', fontSize: '0.78rem',
                letterSpacing: '0.09em', textTransform: 'uppercase',
              }}>
                <Icon size={15} style={{ color: 'var(--c-gold)', flexShrink: 0 }} />
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ EXPERTISE ════════════════════════════════════════ */}
      <section id="expertise" style={{ padding: 'clamp(4rem, 8vw, 7rem) 0' }}>
        <div className="container mx-auto px-6 lg:px-8">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div className="section-label" style={{ justifyContent: 'center' }}>
              Domaines d'intervention
            </div>
            <h2 className="section-title">
              Notre <span>Expertise</span> Réglementaire
            </h2>
            <p className="section-subtitle">
              Conformément à la réglementation algérienne en matière de sécurité et d'environnement
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 2 }}>
            {services.map(({ Icon, title, abbr, ref: decree, desc, items }, i) => (
              <div
                key={i}
                className="card"
                style={{ position: 'relative', overflow: 'hidden' }}
              >
                {/* Corner accent */}
                <div style={{
                  position: 'absolute', top: 0, right: 0,
                  width: 60, height: 60,
                  background: 'linear-gradient(135deg, transparent 50%, var(--c-gold-bg) 50%)',
                }} />

                {/* Icon + Abbr */}
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: '1.5rem' }}>
                  <div style={{
                    width: 42, height: 42,
                    border: '1px solid var(--c-border)',
                    background: 'var(--c-gold-bg)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Icon size={18} style={{ color: 'var(--c-gold)' }} />
                  </div>
                  <span className="tag tag-gold">{abbr}</span>
                </div>

                <h3 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '1.4rem', fontWeight: 700,
                  color: 'var(--c-text)',
                  marginBottom: '0.4rem', lineHeight: 1.22,
                }}>
                  {title}
                </h3>

                <p style={{
                  fontSize: '0.68rem', color: 'var(--c-gold)',
                  letterSpacing: '0.07em', marginBottom: '1rem', opacity: 0.85,
                  fontWeight: 500,
                }}>
                  Réf. {decree}
                </p>

                <p style={{
                  color: 'var(--c-muted)', fontSize: '0.85rem',
                  lineHeight: 1.75, marginBottom: '1.5rem',
                }}>
                  {desc}
                </p>

                <span className="accent-line" />

                <ul style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                  {items.map((item, j) => (
                    <li key={j} style={{
                      display: 'flex', alignItems: 'flex-start', gap: 10,
                      color: 'var(--c-text-sec)', fontSize: '0.82rem',
                    }}>
                      <CheckCircle size={13} style={{ color: 'var(--c-accent)', flexShrink: 0, marginTop: 3 }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ VEILLE CTA ════════════════════════════════════════ */}
      <section style={{
        position: 'relative', overflow: 'hidden',
        padding: 'clamp(3.5rem, 7vw, 6rem) 0',
        background: 'var(--c-surface)',
        borderTop: '1px solid var(--c-border)',
        borderBottom: '1px solid var(--c-border)',
      }}>
        <div className="geo-bg" />
        <div className="container mx-auto px-6 lg:px-8" style={{ position: 'relative' }}>
          <div style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', textAlign: 'center', gap: '1.5rem',
          }}>
            <div className="section-label" style={{ justifyContent: 'center' }}>Actualités</div>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(1.8rem, 4vw, 3rem)',
              fontWeight: 700, color: 'var(--c-text)',
              maxWidth: '36rem', lineHeight: 1.2,
            }}>
              Veille Réglementaire{' '}
              <em style={{ color: 'var(--c-gold)', fontStyle: 'italic' }}>HSE & Environnement</em>
            </h2>
            <p style={{ color: 'var(--c-muted)', fontSize: '0.9rem', maxWidth: '32rem', lineHeight: 1.75 }}>
              Restez informés des derniers décrets, normes et obligations en matière de sécurité et d'environnement en Algérie.
            </p>
            <Link to="/blog" className="btn-primary">
              <BookOpen size={14} />
              Consulter les actualités
            </Link>
          </div>
        </div>
      </section>

      {/* ══ CONTACT ══════════════════════════════════════════ */}
      <section id="contact" style={{ padding: 'clamp(4rem, 8vw, 7rem) 0' }}>
        <div className="container mx-auto px-6 lg:px-8">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div className="section-label" style={{ justifyContent: 'center' }}>
              Prise de contact
            </div>
            <h2 className="section-title">
              Discutons de votre <span>Projet</span>
            </h2>
            <p className="section-subtitle">
              Réponse garantie sous 48h ouvrées
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'clamp(200px, 30%, 300px) 1fr',
            gap: '2rem',
            maxWidth: '900px',
            margin: '0 auto',
            alignItems: 'start',
          }}
          className="contact-grid"
          >

            {/* ── Informations de contact ── */}
            <aside style={{
              background: 'var(--c-text)',
              padding: '2rem',
              position: 'sticky',
              top: '6rem',
            }}>
              <span className="accent-line-green" />
              <h3 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1.3rem', fontWeight: 700,
                color: '#ffffff', marginBottom: '1.5rem',
              }}>
                Coordonnées
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {contactInfos.map(({ Icon, label, value, href }) => (
                  <div key={label} style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
                    <div style={{
                      width: 34, height: 34, flexShrink: 0,
                      background: 'rgba(255,255,255,0.07)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Icon size={14} style={{ color: 'var(--c-gold)' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.62rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: '0.2rem' }}>
                        {label}
                      </div>
                      {href ? (
                        <a href={href} style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)', textDecoration: 'none', transition: 'color 0.2s' }}
                          onMouseEnter={e => e.target.style.color = 'var(--c-gold)'}
                          onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.85)'}
                        >{value}</a>
                      ) : (
                        <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)' }}>{value}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{
                marginTop: '2rem',
                paddingTop: '1.5rem',
                borderTop: '1px solid rgba(255,255,255,0.1)',
                fontSize: '0.75rem',
                color: 'rgba(255,255,255,0.4)',
                lineHeight: 1.6,
              }}>
                Vos données sont traitées conformément à la réglementation en vigueur. Aucune transmission à des tiers.
              </div>
            </aside>

            {/* ── Formulaire ── */}
            <div>
              {/* Succès global */}
              {submitStatus === 'success' && (
                <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
                  <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: 1 }} />
                  <div>
                    <strong style={{ display: 'block', marginBottom: '0.2rem' }}>Message envoyé !</strong>
                    Votre demande a bien été reçue. Nous vous répondrons dans les 48h ouvrées.
                  </div>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
                  <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 1 }} />
                  <div>
                    <strong style={{ display: 'block', marginBottom: '0.2rem' }}>Erreur d'envoi</strong>
                    {errorMessage}
                  </div>
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                noValidate
                style={{
                  background: 'var(--c-card)',
                  border: '1px solid var(--c-border)',
                  padding: 'clamp(1.5rem, 4vw, 2.5rem)',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                {/* Ligne 1 : Nom + Entreprise */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
                  <Field
                    label="Nom complet" name="nom" required
                    value={formData.nom} onChange={handleInputChange}
                    error={fieldErrors.nom} placeholder="Prénom Nom"
                  />
                  <Field
                    label="Entreprise" name="entreprise"
                    value={formData.entreprise} onChange={handleInputChange}
                    placeholder="Nom de votre société"
                  />
                </div>

                {/* Ligne 2 : Email + Téléphone */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
                  <Field
                    label="Email professionnel" name="email" type="email" required
                    value={formData.email} onChange={handleInputChange}
                    error={fieldErrors.email} placeholder="vous@entreprise.dz"
                  />
                  <Field
                    label="Téléphone" name="telephone" type="tel"
                    value={formData.telephone} onChange={handleInputChange}
                    placeholder="+213 (0)XX XX XX XX"
                  />
                </div>

                {/* Sujet */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <label className="field-label">Sujet de la demande</label>
                  <select
                    name="sujet"
                    value={formData.sujet}
                    onChange={handleInputChange}
                    className="field"
                  >
                    <option value="Demande de devis">Demande de devis</option>
                    <option value="EIE">Étude d'Impact sur l'Environnement (EIE)</option>
                    <option value="Audit ICPE">Audit Environnemental (ICPE)</option>
                    <option value="PGD">Plan de Gestion des Déchets (PGD)</option>
                    <option value="ED_PII">Études de Danger & PII</option>
                    <option value="Autre">Autre demande</option>
                  </select>
                </div>

                {/* Message */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label className="field-label">
                    Message <span style={{ color: 'var(--c-gold)' }}>*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className={`field${fieldErrors.message ? ' field-error' : ''}`}
                    placeholder="Décrivez votre projet, le type d'installation concernée, et vos besoins spécifiques..."
                    style={{ resize: 'vertical', minHeight: '120px' }}
                    aria-invalid={fieldErrors.message ? 'true' : 'false'}
                  />
                  {fieldErrors.message && (
                    <p className="field-error-msg">{fieldErrors.message}</p>
                  )}
                  <div style={{
                    display: 'flex', justifyContent: 'flex-end',
                    fontSize: '0.7rem', color: 'var(--c-muted)',
                    marginTop: '0.3rem',
                  }}>
                    {formData.message.length} / 20 min.
                  </div>
                </div>

                {/* Bouton submit */}
                <button
                  type="submit"
                  disabled={submitStatus === 'loading'}
                  className="btn-primary"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    paddingTop: '0.9rem',
                    paddingBottom: '0.9rem',
                    fontSize: '0.82rem',
                    letterSpacing: '0.1em',
                  }}
                >
                  {submitStatus === 'loading' ? (
                    <>
                      <span className="spinner" style={{ marginRight: 8 }} />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      Envoyer le message
                    </>
                  )}
                </button>

                <p style={{
                  fontSize: '0.72rem', color: 'var(--c-muted)',
                  textAlign: 'center', marginTop: '1rem', lineHeight: 1.5,
                }}>
                  En soumettant ce formulaire, vous acceptez d'être recontacté par notre équipe dans les 48h ouvrées.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* CSS responsive pour le grid contact */}
      <style>{`
        @media (max-width: 640px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
          }
          .contact-grid aside {
            position: static !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;