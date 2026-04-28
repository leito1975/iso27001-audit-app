import express from 'express';
import prisma from '../config/database.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all action plans
router.get('/', asyncHandler(async (req, res) => {
    const { status, overdue } = req.query;

    const where = {};
    if (status) where.status = status;
    if (overdue === 'true') {
        where.dueDate = { lt: new Date() };
        where.status = { not: 'completado' };
    }

    const actionPlans = await prisma.actionPlan.findMany({
        where,
        include: {
            finding: { select: { title: true } },
            risk: { select: { name: true } }
        },
        orderBy: [{ dueDate: 'asc' }, { createdAt: 'desc' }]
    });

    const result = actionPlans.map(ap => ({
        ...ap,
        finding_title: ap.finding?.title ?? null,
        risk_name: ap.risk?.name ?? null,
        finding: undefined,
        risk: undefined
    }));

    res.json({ actionPlans: result });
}));

// Get action plan by ID
router.get('/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;

    const actionPlan = await prisma.actionPlan.findUnique({
        where: { id: parseInt(id) },
        include: {
            finding: { select: { title: true } },
            risk: { select: { name: true } }
        }
    });

    if (!actionPlan) {
        return res.status(404).json({ error: 'Plan de acción no encontrado' });
    }

    const result = {
        ...actionPlan,
        finding_title: actionPlan.finding?.title ?? null,
        risk_name: actionPlan.risk?.name ?? null,
        finding: undefined,
        risk: undefined
    };

    res.json({ actionPlan: result });
}));

// Create action plan
router.post('/', authenticateToken, asyncHandler(async (req, res) => {
    const { title, description, findingId, riskId, responsible, dueDate } = req.body;

    if (!title) {
        return res.status(400).json({ error: 'El título es requerido' });
    }

    const actionPlan = await prisma.actionPlan.create({
        data: {
            title,
            description,
            findingId: findingId ? parseInt(findingId) : null,
            riskId: riskId ? parseInt(riskId) : null,
            responsible,
            dueDate: dueDate ? new Date(dueDate) : null
        }
    });

    res.status(201).json({ actionPlan, message: 'Plan de acción creado' });
}));

// Update action plan
router.put('/:id', authenticateToken, asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, description, responsible, dueDate, status } = req.body;

    try {
        const actionPlan = await prisma.actionPlan.update({
            where: { id: parseInt(id) },
            data: {
                ...(title !== undefined && { title }),
                ...(description !== undefined && { description }),
                ...(responsible !== undefined && { responsible }),
                ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
                ...(status !== undefined && { status })
            }
        });

        res.json({ actionPlan, message: 'Plan actualizado' });
    } catch (e) {
        if (e.code === 'P2025') {
            return res.status(404).json({ error: 'Plan de acción no encontrado' });
        }
        throw e;
    }
}));

// Delete action plan
router.delete('/:id', authenticateToken, asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.actionPlan.delete({ where: { id: parseInt(id) } });
        res.json({ message: 'Plan de acción eliminado' });
    } catch (e) {
        if (e.code === 'P2025') {
            return res.status(404).json({ error: 'Plan de acción no encontrado' });
        }
        throw e;
    }
}));

export default router;
