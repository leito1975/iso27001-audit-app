import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import prisma from '../config/database.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authenticateToken } from '../middleware/auth.js';
import { sendPasswordResetEmail, sendInviteEmail } from '../utils/email.js';
import { loginLimiter, registerLimiter, forgotPasswordLimiter } from '../index.js';

const router = express.Router();

// Register
router.post('/register', registerLimiter, asyncHandler(async (req, res) => {
    const { email, password, name, role = 'auditor' } = req.body;

    if (!email || !password || !name) {
        return res.status(400).json({ error: 'Email, contraseña y nombre son requeridos' });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        return res.status(409).json({ error: 'El email ya está registrado' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const user = await prisma.user.create({
        data: { email, passwordHash, name, role },
        select: { id: true, email: true, name: true, role: true, createdAt: true }
    });

    // Generate token
    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
        message: 'Usuario creado exitosamente',
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
        token
    });
}));

// Login
router.post('/login', loginLimiter, asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Block invited (not yet activated) users
    if (user.status === 'invited' || !user.passwordHash) {
        return res.status(403).json({ error: 'Tu cuenta no está activada. Revisá tu email para el link de activación.' });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generate token
    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
        message: 'Login exitoso',
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
        token
    });
}));

// Get current user
router.get('/me', authenticateToken, asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: { id: true, email: true, name: true, role: true, createdAt: true }
    });

    if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ user });
}));

// Update password
router.put('/password', authenticateToken, asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Contraseña actual y nueva son requeridas' });
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    const validPassword = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!validPassword) {
        return res.status(401).json({ error: 'Contraseña actual incorrecta' });
    }

    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({
        where: { id: req.user.id },
        data: { passwordHash: newPasswordHash }
    });

    res.json({ message: 'Contraseña actualizada exitosamente' });
}));

// Activate account (from invite link)
router.post('/activate', asyncHandler(async (req, res) => {
    const { token, password } = req.body;

    if (!token || !password) {
        return res.status(400).json({ error: 'Token y contraseña son requeridos' });
    }
    if (password.length < 8) {
        return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres' });
    }

    const user = await prisma.user.findFirst({
        where: { inviteToken: token, status: 'invited' }
    });

    if (!user) {
        return res.status(404).json({ error: 'Link de activación inválido o ya utilizado' });
    }

    if (user.inviteExpiry && new Date() > user.inviteExpiry) {
        return res.status(410).json({ error: 'El link de activación expiró. Pedile al administrador que reenvíe la invitación.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const activated = await prisma.user.update({
        where: { id: user.id },
        data: {
            passwordHash,
            status: 'active',
            inviteToken: null,
            inviteExpiry: null
        },
        select: { id: true, email: true, name: true, role: true }
    });

    // Auto-login after activation
    const jwtToken = jwt.sign(
        { id: activated.id, email: activated.email, role: activated.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
        message: 'Cuenta activada exitosamente',
        user: activated,
        token: jwtToken
    });
}));

// Validate invite token (for the activation page to show user info)
router.get('/activate/:token', asyncHandler(async (req, res) => {
    const { token } = req.params;

    const user = await prisma.user.findFirst({
        where: { inviteToken: token, status: 'invited' },
        select: { id: true, email: true, name: true, role: true, inviteExpiry: true }
    });

    if (!user) {
        return res.status(404).json({ error: 'Link inválido o ya utilizado' });
    }
    if (user.inviteExpiry && new Date() > user.inviteExpiry) {
        return res.status(410).json({ error: 'Link expirado' });
    }

    res.json({ user: { email: user.email, name: user.name, role: user.role } });
}));

// ─── Forgot Password ─────────────────────────────────────────────────────────

// POST /auth/forgot-password — generates reset token and sends email
router.post('/forgot-password', forgotPasswordLimiter, asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: 'El email es requerido' });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    // Always respond the same to avoid user enumeration
    const successMsg = 'Si el email existe en el sistema, recibirás un link para resetear tu contraseña.';

    if (!user || user.status !== 'active') {
        return res.json({ message: successMsg });
    }

    // Generate secure token (64 hex chars)
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.user.update({
        where: { id: user.id },
        data: { resetToken, resetExpiry }
    });

    const frontendUrl = process.env.FRONTEND_URL?.split(',')[0]?.trim() || 'http://localhost:5173';
    const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

    const sent = await sendPasswordResetEmail({ to: user.email, name: user.name, resetUrl });

    if (!sent) {
        // SMTP not configured — in dev, return the URL directly
        if (process.env.NODE_ENV === 'development') {
            return res.json({ message: successMsg, devResetUrl: resetUrl });
        }
    }

    res.json({ message: successMsg });
}));

// GET /auth/reset/:token — validates reset token
router.get('/reset/:token', asyncHandler(async (req, res) => {
    const { token } = req.params;

    const user = await prisma.user.findFirst({
        where: { resetToken: token },
        select: { id: true, email: true, resetExpiry: true }
    });

    if (!user) {
        return res.status(404).json({ error: 'Link de reseteo inválido o ya utilizado' });
    }
    if (user.resetExpiry && new Date() > user.resetExpiry) {
        return res.status(410).json({ error: 'El link expiró. Solicitá uno nuevo.' });
    }

    res.json({ valid: true, email: user.email });
}));

// POST /auth/reset-password — sets new password using reset token
router.post('/reset-password', asyncHandler(async (req, res) => {
    const { token, password } = req.body;

    if (!token || !password) {
        return res.status(400).json({ error: 'Token y contraseña son requeridos' });
    }
    if (password.length < 8) {
        return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres' });
    }

    const user = await prisma.user.findFirst({ where: { resetToken: token } });

    if (!user) {
        return res.status(404).json({ error: 'Link de reseteo inválido o ya utilizado' });
    }
    if (user.resetExpiry && new Date() > user.resetExpiry) {
        return res.status(410).json({ error: 'El link expiró. Solicitá uno nuevo.' });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash, resetToken: null, resetExpiry: null }
    });

    res.json({ message: 'Contraseña actualizada exitosamente. Ya podés iniciar sesión.' });
}));

export default router;
