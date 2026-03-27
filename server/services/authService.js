const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendPasswordResetEmail, isSmtpConfigured } = require('./mailService');
const AuthRepository = require('../repositories/authRepository');

class AuthService {
  static async register({ nom, email, password, entreprise, telephone }) {
    const normalizedEmail = email.toLowerCase();
    const existingUser = await AuthRepository.findUserIdByEmail(normalizedEmail);

    if (existingUser.rows.length > 0) {
      return { error: 'Cet email est déjà utilisé', status: 400 };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await AuthRepository.createClientUser({
      nom,
      email: normalizedEmail,
      hashedPassword,
      entreprise,
      telephone
    });

    return { user: result.rows[0] };
  }

  static async login({ email, password }) {
    const result = await AuthRepository.findUserByEmail(email.toLowerCase());
    if (result.rows.length === 0) {
      return { error: 'Identifiants invalides', status: 401 };
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return { error: 'Identifiants invalides', status: 401 };
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, nom: user.nom },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    const { password: _, ...userWithoutPassword } = user;
    return { token, user: userWithoutPassword };
  }

  static async getProfile(userId) {
    const result = await AuthRepository.getProfileById(userId);
    return result.rows[0] || null;
  }

  static async updateProfile(userId, { nom, entreprise, telephone }) {
    const result = await AuthRepository.updateProfile(userId, { nom, entreprise, telephone });
    return result.rows[0];
  }

  static async changePassword(userId, { currentPassword, newPassword }) {
    const result = await AuthRepository.getPasswordByUserId(userId);
    const user = result.rows[0];
    if (!user) {
      return { error: 'Utilisateur non trouvé', status: 404 };
    }

    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword) {
      return { error: 'Mot de passe actuel incorrect', status: 401 };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await AuthRepository.updatePassword(userId, hashedPassword);
    return { ok: true };
  }

  static getResetUrl(rawToken) {
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    return `${clientUrl.replace(/\/$/, '')}/reset-password?token=${rawToken}`;
  }

  static async forgotPassword(email) {
    const normalizedEmail = email.toLowerCase();
    const userResult = await AuthRepository.findUserIdByEmail(normalizedEmail);
    if (userResult.rows.length === 0) {
      return { ok: true };
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    try {
      if (!isSmtpConfigured()) {
        return { ok: true };
      }
      await AuthRepository.upsertResetToken(userResult.rows[0].id, tokenHash, expiresAt);
      const resetUrl = this.getResetUrl(rawToken);
      await sendPasswordResetEmail(normalizedEmail, resetUrl);
    } catch (error) {
      console.error('Erreur envoi forgotPassword:', error);
      return { error: 'Erreur lors de la demande de reinitialisation du mot de passe', status: 500 };
    }
    return { ok: true };
  }

  static async resetPassword(token, newPassword) {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const tokenResult = await AuthRepository.findValidResetToken(tokenHash);

    if (tokenResult.rows.length === 0) {
      return { error: 'Token invalide ou expire', status: 400 };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await AuthRepository.updatePassword(tokenResult.rows[0].user_id, hashedPassword);
    await AuthRepository.deleteResetToken(tokenResult.rows[0].id);
    return { ok: true };
  }
}

module.exports = AuthService;
