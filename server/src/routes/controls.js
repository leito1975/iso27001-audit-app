import express from 'express';
import prisma from '../config/database.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all controls with assessments
router.get('/', asyncHandler(async (req, res) => {
    const { auditId } = req.query;

    const where = auditId ? { auditId: parseInt(auditId) } : { auditId: null };

    const controls = await prisma.control.findMany({
        include: {
            assessments: {
                where,
                select: {
                    maturityLevel: true,
                    targetLevel: true,
                    applicable: true,
                    evidence: true,
                    assessedAt: true
                }
            }
        },
        orderBy: { id: 'asc' }
    });

    // Flatten: merge first assessment into control
    const result = controls.map(c => {
        const a = c.assessments[0] || {};
        return {
            id: c.id,
            name: c.name,
            description: c.description,
            category: c.category,
            objective: c.objective,
            maturity_level: a.maturityLevel ?? null,
            target_level: a.targetLevel ?? 3,
            applicable: a.applicable ?? true,
            evidence: a.evidence ?? null,
            assessed_at: a.assessedAt ?? null
        };
    });

    res.json({ controls: result });
}));

// Get control by ID
router.get('/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;

    const control = await prisma.control.findUnique({
        where: { id },
        include: {
            assessments: {
                select: {
                    maturityLevel: true,
                    targetLevel: true,
                    applicable: true,
                    evidence: true,
                    assessedAt: true
                }
            },
            attachments: {
                orderBy: { uploadedAt: 'desc' }
            }
        }
    });

    if (!control) {
        return res.status(404).json({ error: 'Control no encontrado' });
    }

    const a = control.assessments[0] || {};
    const result = {
        id: control.id,
        name: control.name,
        description: control.description,
        category: control.category,
        objective: control.objective,
        maturity_level: a.maturityLevel ?? null,
        target_level: a.targetLevel ?? 3,
        applicable: a.applicable ?? true,
        evidence: a.evidence ?? null,
        assessed_at: a.assessedAt ?? null
    };

    res.json({ control: result, attachments: control.attachments });
}));

// Update control assessment
router.put('/:id/assessment', authenticateToken, asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { maturityLevel, targetLevel, applicable, evidence, auditId } = req.body;

    await prisma.controlAssessment.upsert({
        where: { controlId_auditId: { controlId: id, auditId: auditId ? parseInt(auditId) : null } },
        create: {
            controlId: id,
            auditId: auditId ? parseInt(auditId) : null,
            maturityLevel: maturityLevel,
            targetLevel: targetLevel ?? 3,
            applicable: applicable ?? true,
            evidence: evidence,
            assessedBy: req.user.id
        },
        update: {
            ...(maturityLevel !== undefined && { maturityLevel }),
            ...(targetLevel !== undefined && { targetLevel }),
            ...(applicable !== undefined && { applicable }),
            ...(evidence !== undefined && { evidence }),
            assessedBy: req.user.id,
            assessedAt: new Date()
        }
    });

    res.json({ message: 'Evaluación actualizada exitosamente' });
}));

// Get traceability for a control: linked findings and risks
router.get('/:id/traceability', asyncHandler(async (req, res) => {
    const { id } = req.params;

    const control = await prisma.control.findUnique({
        where: { id },
        select: { id: true, name: true, category: true },
    });

    if (!control) {
        return res.status(404).json({ error: 'Control no encontrado' });
    }

    const [findingControls, riskControls] = await Promise.all([
        prisma.findingControl.findMany({
            where: { controlId: id },
            include: {
                finding: {
                    select: {
                        id: true, title: true, description: true,
                        type: true, status: true, severity: true, createdAt: true
                    }
                }
            }
        }),
        prisma.riskControl.findMany({
            where: { controlId: id },
            include: {
                risk: {
                    select: {
                        id: true, name: true, description: true,
                        probability: true, impact: true, status: true,
                        treatment: true, owner: true, createdAt: true
                    }
                }
            }
        })
    ]);

    res.json({
        control,
        findings: findingControls.map(fc => fc.finding),
        risks: riskControls.map(rc => rc.risk)
    });
}));

// Get controls by category
router.get('/category/:category', asyncHandler(async (req, res) => {
    const { category } = req.params;

    const controls = await prisma.control.findMany({
        where: { category },
        include: {
            assessments: {
                select: {
                    maturityLevel: true,
                    targetLevel: true,
                    applicable: true,
                    evidence: true
                }
            }
        },
        orderBy: { id: 'asc' }
    });

    const result = controls.map(c => {
        const a = c.assessments[0] || {};
        return {
            id: c.id,
            name: c.name,
            description: c.description,
            category: c.category,
            objective: c.objective,
            maturity_level: a.maturityLevel ?? null,
            target_level: a.targetLevel ?? 3,
            applicable: a.applicable ?? true,
            evidence: a.evidence ?? null
        };
    });

    res.json({ controls: result });
}));

export default router;
