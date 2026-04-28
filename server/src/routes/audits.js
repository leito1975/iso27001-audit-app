import express from 'express';
import prisma from '../config/database.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all audits
router.get('/', asyncHandler(async (req, res) => {
    const audits = await prisma.audit.findMany({
        include: {
            findings: { select: { id: true } },
            risks: { select: { id: true } },
            assessments: { select: { id: true } }
        },
        orderBy: { updatedAt: 'desc' }
    });

    const result = audits.map(a => ({
        id: a.id,
        name: a.name,
        norm: a.norm,
        status: a.status,
        organization: a.organization,
        auditor: a.auditor,
        startDate: a.startDate,
        endDate: a.endDate,
        scope: a.scope,
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
        stats: {
            findingsCount: a.findings.length,
            risksCount: a.risks.length,
            assessmentsCount: a.assessments.length
        }
    }));

    res.json({ audits: result });
}));

// Get audit by ID
router.get('/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;

    const audit = await prisma.audit.findUnique({
        where: { id: parseInt(id) },
        include: {
            findings: { select: { id: true, title: true, status: true } },
            risks: { select: { id: true, name: true, status: true } },
            assessments: { select: { id: true, controlId: true } }
        }
    });

    if (!audit) {
        return res.status(404).json({ error: 'Auditoría no encontrada' });
    }

    const result = {
        id: audit.id,
        name: audit.name,
        norm: audit.norm,
        status: audit.status,
        organization: audit.organization,
        auditor: audit.auditor,
        startDate: audit.startDate,
        endDate: audit.endDate,
        scope: audit.scope,
        createdAt: audit.createdAt,
        updatedAt: audit.updatedAt,
        stats: {
            findingsCount: audit.findings.length,
            risksCount: audit.risks.length,
            assessmentsCount: audit.assessments.length
        }
    };

    res.json({ audit: result });
}));

// Create audit
router.post('/', authenticateToken, asyncHandler(async (req, res) => {
    const { name, norm, organization, auditor, startDate, endDate, scope } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'El nombre de la auditoría es requerido' });
    }

    const audit = await prisma.audit.create({
        data: {
            name,
            norm: norm || 'iso27001',
            status: 'draft',
            organization,
            auditor,
            startDate,
            endDate,
            scope
        }
    });

    res.status(201).json({
        audit: {
            ...audit,
            stats: {
                findingsCount: 0,
                risksCount: 0,
                assessmentsCount: 0
            }
        },
        message: 'Auditoría creada exitosamente'
    });
}));

// Update audit
router.patch('/:id', authenticateToken, asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, status, organization, auditor, startDate, endDate, scope } = req.body;

    const audit = await prisma.audit.update({
        where: { id: parseInt(id) },
        data: {
            ...(name !== undefined && { name }),
            ...(status !== undefined && { status }),
            ...(organization !== undefined && { organization }),
            ...(auditor !== undefined && { auditor }),
            ...(startDate !== undefined && { startDate }),
            ...(endDate !== undefined && { endDate }),
            ...(scope !== undefined && { scope })
        },
        include: {
            findings: { select: { id: true } },
            risks: { select: { id: true } },
            assessments: { select: { id: true } }
        }
    });

    if (!audit) {
        return res.status(404).json({ error: 'Auditoría no encontrada' });
    }

    res.json({
        audit: {
            ...audit,
            stats: {
                findingsCount: audit.findings.length,
                risksCount: audit.risks.length,
                assessmentsCount: audit.assessments.length
            }
        },
        message: 'Auditoría actualizada exitosamente'
    });
}));

// Delete audit
router.delete('/:id', authenticateToken, asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        // Delete cascades will handle findings, risks, assessments
        await prisma.audit.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: 'Auditoría eliminada exitosamente' });
    } catch (e) {
        if (e.code === 'P2025') {
            return res.status(404).json({ error: 'Auditoría no encontrada' });
        }
        throw e;
    }
}));

export default router;
