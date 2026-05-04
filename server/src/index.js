import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { apiLimiter } from './middleware/rateLimiter.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/auth.js';
import auditsRoutes from './routes/audits.js';
import controlsRoutes from './routes/controls.js';
import findingsRoutes from './routes/findings.js';
import risksRoutes from './routes/risks.js';
import actionPlansRoutes from './routes/actionPlans.js';
import tagsRoutes from './routes/tags.js';
import statsRoutes from './routes/stats.js';
import usersRoutes from './routes/users.js';

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
    origin: process.env.FRONTEND_URL
        ? process.env.FRONTEND_URL.split(',').map(o => o.trim())
        : ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/api', apiLimiter);

// Request logging in development
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`📥 ${req.method} ${req.path}`);
        next();
    });
}


// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/audits', auditsRoutes);
app.use('/api/controls', controlsRoutes);
app.use('/api/findings', findingsRoutes);
app.use('/api/risks', risksRoutes);
app.use('/api/action-plans', actionPlansRoutes);
app.use('/api/tags', tagsRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/users', usersRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Auto-create admin user on first run if no users exist
// Credentials come from env: ADMIN_EMAIL, ADMIN_PASSWORD (required on first deploy)
async function ensureAdminUser() {
    const prisma = new PrismaClient();
    try {
        const userCount = await prisma.user.count();
        if (userCount === 0) {
            const adminEmail    = process.env.ADMIN_EMAIL    || 'admin@auditia.com';
            const adminPassword = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
            const adminName     = process.env.ADMIN_NAME     || 'Administrador';

            const hash = await bcrypt.hash(adminPassword, 12);
            await prisma.user.create({
                data: {
                    email: adminEmail,
                    passwordHash: hash,
                    name: adminName,
                    role: 'admin',
                    status: 'active'
                }
            });
            console.log(`✅ Admin user created: ${adminEmail}`);
            if (!process.env.ADMIN_PASSWORD) {
                console.warn('⚠️  No ADMIN_PASSWORD env var set — using default. Change this immediately!');
            }
        }
    } catch (e) {
        console.error('Auto-setup error:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}

// Start server
app.listen(PORT, async () => {
    console.log(`
🚀 AuditIA API Server
📍 Running on http://localhost:${PORT}
🔧 Environment: ${process.env.NODE_ENV || 'development'}
    `);
    await ensureAdminUser();
});

export default app;
