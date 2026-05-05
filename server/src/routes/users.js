import express from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import prisma from '../config/database.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authenticateToken } from '../middleware/auth.js';
import { sendInviteEmail, emailConfigured } from '../utils/email.js';

const router = express.Router();

const requireAdmin = (req, res, next) => {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ error: 'Se requieren permisos de administrador' });
    }
    next();
};

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5174';

// GET /users — list all users (admin only)
router.get('/', authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
    const users = await prisma.user.findMany({
        select: { id: true, email: true, name: true, role: true, status: true, createdAt: true },
        orderBy: { createdAt: 'asc' }
    });
    res.json({ users });
}));

// POST /users — invite a new user (admin only)
// Creates user with status='invited', sends email with activation link
router.post('/', authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
    const { email, name, role = 'auditor' } = req.body;

    if (!email || !name) {
        return res.status(400).json({ error: 'Email y nombre son requeridos' });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        return res.status(409).json({ error: 'El email ya está registrado' });
    }

    // Generate secure invite token (72h expiry)
    const inviteToken = crypto.randomBytes(32).toString('hex');
    const inviteExpiry = new Date(Date.now() + 72 * 60 * 60 * 1000);

    const user = await prisma.user.create({
        data: {
            email,
            name,
            role,
            status: 'invited',
            inviteToken,
            inviteExpiry,
            passwordHash: null
        },
        select: { id: true, email: true, name: true, role: true, status: true, createdAt: true }
    });

    const inviteUrl = `${FRONTEND_URL}/activate?token=${inviteToken}`;

    // Try to send email
    let emailSent = false;
    try {
        emailSent = await sendInviteEmail({ to: email, name, inviteUrl });
    } catch (err) {
        console.error('Error sending invite email:', err.message);
    }

    res.status(201).json({
        user,
        inviteUrl,           // Always return so admin can copy it manually
        emailSent,
        emailConfigured: emailConfigured(),
        message: emailSent
            ? `Invitación enviada a ${email}`
            : `Usuario creado. Compartí el link de activación manualmente.`
    });
}));

// PUT /users/:id — update user (admin only)
router.put('/:id', authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, email, role, password } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) {
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing && existing.id !== parseInt(id)) {
            return res.status(409).json({ error: 'El email ya está en uso' });
        }
        updateData.email = email;
    }
    if (role !== undefined) updateData.role = role;
    if (password) {
        const salt = await bcrypt.genSalt(10);
        updateData.passwordHash = await bcrypt.hash(password, salt);
        updateData.status = 'active';
        updateData.inviteToken = null;
        updateData.inviteExpiry = null;
    }

    const user = await prisma.user.update({
        where: { id: parseInt(id) },
        data: updateData,
        select: { id: true, email: true, name: true, role: true, status: true, createdAt: true }
    });

    res.json({ user, message: 'Usuario actualizado' });
}));

// POST /users/:id/resend-invite — resend invitation email
router.post('/:id/resend-invite', authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await prisma.user.findUnique({ where: { id: parseInt(id) } });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    if (user.status !== 'invited') return res.status(400).json({ error: 'El usuario ya está activo' });

    // Regenerate token
    const inviteToken = crypto.randomBytes(32).toString('hex');
    const inviteExpiry = new Date(Date.now() + 72 * 60 * 60 * 1000);

    await prisma.user.update({
        where: { id: parseInt(id) },
        data: { inviteToken, inviteExpiry }
    });

    const inviteUrl = `${FRONTEND_URL}/activate?token=${inviteToken}`;

    let emailSent = false;
    try {
        emailSent = await sendInviteEmail({ to: user.email, name: user.name, inviteUrl });
    } catch (err) {
        console.error('Error resending invite:', err.message);
    }

    res.json({ inviteUrl, emailSent, message: emailSent ? 'Invitación reenviada' : 'Link generado' });
}));

// DELETE /users/:id — delete user (admin only, can't delete self)
router.delete('/:id', authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (parseInt(id) === req.user.id) {
        return res.status(400).json({ error: 'No podés eliminar tu propio usuario' });
    }

    try {
        await prisma.user.delete({ where: { id: parseInt(id) } });
        res.json({ message: 'Usuario eliminado' });
    } catch (e) {
        if (e.code === 'P2025') {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        throw e;
    }
}));

// POST /users/:id/activate — force-activate a pending user (admin only)
router.post('/:id/activate', authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({ where: { id: parseInt(req.params.id) } });

    if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    await prisma.user.update({
        where: { id: user.id },
        data: { status: 'active', verifyToken: null, verifyExpiry: null }
    });

    res.json({ message: `Usuario ${user.email} activado correctamente` });
}));

export default router;
