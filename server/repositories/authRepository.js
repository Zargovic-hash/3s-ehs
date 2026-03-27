const db = require('../config/database');

class AuthRepository {
  static async findUserIdByEmail(email) {
    return db.query('SELECT id FROM users WHERE email = $1', [email]);
  }

  static async createClientUser({ nom, email, hashedPassword, entreprise, telephone }) {
    return db.query(
      `INSERT INTO users (nom, email, password, role, entreprise, telephone)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, nom, email, role, entreprise, created_at`,
      [nom, email, hashedPassword, 'client', entreprise, telephone]
    );
  }

  static async findUserByEmail(email) {
    return db.query('SELECT * FROM users WHERE email = $1', [email]);
  }

  static async getProfileById(userId) {
    return db.query(
      'SELECT id, nom, email, role, entreprise, telephone, created_at FROM users WHERE id = $1',
      [userId]
    );
  }

  static async updateProfile(userId, { nom, entreprise, telephone }) {
    return db.query(
      `UPDATE users
       SET nom = COALESCE($1, nom),
           entreprise = COALESCE($2, entreprise),
           telephone = COALESCE($3, telephone)
       WHERE id = $4
       RETURNING id, nom, email, role, entreprise, telephone`,
      [nom, entreprise, telephone, userId]
    );
  }

  static async getPasswordByUserId(userId) {
    return db.query('SELECT password FROM users WHERE id = $1', [userId]);
  }

  static async updatePassword(userId, hashedPassword) {
    return db.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, userId]);
  }

  static async upsertResetToken(userId, tokenHash, expiresAt) {
    return db.query(
      `INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id)
       DO UPDATE SET token_hash = EXCLUDED.token_hash, expires_at = EXCLUDED.expires_at, created_at = CURRENT_TIMESTAMP`,
      [userId, tokenHash, expiresAt]
    );
  }

  static async findValidResetToken(tokenHash) {
    return db.query(
      `SELECT id, user_id FROM password_reset_tokens
       WHERE token_hash = $1 AND expires_at > NOW()`,
      [tokenHash]
    );
  }

  static async deleteResetToken(tokenId) {
    return db.query('DELETE FROM password_reset_tokens WHERE id = $1', [tokenId]);
  }
}

module.exports = AuthRepository;
