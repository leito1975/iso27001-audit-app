import express from 'express';
import prisma from '../config/database.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Normalize legacy Spanish status values to English
const STATUS_NORMALIZE = { 'abierto': 'open', 'en-proceso': 'in-progress', 'cerrado': 'closed' };

// Helper: flatten controls from FindingControl junction
function mapFinding(f) {
    return {
        ...f,
        status: STATUS_NORMALIZE[f.status] || f.status,
        controls: (f.controls || []).map(fc => fc.control),
        created_by_name: f.creator?.name ?? null,
        creator: undefined
    };
}

// Get all findings
router.get('/', asyncHandler(async (req, res) => {
    const { status, type, tag, auditId } = req.query;

    const where = {};
    if (status) where.status = status;
    if (type) where.type = type;
    if (auditId) where.auditId = parseInt(auditId);
    else where.auditId = null;

    const findings = await prisma.finding.findMany({
        where,
        include: {
            controls: {
                include: {
                    control: { select: { id: true, name: true, category: true } }
                }
            },
            creator: { select: { name: true } },
            tags: {
                include: {
                    tag: { select: { id: true, name: true, color: true } }
                }
            },
            ncDetail: true
        },
        orderBy: { createdAt: 'desc' }
    });

    let result = findings.map(f => ({
        ...mapFinding(f),
        tags: f.tags.map(ft => ft.tag),
        ncDetail: f.ncDetail || null
    }));

    // Filter by tag if specified
    if (tag) {
        result = result.filter(f => f.tags.some(t => t.id === parseInt(tag)));
    }

    res.json({ findings: result });
}));

// Get finding by ID
router.get('/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;

    const finding = await prisma.finding.findUnique({
        where: { id: parseInt(id) },
        include: {
            controls: {
                include: {
                    control: { select: { id: true, name: true, category: true } }
                }
            },
            creator: { select: { name: true } },
            tags: {
                include: {
                    tag: { select: { id: true, name: true, color: true } }
                }
            }
        }
    });

    if (!finding) {
        return res.status(404).json({ error: 'Hallazgo no encontrado' });
    }

    const result = {
        ...mapFinding(finding),
        tags: finding.tags.map(ft => ft.tag)
    };

    res.json({ finding: result });
}));

// Create finding
router.post('/', authenticateToken, asyncHandler(async (req, res) => {
    const { title, description, type, status, severity, evidence, recommendation, clausulaRef, auditId, controlIds = [], tags = [] } = req.body;

    if (!title) {
        return res.status(400).json({ error: 'El título es requerido' });
    }

    const finding = await prisma.finding.create({
        data: {
            title,
            description,
            type,
            status: status || 'open',
            severity,
            evidence,
            recommendation,
            clausulaRef: clausulaRef || null,
            auditId: auditId ? parseInt(auditId) : null,
            createdBy: req.user.id,
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
        finding: {
            ...finding,
            controls: finding.controls.map(fc => fc.control)
        },
        message: 'Hallazgo creado exitosamente'
    });
}));

// Update finding
router.put('/:id', authenticateToken, asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, description, type, status, severity, evidence, recommendation, clausulaRef, controlIds, tags } = req.body;

    const finding = await prisma.finding.update({
        where: { id: parseInt(id) },
        data: {
            ...(title !== undefined && { title }),
            ...(description !== undefined && { description }),
            ...(type !== undefined && { type }),
            ...(status !== undefined && { status }),
            ...(severity !== undefined && { severity }),
            ...(evidence !== undefined && { evidence }),
            ...(recommendation !== undefined && { recommendation }),
            ...(clausulaRef !== undefined && { clausulaRef: clausulaRef || null })
        }
    });

    if (!finding) {
        return res.status(404).json({ error: 'Hallazgo no encontrado' });
    }

    // Update controls if provided: delete all, recreate
    if (controlIds !== undefined) {
        await prisma.findingControl.deleteMany({ where: { findingId: parseInt(id) } });
        if (controlIds.length > 0) {
            await prisma.findingControl.createMany({
                data: controlIds.map(controlId => ({ findingId: parseInt(id), controlId }))
            });
        }
    }

    // Update tags if provided
    if (tags !== undefined) {
        await prisma.findingTag.deleteMany({ where: { findingId: parseInt(id) } });
        if (tags.length > 0) {
            await prisma.findingTag.createMany({
                data: tags.map(tagId => ({ findingId: parseInt(id), tagId }))
            });
        }
    }

    res.json({ finding, message: 'Hallazgo actualizado' });
}));

// Delete finding
router.delete('/:id', authenticateToken, asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.findingTag.deleteMany({ where: { findingId: parseInt(id) } });
        await prisma.findingControl.deleteMany({ where: { findingId: parseInt(id) } });
        await prisma.finding.delete({ where: { id: parseInt(id) } });
        res.json({ message: 'Hallazgo eliminado exitosamente' });
    } catch (e) {
        if (e.code === 'P2025') {
            return res.status(404).json({ error: 'Hallazgo no encontrado' });
        }
        throw e;
    }
}));

// ─── NC Detail endpoints ──────────────────────────────────────────────────────

// GET /findings/:id/nc-detail
router.get('/:id/nc-detail', authenticateToken, asyncHandler(async (req, res) => {
    const { id } = req.params;
    const detail = await prisma.findingNcDetail.findUnique({
        where: { findingId: parseInt(id) }
    });
    res.json({ ncDetail: detail || null });
}));

// PUT /findings/:id/nc-detail  (upsert)
router.put('/:id/nc-detail', authenticateToken, asyncHandler(async (req, res) => {
    const findingId = parseInt(req.params.id);
    const data = req.body;

    // Remove non-schema fields
    delete data.id;
    delete data.findingId;
    delete data.createdAt;
    delete data.updatedAt;

    // Parse dates
    const dateFields = ['fechaCorreccion', 'fechaAccionCorrectiva', 'fechaEstimada', 'fechaInicioNc', 'fechaFinNc'];
    for (const f of dateFields) {
        if (data[f] && data[f] !== '') {
            data[f] = new Date(data[f]);
        } else {
            data[f] = null;
        }
    }

    const detail = await prisma.findingNcDetail.upsert({
        where: { findingId },
        create: { findingId, ...data },
        update: data
    });

    res.json({ ncDetail: detail });
}));

export default router;
