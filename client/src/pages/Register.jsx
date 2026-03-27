import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const { register, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nom: '',
    email: '',
    entreprise: '',
    telephone: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated()) {
    return <Navigate to={user?.role === 'admin' ? '/admin' : '/client'} replace />;
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    const result = await register(form);
    setLoading(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    setSuccess('Compte créé avec succès. Vous pouvez vous connecter.');
    setTimeout(() => navigate('/login'), 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-xl card">
        <h1 className="text-2xl font-bold text-emerald-900 mb-6 flex items-center">
          <UserPlus className="h-6 w-6 mr-2" />
          Créer un compte client
        </h1>

        {error && <p className="mb-4 text-red-600">{error}</p>}
        {success && <p className="mb-4 text-green-700">{success}</p>}

        <form onSubmit={onSubmit} className="space-y-4">
          <input className="field" placeholder="Nom complet" required value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} />
          <input className="field" placeholder="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="field" placeholder="Entreprise (optionnel)" value={form.entreprise} onChange={(e) => setForm({ ...form, entreprise: e.target.value })} />
          <input className="field" placeholder="Téléphone (optionnel)" value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} />
          <input className="field" placeholder="Mot de passe (8+ caractères)" type="password" required minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />

          <button className="btn-primary w-full" type="submit" disabled={loading}>
            {loading ? 'Création en cours...' : 'Créer mon compte'}
          </button>
        </form>

        <p className="text-sm text-slate-600 mt-4">
          Déjà inscrit ? <Link to="/login" className="text-emerald-800 font-semibold">Se connecter</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
