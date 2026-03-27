import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Calendar, Tag, ArrowRight, X } from 'lucide-react';
import { articleService } from '../services/api';

const catColorMap = {
  'Décrets': { bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.3)', text: '#93c5fd' },
  'News': { bg: 'rgba(77,140,96,0.08)', border: 'rgba(77,140,96,0.3)', text: 'var(--c-accent2)' },
  'Guides': { bg: 'rgba(167,139,250,0.08)', border: 'rgba(167,139,250,0.3)', text: '#c4b5fd' },
  'Normes Rejets': { bg: 'rgba(251,146,60,0.08)', border: 'rgba(251,146,60,0.3)', text: '#fdba74' },
  'Déchets': { bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.3)', text: '#fca5a5' },
  'ICPE': { bg: 'rgba(201,168,76,0.08)', border: 'rgba(201,168,76,0.3)', text: 'var(--c-gold-lt)' },
};

const getCatStyle = (cat) =>
  catColorMap[cat] || { bg: 'rgba(255,255,255,0.04)', border: 'var(--c-border)', text: 'var(--c-muted)' };

const normalizeCategory = (cat) => {
  if (typeof cat === 'string') return cat;
  if (cat && typeof cat === 'object') return cat.categorie || cat.category || '';
  return '';
};

const normalizeTag = (tag) => {
  if (typeof tag === 'string') return tag;
  if (tag && typeof tag === 'object') return tag.tag || tag.name || '';
  return '';
};

