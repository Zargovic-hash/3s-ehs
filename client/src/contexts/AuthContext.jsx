import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté au chargement
    const currentUser = authService.getCurrentUser();
    if (currentUser?.role) {
      setUser(currentUser);
    } else if (currentUser) {
      // Session corrompue/partielle: éviter les crashes sur user.role
      authService.logout();
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
      const nextUser = data?.user;
      if (nextUser && !nextUser.role) {
        authService.logout();
        return {
          success: false,
          error: "Réponse serveur invalide (role manquant). Vérifiez l'API d'inscription.",
        };
      }
      if (nextUser?.role) setUser(nextUser);
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
