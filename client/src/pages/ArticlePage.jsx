import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, Tag, ArrowLeft, ArrowRight, Share2, BookOpen, Clock } from 'lucide-react';
import { articleService } from '../services/api';

const catColorMap = {
  'Décrets': { bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.3)', text: '#93c5fd' },
  'News': { bg: 'rgba(77,140,96,0.08)', border: 'rgba(77,140,96,0.3)', text: 'var(--c-accent2)' },
  'Guides': { bg: 'rgba(167,139,250,0.08)', border: 'rgba(167,139,250,0.3)', text: '#c4b5fd' },
  'Normes Rejets': { bg: 'rgba(251,146,60,0.08)', border: 'rgba(251,146,60,0.3)', text: '#fdba74' },
  'Déchets': { bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.3)', text: '#fca5a5' },
  'ICPE': { bg: 'rgba(201,168,76,0.08)', border: 'rgba(201,168,76,0.3)', text: 'var(--c-gold-lt)' },
};

export default function ArticlePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [readingTime, setReadingTime] = useState(0);

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const data = await articleService.getArticle(id);
      setArticle(data);
      // Estimate reading time
      const words = (data.contenu || '').split(/\s+/).length;
      setReadingTime(Math.max(1, Math.ceil(words / 200)));
      // Fetch related articles by category
      if (data.categorie) {
        const related = await articleService.getArticles({ categorie: data.categorie });
        setRelated((related.articles || []).filter(a => a.id !== data.id).slice(0, 3));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

  if (loading) return (
    <div style={{ background: 'var(--c-bg)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: 'var(--c-muted)', fontSize: '0.85rem' }}>Chargement de l'article…</div>
    </div>
  );

  if (!article) return (
    <div style={{ background: 'var(--c-bg)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ color: 'var(--c-white)', fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem' }}>Article introuvable</div>
      <Link to="/blog" className="btn-ghost" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><ArrowLeft size={13} /> Retour au blog</Link>
    </div>
  );

  const cs = catColorMap[article.categorie] || { bg: 'rgba(255,255,255,0.04)', border: 'var(--c-border)', text: 'var(--c-muted)' };

  return (
    <div style={{ background: 'var(--c-bg)', minHeight: '100vh' }}>

      {/* ── Header article ── */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: 'clamp(3.5rem,8vw,6rem) 0 clamp(2.5rem,5vw,4rem)', borderBottom: '1px solid var(--c-border)' }}>
        <div className="geo-bg" />
        <div className="container mx-auto px-6 lg:px-8" style={{ position: 'relative', maxWidth: '760px' }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '2rem', flexWrap: 'wrap' }}>
            <Link to="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--c-muted)', fontSize: '0.75rem', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--c-gold)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--c-muted)'}
            >
              <ArrowLeft size={12} /> Veille Réglementaire HSE
            </Link>
            {article.categorie && (
              <>
                <span style={{ color: 'var(--c-border)', fontSize: '0.7rem' }}>/</span>
                <span style={{ fontSize: '0.72rem', padding: '2px 10px', background: cs.bg, border: `1px solid ${cs.border}`, color: cs.text }}>
                  {article.categorie}
                </span>
              </>
            )}
          </div>

          {/* Meta */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', alignItems: 'center', marginBottom: '1.5rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--c-muted)', fontSize: '0.75rem' }}>
              <Calendar size={12} /> {formatDate(article.created_at || article.date_publication)}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--c-muted)', fontSize: '0.75rem' }}>
              <Clock size={12} /> {readingTime} min de lecture
            </span>
            {article.auteur && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--c-muted)', fontSize: '0.75rem' }}>
                <BookOpen size={12} /> Par {article.auteur}
              </span>
            )}
          </div>

          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem,4.5vw,3.2rem)', fontWeight: 700, color: 'var(--c-white)', lineHeight: 1.2, marginBottom: '1.25rem' }}>
            {article.titre}
          </h1>

          {article.resume && (
            <p style={{ color: 'var(--c-muted)', fontSize: '1rem', lineHeight: 1.8, borderLeft: '2px solid var(--c-gold)', paddingLeft: '1.25rem' }}>
              {article.resume}
            </p>
          )}

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: '1.5rem' }}>
              {article.tags.map((t, i) => (
                <Link key={i} to={`/blog?tag=${t}`} className="tag" style={{ textDecoration: 'none' }}>#{t}</Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Article body ── */}
      <section style={{ padding: 'clamp(2.5rem,5vw,4rem) 0' }}>
        <div className="container mx-auto px-6 lg:px-8" style={{ maxWidth: '760px' }}>
          {/* Article content */}
          <div style={{
            color: 'var(--c-text)',
            fontSize: '0.9rem',
            lineHeight: 1.9,
          }}>
            {(article.contenu || '').split('\n\n').map((para, i) => {
              if (!para.trim()) return null;
              // Detect headings (lines starting with ## or #)
              if (para.startsWith('## ')) return (
                <h2 key={i} style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.6rem', fontWeight: 700, color: 'var(--c-white)', margin: '2.5rem 0 1rem' }}>
                  {para.replace('## ', '')}
                </h2>
              );
              if (para.startsWith('# ')) return (
                <h2 key={i} style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.9rem', fontWeight: 700, color: 'var(--c-white)', margin: '2.5rem 0 1rem' }}>
                  {para.replace('# ', '')}
                </h2>
              );
              // Bullet lists
              if (para.startsWith('- ')) {
                const items = para.split('\n').filter(l => l.startsWith('- '));
                return (
                  <ul key={i} style={{ margin: '1rem 0', paddingLeft: 0, listStyle: 'none' }}>
                    {items.map((item, j) => (
                      <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
                        <span style={{ display: 'inline-block', width: 4, height: 4, background: 'var(--c-gold)', borderRadius: '50%', flexShrink: 0, marginTop: 8 }} />
                        <span style={{ color: 'var(--c-muted)' }}>{item.replace('- ', '')}</span>
                      </li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={i} style={{ marginBottom: '1.4rem', color: 'var(--c-muted)' }}>{para}</p>
              );
            })}
          </div>

          {/* Share / actions */}
          <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--c-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <Link to="/blog" className="btn-ghost" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: '0.75rem' }}>
              <ArrowLeft size={13} /> Tous les articles
            </Link>
            <button
              onClick={() => navigator.clipboard?.writeText(window.location.href).then(() => alert('Lien copié !'))}
              className="btn-ghost"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: '0.75rem' }}
            >
              <Share2 size={13} /> Partager
            </button>
          </div>
        </div>
      </section>

      {/* ── Related articles ── */}
      {related.length > 0 && (
        <section style={{ padding: 'clamp(2rem,5vw,4rem) 0', background: 'var(--c-surface)', borderTop: '1px solid var(--c-border)' }}>
          <div className="container mx-auto px-6 lg:px-8">
            <div style={{ marginBottom: '2rem' }}>
              <div className="section-label">À lire aussi</div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.6rem', color: 'var(--c-white)' }}>
                Articles <span style={{ color: 'var(--c-gold)' }}>similaires</span>
              </h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 2 }}>
              {related.map((a, i) => {
                const rcs = catColorMap[a.categorie] || { bg: 'rgba(255,255,255,0.04)', border: 'var(--c-border)', text: 'var(--c-muted)' };
                return (
                  <Link key={i} to={`/blog/${a.id}`} style={{ textDecoration: 'none' }}>
                    <article style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)', padding: '1.5rem', height: '100%', transition: 'border-color 0.25s, transform 0.25s', display: 'flex', flexDirection: 'column', gap: '0.6rem', cursor: 'pointer' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--c-accent)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--c-border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                    >
                      {a.categorie && (
                        <span style={{ fontSize: '0.6rem', padding: '2px 8px', background: rcs.bg, border: `1px solid ${rcs.border}`, color: rcs.text, display: 'inline-block', width: 'fit-content', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                          {a.categorie}
                        </span>
                      )}
                      <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem', color: 'var(--c-white)', lineHeight: 1.3, fontWeight: 700 }}>{a.titre}</h4>
                      {a.resume && <p style={{ color: 'var(--c-muted)', fontSize: '0.78rem', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{a.resume}</p>}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--c-gold)', fontSize: '0.7rem', marginTop: 'auto' }}>
                        Lire l'article <ArrowRight size={11} />
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}