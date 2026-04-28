import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/database.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Register
router.post('/register', asyncHandler(async (req, res) => {
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
router.post('/login', asyncHandler(async (req, res) => {
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

export default router;
