import { useState } from 'react';
import {
    ListChecks, AlertTriangle, Search, CheckCircle,
    Clock, TrendingUp, Calendar, ChevronRight
} from 'lucide-react';
import { useAudit } from '../../context/AuditContext';
import { getRiskLevel } from '../../data/iso27001-controls';
import './Seguimiento.css';

const STATUS_FINDING = {
    abierto:     { label: 'Abierto',      cls: 'open'     },
    open:        { label: 'Abierto',      cls: 'open'     },
    'en-proceso':{ label: 'En proceso',   cls: 'progress' },
    'in-progress':{ label: 'En proceso',  cls: 'progress' },
    cerrado:     { label: 'Cerrado',      cls: 'closed'   },
    closed:      { label: 'Cerrado',      cls: 'closed'   }
};

const TREAT_LABEL = { mitigate:'Mitigar', transfer:'Transferir', accept:'Aceptar', avoid:'Evitar' };

const Seguimiento = () => {
    const { risks, findings } = useAudit();
    const [activeTab, setActiveTab] = useState('open');

    // ─── Open Findings ────────────────────────────────────────────
    const openFindings = findings.filter(f =>
        f.status === 'abierto' || f.status === 'open' || f.status === 'en-proceso' || f.status === 'in-progress'
    );

    // ─── Critical / High Risks ────────────────────────────────────
    const criticalRisks = risks.filter(r => {
        const score = (r.probability || 0) * (r.impact || 0);
        return score >= 9;
    });

    // ─── Risks without treatment plan ─────────────────────────────
    const risksNoPlan = risks.filter(r => !r.treatmentPlan && r.treatment);

    // ─── Risks with target date due soon / overdue ────────────────
    const today = new Date();
    const in30 = new Date(); in30.setDate(today.getDate() + 30);
    const dueSoonRisks = risks.filter(r => {
        if (!r.targetDate) return false;
        const d = new Date(r.targetDate);
        return d <= in30;
    }).sort((a, b) => new Date(a.targetDate) - new Date(b.targetDate));

    const overdueRisks = dueSoonRisks.filter(r => new Date(r.targetDate) < today);
    const upcomingRisks = dueSoonRisks.filter(r => new Date(r.targetDate) >= today);

    const tabs = [
        { id: 'open',     label: 'Hallazgos abiertos',  count: openFindings.length,   color: '#f97316' },
        { id: 'critical', label: 'Riesgos críticos/altos', count: criticalRisks.length, color: '#ef4444' },
        { id: 'due',      label: 'Vencimientos próximos',  count: dueSoonRisks.length,  color: '#eab308' },
        { id: 'noplan',   label: 'Sin plan de tratamiento',count: risksNoPlan.length,   color: '#94a3b8' }
    ];

    const formatDate = (d) => {
        if (!d) return '—';
        try {
            const date = new Date(d);
            const diff = Math.round((date - today) / (1000 * 60 * 60 * 24));
            const label = date.toLocaleDateString('es-ES', { day:'2-digit', month:'short', year:'numeric' });
            if (diff < 0) return `${label} (vencido hace ${Math.abs(diff)} días)`;
            if (diff === 0) return `${label} (hoy)`;
            if (diff <= 7) return `${label} (en ${diff} días)`;
            return label;
        } catch { return '—'; }
    };

    return (
        <div className="seguimiento-page">
            {/* Header */}
            <div className="card seguimiento-header">
                <div>
                    <h1 className="seguimiento-title">
                        <ListChecks size={22} />
                        Seguimiento
                    </h1>
                    <p className="seguimiento-subtitle">
                        Hallazgos y riesgos que requieren atención. Vista consolidada de ítems pendientes.
                    </p>
                </div>
                <div className="seguimiento-summary">
                    <div className="summary-pill critical">
                        <AlertTriangle size={14} />
                        {overdueRisks.length} vencidos
                    </div>
                    <div className="summary-pill warning">
                        <Clock size={14} />
                        {upcomingRisks.length} próximos 30 días
                    </div>
                    <div className="summary-pill open">
                        <Search size={14} />
                        {openFindings.length} hallazgos abiertos
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="seguimiento-tabs">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`seg-tab ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                        style={activeTab === tab.id ? { borderBottomColor: tab.color, color: tab.color } : {}}
                    >
                        {tab.label}
                        <span
                            className="seg-tab-count"
                            style={activeTab === tab.id ? { background: tab.color + '28', color: tab.color } : {}}
                        >
                            {tab.count}
                        </span>
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="seguimiento-content">

                {/* OPEN FINDINGS */}
                {activeTab === 'open' && (
                    <div className="seg-list">
                        {openFindings.length === 0 ? (
                            <div className="seg-empty">
                                <CheckCircle size={40} />
                                <p>No hay hallazgos abiertos. ¡Todo bajo control!</p>
                            </div>
                        ) : openFindings.map(f => {
                            const st = STATUS_FINDING[f.status] || { label: f.status, cls: 'pending' };
                            return (
                                <div key={f.id} className="seg-item card">
                                    <div className="seg-item-header">
                                        <span className="seg-item-id">H-{f.id}</span>
                                        {f.severity && (
                                            <span className={`seg-badge sev-${f.severity}`}>{f.severity}</span>
                                        )}
                                        <span className={`seg-badge st-${st.cls}`}>{st.label}</span>
                                        {f.type && <span className="seg-badge type">{f.type}</span>}
                                    </div>
                                    <p className="seg-item-title">{f.title}</p>
                                    {f.description && (
                                        <p className="seg-item-desc">{f.description.substring(0, 160)}{f.description.length > 160 ? '…' : ''}</p>
                                    )}
                                    {f.controls && f.controls.length > 0 && (
                                        <div className="seg-controls">
                                            {f.controls.map(c => (
                                                <span key={c.id} className="seg-control-tag">{c.id}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* CRITICAL RISKS */}
                {activeTab === 'critical' && (
                    <div className="seg-list">
                        {criticalRisks.length === 0 ? (
                            <div className="seg-empty">
                                <CheckCircle size={40} />
                                <p>No hay riesgos críticos ni altos.</p>
                            </div>
                        ) : criticalRisks.sort((a, b) => ((b.probability||0)*(b.impact||0)) - ((a.probability||0)*(a.impact||0))).map(r => {
                            const score = (r.probability||0) * (r.impact||0);
                            const level = getRiskLevel(r.probability, r.impact);
                            return (
                                <div key={r.id} className="seg-item card">
                                    <div className="seg-item-header">
                                        <span className="seg-item-id">R-{r.id}</span>
                                        <span className={`seg-badge risk-${level.class}`}>{level.level} ({score} pts)</span>
                                        {r.treatment && <span className="seg-badge type">{TREAT_LABEL[r.treatment] || r.treatment}</span>}
                                    </div>
                                    <p className="seg-item-title">{r.name || r.title}</p>
                                    {r.description && (
                                        <p className="seg-item-desc">{r.description.substring(0, 160)}{r.description.length > 160 ? '…' : ''}</p>
                                    )}
                                    <div className="seg-item-footer">
                                        {r.owner && <span className="seg-meta">👤 {r.owner}</span>}
                                        {r.targetDate && <span className="seg-meta"><Calendar size={12} /> {formatDate(r.targetDate)}</span>}
                                        {!r.treatmentPlan && r.treatment && (
                                            <span className="seg-meta warn">⚠ Sin plan de tratamiento</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* DUE SOON */}
                {activeTab === 'due' && (
                    <div className="seg-list">
                        {dueSoonRisks.length === 0 ? (
                            <div className="seg-empty">
                                <Calendar size={40} />
                                <p>No hay riesgos con fecha objetivo en los próximos 30 días.</p>
                            </div>
                        ) : (
                            <>
                                {overdueRisks.length > 0 && (
                                    <>
                                        <div className="seg-section-label overdue">
                                            <AlertTriangle size={14} /> Vencidos ({overdueRisks.length})
                                        </div>
                                        {overdueRisks.map(r => {
                                            const level = getRiskLevel(r.probability, r.impact);
                                            return (
                                                <div key={r.id} className="seg-item card seg-item-overdue">
                                                    <div className="seg-item-header">
                                                        <span className="seg-item-id">R-{r.id}</span>
                                                        <span className={`seg-badge risk-${level.class}`}>{level.level}</span>
                                                    </div>
                                                    <p className="seg-item-title">{r.name || r.title}</p>
                                                    <div className="seg-item-footer">
                                                        {r.owner && <span className="seg-meta">👤 {r.owner}</span>}
                                                        <span className="seg-meta overdue"><Calendar size={12} /> {formatDate(r.targetDate)}</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </>
                                )}
                                {upcomingRisks.length > 0 && (
                                    <>
                                        <div className="seg-section-label upcoming">
                                            <TrendingUp size={14} /> Próximos 30 días ({upcomingRisks.length})
                                        </div>
                                        {upcomingRisks.map(r => {
                                            const level = getRiskLevel(r.probability, r.impact);
                                            return (
                                                <div key={r.id} className="seg-item card">
                                                    <div className="seg-item-header">
                                                        <span className="seg-item-id">R-{r.id}</span>
                                                        <span className={`seg-badge risk-${level.class}`}>{level.level}</span>
                                                    </div>
                                                    <p className="seg-item-title">{r.name || r.title}</p>
                                                    <div className="seg-item-footer">
                                                        {r.owner && <span className="seg-meta">👤 {r.owner}</span>}
                                                        <span className="seg-meta"><Calendar size={12} /> {formatDate(r.targetDate)}</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </>
                                )}
                            </>
                        )}
                    </div>
                )}

                {/* NO PLAN */}
                {activeTab === 'noplan' && (
                    <div className="seg-list">
                        {risksNoPlan.length === 0 ? (
                            <div className="seg-empty">
                                <CheckCircle size={40} />
                                <p>Todos los riesgos con estrategia definida tienen su plan de tratamiento documentado.</p>
                            </div>
                        ) : risksNoPlan.map(r => {
                            const level = getRiskLevel(r.probability, r.impact);
                            return (
                                <div key={r.id} className="seg-item card">
                                    <div className="seg-item-header">
                                        <span className="seg-item-id">R-{r.id}</span>
                                        <span className={`seg-badge risk-${level.class}`}>{level.level}</span>
                                        <span className="seg-badge type">{TREAT_LABEL[r.treatment] || r.treatment}</span>
                                        <span className="seg-badge warn">Sin plan documentado</span>
                                    </div>
                                    <p className="seg-item-title">{r.name || r.title}</p>
                                    {r.description && (
                                        <p className="seg-item-desc">{r.description.substring(0, 120)}…</p>
                                    )}
                                    {r.owner && <span className="seg-meta">👤 {r.owner}</span>}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Seguimiento;
