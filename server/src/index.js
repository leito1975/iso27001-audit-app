import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
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

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

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

// Start server
app.listen(PORT, () => {
    console.log(`
🚀 ISO 27001 Audit API Server
📍 Running on http://localhost:${PORT}
🔧 Environment: ${process.env.NODE_ENV || 'development'}
    `);
});

export default app;
