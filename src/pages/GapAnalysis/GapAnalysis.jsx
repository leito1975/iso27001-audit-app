import { useAudit } from '../../context/AuditContext';
import { CONTROL_CATEGORIES, CMMI_LEVELS } from '../../data/iso27001-controls';
import { ISO42001_CONTROL_CATEGORIES } from '../../data/iso42001-controls';
import { ISO27001_CLAUSES, COMPLIANCE_STATUS } from '../../data/iso27001-clauses';
import { ISO42001_CLAUSES } from '../../data/iso42001-clauses';
import { AlertTriangle, CheckCircle, ArrowRight, Target, Book, ClipboardCheck } from 'lucide-react';
import {
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    ResponsiveContainer,
    Legend,
    Tooltip
} from 'recharts';
import './GapAnalysis.css';

const GapAnalysis = () => {
    const { controls, controlAssessments, clauseAssessments, getStatistics, selectedNorm } = useAudit();
    const stats = getStatistics();
    const categories = selectedNorm === 'iso42001' ? ISO42001_CONTROL_CATEGORIES : CONTROL_CATEGORIES;
    const CLAUSES = selectedNorm === 'iso42001' ? ISO42001_CLAUSES : ISO27001_CLAUSES;

    const defaultAssessment = { maturityLevel: null, targetLevel: 3, applicable: true, evidence: '' };
    const getAssessment = (id) => controlAssessments[id] || defaultAssessment;

    // Get controls with gaps
    const gapControls = controls.filter(control => {
        const assessment = getAssessment(control.id);
        return assessment.applicable &&
            assessment.maturityLevel !== null &&
            assessment.maturityLevel < assessment.targetLevel;
    }).map(control => {
        const assessment = getAssessment(control.id);
        return {
            ...control,
            currentLevel: assessment.maturityLevel,
            targetLevel: assessment.targetLevel,
            gap: assessment.targetLevel - assessment.maturityLevel
        };
    }).sort((a, b) => b.gap - a.gap);

    // Compliant controls
    const compliantControls = controls.filter(control => {
        const assessment = getAssessment(control.id);
        return assessment.applicable &&
            assessment.maturityLevel !== null &&
            assessment.maturityLevel >= assessment.targetLevel;
    });

    // Radar data for target vs actual
    const radarData = categories.map(cat => {
        const catControls = controls.filter(c => c.categoryId === cat.id);
        const assessedControls = catControls.filter(c =>
            controlAssessments[c.id]?.maturityLevel !== null &&
            controlAssessments[c.id]?.applicable
        );

        const avgMaturity = assessedControls.length > 0
            ? assessedControls.reduce((sum, c) => sum + (controlAssessments[c.id]?.maturityLevel || 0), 0) / assessedControls.length
            : 0;

        const avgTarget = assessedControls.length > 0
            ? assessedControls.reduce((sum, c) => sum + (controlAssessments[c.id]?.targetLevel || 3), 0) / assessedControls.length
            : 3;

        return {
            category: cat.name,
            actual: Math.round(avgMaturity * 100) / 100,
            target: Math.round(avgTarget * 100) / 100,
            fullMark: 5
        };
    });

    // Gap by category
    const gapByCategory = categories.map(cat => {
        const catGaps = gapControls.filter(c => c.categoryId === cat.id);
        return {
            ...cat,
            gapCount: catGaps.length,
            totalGap: catGaps.reduce((sum, c) => sum + c.gap, 0)
        };
    }).sort((a, b) => b.gapCount - a.gapCount);

    return (
        <div className="gap-analysis-page">
            {/* Summary Cards */}
            <div className="gap-summary">
                <div className="summary-card compliance">
                    <div className="summary-icon">
                        <CheckCircle />
                    </div>
                    <div className="summary-content">
                        <span className="summary-value">{stats.complianceRate}%</span>
                        <span className="summary-label">Tasa de Cumplimiento</span>
                    </div>
                </div>

                <div className="summary-card gaps">
                    <div className="summary-icon warning">
                        <AlertTriangle />
                    </div>
                    <div className="summary-content">
                        <span className="summary-value">{gapControls.length}</span>
                        <span className="summary-label">Controles con Brecha</span>
                    </div>
                </div>

                <div className="summary-card compliant">
                    <div className="summary-icon success">
                        <CheckCircle />
                    </div>
                    <div className="summary-content">
                        <span className="summary-value">{compliantControls.length}</span>
                        <span className="summary-label">Controles Conformes</span>
                    </div>
                </div>

                <div className="summary-card target">
                    <div className="summary-icon">
                        <Target />
                    </div>
                    <div className="summary-content">
                        <span className="summary-value">{stats.avgMaturity}</span>
                        <span className="summary-label">Madurez Promedio</span>
                    </div>
                </div>
            </div>

            {/* Radar Chart */}
            <div className="card radar-section">
                <div className="card-header">
                    <h3 className="card-title">Análisis de Brechas por Categoría</h3>
                    <span className="card-subtitle">Comparación entre nivel actual y objetivo</span>
                </div>
                <div className="radar-container">
                    <ResponsiveContainer width="100%" height={400}>
                        <RadarChart data={radarData}>
                            <PolarGrid stroke="rgba(255,255,255,0.1)" />
                            <PolarAngleAxis
                                dataKey="category"
                                tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
                            />
                            <PolarRadiusAxis
                                angle={30}
                                domain={[0, 5]}
                                tick={{ fill: 'var(--color-text-muted)', fontSize: 10 }}
                            />
                            <Radar
                                name="Nivel Objetivo"
                                dataKey="target"
                                stroke="var(--color-warning)"
                                fill="var(--color-warning)"
                                fillOpacity={0.1}
                                strokeWidth={2}
                                strokeDasharray="5 5"
                            />
                            <Radar
                                name="Nivel Actual"
                                dataKey="actual"
                                stroke="var(--color-primary)"
                                fill="var(--color-primary)"
                                fillOpacity={0.3}
                                strokeWidth={2}
                            />
                            <Legend
                                wrapperStyle={{ color: 'var(--color-text-secondary)' }}
                            />
                            <Tooltip
                                contentStyle={{
                                    background: 'var(--color-bg-secondary)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: 'var(--radius-md)'
                                }}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Gap by Category */}
            <div className="card category-gaps-section">
                <div className="card-header">
                    <h3 className="card-title">Brechas por Categoría</h3>
                </div>
                <div className="category-gaps-grid">
                    {gapByCategory.map(cat => (
                        <div key={cat.id} className="category-gap-card" style={{ '--cat-color': cat.color }}>
                            <div className="cat-gap-header">
                                <span className="cat-gap-name">{cat.name}</span>
                                <span className="cat-gap-count">{cat.gapCount} brechas</span>
                            </div>
                            <div className="cat-gap-bar">
                                <div
                                    className="cat-gap-fill"
                                    style={{ width: `${(cat.gapCount / (cat.count || 1)) * 100}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Gap Details Table */}
            <div className="card gap-details-section">
                <div className="card-header">
                    <h3 className="card-title">Detalle de Brechas</h3>
                    <span className="gap-count-badge">{gapControls.length} controles</span>
                </div>

                {gapControls.length > 0 ? (
                    <div className="table-wrapper">
                        <table className="table gap-table">
                            <thead>
                                <tr>
                                    <th>Control</th>
                                    <th>Nombre</th>
                                    <th>Categoría</th>
                                    <th>Actual</th>
                                    <th></th>
                                    <th>Objetivo</th>
                                    <th>Brecha</th>
                                </tr>
                            </thead>
                            <tbody>
                                {gapControls.map(control => (
                                    <tr key={control.id}>
                                        <td>
                                            <span className="control-id-cell">{control.id}</span>
                                        </td>
                                        <td className="control-name-cell">{control.name}</td>
                                        <td>
                                            <span className="category-tag">{control.category}</span>
                                        </td>
                                        <td>
                                            <span className={`maturity-badge level-${control.currentLevel}`}>
                                                {control.currentLevel}
                                            </span>
                                        </td>
                                        <td>
                                            <ArrowRight size={16} className="arrow-icon" />
                                        </td>
                                        <td>
                                            <span className="maturity-badge target">
                                                {control.targetLevel}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`gap-badge gap-${control.gap >= 3 ? 'high' : control.gap >= 2 ? 'medium' : 'low'}`}>
                                                -{control.gap}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="empty-gaps">
                        <CheckCircle size={48} />
                        <h4>¡Excelente!</h4>
                        <p>No hay brechas identificadas. Todos los controles evaluados cumplen con el nivel objetivo.</p>
                    </div>
                )}
            </div>

            {/* ===== REQUIREMENTS SECTION ===== */}
            <div className="section-divider">
                <Book size={22} />
                <h2>Análisis de Brechas — Requisitos (Cláusulas 4-10)</h2>
            </div>

            {/* Requirements Summary Cards */}
            <div className="gap-summary">
                <div className="summary-card compliance">
                    <div className="summary-icon">
                        <ClipboardCheck />
                    </div>
                    <div className="summary-content">
                        <span className="summary-value">
                            {(() => {
                                const all = CLAUSES.flatMap(c => c.subclauses);
                                const evaluated = all.filter(s => clauseAssessments?.[s.id]?.status && clauseAssessments[s.id].status !== 'not-evaluated');
                                const compliant = evaluated.filter(s => clauseAssessments?.[s.id]?.status === 'compliant');
                                return evaluated.length > 0 ? Math.round((compliant.length / evaluated.length) * 100) : 0;
                            })()}%
                        </span>
                        <span className="summary-label">Cumplimiento Requisitos</span>
                    </div>
                </div>

                <div className="summary-card gaps">
                    <div className="summary-icon warning">
                        <AlertTriangle />
                    </div>
                    <div className="summary-content">
                        <span className="summary-value">
                            {CLAUSES.flatMap(c => c.subclauses).filter(s => {
                                const st = clauseAssessments?.[s.id]?.status;
                                return st === 'non-compliant' || st === 'partial';
                            }).length}
                        </span>
                        <span className="summary-label">Requisitos con Brecha</span>
                    </div>
                </div>

                <div className="summary-card compliant">
                    <div className="summary-icon success">
                        <CheckCircle />
                    </div>
                    <div className="summary-content">
                        <span className="summary-value">
                            {CLAUSES.flatMap(c => c.subclauses).filter(s =>
                                clauseAssessments?.[s.id]?.status === 'compliant'
                            ).length}
                        </span>
                        <span className="summary-label">Requisitos Conformes</span>
                    </div>
                </div>

                <div className="summary-card target">
                    <div className="summary-icon">
                        <Target />
                    </div>
                    <div className="summary-content">
                        <span className="summary-value">
                            {(() => {
                                const withM = CLAUSES.flatMap(c => c.subclauses).filter(s => clauseAssessments?.[s.id]?.maturityLevel != null);
                                return withM.length > 0
                                    ? (withM.reduce((sum, s) => sum + (clauseAssessments[s.id].maturityLevel || 0), 0) / withM.length).toFixed(1)
                                    : '0.0';
                            })()}
                        </span>
                        <span className="summary-label">Madurez Prom. Requisitos</span>
                    </div>
                </div>
            </div>

            {/* Requirements Gap by Clause */}
            <div className="card category-gaps-section">
                <div className="card-header">
                    <h3 className="card-title">Brechas por Cláusula</h3>
                </div>
                <div className="category-gaps-grid">
                    {CLAUSES.map((clause, idx) => {
                        const total = clause.subclauses.length;
                        const gapCount = clause.subclauses.filter(s => {
                            const st = clauseAssessments?.[s.id]?.status;
                            return st === 'non-compliant' || st === 'partial';
                        }).length;
                        const colors = ['#6366f1', '#8b5cf6', '#a78bfa', '#f59e0b', '#22c55e', '#14b8a6', '#06b6d4'];
                        return (
                            <div key={clause.id} className="category-gap-card" style={{ '--cat-color': colors[idx % colors.length] }}>
                                <div className="cat-gap-header">
                                    <span className="cat-gap-name">{clause.id}. {clause.name}</span>
                                    <span className="cat-gap-count">{gapCount} brechas</span>
                                </div>
                                <div className="cat-gap-bar">
                                    <div
                                        className="cat-gap-fill"
                                        style={{ width: `${total > 0 ? (gapCount / total) * 100 : 0}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Requirements Gap Details Table */}
            <div className="card gap-details-section">
                <div className="card-header">
                    <h3 className="card-title">Detalle de Brechas — Requisitos</h3>
                    <span className="gap-count-badge">
                        {CLAUSES.flatMap(c => c.subclauses).filter(s => {
                            const st = clauseAssessments?.[s.id]?.status;
                            return st === 'non-compliant' || st === 'partial';
                        }).length} requisitos
                    </span>
                </div>

                {(() => {
                    const reqGaps = CLAUSES.flatMap(clause =>
                        clause.subclauses
                            .filter(s => {
                                const st = clauseAssessments?.[s.id]?.status;
                                return st === 'non-compliant' || st === 'partial';
                            })
                            .map(s => ({
                                ...s,
                                clauseName: clause.name,
                                clauseId: clause.id,
                                status: clauseAssessments?.[s.id]?.status,
                                maturityLevel: clauseAssessments?.[s.id]?.maturityLevel
                            }))
                    );

                    return reqGaps.length > 0 ? (
                        <div className="table-wrapper">
                            <table className="table gap-table">
                                <thead>
                                    <tr>
                                        <th>Cláusula</th>
                                        <th>Requisito</th>
                                        <th>Estado</th>
                                        <th>Madurez</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reqGaps.map(req => {
                                        const statusInfo = COMPLIANCE_STATUS.find(s => s.id === req.status);
                                        return (
                                            <tr key={req.id}>
                                                <td>
                                                    <span className="control-id-cell">{req.id}</span>
                                                </td>
                                                <td className="control-name-cell">{req.name}</td>
                                                <td>
                                                    <span
                                                        className="status-tag"
                                                        style={{ background: statusInfo?.color + '22', color: statusInfo?.color, border: `1px solid ${statusInfo?.color}44` }}
                                                    >
                                                        {statusInfo?.label}
                                                    </span>
                                                </td>
                                                <td>
                                                    {req.maturityLevel != null ? (
                                                        <span className={`maturity-badge level-${req.maturityLevel}`}>
                                                            {req.maturityLevel}
                                                        </span>
                                                    ) : (
                                                        <span className="maturity-badge">—</span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="empty-gaps">
                            <CheckCircle size={48} />
                            <h4>¡Excelente!</h4>
                            <p>No hay brechas en requisitos. Todos los requisitos evaluados están conformes.</p>
                        </div>
                    );
                })()}
            </div>
        </div>
    );
};

export default GapAnalysis;
