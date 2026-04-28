import express from 'express';
import prisma from '../config/database.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// Get dashboard statistics
router.get('/dashboard', asyncHandler(async (req, res) => {
    // Control stats
    const allControls = await prisma.control.count();

    const assessments = await prisma.controlAssessment.findMany({
        select: { maturityLevel: true, targetLevel: true, applicable: true }
    });

    const applicable = assessments.filter(a => a.applicable);
    const assessed = applicable.filter(a => a.maturityLevel !== null);
    const withGap = assessed.filter(a => a.maturityLevel < a.targetLevel);
    const totalMaturity = assessed.reduce((sum, a) => sum + (a.maturityLevel || 0), 0);
    const avgMaturity = assessed.length > 0 ? Math.round((totalMaturity / assessed.length) * 100) / 100 : 0;

    // Finding stats
    const findingsTotal = await prisma.finding.count();
    const findingsOpen = await prisma.finding.count({ where: { status: 'abierto' } });
    const findingsInProgress = await prisma.finding.count({ where: { status: 'en_progreso' } });
    const findingsClosed = await prisma.finding.count({ where: { status: 'cerrado' } });

    // Risk stats
    const risks = await prisma.risk.findMany({
        select: { probability: true, impact: true }
    });

    const riskCritical = risks.filter(r => (r.probability || 0) * (r.impact || 0) >= 15).length;
    const riskHigh = risks.filter(r => {
        const score = (r.probability || 0) * (r.impact || 0);
        return score >= 8 && score < 15;
    }).length;
    const riskMedium = risks.filter(r => {
        const score = (r.probability || 0) * (r.impact || 0);
        return score >= 4 && score < 8;
    }).length;
    const riskLow = risks.filter(r => (r.probability || 0) * (r.impact || 0) < 4).length;

    // Action plan stats
    const apTotal = await prisma.actionPlan.count();
    const apPending = await prisma.actionPlan.count({ where: { status: 'pendiente' } });
    const apInProgress = await prisma.actionPlan.count({ where: { status: 'en_progreso' } });
    const apCompleted = await prisma.actionPlan.count({ where: { status: 'completado' } });
    const apOverdue = await prisma.actionPlan.count({
        where: {
            dueDate: { lt: new Date() },
            status: { not: 'completado' }
        }
    });

    // Maturity by category
    const controlsWithAssessments = await prisma.control.findMany({
        include: {
            assessments: {
                where: { applicable: true },
                select: { maturityLevel: true }
            }
        }
    });

    const categoryMap = {};
    for (const c of controlsWithAssessments) {
        if (!c.category) continue;
        if (!categoryMap[c.category]) {
            categoryMap[c.category] = { category: c.category, totalMaturity: 0, count: 0, controlCount: 0 };
        }
        categoryMap[c.category].controlCount++;
        if (c.assessments[0]?.maturityLevel !== null && c.assessments[0]?.maturityLevel !== undefined) {
            categoryMap[c.category].totalMaturity += c.assessments[0].maturityLevel;
            categoryMap[c.category].count++;
        }
    }

    const maturityByCategory = Object.values(categoryMap).map(cat => ({
        category: cat.category,
        avg_maturity: cat.count > 0 ? Math.round((cat.totalMaturity / cat.count) * 100) / 100 : null,
        control_count: cat.controlCount
    })).sort((a, b) => a.category.localeCompare(b.category));

    // Compliance rate
    const complianceRate = applicable.length > 0
        ? Math.round((assessed.length / applicable.length) * 100)
        : 0;

    res.json({
        controls: {
            total: allControls,
            applicable: applicable.length,
            assessed: assessed.length,
            withGap: withGap.length,
            avgMaturity
        },
        findings: {
            total: findingsTotal,
            open: findingsOpen,
            inProgress: findingsInProgress,
            closed: findingsClosed
        },
        risks: {
            total: risks.length,
            critical: riskCritical,
            high: riskHigh,
            medium: riskMedium,
            low: riskLow
        },
        actionPlans: {
            total: apTotal,
            pending: apPending,
            inProgress: apInProgress,
            completed: apCompleted,
            overdue: apOverdue
        },
        maturityByCategory,
        complianceRate
    });
}));

export default router;
