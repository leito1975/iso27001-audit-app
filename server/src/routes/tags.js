import express from 'express';
import prisma from '../config/database.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all tags
router.get('/', asyncHandler(async (req, res) => {
    const tags = await prisma.tag.findMany({ orderBy: { name: 'asc' } });
    res.json({ tags });
}));

// Create tag
router.post('/', authenticateToken, asyncHandler(async (req, res) => {
    const { name, color = '#3b82f6' } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'El nombre es requerido' });
    }

    const tag = await prisma.tag.create({ data: { name, color } });
    res.status(201).json({ tag });
}));

// Update tag
router.put('/:id', authenticateToken, asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, color } = req.body;

    try {
        const tag = await prisma.tag.update({
            where: { id: parseInt(id) },
            data: {
                ...(name !== undefined && { name }),
                ...(color !== undefined && { color })
            }
        });
        res.json({ tag });
    } catch (e) {
        if (e.code === 'P2025') {
            return res.status(404).json({ error: 'Tag no encontrado' });
        }
        throw e;
    }
}));

// Delete tag
router.delete('/:id', authenticateToken, asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        // Remove tag associations first
        await prisma.findingTag.deleteMany({ where: { tagId: parseInt(id) } });
        await prisma.riskTag.deleteMany({ where: { tagId: parseInt(id) } });
        await prisma.tag.delete({ where: { id: parseInt(id) } });
        res.json({ message: 'Tag eliminado' });
    } catch (e) {
        if (e.code === 'P2025') {
            return res.status(404).json({ error: 'Tag no encontrado' });
        }
        throw e;
    }
}));

export default router;
