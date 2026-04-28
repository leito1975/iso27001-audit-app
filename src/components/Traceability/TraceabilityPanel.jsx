import { useState, useEffect } from 'react';
import { X, AlertTriangle, Search, ExternalLink } from 'lucide-react';
import api from '../../services/api';
import './TraceabilityPanel.css';

const SEVERITY_COLORS = {
    critical: '#ef4444',
    high: '#f97316',
    medium: '#eab308',
    low: '#22c55e'
};

const RISK_COLORS = {
    danger: '#ef4444',
    warning: '#f97316',
    success: '#22c55e'
};

const TraceabilityPanel = ({ controlId, controlName, onClose }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tab, setTab] = useState('findings');

    useEffect(() => {
        if (!controlId) return;
        setLoading(true);
        setError(null);
        api.controls.getTraceability(controlId)
            .then(res => {
                setData(res);
                setLoading(false);
                // Default to the tab that has content
                if (res.risks?.length > 0 && res.findings?.length === 0) setTab('risks');
            })
            .catch(err => {
                setError('Error cargando trazabilidad');
                setLoading(false);
            });
    }, [controlId]);

    const getRiskClass = (probability, impact) => {
        const score = (probability || 0) * (impact || 0);
        if (score >= 15) return 'danger';
        if (score >= 9) return 'warning';
        return 'success';
    };

    return (
        <div className="traceability-overlay" onClick={onClose}>
            <div className="traceability-panel" onClick={e => e.stopPropagation()}>
                <div className="traceability-header">
                    <div>
                        <span className="traceability-control-id">{controlId}</span>
                        <h3 className="traceability-title">{controlName}</h3>
                    </div>
                    <button className="btn btn-ghost btn-icon" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                {loading && (
                    <div className="traceability-loading">Cargando vínculos...</div>
                )}

                {error && (
                    <div className="traceability-error">{error}</div>
                )}

                {data && !loading && (
                    <>
                        <div className="traceability-tabs">
                            <button
                                className={`traceability-tab ${tab === 'findings' ? 'active' : ''}`}
                                onClick={() => setTab('findings')}
                            >
                                <AlertTriangle size={14} />
                                Hallazgos
                                <span className="tab-count">{data.findings?.length || 0}</span>
                            </button>
                            <button
                                className={`traceability-tab ${tab === 'risks' ? 'active' : ''}`}
                                onClick={() => setTab('risks')}
                            >
                                <Search size={14} />
                                Riesgos
                                <span className="tab-count">{data.risks?.length || 0}</span>
                            </button>
                        </div>

                        <div className="traceability-body">
                            {tab === 'findings' && (
                                <>
                                    {data.findings?.length === 0 ? (
                                        <div className="traceability-empty">
                                            <AlertTriangle size={32} />
                                            <p>No hay hallazgos vinculados a este control</p>
                                        </div>
                                    ) : (
                                        <div className="traceability-list">
                                            {data.findings.map(f => (
                                                <div key={f.id} className="traceability-item">
                                                    <div className="traceability-item-header">
                                                        <span className="item-id">H-{f.id}</span>
                                                        {f.severity && (
                                                            <span
                                                                className="item-badge"
                                                                style={{ background: (SEVERITY_COLORS[f.severity] || '#6366f1') + '22', color: SEVERITY_COLORS[f.severity] || '#6366f1' }}
                                                            >
                                                                {f.severity}
                                                            </span>
                                                        )}
                                                        <span className={`item-status status-${f.status}`}>{f.status}</span>
                                                    </div>
                                                    <p className="item-title">{f.title}</p>
                                                    {f.description && (
                                                        <p className="item-desc">{f.description.substring(0, 120)}{f.description.length > 120 ? '...' : ''}</p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}

                            {tab === 'risks' && (
                                <>
                                    {data.risks?.length === 0 ? (
                                        <div className="traceability-empty">
                                            <Search size={32} />
                                            <p>No hay riesgos vinculados a este control</p>
                                        </div>
                                    ) : (
                                        <div className="traceability-list">
                                            {data.risks.map(r => {
                                                const cls = getRiskClass(r.probability, r.impact);
                                                const score = (r.probability || 0) * (r.impact || 0);
                                                return (
                                                    <div key={r.id} className="traceability-item">
                                                        <div className="traceability-item-header">
                                                            <span className="item-id">R-{r.id}</span>
                                                            <span
                                                                className="item-badge"
                                                                style={{ background: (RISK_COLORS[cls] || '#6366f1') + '22', color: RISK_COLORS[cls] || '#6366f1' }}
                                                            >
                                                                {score} pts
                                                            </span>
                                                            {r.treatment && (
                                                                <span className="item-treatment">{r.treatment}</span>
                                                            )}
                                                        </div>
                                                        <p className="item-title">{r.name}</p>
                                                        {r.description && (
                                                            <p className="item-desc">{r.description.substring(0, 120)}{r.description.length > 120 ? '...' : ''}</p>
                                                        )}
                                                        {r.owner && (
                                                            <p className="item-owner">Responsable: {r.owner}</p>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default TraceabilityPanel;
