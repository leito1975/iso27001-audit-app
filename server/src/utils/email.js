import nodemailer from 'nodemailer';

/**
 * Returns a configured nodemailer transporter, or null if SMTP is not set up.
 * Configure via environment variables:
 *   EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, EMAIL_FROM
 */
function getTransporter() {
    const { EMAIL_HOST, EMAIL_USER, EMAIL_PASS } = process.env;
    if (!EMAIL_HOST || !EMAIL_USER || !EMAIL_PASS) return null;

    return nodemailer.createTransport({
        host: EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: process.env.EMAIL_PORT === '465',
        auth: { user: EMAIL_USER, pass: EMAIL_PASS }
    });
}

/**
 * Sends an invitation email to a new user.
 * Returns true if sent, false if SMTP not configured (caller should show the link in UI).
 */
export async function sendInviteEmail({ to, name, inviteUrl }) {
    const transporter = getTransporter();
    if (!transporter) return false;

    const from = process.env.EMAIL_FROM || process.env.EMAIL_USER;

    await transporter.sendMail({
        from: `"ISO 27001 Audit Pro" <${from}>`,
        to,
        subject: 'Invitación a ISO 27001 Audit Pro',
        html: `
        <div style="font-family: Inter, Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #0f172a; color: #e2e8f0; border-radius: 12px; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 32px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.08);">
                <h1 style="margin: 0; font-size: 1.5rem; color: #6366f1;">🔐 ISO 27001 Audit Pro</h1>
            </div>
            <div style="padding: 32px;">
                <p style="margin-top: 0;">Hola <strong>${name}</strong>,</p>
                <p>Fuiste invitado a usar <strong>ISO 27001 Audit Pro</strong>. Para activar tu cuenta y configurar tu contraseña, hacé clic en el botón de abajo.</p>
                <div style="text-align: center; margin: 32px 0;">
                    <a href="${inviteUrl}"
                       style="display: inline-block; background: #6366f1; color: #fff; text-decoration: none;
                              padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 1rem;">
                        Activar mi cuenta
                    </a>
                </div>
                <p style="font-size: 0.85rem; color: #94a3b8;">Este link expira en 72 horas. Si no esperabas esta invitación, podés ignorar este mensaje.</p>
                <p style="font-size: 0.8rem; color: #64748b; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 16px; margin-bottom: 0;">
                    Link directo: <a href="${inviteUrl}" style="color: #6366f1;">${inviteUrl}</a>
                </p>
            </div>
        </div>
        `
    });

    return true;
}

export const emailConfigured = () => !!(process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS);
