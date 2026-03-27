const nodemailer = require('nodemailer');

function buildTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

function isSmtpConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

async function sendPasswordResetEmail(email, resetUrl) {
  if (!isSmtpConfigured()) {
    throw new Error('SMTP_NOT_CONFIGURED');
  }
  if (!sendPasswordResetEmail.transporter) {
    sendPasswordResetEmail.transporter = buildTransporter();
  }
  const transporter = sendPasswordResetEmail.transporter;
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  await transporter.sendMail({
    from,
    to: email,
    subject: 'Reinitialisation de votre mot de passe',
    text: `Vous avez demande une reinitialisation de mot de passe.\n\nCliquez sur ce lien: ${resetUrl}\n\nCe lien expire dans 1 heure.\nSi vous n'etes pas a l'origine de cette demande, ignorez cet email.`,
    html: `
      <p>Vous avez demande une reinitialisation de mot de passe.</p>
      <p><a href="${resetUrl}">Reinitialiser mon mot de passe</a></p>
      <p>Ce lien expire dans 1 heure.</p>
      <p>Si vous n'etes pas a l'origine de cette demande, ignorez cet email.</p>
    `
  });
}

module.exports = {
  sendPasswordResetEmail,
  isSmtpConfigured
};
