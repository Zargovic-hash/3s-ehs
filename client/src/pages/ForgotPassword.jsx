import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    try {
      const res = await authService.forgotPassword(email);
      setMessage(res.message || 'Si cet email existe, un lien a été envoyé.');
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la demande');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg card">
        <h1 className="text-2xl font-bold text-emerald-900 mb-4">Mot de passe oublié</h1>
        <p className="text-slate-600 mb-6">Entrez votre email pour recevoir un lien de réinitialisation.</p>
        {message && <p className="mb-4 text-green-700">{message}</p>}
        {error && <p className="mb-4 text-red-600">{error}</p>}
        <form onSubmit={onSubmit} className="space-y-4">
          <input className="field" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="votre.email@exemple.dz" />
          <button className="btn-primary w-full" type="submit" disabled={loading}>
            {loading ? 'Envoi en cours...' : 'Envoyer le lien'}
          </button>
        </form>
        <p className="text-sm text-slate-600 mt-4">
          <Link to="/login" className="text-emerald-800 font-semibold">Retour à la connexion</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
