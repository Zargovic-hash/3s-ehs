import React, { useMemo, useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { documentService } from '../services/api';
import {
  FileText, Download, Calendar, User, Building2, Search, Filter, Sparkles, Clock3
} from 'lucide-react';

const ClientDashboard = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const data = await documentService.getDocuments();
      setDocuments(data.documents || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (documentId, nomFichier) => {
    try {
      const response = await documentService.downloadDocument(documentId);
      
      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', nomFichier);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      alert('Erreur lors du téléchargement du document');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    const sizes = ['Octets', 'Ko', 'Mo', 'Go'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(documents.map((doc) => doc.categorie).filter(Boolean))
    );
    return ['all', ...uniqueCategories];
  }, [documents]);

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchCategory = categoryFilter === 'all' || doc.categorie === categoryFilter;
      const needle = searchTerm.trim().toLowerCase();
      const matchSearch = !needle
        || doc.titre?.toLowerCase().includes(needle)
        || doc.description?.toLowerCase().includes(needle)
        || doc.nom_fichier?.toLowerCase().includes(needle);
      return matchCategory && matchSearch;
    });
  }, [documents, categoryFilter, searchTerm]);

  const latestDocument = useMemo(() => {
    if (!documents.length) return null;
    return [...documents].sort(
      (a, b) => new Date(b.date_upload).getTime() - new Date(a.date_upload).getTime()
    )[0];
  }, [documents]);

  return (
    <div className="min-h-screen" style={{ background: 'var(--c-bg)' }}>
      {/* Header */}
      <div className="py-10" style={{ background: 'linear-gradient(135deg, var(--c-surface), #e6f2ea)' }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--c-white)' }}>Espace Client</h1>
              <p style={{ color: 'var(--c-muted)' }}>
                Bienvenue, <span className="font-semibold" style={{ color: 'var(--c-accent)' }}>{user?.nom}</span>
              </p>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border" style={{ borderColor: 'var(--c-border)', color: 'var(--c-accent)' }}>
              <Sparkles className="h-4 w-4" />
              Espace personnalisé
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Informations du client */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center mb-2">
              <User className="h-5 w-5 text-emerald-900 mr-2" />
              <h3 className="font-semibold text-slate-700">Nom</h3>
            </div>
            <p className="text-lg font-bold text-emerald-900">{user?.nom}</p>
          </div>

          <div className="card">
            <div className="flex items-center mb-2">
              <Building2 className="h-5 w-5 text-emerald-900 mr-2" />
              <h3 className="font-semibold text-slate-700">Entreprise</h3>
            </div>
            <p className="text-lg font-bold text-emerald-900">
              {user?.entreprise || 'Non renseigné'}
            </p>
          </div>

          <div className="card">
            <div className="flex items-center mb-2">
              <FileText className="h-5 w-5 text-emerald-900 mr-2" />
              <h3 className="font-semibold text-slate-700">Documents</h3>
            </div>
            <p className="text-lg font-bold text-emerald-900">
              {documents.length} document{documents.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {latestDocument && (
          <div className="card mb-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-wider mb-1" style={{ color: 'var(--c-muted)' }}>
                  Dernier document ajouté
                </p>
                <h3 className="text-xl font-bold" style={{ color: 'var(--c-white)' }}>{latestDocument.titre}</h3>
                <p className="text-sm mt-1" style={{ color: 'var(--c-muted)' }}>
                  <Clock3 className="inline h-4 w-4 mr-1" />
                  {formatDate(latestDocument.date_upload)}
                </p>
              </div>
              <button
                onClick={() => handleDownload(latestDocument.id, latestDocument.nom_fichier)}
                className="btn-primary"
              >
                <Download className="h-4 w-4 mr-2" />
                Télécharger
              </button>
            </div>
          </div>
        )}

        {/* Liste des documents */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-emerald-900">Mes Documents</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <div className="lg:col-span-2 relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher un titre, description ou nom de fichier..."
                className="field pl-10"
              />
            </div>
            <div className="relative">
              <Filter className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <select
                className="field pl-10"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'Toutes les catégories' : cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-900"></div>
              <p className="mt-4 text-slate-600">Chargement des documents...</p>
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 text-lg">
                {documents.length === 0 ? 'Aucun document disponible' : 'Aucun document ne correspond à votre recherche'}
              </p>
              <p className="text-slate-500 text-sm mt-2">
                {documents.length === 0
                  ? 'Vos rapports et audits apparaîtront ici dès qu\'ils seront disponibles'
                  : 'Essayez de changer le filtre ou le texte de recherche'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Titre</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Catégorie</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Taille</th>
                    <th className="text-right py-3 px-4 font-semibold text-slate-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocuments.map((doc) => (
                    <tr key={doc.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-4 px-4">
                        <div className="font-medium text-slate-900">{doc.titre}</div>
                        {doc.description && (
                          <div className="text-sm text-slate-600 mt-1">{doc.description}</div>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        {doc.categorie && (
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-sm rounded-full">
                            {doc.categorie}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center text-sm text-slate-600">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(doc.date_upload)}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-slate-600">
                        {formatFileSize(doc.taille_fichier)}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => handleDownload(doc.id, doc.nom_fichier)}
                          className="inline-flex items-center px-4 py-2 bg-emerald-900 text-white rounded-lg hover:bg-emerald-800 transition-colors"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Télécharger
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
