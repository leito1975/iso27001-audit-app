import express from 'express';
import prisma from '../config/database.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Helper: flatten controls from RiskControl junction
function mapRisk(r) {
    return {
        ...r,
        controls: (r.controls || []).map(rc => rc.control),
        riskScore: (r.probability || 0) * (r.impact || 0)
    };
}

// Get all risks
router.get('/', asyncHandler(async (req, res) => {
    const { status, category, tag, auditId } = req.query;

    const where = {};
    if (status) where.status = status;
    if (category) where.category = category;
    if (auditId) where.auditId = parseInt(auditId);
    else where.auditId = null;

    const risks = await prisma.risk.findMany({
        where,
        include: {
            controls: {
                include: {
                    control: { select: { id: true, name: true, category: true } }
                }
            },
            tags: {
                include: {
                    tag: { select: { id: true, name: true, color: true } }
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    let result = risks.map(r => ({
        ...mapRisk(r),
        tags: r.tags.map(rt => rt.tag)
    }));

    // Sort by risk score (probability * impact) desc
    result.sort((a, b) => b.riskScore - a.riskScore);

    // Filter by tag
    if (tag) {
        result = result.filter(r => r.tags.some(t => t.id === parseInt(tag)));
    }

    res.json({ risks: result });
}));

// Get risk by ID
router.get('/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;

    const risk = await prisma.risk.findUnique({
        where: { id: parseInt(id) },
        include: {
            controls: {
                include: {
                    control: { select: { id: true, name: true, category: true } }
                }
            },
            tags: {
                include: {
                    tag: { select: { id: true, name: true, color: true } }
                }
            }
        }
    });

    if (!risk) {
        return res.status(404).json({ error: 'Riesgo no encontrado' });
    }

    const result = {
        ...mapRisk(risk),
        tags: risk.tags.map(rt => rt.tag)
    };

    res.json({ risk: result });
}));

// Create risk
router.post('/', authenticateToken, asyncHandler(async (req, res) => {
    const {
        name, description, category, probability, impact, status,
        treatment, treatmentPlan, owner, targetDate,
        residualProbability, residualImpact, residualNotes, residualEvaluatedAt,
        auditId, controlIds = [], tags = []
    } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'El nombre es requerido' });
    }

    const risk = await prisma.risk.create({
        data: {
            name,
            description,
            category,
            probability,
            impact,
            status: status || 'identificado',
            treatment,
            treatmentPlan,
            owner,
            targetDate: targetDate ? new Date(targetDate) : null,
            residualProbability,
            residualImpact,
            residualNotes,
            residualEvaluatedAt: residualEvaluatedAt ? new Date(residualEvaluatedAt) : null,
            auditId: auditId ? parseInt(auditId) : null,
            ...(controlIds.length > 0 && {
                controls: {
                    create: controlIds.map(controlId => ({ controlId }))
                }
            }),
            ...(tags.length > 0 && {
                tags: {
                    create: tags.map(tagId => ({ tagId }))
                }
            })
        },
        include: {
            controls: {
                include: {
                    control: { select: { id: true, name: true, category: true } }
                }
            }
        }
    });

    res.status(201).json({
        risk: {
            ...risk,
            controls: risk.controls.map(rc => rc.control),
            riskScore: (risk.probability || 0) * (risk.impact || 0)
        },
        message: 'Riesgo creado exitosamente'
    });
}));

// Update risk
router.put('/:id', authenticateToken, asyncHandler(async (req, res) => {
    const { id } = req.params;
    const {
        name, description, category, probability, impact, status, treatment,
        treatmentPlan, owner, targetDate,
        residualProbability, residualImpact, residualNotes, residualEvaluatedAt,
        controlIds, tags
    } = req.body;

    const risk = await prisma.risk.update({
        where: { id: parseInt(id) },
        data: {
            ...(name !== undefined && { name }),
            ...(description !== undefined && { description }),
            ...(category !== undefined && { category }),
            ...(probability !== undefined && { probability }),
            ...(impact !== undefined && { impact }),
            ...(status !== undefined && { status }),
            ...(treatment !== undefined && { treatment }),
            ...(treatmentPlan !== undefined && { treatmentPlan }),
            ...(owner !== undefined && { owner }),
            ...(targetDate !== undefined && { targetDate: targetDate ? new Date(targetDate) : null }),
            ...(residualProbability !== undefined && { residualProbability }),
            ...(residualImpact !== undefined && { residualImpact }),
            ...(residualNotes !== undefined && { residualNotes }),
            ...(residualEvaluatedAt !== undefined && { residualEvaluatedAt: residualEvaluatedAt ? new Date(residualEvaluatedAt) : null })
        }
    });

    if (!risk) {
        return res.status(404).json({ error: 'Riesgo no encontrado' });
    }

    // Update controls if provided: delete all, recreate
    if (controlIds !== undefined) {
        await prisma.riskControl.deleteMany({ where: { riskId: parseInt(id) } });
        if (controlIds.length > 0) {
            await prisma.riskControl.createMany({
                data: controlIds.map(controlId => ({ riskId: parseInt(id), controlId }))
            });
        }
    }

    // Update tags if provided
    if (tags !== undefined) {
        await prisma.riskTag.deleteMany({ where: { riskId: parseInt(id) } });
        if (tags.length > 0) {
            await prisma.riskTag.createMany({
                data: tags.map(tagId => ({ riskId: parseInt(id), tagId }))
            });
        }
    }

    res.json({ risk, message: 'Riesgo actualizado' });
}));

// Delete risk
router.delete('/:id', authenticateToken, asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.riskTag.deleteMany({ where: { riskId: parseInt(id) } });
        await prisma.riskControl.deleteMany({ where: { riskId: parseInt(id) } });
        await prisma.risk.delete({ where: { id: parseInt(id) } });
        res.json({ message: 'Riesgo eliminado exitosamente' });
    } catch (e) {
        if (e.code === 'P2025') {
            return res.status(404).json({ error: 'Riesgo no encontrado' });
        }
        throw e;
    }
}));

export default router;
