import {
    Shield,
    CheckCircle,
    AlertTriangle,
    TrendingUp,
    FileText,
    Target,
    Activity,
    ListChecks,
    Book,
    ClipboardCheck
} from 'lucide-react';
import { useAudit } from '../../context/AuditContext';
import { CONTROL_CATEGORIES, CMMI_LEVELS } from '../../data/iso27001-controls';
import { ISO42001_CONTROL_CATEGORIES } from '../../data/iso42001-controls';
import { ISO27001_CLAUSES, COMPLIANCE_STATUS } from '../../data/iso27001-clauses';
import { ISO42001_CLAUSES } from '../../data/iso42001-clauses';
import {
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Cell,
    PieChart,
    Pie,
    Legend
} from 'recharts';
import './Dashboard.css';

const TOOLTIP_STYLE = {
    contentStyle: {
        background: 'var(--color-bg-secondary)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 'var(--radius-md)'
    }
};

const Dashboard = () => {
    const { getStatistics, controlAssessments, clauseAssessments, controls, actionPlans, selectedNorm } = useAudit();
    const stats = getStatistics();

    // Define dynamic categories and clauses based on selected norm
    const CATEGORIES = selectedNorm === 'iso42001' ? ISO42001_CONTROL_CATEGORIES : CONTROL_CATEGORIES;
    const CLAUSES = selectedNorm === 'iso42001' ? ISO42001_CLAUSES : ISO27001_CLAUSES;

    // ─── CONTROLS (Annex A) ──────────────────────────────────────────────────────

    const radarDataControls = CATEGORIES.map(cat => {
        const catControls = controls.filter(c => c.categoryId === cat.id);
        const assessed = catControls.filter(c =>
            controlAssessments[c.id]?.maturityLevel != null && controlAssessments[c.id]?.applicable
        );
        const avg = assessed.length > 0
            ? assessed.reduce((sum, c) => sum + (controlAssessments[c.id]?.maturityLevel || 0), 0) / assessed.length
            : 0;
        return { category: cat.name, maturity: Math.round(avg * 100) / 100, target: 3, fullMark: 5 };
    });

    const donutControls = CMMI_LEVELS.map(level => {
        const count = Object.values(controlAssessments).filter(
            a => a.maturityLevel === level.level && a.applicable
        ).length;
        return { name: `Nivel ${level.level} — ${level.name}`, value: count, color: level.color };
    }).filter(d => d.value > 0);

    const complianceByDomain = CATEGORIES.map(cat => {
        const catControls = controls.filter(c => c.categoryId === cat.id);
        const applicable = catControls.filter(c => controlAssessments[c.id]?.applicable);
        const compliant = applicable.filter(c => (controlAssessments[c.id]?.maturityLevel || 0) >= 3);
        const assessed = applicable.filter(c => controlAssessments[c.id]?.maturityLevel != null);
        return {
            name: cat.name,
            compliance: applicable.length > 0
                ? Math.round((compliant.length / applicable.length) * 100)
                : 0,
            assessed: assessed.length,
            total: catControls.length,
            color: cat.color
        };
    });

    // ─── REQUIREMENTS (Clauses 4–10) ─────────────────────────────────────────────

    const allSubclauses = CLAUSES.flatMap(c => c.subclauses);
    const totalReq = allSubclauses.length;

    const evaluatedReq = allSubclauses.filter(s =>
        clauseAssessments?.[s.id]?.status && clauseAssessments[s.id].status !== 'not-evaluated'
    ).length;

    const compliantReq = allSubclauses.filter(s =>
        clauseAssessments?.[s.id]?.status === 'compliant'
    ).length;

    const reqProgressPct = totalReq > 0 ? Math.round((evaluatedReq / totalReq) * 100) : 0;
    const reqCompliancePct = evaluatedReq > 0 ? Math.round((compliantReq / evaluatedReq) * 100) : 0;

    const reqWithMaturity = allSubclauses.filter(s => clauseAssessments?.[s.id]?.maturityLevel != null);
    const reqAvgMaturity = reqWithMaturity.length > 0
        ? (reqWithMaturity.reduce((sum, s) => sum + (clauseAssessments[s.id].maturityLevel || 0), 0) / reqWithMaturity.length).toFixed(1)
        : '0.0';

    const radarDataReq = CLAUSES.map(clause => {
        const subs = clause.subclauses.filter(s => clauseAssessments?.[s.id]?.maturityLevel != null);
        const avg = subs.length > 0
            ? subs.reduce((sum, s) => sum + (clauseAssessments[s.id].maturityLevel || 0), 0) / subs.length
            : 0;
        return { category: `Cl. ${clause.id}`, maturity: Math.round(avg * 10) / 10, target: 3, fullMark: 5 };
    });

    const donutReq = (COMPLIANCE_STATUS || [])
        .filter(s => s.id !== 'not-evaluated')
        .map(s => ({
            name: s.label,
            value: allSubclauses.filter(sub => clauseAssessments?.[sub.id]?.status === s.id).length,
            color: s.color
        }))
        .filter(d => d.value > 0);

    // ─── OVERALL MATURITY ────────────────────────────────────────────────────────

    const overallMaturity = ((parseFloat(reqAvgMaturity) + parseFloat(stats.avgMaturity)) / 2).toFixed(1);
    const overallPct = Math.min(100, Math.round((parseFloat(overallMaturity) / 5) * 100));

    // ─── ACTION PLANS ────────────────────────────────────────────────────────────

    const actionPlanDonut = [
        { name: 'Pendiente', value: actionPlans.filter(p => ['pendiente', 'pending'].includes(p.status)).length, color: '#64748b' },
        { name: 'En Progreso', value: actionPlans.filter(p => ['en_progreso', 'in-progress'].includes(p.status)).length, color: '#f59e0b' },
        { name: 'Completado', value: actionPlans.filter(p => ['completado', 'completed'].includes(p.status)).length, color: '#22c55e' }
    ].filter(d => d.value > 0);

    return (
        <div className="dashboard">

            {/* ── OVERALL MATURITY BANNER ── */}
            <div className="kpi-card maturity-banner">
                <div className="kpi-icon" style={{ background: 'rgba(99,102,241,0.18)' }}>
                    <Activity style={{ color: '#6366f1' }} />
                </div>
                <div className="kpi-content" style={{ flex: 1 }}>
                    <span className="kpi-label">Madurez General {selectedNorm === 'iso42001' ? 'ISO 42001:2023' : 'ISO 27001:2022'}</span>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                        <span className="kpi-value" style={{ fontSize: '2.6rem', color: '#6366f1' }}>{overallMaturity}</span>
                        <span style={{ color: 'var(--color-text-muted)', fontSize: '1rem' }}>/ 5.0</span>
                        <span style={{ marginLeft: 12, fontSize: '1.1rem', fontWeight: 600, color: '#6366f1' }}>({overallPct}%)</span>
                    </div>
                    <div className="progress-bar" style={{ marginTop: 8, maxWidth: 480 }}>
                        <div className="progress-bar-fill" style={{ width: `${overallPct}%`, background: '#6366f1' }} />
                    </div>
                </div>
                <div className="banner-breakdown">
                    <div className="banner-item">
                        <span className="banner-value">{reqAvgMaturity}</span>
                        <span className="banner-label">Requisitos</span>
                    </div>
                    <div className="banner-divider" />
                    <div className="banner-item">
                        <span className="banner-value">{stats.avgMaturity}</span>
                        <span className="banner-label">Controles</span>
                    </div>
                </div>
            </div>

            {/* ── TOP 4 KPI CARDS ── */}
            <div className="kpi-grid">
                <div className="kpi-card">
                    <div className="kpi-icon success"><CheckCircle /></div>
                    <div className="kpi-content">
                        <span className="kpi-label">Controles Evaluados</span>
                        <span className="kpi-value">
                            {stats.assessedControls}
                            <span style={{ fontSize: '1.1rem', fontWeight: 400, color: 'var(--color-text-muted)' }}>/{stats.totalControls}</span>
                        </span>
                        <div className="progress-bar" style={{ marginTop: 4 }}>
                            <div className="progress-bar-fill" style={{ width: `${stats.progressRate}%` }} />
                        </div>
                        <span className="kpi-sublabel">{stats.complianceRate}% conformes</span>
                    </div>
                </div>

                <div className="kpi-card">
                    <div className="kpi-icon primary"><ClipboardCheck /></div>
                    <div className="kpi-content">
                        <span className="kpi-label">Requisitos Evaluados</span>
                        <span className="kpi-value">
                            {evaluatedReq}
                            <span style={{ fontSize: '1.1rem', fontWeight: 400, color: 'var(--color-text-muted)' }}>/{totalReq}</span>
                        </span>
                        <div className="progress-bar" style={{ marginTop: 4 }}>
                            <div className="progress-bar-fill" style={{ width: `${reqProgressPct}%`, background: 'var(--color-primary)' }} />
                        </div>
                        <span className="kpi-sublabel">{reqCompliancePct}% conformes</span>
                    </div>
                </div>

                <div className="kpi-card">
                    <div className="kpi-icon warning"><FileText /></div>
                    <div className="kpi-content">
                        <span className="kpi-label">Hallazgos Abiertos</span>
                        <span className="kpi-value">{stats.findings.open}</span>
                        <span className="kpi-trend" style={{ color: stats.findings.ncMajor > 0 ? 'var(--color-danger)' : 'var(--color-text-muted)' }}>
                            <TrendingUp size={14} />
                            {stats.findings.ncMajor} NC Mayor · {stats.findings.ncMinor} NC Menor
                        </span>
                    </div>
                </div>

                <div className="kpi-card">
                    <div className="kpi-icon danger"><AlertTriangle /></div>
                    <div className="kpi-content">
                        <span className="kpi-label">Riesgos Activos</span>
                        <span className="kpi-value">{stats.risks.open}</span>
                        <span className="kpi-trend" style={{ color: stats.risks.critical > 0 ? 'var(--color-danger)' : 'var(--color-text-muted)' }}>
                            <Shield size={14} />
                            {stats.risks.critical} críticos de {stats.risks.total} totales
                        </span>
                    </div>
                </div>
            </div>

            {/* ── TWO-COLUMN: REQUISITOS vs CONTROLES ── */}
            <div className="two-sections">

                {/* LEFT: Requisitos */}
                <div className="section-column">
                    <div className="section-column-header">
                        <Book size={18} />
                        <h3>Requisitos — Cláusulas 4–10</h3>
                        <span className="section-badge">{reqAvgMaturity} / 5.0</span>
                    </div>

                    <div className="section-kpis">
                        <div className="mini-kpi">
                            <span className="mini-kpi-value" style={{ color: '#6366f1' }}>{reqProgressPct}%</span>
                            <span className="mini-kpi-label">Evaluados</span>
                        </div>
                        <div className="mini-kpi">
                            <span className="mini-kpi-value" style={{ color: '#22c55e' }}>{reqCompliancePct}%</span>
                            <span className="mini-kpi-label">Conformes</span>
                        </div>
                        <div className="mini-kpi">
                            <span className="mini-kpi-value" style={{ color: '#f59e0b' }}>{reqAvgMaturity}</span>
                            <span className="mini-kpi-label">Madurez</span>
                        </div>
                    </div>

                    <div className="card chart-card chart-card-sm">
                        <div className="card-header">
                            <h4 className="card-title">Madurez por Cláusula</h4>
                        </div>
                        <ResponsiveContainer width="100%" height={260}>
                            <RadarChart data={radarDataReq}>
                                <PolarGrid stroke="rgba(255,255,255,0.08)" />
                                <PolarAngleAxis dataKey="category" tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fill: 'var(--color-text-muted)', fontSize: 10 }} />
                                <Radar name="Objetivo" dataKey="target" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.08} strokeDasharray="5 5" />
                                <Radar name="Madurez" dataKey="maturity" stroke="#6366f1" fill="#6366f1" fillOpacity={0.35} />
                                <Tooltip {...TOOLTIP_STYLE} />
                                <Legend verticalAlign="bottom" height={28} formatter={v => <span style={{ color: 'var(--color-text-secondary)', fontSize: 11 }}>{v}</span>} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="card chart-card chart-card-sm">
                        <div className="card-header">
                            <h4 className="card-title">Estado de Requisitos</h4>
                        </div>
                        {donutReq.length > 0 ? (
                            <ResponsiveContainer width="100%" height={220}>
                                <PieChart>
                                    <Pie data={donutReq} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
                                        {donutReq.map((e, i) => <Cell key={i} fill={e.color} />)}
                                    </Pie>
                                    <Tooltip {...TOOLTIP_STYLE} />
                                    <Legend verticalAlign="bottom" height={36} formatter={v => <span style={{ color: 'var(--color-text-secondary)', fontSize: 11 }}>{v}</span>} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="empty-chart" style={{ height: 220 }}>
                                <Book size={36} />
                                <p>Sin requisitos evaluados</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT: Controles Anexo A */}
                <div className="section-column">
                    <div className="section-column-header">
                        <Shield size={18} />
                        <h3>Controles — Anexo A</h3>
                        <span className="section-badge">{stats.avgMaturity} / 5.0</span>
                    </div>

                    <div className="section-kpis">
                        <div className="mini-kpi">
                            <span className="mini-kpi-value" style={{ color: '#22c55e' }}>{stats.progressRate}%</span>
                            <span className="mini-kpi-label">Evaluados</span>
                        </div>
                        <div className="mini-kpi">
                            <span className="mini-kpi-value" style={{ color: '#22c55e' }}>{stats.complianceRate}%</span>
                            <span className="mini-kpi-label">Conformes</span>
                        </div>
                        <div className="mini-kpi">
                            <span className="mini-kpi-value" style={{ color: '#f59e0b' }}>{stats.avgMaturity}</span>
                            <span className="mini-kpi-label">Madurez</span>
                        </div>
                    </div>

                    <div className="card chart-card chart-card-sm">
                        <div className="card-header">
                            <h4 className="card-title">Madurez por Dominio</h4>
                        </div>
                        <ResponsiveContainer width="100%" height={260}>
                            <RadarChart data={radarDataControls}>
                                <PolarGrid stroke="rgba(255,255,255,0.08)" />
                                <PolarAngleAxis dataKey="category" tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fill: 'var(--color-text-muted)', fontSize: 10 }} />
                                <Radar name="Objetivo" dataKey="target" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.08} strokeDasharray="5 5" />
                                <Radar name="Madurez" dataKey="maturity" stroke="#22c55e" fill="#22c55e" fillOpacity={0.35} />
                                <Tooltip {...TOOLTIP_STYLE} />
                                <Legend verticalAlign="bottom" height={28} formatter={v => <span style={{ color: 'var(--color-text-secondary)', fontSize: 11 }}>{v}</span>} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="card chart-card chart-card-sm">
                        <div className="card-header">
                            <h4 className="card-title">Distribución CMMI — Controles</h4>
                        </div>
                        {donutControls.length > 0 ? (
                            <ResponsiveContainer width="100%" height={220}>
                                <PieChart>
                                    <Pie data={donutControls} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
                                        {donutControls.map((e, i) => <Cell key={i} fill={e.color} />)}
                                    </Pie>
                                    <Tooltip {...TOOLTIP_STYLE} />
                                    <Legend verticalAlign="bottom" height={36} formatter={v => <span style={{ color: 'var(--color-text-secondary)', fontSize: 11 }}>{v}</span>} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="empty-chart" style={{ height: 220 }}>
                                <Shield size={36} />
                                <p>Sin controles evaluados</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── COMPLIANCE BY DOMAIN (full-width horizontal bar) ── */}
            <div className="card chart-card-wide">
                <div className="card-header">
                    <h3 className="card-title">Cumplimiento por Dominio — Anexo A</h3>
                    <Target className="card-icon" />
                </div>
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={complianceByDomain} layout="vertical" margin={{ left: 12, right: 64, top: 4, bottom: 4 }}>
                        <XAxis type="number" domain={[0, 100]} tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} tickFormatter={v => `${v}%`} />
                        <YAxis dataKey="name" type="category" tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} width={220} />
                        <Tooltip
                            formatter={(v, n, p) => [`${v}% (${p.payload.assessed}/${p.payload.total} evaluados)`, 'Cumplimiento']}
                            {...TOOLTIP_STYLE}
                        />
                        <Bar dataKey="compliance" radius={[0, 6, 6, 0]}
                            label={{ position: 'right', formatter: v => `${v}%`, fill: 'var(--color-text-secondary)', fontSize: 12 }}>
                            {complianceByDomain.map((e, i) => <Cell key={i} fill={e.color} />)}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* ── SUMMARY ROW: Findings + Risks + Action Plans ── */}
            <div className="summary-row">
                <div className="card summary-card">
                    <div className="card-header">
                        <h3 className="card-title">Hallazgos</h3>
                        <FileText className="card-icon" />
                    </div>
                    <div className="findings-type-list">
                        <div className="findings-type-row">
                            <span className="findings-type-dot" style={{ background: '#ef4444' }} />
                            <span className="findings-type-name">NC Mayor</span>
                            <span className="findings-type-count" style={{ color: '#ef4444' }}>{stats.findings.ncMajor}</span>
                        </div>
                        <div className="findings-type-row">
                            <span className="findings-type-dot" style={{ background: '#f59e0b' }} />
                            <span className="findings-type-name">NC Menor</span>
                            <span className="findings-type-count" style={{ color: '#f59e0b' }}>{stats.findings.ncMinor}</span>
                        </div>
                        <div className="findings-type-row">
                            <span className="findings-type-dot" style={{ background: '#6366f1' }} />
                            <span className="findings-type-name">Observación</span>
                            <span className="findings-type-count" style={{ color: '#6366f1' }}>{stats.findings.observation}</span>
                        </div>
                        <div className="findings-type-row">
                            <span className="findings-type-dot" style={{ background: '#22c55e' }} />
                            <span className="findings-type-name">Oportunidad de Mejora</span>
                            <span className="findings-type-count" style={{ color: '#22c55e' }}>{stats.findings.improvement}</span>
                        </div>
                        <div className="findings-type-row">
                            <span className="findings-type-dot" style={{ background: '#7c3aed' }} />
                            <span className="findings-type-name">Fortaleza</span>
                            <span className="findings-type-count" style={{ color: '#7c3aed' }}>{stats.findings.strength || 0}</span>
                        </div>
                    </div>
                    <div className="findings-status-footer">
                        <span><strong>{stats.findings.open + stats.findings.inProgress}</strong> abiertos</span>
                        <span className="footer-divider">·</span>
                        <span><strong>{stats.findings.closed}</strong> cerrados</span>
                        <span className="footer-divider">·</span>
                        <span><strong>{stats.findings.total}</strong> total</span>
                    </div>
                </div>

                <div className="card summary-card">
                    <div className="card-header">
                        <h3 className="card-title">Riesgos</h3>
                        <AlertTriangle className="card-icon" />
                    </div>
                    <div className="summary-grid">
                        <div className="summary-item"><span className="summary-value">{stats.risks.total}</span><span className="summary-label">Total</span></div>
                        <div className="summary-item"><span className="summary-value danger">{stats.risks.critical}</span><span className="summary-label">Críticos</span></div>
                        <div className="summary-item"><span className="summary-value warning">{stats.risks.open}</span><span className="summary-label">Activos</span></div>
                        <div className="summary-item"><span className="summary-value success">{stats.risks.treated}</span><span className="summary-label">Tratados</span></div>
                    </div>
                </div>

                <div className="card summary-card">
                    <div className="card-header">
                        <h3 className="card-title">Planes de Acción</h3>
                        <ListChecks className="card-icon" />
                    </div>
                    {actionPlanDonut.length > 0 ? (
                        <ResponsiveContainer width="100%" height={140}>
                            <PieChart>
                                <Pie data={actionPlanDonut} cx="50%" cy="50%" outerRadius={50} dataKey="value">
                                    {actionPlanDonut.map((e, i) => <Cell key={i} fill={e.color} />)}
                                </Pie>
                                <Tooltip {...TOOLTIP_STYLE} />
                                <Legend verticalAlign="bottom" height={30} formatter={v => <span style={{ color: 'var(--color-text-secondary)', fontSize: 11 }}>{v}</span>} />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="summary-grid">
                            <div className="summary-item" style={{ gridColumn: '1 / -1' }}>
                                <span className="summary-value">{actionPlans.length}</span>
                                <span className="summary-label">Total</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