export default function Blog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('categorie') || '');
  const [selectedTag, setSelectedTag] = useState(searchParams.get('tag') || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => { fetchArticles(); fetchCategories(); fetchTags(); }, [selectedCategory, selectedTag, searchTerm]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory) params.categorie = selectedCategory;
      if (selectedTag) params.tag = selectedTag;
      if (searchTerm) params.search = searchTerm;
      const data = await articleService.getArticles(params);
      setArticles(data.articles || []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const fetchCategories = async () => {
    try { const data = await articleService.getCategories(); setCategories(data.categories || []); } catch (e) {}
  };
  const fetchTags = async () => {
    try { const data = await articleService.getTags(); setTags(data.tags || []); } catch (e) {}
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
  const handleSearch = (e) => { e.preventDefault(); setSearchTerm(searchInput); };
  const clearFilters = () => { setSelectedCategory(''); setSelectedTag(''); setSearchTerm(''); setSearchInput(''); };
  const hasFilters = selectedCategory || selectedTag || searchTerm;

  return (
    <div style={{ background: 'var(--c-bg)', minHeight: '100vh' }}>

      {/* ── Hero ── */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: 'clamp(3.5rem,8vw,6rem) 0 clamp(3rem,6vw,5rem)', borderBottom: '1px solid var(--c-border)' }}>
        <div className="geo-bg" />
        <div className="container mx-auto px-6 lg:px-8" style={{ position: 'relative' }}>
          <div className="section-label">Actualités HSE & Réglementation</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem,5vw,3.8rem)', fontWeight: 700, color: 'var(--c-white)', lineHeight: 1.15, marginBottom: '1rem', maxWidth: '40rem' }}>
            Veille Réglementaire{' '}
            <em style={{ color: 'var(--c-gold)', fontStyle: 'italic' }}>HSE & Environnement</em>
          </h1>
          <p style={{ color: 'var(--c-muted)', fontSize: '0.9rem', maxWidth: '36rem', lineHeight: 1.75 }}>
            Toute l'actualité juridique et réglementaire en matière d'Hygiène, Sécurité et Environnement (HSE) en Algérie.
          </p>
          <form onSubmit={handleSearch} style={{ marginTop: '2rem', display: 'flex', maxWidth: '32rem', border: '1px solid var(--c-border)', overflow: 'hidden' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={14} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--c-muted)', pointerEvents: 'none' }} />
              <input type="text" value={searchInput} onChange={e => setSearchInput(e.target.value)}
                placeholder="Rechercher un article, décret, norme..." className="field"
                style={{ border: 'none', paddingLeft: '2.5rem', background: 'var(--c-card)' }} />
            </div>
            <button type="submit" className="btn-primary" style={{ borderLeft: 'none', clipPath: 'none' }}>Chercher</button>
          </form>
        </div>
      </section>

      {/* ── Content ── */}
      <div className="container mx-auto px-6 lg:px-8 py-12">
        <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>

          {/* ── Sidebar ── */}
          <aside style={{ width: 240, flexShrink: 0, position: 'sticky', top: '6rem' }}>
            {hasFilters && (
              <div style={{ marginBottom: '1.5rem', padding: '0.875rem 1rem', background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--c-gold)' }}>Filtres actifs</span>
                  <button onClick={clearFilters} style={{ color: 'var(--c-muted)', background: 'none', border: 'none', cursor: 'pointer' }}><X size={12} /></button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {selectedCategory && <span style={{ fontSize: '0.7rem', padding: '2px 8px', border: '1px solid var(--c-gold)', color: 'var(--c-gold)' }}>{selectedCategory}</span>}
                  {selectedTag && <span style={{ fontSize: '0.7rem', padding: '2px 8px', border: '1px solid var(--c-accent)', color: 'var(--c-accent2)' }}>#{selectedTag}</span>}
                  {searchTerm && <span style={{ fontSize: '0.7rem', padding: '2px 8px', border: '1px solid var(--c-border)', color: 'var(--c-muted)' }}>"{searchTerm}"</span>}
                </div>
              </div>
            )}

            {categories.length > 0 && (
              <div style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)', padding: '1.25rem', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--c-gold)', marginBottom: '1rem', fontWeight: 500 }}>Catégories</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <button onClick={() => setSelectedCategory('')} style={{ textAlign: 'left', padding: '0.4rem 0', fontSize: '0.78rem', color: !selectedCategory ? 'var(--c-white)' : 'var(--c-muted)', background: 'none', border: 'none', cursor: 'pointer', borderBottom: !selectedCategory ? '1px solid var(--c-gold)' : '1px solid transparent' }}>
                    Toutes les catégories
                  </button>
                  {categories.map((cat, i) => {
                    const catName = normalizeCategory(cat);
                    return (
                    <button key={catName || i} onClick={() => setSelectedCategory(catName === selectedCategory ? '' : catName)}
                      style={{ textAlign: 'left', padding: '0.4rem 0', fontSize: '0.78rem', color: selectedCategory === catName ? 'var(--c-white)' : 'var(--c-muted)', background: 'none', border: 'none', cursor: 'pointer', borderBottom: selectedCategory === catName ? '1px solid var(--c-gold)' : '1px solid transparent' }}>
                      {catName || 'Sans catégorie'}
                    </button>
                  )})}
                </div>
              </div>
            )}

            {tags.length > 0 && (
              <div style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)', padding: '1.25rem' }}>
                <h3 style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--c-gold)', marginBottom: '1rem', fontWeight: 500 }}>Tags</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {tags.map((tag, i) => {
                    const tagName = normalizeTag(tag);
                    return (
                    <button key={tagName || i} onClick={() => setSelectedTag(tagName === selectedTag ? '' : tagName)}
                      className={`tag ${selectedTag === tagName ? 'tag-active' : ''}`}
                      style={{ background: 'none', cursor: 'pointer' }}>
                      #{tagName || 'Sans tag'}
                    </button>
                  )})}
                </div>
              </div>
            )}
          </aside>

          {/* ── Articles grid ── */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[1, 2, 3].map(i => <div key={i} style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)', height: 160, opacity: 0.3 + i * 0.2 }} />)}
              </div>
            ) : articles.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'var(--c-card)', border: '1px solid var(--c-border)' }}>
                <p style={{ color: 'var(--c-muted)', fontSize: '0.9rem' }}>Aucun article trouvé</p>
                {hasFilters && <button onClick={clearFilters} className="btn-ghost" style={{ marginTop: '1.5rem', fontSize: '0.75rem' }}>Réinitialiser les filtres</button>}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {articles.map((article, i) => {
                  const cs = getCatStyle(article.categorie);
                  return (
                    <Link key={article.id || i} to={`/blog/${article.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                      <article style={{
                        background: 'var(--c-card)', border: '1px solid var(--c-border)',
                        padding: '1.75rem 2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem',
                        transition: 'border-color 0.3s, transform 0.25s', cursor: 'pointer',
                      }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--c-accent)'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--c-border)'; e.currentTarget.style.transform = 'translateX(0)'; }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                          {article.categorie && (
                            <span style={{ fontSize: '0.62rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '2px 10px', background: cs.bg, border: `1px solid ${cs.border}`, color: cs.text }}>
                              {article.categorie}
                            </span>
                          )}
                          <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--c-muted)', fontSize: '0.72rem', letterSpacing: '0.05em' }}>
                            <Calendar size={11} /> {formatDate(article.created_at || article.date)}
                          </span>
                        </div>
                        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.35rem', fontWeight: 700, color: 'var(--c-white)', lineHeight: 1.3 }}>
                          {article.titre || article.title}
                        </h2>
                        {article.resume && (
                          <p style={{ color: 'var(--c-muted)', fontSize: '0.83rem', lineHeight: 1.7, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {article.resume}
                          </p>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem', flexWrap: 'wrap', gap: 10 }}>
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            {(article.tags || []).slice(0, 3).map((tag, j) => (
                              <span key={j} className="tag">#{tag}</span>
                            ))}
                          </div>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--c-gold)', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500 }}>
                            Lire l'article <ArrowRight size={12} />
                          </span>
                        </div>
                      </article>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}