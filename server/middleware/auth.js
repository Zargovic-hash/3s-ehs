const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    // Récupérer le token depuis les headers
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Accès non autorisé - Token manquant' 
      });
    }

    const token = authHeader.substring(7);

    // Vérifier et décoder le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attacher les informations utilisateur à la requête
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      nom: decoded.nom
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expiré - Veuillez vous reconnecter' 
      });
    }
    
    return res.status(401).json({ 
      error: 'Token invalide' 
    });
  }
};

// Middleware pour vérifier le rôle admin
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      error: 'Accès refusé - Privilèges administrateur requis' 
    });
  }
  next();
};

// Middleware pour vérifier que l'utilisateur accède à ses propres ressources
const ownerOrAdmin = (req, res, next) => {
  const requestedUserId = req.params.userId || req.params.clientId;
  
  if (req.user.role === 'admin' || req.user.id === requestedUserId) {
    next();
  } else {
    return res.status(403).json({ 
      error: 'Accès refusé - Vous ne pouvez accéder qu\'à vos propres ressources' 
    });
  }
};

module.exports = {
  authMiddleware,
  adminOnly,
  ownerOrAdmin
};
