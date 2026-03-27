import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  Users, 
  FileText, 
  MessageSquare,
  Trash2,
} from 'lucide-react';
import { documentService, userService, contactService } from '../services/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('documents');
  const [documents, setDocuments] = useState([]);
  const [clients, setClients] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);

  const [uploadForm, setUploadForm] = useState({
    titre: '',
    description: '',
    client_id: '',
    categorie: '',
    file: null
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'documents') {
        const docsData = await documentService.getDocuments();
        setDocuments(docsData.documents || []);
      } else if (activeTab === 'clients') {
        // ✅ FIX: getAllUsers() n'existe pas → getUsers(), filtrer role='client' côté client
        const usersData = await userService.getUsers();
        setClients((usersData.users || []).filter(u => u.role === 'client'));
      } else if (activeTab === 'contacts') {
        // ✅ FIX: getContactLeads() n'existe pas → getContacts(), données dans .contacts
        const leadsData = await contactService.getContacts();
        setLeads(leadsData.contacts || leadsData.leads || []);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setUploadForm({ ...uploadForm, file: e.target.files[0] });
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadForm.file || !uploadForm.titre || !uploadForm.client_id) {
      alert('Veuillez remplir tous les champs requis');
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', uploadForm.file);
      formData.append('titre', uploadForm.titre);
      formData.append('description', uploadForm.description);
      formData.append('client_id', uploadForm.client_id);
      formData.append('categorie', uploadForm.categorie);
      await documentService.uploadDocument(formData);
      alert('Document uploadé avec succès!');
      setUploadForm({ titre: '', description: '', client_id: '', categorie: '', file: null });
      const fileInput = document.getElementById('file-upload');
      if (fileInput) fileInput.value = '';
      fetchData();
    } catch (error) {
      alert(error.response?.data?.error || 'Erreur lors de l\'upload du document');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDocument = async (documentId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce document?')) return;
    try {
      await documentService.deleteDocument(documentId);
      fetchData();
    } catch (error) {
      alert('Erreur lors de la suppression du document');
    }
  };

  const handleLeadStatusUpdate = async (leadId, statut) => {
    try {
      await contactService.updateStatus(leadId, statut);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.error || 'Erreur lors de la mise à jour du statut');
    }
  };

  const handleDeleteLead = async (leadId) => {
    if (!window.confirm('Supprimer cette demande de contact ?')) return;
    try {
      await contactService.deleteContact(leadId);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.error || 'Erreur lors de la suppression');
    }
  };

  const handleResetClientPassword = async (clientId) => {
    const newPassword = window.prompt('Nouveau mot de passe (minimum 6 caractères):');
    if (!newPassword) return;
    try {
      await userService.resetPassword(clientId, newPassword);
      alert('Mot de passe réinitialisé.');
    } catch (error) {
      alert(error.response?.data?.error || 'Erreur lors de la réinitialisation');
    }
  };

  const handleDeleteClient = async (clientId) => {
    if (!window.confirm('Supprimer ce client ?')) return;
    try {
      await userService.deleteUser(clientId);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.error || 'Erreur lors de la suppression du client');
    }
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('fr-FR');

  // ✅ FIX: idem ici, getAllUsers() → getUsers() + filtre client
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await userService.getUsers();
        setClients((data.users || []).filter(u => u.role === 'client'));
      } catch (error) {
        console.error('Erreur lors de la récupération des clients:', error);
      }
    };
    fetchClients();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-emerald-900 text-white py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">Tableau de Bord Administrateur</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex space-x-4 mb-8 border-b border-slate-200">
          {[
            { key: 'documents', Icon: FileText, label: 'Documents' },
            { key: 'clients', Icon: Users, label: 'Clients' },
            { key: 'contacts', Icon: MessageSquare, label: 'Demandes de Contact' },
          ].map(({ key, Icon, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`pb-4 px-4 font-semibold transition-colors ${
                activeTab === key
                  ? 'border-b-2 border-emerald-900 text-emerald-900'
                  : 'text-slate-600 hover:text-emerald-900'
              }`}
            >
              <Icon className="inline h-5 w-5 mr-2" />
              {label}
            </button>
          ))}
        </div>

        {/* ── Documents Tab ── */}
        {activeTab === 'documents' && (
          <div className="space-y-8">
            <div className="card">
              <h2 className="text-2xl font-bold text-emerald-900 mb-6 flex items-center">
                <Upload className="h-6 w-6 mr-2" />
                Uploader un Document
              </h2>
              <form onSubmit={handleUploadSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Titre du document *</label>
                    <input
                      type="text"
                      value={uploadForm.titre}
                      onChange={(e) => setUploadForm({ ...uploadForm, titre: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Client *</label>
                    <select
                      value={uploadForm.client_id}
                      onChange={(e) => setUploadForm({ ...uploadForm, client_id: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">Sélectionner un client</option>
                      {clients.map((client) => (
                        <option key={client.id} value={client.id}>
                          {client.nom} - {client.entreprise || 'Sans entreprise'}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Catégorie</label>
                    <select
                      value={uploadForm.categorie}
                      onChange={(e) => setUploadForm({ ...uploadForm, categorie: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">Sélectionner une catégorie</option>
                      <option value="EIE">Étude d'Impact Environnemental</option>
                      <option value="Audit">Audit de Conformité</option>
                      <option value="PANDRU">Plan de Gestion</option>
                      <option value="Notice">Notice d'Impact</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Fichier *</label>
                    <input
                      id="file-upload"
                      type="file"
                      onChange={handleFileChange}
                      required
                      accept=".pdf,.xlsx,.xls,.docx,.doc,.dwg,.dxf"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                    <p className="text-xs text-slate-500 mt-1">Formats acceptés: PDF, Excel, Word, DWG (max 10MB)</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                  <textarea
                    value={uploadForm.description}
                    onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                    rows="3"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    placeholder="Description optionnelle du document..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={uploading}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <Upload className="h-5 w-5 mr-2" />
                  {uploading ? 'Upload en cours...' : 'Uploader le document'}
                </button>
              </form>
            </div>

            <div className="card">
              <h2 className="text-2xl font-bold text-emerald-900 mb-6">
                Tous les Documents ({documents.length})
              </h2>
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-900" />
                </div>
              ) : documents.length === 0 ? (
                <p className="text-center text-slate-600 py-8">Aucun document uploadé</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Titre</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Client</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Catégorie</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Date</th>
                        <th className="text-right py-3 px-4 font-semibold text-slate-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {documents.map((doc) => (
                        <tr key={doc.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-4 px-4 font-medium">{doc.titre}</td>
                          <td className="py-4 px-4 text-sm">
                            <div>{doc.client_nom}</div>
                            <div className="text-slate-500">{doc.client_entreprise}</div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded">
                              {doc.categorie || 'N/A'}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-sm text-slate-600">{formatDate(doc.date_upload)}</td>
                          <td className="py-4 px-4 text-right">
                            <button
                              onClick={() => handleDeleteDocument(doc.id)}
                              className="text-red-600 hover:text-red-800 p-2"
                            >
                              <Trash2 className="h-5 w-5" />
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
        )}

        {/* ── Clients Tab ── */}
        {activeTab === 'clients' && (
          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-900 mb-6">
              Liste des Clients ({clients.length})
            </h2>
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-900" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">Nom</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">Email</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">Entreprise</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">Téléphone</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">Date d'inscription</th>
                      <th className="text-right py-3 px-4 font-semibold text-slate-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((client) => (
                      <tr key={client.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-4 px-4 font-medium">{client.nom}</td>
                        <td className="py-4 px-4">{client.email}</td>
                        <td className="py-4 px-4">{client.entreprise || 'N/A'}</td>
                        <td className="py-4 px-4">{client.telephone || 'N/A'}</td>
                        <td className="py-4 px-4 text-sm text-slate-600">{formatDate(client.created_at)}</td>
                        <td className="py-4 px-4 text-right space-x-2">
                          <button className="text-xs px-2 py-1 bg-amber-100 text-amber-800 rounded" onClick={() => handleResetClientPassword(client.id)}>
                            Reset MDP
                          </button>
                          <button className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded" onClick={() => handleDeleteClient(client.id)}>
                            Supprimer
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── Contacts Tab ── */}
        {activeTab === 'contacts' && (
          <div className="card">
            <h2 className="text-2xl font-bold text-emerald-900 mb-6">
              Demandes de Contact ({leads.length})
            </h2>
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-900" />
              </div>
            ) : (
              <div className="space-y-4">
                {leads.map((lead) => (
                  <div key={lead.id} className="border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg text-emerald-900">{lead.nom}</h3>
                        <p className="text-sm text-slate-600">{lead.entreprise}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        lead.statut === 'nouveau' ? 'bg-blue-100 text-blue-800' :
                        lead.statut === 'en_cours' ? 'bg-yellow-100 text-yellow-800' :
                        lead.statut === 'traité' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {lead.statut}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div><span className="text-sm text-slate-600">Email:</span><p className="font-medium">{lead.email}</p></div>
                      <div><span className="text-sm text-slate-600">Téléphone:</span><p className="font-medium">{lead.telephone || 'Non renseigné'}</p></div>
                      <div><span className="text-sm text-slate-600">Sujet:</span><p className="font-medium">{lead.sujet || 'N/A'}</p></div>
                      <div><span className="text-sm text-slate-600">Date:</span><p className="font-medium">{formatDate(lead.created_at)}</p></div>
                    </div>
                    <div>
                      <span className="text-sm text-slate-600">Message:</span>
                      <p className="mt-1 text-slate-800">{lead.message}</p>
                    </div>
                    <div className="mt-4 flex items-center justify-end gap-2">
                      <select
                        value={lead.statut}
                        onChange={(e) => handleLeadStatusUpdate(lead.id, e.target.value)}
                        className="px-3 py-2 border border-slate-300 rounded"
                      >
                        <option value="nouveau">nouveau</option>
                        <option value="en_cours">en_cours</option>
                        <option value="traité">traité</option>
                        <option value="archivé">archivé</option>
                      </select>
                      <button className="text-xs px-3 py-2 bg-red-100 text-red-700 rounded" onClick={() => handleDeleteLead(lead.id)}>
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;