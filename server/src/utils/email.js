import nodemailer from 'nodemailer';

const APP_NAME = 'AuditIA';
const APP_COLOR = '#6366f1';

function getTransporter() {
    const { EMAIL_HOST, EMAIL_USER, EMAIL_PASS } = process.env;
    if (!EMAIL_HOST || !EMAIL_USER || !EMAIL_PASS) return null;

    return nodemailer.createTransport({
        host: EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: process.env.EMAIL_PORT === '465',
        auth: { user: EMAIL_USER, pass: EMAIL_PASS },
        connectionTimeout: 8000,   // 8 seconds max to connect
        greetingTimeout: 8000,
        socketTimeout: 10000
    });
}

function baseTemplate(bodyHtml) {
    return `
    <div style="font-family: Inter, Arial, sans-serif; max-width: 520px; margin: 0 auto;
                background: #0f172a; color: #e2e8f0; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
                    padding: 28px 32px; text-align: center;
                    border-bottom: 1px solid rgba(255,255,255,0.08);">
            <h1 style="margin: 0; font-size: 1.4rem; color: ${APP_COLOR};">🔐 ${APP_NAME}</h1>
            <p style="margin: 4px 0 0; font-size: 0.75rem; color: #64748b; letter-spacing: 2px; text-transform: uppercase;">
                Audit Intelligence Platform
            </p>
        </div>
        <div style="padding: 32px;">${bodyHtml}</div>
        <div style="padding: 16px 32px; border-top: 1px solid rgba(255,255,255,0.06);
                    font-size: 0.75rem; color: #475569; text-align: center;">
            Este mensaje fue generado automáticamente por ${APP_NAME} · AonikLabs
        </div>
    </div>`;
}

/**
 * Sends an invitation email to a new user.
 * Returns true if sent, false if SMTP not configured.
 */
export async function sendInviteEmail({ to, name, inviteUrl }) {
    const transporter = getTransporter();
    if (!transporter) return false;

    const from = process.env.EMAIL_FROM || process.env.EMAIL_USER;

    await transporter.sendMail({
        from: `"${APP_NAME}" <${from}>`,
        to,
        subject: `Invitación a ${APP_NAME}`,
        html: baseTemplate(`
            <p style="margin-top: 0;">Hola <strong>${name}</strong>,</p>
            <p>Fuiste invitado a usar <strong>${APP_NAME}</strong>. Hacé clic abajo para activar tu cuenta y configurar tu contraseña.</p>
            <div style="text-align: center; margin: 32px 0;">
                <a href="${inviteUrl}"
                   style="display: inline-block; background: ${APP_COLOR}; color: #fff;
                          text-decoration: none; padding: 14px 32px; border-radius: 8px;
                          font-weight: 600; font-size: 1rem;">
                    Activar mi cuenta
                </a>
            </div>
            <p style="font-size: 0.85rem; color: #94a3b8;">Este link expira en 72 horas.</p>
            <p style="font-size: 0.8rem; color: #64748b; border-top: 1px solid rgba(255,255,255,0.06);
                       padding-top: 16px; margin-bottom: 0;">
                Link directo: <a href="${inviteUrl}" style="color: ${APP_COLOR};">${inviteUrl}</a>
            </p>
        `)
    });

    return true;
}

/**
 * Sends a password reset email.
 * Returns true if sent, false if SMTP not configured.
 */
export async function sendPasswordResetEmail({ to, name, resetUrl }) {
    const transporter = getTransporter();
    if (!transporter) return false;

    const from = process.env.EMAIL_FROM || process.env.EMAIL_USER;

    await transporter.sendMail({
        from: `"${APP_NAME}" <${from}>`,
        to,
        subject: `Reseteo de contraseña — ${APP_NAME}`,
        html: baseTemplate(`
            <p style="margin-top: 0;">Hola <strong>${name}</strong>,</p>
            <p>Recibimos una solicitud para resetear la contraseña de tu cuenta en <strong>${APP_NAME}</strong>.</p>
            <div style="text-align: center; margin: 32px 0;">
                <a href="${resetUrl}"
                   style="display: inline-block; background: ${APP_COLOR}; color: #fff;
                          text-decoration: none; padding: 14px 32px; border-radius: 8px;
                          font-weight: 600; font-size: 1rem;">
                    Resetear mi contraseña
                </a>
            </div>
            <p style="font-size: 0.85rem; color: #94a3b8;">
                Este link expira en <strong>1 hora</strong>. Si no solicitaste este cambio, podés ignorar este mensaje — tu contraseña no será modificada.
            </p>
            <p style="font-size: 0.8rem; color: #64748b; border-top: 1px solid rgba(255,255,255,0.06);
                       padding-top: 16px; margin-bottom: 0;">
                Link directo: <a href="${resetUrl}" style="color: ${APP_COLOR};">${resetUrl}</a>
            </p>
        `)
    });

    return true;
}

export const emailConfigured = () => !!(process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS);
