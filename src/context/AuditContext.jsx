import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ISO27001_CONTROLS } from '../data/iso27001-controls';
import { ISO42001_CONTROLS } from '../data/iso42001-controls';
import api from '../services/api';

const AuditContext = createContext();

export const AuditProvider = ({ children }) => {
    const [currentAuditId, setCurrentAuditId] = useState(null);
    const [currentAudit, setCurrentAudit] = useState(null);

    const [selectedNorm, setSelectedNorm] = useState(() => {
        try {
            const saved = localStorage.getItem('selected_norm');
            return saved || 'iso27001';
        } catch { return 'iso27001'; }
    });

    const [controlAssessments, setControlAssessments] = useState({});
    const [findings, setFindings] = useState([]);
    const [risks, setRisks] = useState([]);
    const [actionPlans, setActionPlans] = useState([]);
    const [tags, setTags] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [activityLog, setActivityLog] = useState([]);
    const [loading, setLoading] = useState(true);

    // Clause assessments (clauses 4-10) — stored in localStorage
    const [clauseAssessments, setClauseAssessments] = useState(() => {
        try {
            const auditId = currentAuditId || 'default';
            const saved = localStorage.getItem(`clause_assessments_${auditId}`);
            return saved ? JSON.parse(saved) : {};
        } catch { return {}; }
    });
    const [auditInfo, setAuditInfo] = useState({
        name: 'Auditoría ISO 27001',
        organization: '',
        auditor: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        scope: '',
        auditedCompany: '',
        companySector: '',
        contactPerson: '',
        sgsiScope: '',
        auditType: 'interna',
        normVersion: 'ISO 27001:2022',
        auditorOrg: 'AonikLabs'
    });

    // Load all data from API for a specific audit
    // loadData accepts an explicit norm to avoid stale-closure issues with selectedNorm state.
    // Always reads norm from param first, then localStorage, then falls back to 'iso27001'.
    const loadData = useCallback(async (auditId = null, normOverride = null) => {
        try {
            setLoading(true);

            // Use explicit norm if provided, otherwise read from localStorage (written synchronously
            // by selectAudit before state updates propagate).
            const norm = normOverride || localStorage.getItem('selected_norm') || 'iso27001';

            const controlsParams = auditId ? { auditId } : {};
            const findingsParams = auditId ? { auditId } : {};
            const risksParams    = auditId ? { auditId } : {};

            const [controlsData, findingsData, risksData, actionPlansData, tagsData] = await Promise.all([
                api.controls.getAll(controlsParams),
                api.findings.getAll(findingsParams),
                api.risks.getAll(risksParams),
                api.actionPlans.getAll(),
                api.tags.getAll()
            ]);

            // Map API controls → assessments object
            const assessMap = {};
            for (const c of controlsData.controls) {
                assessMap[c.id] = {
                    maturityLevel: c.maturity_level,
                    targetLevel:   c.target_level ?? 3,
                    evidence:      c.evidence || '',
                    notes:         '',
                    applicable:    c.applicable ?? true,
                    assessedDate:  c.assessed_at,
                    tags:          []
                };
            }

            // Fill in any controls from the active norm that aren't in the API yet
            const controlsToUse = norm === 'iso42001' ? ISO42001_CONTROLS : ISO27001_CONTROLS;
            for (const control of controlsToUse) {
                if (!assessMap[control.id]) {
                    assessMap[control.id] = {
                        maturityLevel: null,
                        targetLevel:   3,
                        evidence:      '',
                        notes:         '',
                        applicable:    true,
                        assessedDate:  null,
                        tags:          []
                    };
                }
            }

            setControlAssessments(assessMap);
            setFindings(findingsData.findings   || []);
            setRisks(risksData.risks             || []);
            setActionPlans(actionPlansData.actionPlans || []);
            setTags(tagsData.tags               || []);
        } catch (err) {
            console.error('Error loading data:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Auto-load data when currentAuditId changes
    // Only auto-load on mount (when the app first starts with a saved auditId).
    // selectAudit handles loading when the user picks an audit interactively.
    useEffect(() => {
        if (api.getToken() && currentAuditId) {
            // Pass the norm from localStorage so the correct controls are populated
            const norm = localStorage.getItem('selected_norm') || 'iso27001';
            loadData(currentAuditId, norm);
        } else if (!currentAuditId) {
            setLoading(false);
        }
    }, [currentAuditId, loadData]);

    // Log activity (local only)
    const logActivity = (type, description, relatedId = null) => {
        const activity = {
            id: `ACT-${Date.now()}`,
            type,
            description,
            relatedId,
            timestamp: new Date().toISOString()
        };
        setActivityLog(prev => [activity, ...prev].slice(0, 100));
    };

    // Audit Info (local only)
    const updateAuditInfo = (updates) => {
        setAuditInfo(prev => ({ ...prev, ...updates }));
        logActivity('audit', 'Información de auditoría actualizada');
    };

    // Clause Assessments (clauses 4-10, localStorage)
    const updateClauseAssessment = (clauseId, updates) => {
        setClauseAssessments(prev => {
            const updated = {
                ...prev,
                [clauseId]: {
                    ...prev[clauseId],
                    ...updates
                }
            };
            const auditId = currentAuditId || 'default';
            localStorage.setItem(`clause_assessments_${auditId}`, JSON.stringify(updated));
            return updated;
        });
        logActivity('clause', `Cláusula ${clauseId} evaluada`, clauseId);
    };

    // Control Assessments
    const updateControlAssessment = async (controlId, updates) => {
        // Optimistic update of local state
        setControlAssessments(prev => ({
            ...prev,
            [controlId]: {
                ...prev[controlId],
                ...updates,
                assessedDate: new Date().toISOString()
            }
        }));

        try {
            await api.controls.updateAssessment(controlId, {
                maturityLevel: updates.maturityLevel ?? controlAssessments[controlId]?.maturityLevel,
                targetLevel: updates.targetLevel ?? controlAssessments[controlId]?.targetLevel,
                applicable: updates.applicable ?? controlAssessments[controlId]?.applicable,
                evidence: updates.evidence ?? controlAssessments[controlId]?.evidence,
                auditId: currentAuditId || null
            });
        } catch (err) {
            console.error('Error updating assessment:', err);
        }
    };

    const setControlMaturity = (controlId, level) => {
        updateControlAssessment(controlId, { maturityLevel: level });
        logActivity('control', `Control ${controlId} evaluado a nivel ${level}`, controlId);
    };

    const setControlApplicable = (controlId, applicable) => {
        updateControlAssessment(controlId, { applicable });
    };

    // Findings
    const addFinding = async (finding) => {
        try {
            const data = await api.findings.create({
                title: finding.title,
                description: finding.description,
                type: finding.type,
                status: finding.status || 'open',
                severity: finding.severity,
                evidence: finding.evidence,
                recommendation: finding.recommendation,
                auditId: currentAuditId || null,
                controlIds: finding.controlIds || [],
                tags: finding.tags || []
            });
            setFindings(prev => [data.finding, ...prev]);
            logActivity('finding', `Hallazgo creado: ${finding.title}`, data.finding.id);
            return data.finding.id;
        } catch (err) {
            console.error('Error creating finding:', err);
            throw err;
        }
    };

    const updateFinding = async (id, updates) => {
        try {
            // Normalize payload — handles both direct status updates and full form updates
            const payload = {
                ...(updates.title !== undefined && { title: updates.title }),
                ...(updates.description !== undefined && { description: updates.description }),
                ...(updates.type !== undefined && { type: updates.type }),
                ...(updates.status !== undefined && { status: updates.status }),
                ...(updates.severity !== undefined && { severity: updates.severity }),
                ...(updates.evidence !== undefined && { evidence: updates.evidence }),
                ...(updates.recommendation !== undefined && { recommendation: updates.recommendation }),
                ...(updates.controlIds !== undefined && { controlIds: updates.controlIds }),
                ...(updates.tags !== undefined && { tags: updates.tags })
            };
            await api.findings.update(id, payload);
            // Re-fetch to get updated controls + tags
            const fresh = await api.findings.getById(id);
            setFindings(prev => prev.map(f => f.id === id ? fresh.finding : f));
        } catch (err) {
            console.error('Error updating finding:', err);
        }
    };

    const deleteFinding = async (id) => {
        try {
            await api.findings.delete(id);
            setFindings(prev => prev.filter(f => f.id !== id));
            logActivity('finding', 'Hallazgo eliminado', id);
        } catch (err) {
            console.error('Error deleting finding:', err);
        }
    };

    // Risks
    const addRisk = async (risk) => {
        try {
            const data = await api.risks.create({
                name: risk.title || risk.name,
                description: risk.description,
                category: risk.category,
                probability: risk.probability,
                impact: risk.impact,
                status: risk.status || 'identificado',
                treatment: risk.treatment,
                treatmentPlan: risk.treatmentPlan,
                owner: risk.owner,
                targetDate: risk.targetDate || null,
                residualProbability: risk.residualProbability || null,
                residualImpact: risk.residualImpact || null,
                residualNotes: risk.residualNotes || null,
                residualEvaluatedAt: risk.residualEvaluatedAt || null,
                auditId: currentAuditId || null,
                controlIds: risk.controlIds || [],
                tags: risk.tags || []
            });
            setRisks(prev => [data.risk, ...prev]);
            logActivity('risk', `Riesgo creado: ${risk.title || risk.name}`, data.risk.id);
            return data.risk.id;
        } catch (err) {
            console.error('Error creating risk:', err);
            throw err;
        }
    };

    const updateRisk = async (id, updates) => {
        try {
            const payload = {
                name: updates.title || updates.name,
                description: updates.description,
                category: updates.category,
                probability: updates.probability,
                impact: updates.impact,
                status: updates.status,
                treatment: updates.treatment,
                treatmentPlan: updates.treatmentPlan,
                owner: updates.owner,
                targetDate: updates.targetDate || null,
                residualProbability: updates.residualProbability || null,
                residualImpact: updates.residualImpact || null,
                residualNotes: updates.residualNotes !== undefined ? updates.residualNotes : null,
                residualEvaluatedAt: updates.residualEvaluatedAt || null,
                controlIds: updates.controlIds,
                tags: updates.tags
            };
            const data = await api.risks.update(id, payload);
            // Re-fetch to get updated controls
            const fresh = await api.risks.getById(id);
            setRisks(prev => prev.map(r => r.id === id ? fresh.risk : r));
        } catch (err) {
            console.error('Error updating risk:', err);
        }
    };

    const deleteRisk = async (id) => {
        try {
            await api.risks.delete(id);
            setRisks(prev => prev.filter(r => r.id !== id));
            logActivity('risk', 'Riesgo eliminado', id);
        } catch (err) {
            console.error('Error deleting risk:', err);
        }
    };

    // Action Plans
    const addActionPlan = async (plan) => {
        try {
            const data = await api.actionPlans.create({
                title: plan.title,
                description: plan.description,
                findingId: plan.findingId,
                riskId: plan.riskId,
                responsible: plan.responsible,
                dueDate: plan.dueDate
            });
            setActionPlans(prev => [...prev, data.actionPlan]);
            logActivity('action', `Plan de acción creado: ${plan.title}`, data.actionPlan.id);

            if (plan.dueDate && new Date(plan.dueDate) < new Date()) {
                addNotification('warning', `Plan de acción "${plan.title}" está vencido`, data.actionPlan.id);
            }
            return data.actionPlan.id;
        } catch (err) {
            console.error('Error creating action plan:', err);
            throw err;
        }
    };

    const updateActionPlan = async (id, updates) => {
        try {
            const data = await api.actionPlans.update(id, updates);
            setActionPlans(prev => prev.map(p => p.id === id ? { ...p, ...data.actionPlan } : p));
            if (updates.status) {
                logActivity('action', `Plan de acción actualizado a: ${updates.status}`, id);
            }
        } catch (err) {
            console.error('Error updating action plan:', err);
        }
    };

    const deleteActionPlan = async (id) => {
        try {
            await api.actionPlans.delete(id);
            setActionPlans(prev => prev.filter(p => p.id !== id));
            logActivity('action', 'Plan de acción eliminado', id);
        } catch (err) {
            console.error('Error deleting action plan:', err);
        }
    };

    // Notifications (local only)
    const addNotification = (type, message, relatedId = null) => {
        const notification = {
            id: `N-${Date.now()}`,
            type,
            message,
            relatedId,
            read: false,
            createdAt: new Date().toISOString()
        };
        setNotifications(prev => [notification, ...prev]);
    };

    const markNotificationRead = (id) => {
        setNotifications(prev => prev.map(n =>
            n.id === id ? { ...n, read: true } : n
        ));
    };

    const clearNotifications = () => {
        setNotifications([]);
    };

    // Tags
    const addTag = async (tag) => {
        try {
            const data = await api.tags.create({ name: tag.name, color: tag.color });
            setTags(prev => [...prev, data.tag]);
            return data.tag.id;
        } catch (err) {
            console.error('Error creating tag:', err);
            throw err;
        }
    };

    const deleteTag = async (id) => {
        try {
            await api.tags.delete(id);
            setTags(prev => prev.filter(t => t.id !== id));
        } catch (err) {
            console.error('Error deleting tag:', err);
        }
    };

    // Statistics
    const getStatistics = () => {
        // Filter controlAssessments to only include controls from the active norm
        const controlsToUse = selectedNorm === 'iso42001' ? ISO42001_CONTROLS : ISO27001_CONTROLS;
        const activeControlIds = new Set(controlsToUse.map(c => c.id));

        // Only the assessments of the active norm
        const relevantAssessments = Object.entries(controlAssessments)
            .filter(([id]) => activeControlIds.has(id))
            .map(([, a]) => a);

        const assessments = relevantAssessments;
        const applicableControls = assessments.filter(a => a.applicable);
        const assessedControls = applicableControls.filter(a => a.maturityLevel !== null);

        const totalMaturity = assessedControls.reduce((sum, a) => sum + (a.maturityLevel || 0), 0);
        const avgMaturity = assessedControls.length > 0 ? totalMaturity / assessedControls.length : 0;

        const compliantControls = assessedControls.filter(a => a.maturityLevel >= a.targetLevel);
        const complianceRate = assessedControls.length > 0
            ? (compliantControls.length / assessedControls.length) * 100
            : 0;

        const gapControls = assessedControls.filter(a => a.maturityLevel < a.targetLevel);

        // By category
        const byCategory = {};
        controlsToUse.forEach(control => {
            const assessment = controlAssessments[control.id];
            if (!assessment) return;
            if (!byCategory[control.category]) {
                byCategory[control.category] = {
                    total: 0, assessed: 0, compliant: 0, totalMaturity: 0, categoryId: control.categoryId
                };
            }
            if (assessment.applicable) {
                byCategory[control.category].total++;
                if (assessment.maturityLevel !== null) {
                    byCategory[control.category].assessed++;
                    byCategory[control.category].totalMaturity += assessment.maturityLevel;
                    if (assessment.maturityLevel >= assessment.targetLevel) {
                        byCategory[control.category].compliant++;
                    }
                }
            }
        });

        const findingsOpen = findings.filter(f => f.status === 'open' || f.status === 'abierto').length;
        const findingsInProgress = findings.filter(f => f.status === 'in-progress' || f.status === 'en_progreso').length;
        const findingsClosed = findings.filter(f => f.status === 'closed' || f.status === 'cerrado').length;
        const isOpenFinding = f => f.status !== 'closed' && f.status !== 'cerrado';
        const ncMajor = findings.filter(f => f.type === 'nc-major' && isOpenFinding(f)).length;
        const ncMinor = findings.filter(f => f.type === 'nc-minor' && isOpenFinding(f)).length;
        const observation = findings.filter(f => f.type === 'observation' && isOpenFinding(f)).length;
        const improvement = findings.filter(f => (f.type === 'improvement' || f.type === 'opportunity' || f.type === 'ofi') && isOpenFinding(f)).length;
        const strength = findings.filter(f => f.type === 'strength').length;

        // Active risks = only identificado + en-tratamiento
        // Treated = mitigado + aceptado + cerrado
        const ACTIVE_STATUSES = ['identificado', 'en-tratamiento'];
        const TREATED_STATUSES = ['mitigado', 'aceptado', 'cerrado'];
        const risksOpen = risks.filter(r => !r.status || ACTIVE_STATUSES.includes(r.status)).length;
        const risksTreated = risks.filter(r => TREATED_STATUSES.includes(r.status)).length;
        const risksCritical = risks.filter(r => {
            const score = (r.probability || 1) * (r.impact || 1);
            return score >= 15 && (!r.status || ACTIVE_STATUSES.includes(r.status));
        }).length;

        const actionsPending = actionPlans.filter(a => a.status === 'pending' || a.status === 'pendiente').length;
        const actionsInProgress = actionPlans.filter(a => a.status === 'in-progress' || a.status === 'en_progreso').length;
        const actionsCompleted = actionPlans.filter(a => a.status === 'completed' || a.status === 'completado').length;
        const actionsOverdue = actionPlans.filter(a => {
            const due = a.dueDate || a.due_date;
            return due && new Date(due) < new Date() && a.status !== 'completed' && a.status !== 'completado';
        }).length;

        return {
            totalControls: controlsToUse.length,
            applicableControls: applicableControls.length,
            assessedControls: assessedControls.length,
            compliantControls: compliantControls.length,
            gapControls: gapControls.length,
            avgMaturity: Math.round(avgMaturity * 100) / 100,
            complianceRate: Math.round(complianceRate * 100) / 100,
            progressRate: applicableControls.length > 0
                ? Math.round((assessedControls.length / applicableControls.length) * 100 * 100) / 100
                : 0,
            byCategory,
            findings: {
                total: findings.length, open: findingsOpen, inProgress: findingsInProgress,
                closed: findingsClosed, ncMajor, ncMinor, observation, improvement, strength
            },
            risks: {
                total: risks.length, open: risksOpen, treated: risksTreated, critical: risksCritical
            },
            actionPlans: {
                total: actionPlans.length, pending: actionsPending, inProgress: actionsInProgress,
                completed: actionsCompleted, overdue: actionsOverdue
            }
        };
    };

    // Set Norm (update currentAudit norm and context)
    const setNorm = (norm) => {
        setSelectedNorm(norm);
        localStorage.setItem('selected_norm', norm);

        // Update current audit norm
        if (currentAuditId) {
            setCurrentAudit(prev => prev ? { ...prev, norm } : null);
        }

        // Pre-populate assessments for controls of the new norm that aren't loaded yet
        const normControls = norm === 'iso42001' ? ISO42001_CONTROLS : ISO27001_CONTROLS;
        setControlAssessments(prev => {
            const updated = { ...prev };
            for (const control of normControls) {
                if (!updated[control.id]) {
                    updated[control.id] = {
                        maturityLevel: null,
                        targetLevel: 3,
                        evidence: '',
                        notes: '',
                        applicable: true,
                        assessedDate: null,
                        tags: []
                    };
                }
            }
            return updated;
        });
        logActivity('audit', `Norma cambiada a ${norm === 'iso42001' ? 'ISO 42001' : 'ISO 27001'}`);
    };

    // Select/load an audit
    const selectAudit = async (auditId) => {
        try {
            const auditData = await api.audits.getById(auditId);
            const norm = auditData.audit.norm || 'iso27001';

            // Write to localStorage BEFORE state updates so loadData can read it synchronously
            localStorage.setItem('selected_norm', norm);

            // Update all state
            setCurrentAuditId(auditId);
            setCurrentAudit(auditData.audit);
            setSelectedNorm(norm);

            // Sync auditInfo from the audit record so reports use correct normVersion
            const normVersion = norm === 'iso42001' ? 'ISO 42001:2023' : 'ISO 27001:2022';
            setAuditInfo(prev => ({
                ...prev,
                name:         auditData.audit.name      || prev.name,
                organization: auditData.audit.organization || prev.organization,
                auditor:      auditData.audit.auditor   || prev.auditor,
                startDate:    auditData.audit.startDate || auditData.audit.start_date || prev.startDate,
                endDate:      auditData.audit.endDate   || auditData.audit.end_date   || prev.endDate,
                scope:        auditData.audit.scope     || prev.scope,
                normVersion,
                auditType:    auditData.audit.auditType || 'interna',
            }));

            // Load data passing norm explicitly — avoids stale-closure issue
            await loadData(auditId, norm);

            logActivity('audit', `Auditoría seleccionada: ${auditData.audit.name}`, auditId);
        } catch (err) {
            console.error('Error selecting audit:', err);
            throw err;
        }
    };

    // Reset
    const resetAudit = () => {
        if (window.confirm('¿Está seguro de reiniciar toda la auditoría? Esta acción no se puede deshacer.')) {
            // Re-load from API
            loadData();
            logActivity('audit', 'Auditoría reiniciada');
        }
    };

    const value = {
        currentAuditId,
        currentAudit,
        selectAudit,
        auditInfo,
        controlAssessments,
        clauseAssessments,
        findings,
        risks,
        actionPlans,
        activityLog,
        notifications,
        tags,
        loading,
        selectedNorm,
        controls: selectedNorm === 'iso42001' ? ISO42001_CONTROLS : ISO27001_CONTROLS,
        updateAuditInfo,
        updateControlAssessment,
        updateClauseAssessment,
        setControlMaturity,
        setControlApplicable,
        addFinding,
        updateFinding,
        deleteFinding,
        addRisk,
        updateRisk,
        deleteRisk,
        addActionPlan,
        updateActionPlan,
        deleteActionPlan,
        addNotification,
        markNotificationRead,
        clearNotifications,
        addTag,
        deleteTag,
        logActivity,
        getStatistics,
        resetAudit,
        refreshData: loadData,
        setNorm
    };

    return (
        <AuditContext.Provider value={value}>
            {children}
        </AuditContext.Provider>
    );
};

export const useAudit = () => {
    const context = useContext(AuditContext);
    if (!context) {
        throw new Error('useAudit must be used within an AuditProvider');
    }
    return context;
};
