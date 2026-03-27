import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté au chargement
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);
      const nextUser = data?.user;
      if (!nextUser) {
        return {
          success: false,
          error: "Réponse serveur invalide (utilisateur manquant). Vérifiez l'URL API et le backend.",
        };
      }
      if (!nextUser.role) {
        return {
          success: false,
          error: "Réponse serveur invalide (role manquant). Vérifiez l'API d'authentification.",
        };
      }
      setUser(nextUser);
      return { success: true, user: nextUser };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Erreur de connexion' 
      };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const register = async (userData) => {
    try {
      const data = await authService.register(userData);
      // Some APIs auto-login on register; if so, keep UI consistent.
      if (data?.token) localStorage.setItem('token', data.token);
      if (data?.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
      }
      return { success: true, data };
    } catch (error) {
      const validationError = error.response?.data?.errors?.[0]?.msg;
      return { 
        success: false, 
        error: validationError || error.response?.data?.error || 'Erreur d\'inscription' 
      };
    }
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const isAuthenticated = () => {
    return !!user;
  };

  const value = {
    user,
    login,
    logout,
    register,
    isAdmin,
    isAuthenticated,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};

export default AuthContext;
