import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { authService } from '../services/api';

const ResetPassword = () => {
  const [params] = useSearchParams();
  const token = useMemo(() => params.get('token') || '', [params]);
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    try {
      const res = await authService.resetPassword(token, newPassword);
      setMessage(res.message || 'Mot de passe réinitialisé avec succès.');
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la réinitialisation');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="card w-full max-w-lg">
          <p className="text-red-600">Lien invalide: token manquant.</p>
          <Link to="/forgot-password" className="text-emerald-800 font-semibold">Demander un nouveau lien</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg card">
        <h1 className="text-2xl font-bold text-emerald-900 mb-4">Réinitialiser le mot de passe</h1>
        {message && <p className="mb-4 text-green-700">{message}</p>}
        {error && <p className="mb-4 text-red-600">{error}</p>}
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            className="field"
            type="password"
            minLength={8}
            required
            placeholder="Nouveau mot de passe"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button className="btn-primary w-full" type="submit" disabled={loading}>
            {loading ? 'Réinitialisation...' : 'Réinitialiser'}
          </button>
        </form>
        <p className="text-sm text-slate-600 mt-4">
          <Link to="/login" className="text-emerald-800 font-semibold">Retour à la connexion</Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
