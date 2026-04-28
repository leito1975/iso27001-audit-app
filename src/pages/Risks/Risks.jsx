import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, X, AlertTriangle, Shield, Tag } from 'lucide-react';
import { useAudit } from '../../context/AuditContext';
import { RISK_LEVELS, getRiskLevel } from '../../data/iso27001-controls';
import TagSelector from '../../components/Tags/TagSelector';
import './Risks.css';

const Risks = () => {
    const { risks, addRisk, updateRisk, deleteRisk, controls, tags } = useAudit();
    const [searchTerm, setSearchTerm] = useState('');
    const [tagFilter, setTagFilter] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [editingRisk, setEditingRisk] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        controlIds: [],
        probability: 3,
        impact: 3,
        owner: '',
        treatment: '',
        treatmentPlan: '',
        targetDate: '',
        residualProbability: '',
        residualImpact: '',
        residualNotes: '',
        residualEvaluatedAt: '',
        status: 'identificado',
        tags: []
    });
    const [controlSearch, setControlSearch] = useState('');

    const filteredRisks = risks.filter(risk => {
        const matchesSearch = (risk.name || risk.title)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            risk.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTag = tagFilter === 'all' || (risk.tags && risk.tags.some(t =>
            (typeof t === 'object' ? t.id : t) === parseInt(tagFilter)
        ));
        return matchesSearch && matchesTag;
    });

    // Group risks by level
    const risksByLevel = {
        critical: filteredRisks.filter(r => getRiskLevel(r.probability, r.impact).level === 'Crítico'),
        high: filteredRisks.filter(r => getRiskLevel(r.probability, r.impact).level === 'Alto'),
        medium: filteredRisks.filter(r => getRiskLevel(r.probability, r.impact).level === 'Medio'),
        low: filteredRisks.filter(r => getRiskLevel(r.probability, r.impact).level === 'Bajo')
    };

    const handleOpenModal = (risk = null) => {
        if (risk) {
            setEditingRisk(risk);
            setFormData({
                title: risk.name || risk.title || '',
                description: risk.description || '',
                controlIds: (risk.controls || []).map(c => c.id),
                probability: risk.probability || 3,
                impact: risk.impact || 3,
                owner: risk.owner || '',
                treatment: risk.treatment || '',
                treatmentPlan: risk.treatmentPlan || '',
                targetDate: risk.targetDate ? risk.targetDate.split('T')[0] : '',
                residualProbability: risk.residualProbability || '',
                residualImpact: risk.residualImpact || '',
                residualNotes: risk.residualNotes || '',
                residualEvaluatedAt: risk.residualEvaluatedAt ? risk.residualEvaluatedAt.split('T')[0] : '',
                status: risk.status || 'identificado',
                tags: (risk.tags || []).map(t => typeof t === 'object' ? t.id : t)
            });
        } else {
            setEditingRisk(null);
            setFormData({
                title: '',
                description: '',
                controlIds: [],
                probability: 3,
                impact: 3,
                owner: '',
                treatment: '',
                treatmentPlan: '',
                targetDate: '',
                residualProbability: '',
                residualImpact: '',
                residualNotes: '',
                residualEvaluatedAt: '',
                status: 'identificado',
                tags: []
            });
        }
        setControlSearch('');
        setShowModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingRisk) {
            updateRisk(editingRisk.id, formData);
        } else {
            addRisk(formData);
        }
        setShowModal(false);
    };

    const handleDelete = (id) => {
        if (window.confirm('¿Está seguro de eliminar este riesgo?')) {
            deleteRisk(id);
        }
    };

    return (
        <div className="risks-page">
            {/* Header */}
            <div className="page-header card">
                <div className="header-left">
                    <div className="search-wrapper">
                        <Search className="search-icon" />
                        <input
                            type="text"
                            placeholder="Buscar riesgos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="form-input"
                        />
                    </div>

                    <select
                        value={tagFilter}
                        onChange={(e) => setTagFilter(e.target.value)}
                        className="form-select"
                    >
                        <option value="all">Todas las etiquetas</option>
                        {tags.map(tag => (
                            <option key={tag.id} value={tag.id}>{tag.name}</option>
                        ))}
                    </select>
                </div>

                <button className="btn btn-primary" onClick={() => handleOpenModal()}>
                    <Plus size={18} />
                    Nuevo Riesgo
                </button>
            </div>

            {/* Risk Matrix */}
            <div className="card risk-matrix-section">
                <div className="card-header">
                    <h3 className="card-title">Matriz de Riesgos</h3>
                </div>
                <div className="risk-matrix">
                    <div className="matrix-y-label">
                        <span>Probabilidad</span>
                    </div>
                    <div className="matrix-grid">
                        {[5, 4, 3, 2, 1].map(prob => (
                            <div key={prob} className="matrix-row">
                                <div className="matrix-row-label">{prob}</div>
                                {[1, 2, 3, 4, 5].map(imp => {
                                    const riskLevel = getRiskLevel(prob, imp);
                                    const risksInCell = risks.filter(
                                        r => r.probability === prob && r.impact === imp
                                    );
                                    return (
                                        <div
                                            key={`${prob}-${imp}`}
                                            className={`matrix-cell ${riskLevel.class}`}
                                            title={`P:${prob} x I:${imp} = ${riskLevel.level}`}
                                        >
                                            {risksInCell.length > 0 && (
                                                <span className="cell-count">{risksInCell.length}</span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                        <div className="matrix-x-labels">
                            <span></span>
                            {[1, 2, 3, 4, 5].map(i => (
                                <span key={i}>{i}</span>
                            ))}
                        </div>
                    </div>
                    <div className="matrix-x-label">
                        <span>Impacto</span>
                    </div>
                </div>

                <div className="matrix-legend">
                    <div className="legend-item">
                        <span className="legend-color critical"></span>
                        <span>Crítico (15-25)</span>
                    </div>
                    <div className="legend-item">
                        <span className="legend-color high"></span>
                        <span>Alto (9-14)</span>
                    </div>
                    <div className="legend-item">
                        <span className="legend-color medium"></span>
                        <span>Medio (4-8)</span>
                    </div>
                    <div className="legend-item">
                        <span className="legend-color low"></span>
                        <span>Bajo (1-3)</span>
                    </div>
                </div>
            </div>

            {/* Risk Stats */}
            <div className="risk-stats">
                <div className="stat-card critical">
                    <AlertTriangle />
                    <span className="stat-number">{risksByLevel.critical.length}</span>
                    <span className="stat-label">Críticos</span>
                </div>
                <div className="stat-card high">
                    <AlertTriangle />
                    <span className="stat-number">{risksByLevel.high.length}</span>
                    <span className="stat-label">Altos</span>
                </div>
                <div className="stat-card medium">
                    <Shield />
                    <span className="stat-number">{risksByLevel.medium.length}</span>
                    <span className="stat-label">Medios</span>
                </div>
                <div className="stat-card low">
                    <Shield />
                    <span className="stat-number">{risksByLevel.low.length}</span>
                    <span className="stat-label">Bajos</span>
                </div>
            </div>

            {/* Risks List */}
            <div className="risks-list">
                {filteredRisks.length > 0 ? (
                    <div className="table-wrapper card">
                        <table className="table risks-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Riesgo</th>
                                    <th>P</th>
                                    <th>I</th>
                                    <th>Nivel</th>
                                    <th>Residual</th>
                                    <th>Estado</th>
                                    <th>Controles</th>
                                    <th>Responsable</th>
                                    <th>Tratamiento</th>
                                    <th>F. Objetivo</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRisks.map(risk => {
                                    const riskLevel = getRiskLevel(risk.probability, risk.impact);
                                    const residualLevel = (risk.residualProbability && risk.residualImpact)
                                        ? getRiskLevel(risk.residualProbability, risk.residualImpact)
                                        : null;
                                    return (
                                        <tr key={risk.id}>
                                            <td>
                                                <span className="risk-id">{risk.id}</span>
                                            </td>
                                            <td>
                                                <div className="risk-info">
                                                    <span className="risk-title">{risk.name || risk.title}</span>
                                                    <span className="risk-desc">{risk.description?.substring(0, 60)}{risk.description?.length > 60 ? '...' : ''}</span>
                                                </div>
                                            </td>
                                            <td>{risk.probability}</td>
                                            <td>{risk.impact}</td>
                                            <td>
                                                <span className={`risk-level-badge ${riskLevel.class}`}>
                                                    {riskLevel.level}
                                                </span>
                                            </td>
                                            <td>
                                                {residualLevel ? (
                                                    <span className={`risk-level-badge ${residualLevel.class}`} title={`P:${risk.residualProbability} × I:${risk.residualImpact}`}>
                                                        {residualLevel.level}
                                                    </span>
                                                ) : <span className="text-muted">—</span>}
                                            </td>
                                            <td>
                                                <span className={`lifecycle-badge lifecycle-${risk.status || 'identificado'}`}>
                                                    {risk.status === 'identificado' && 'Identificado'}
                                                    {risk.status === 'en-tratamiento' && 'En tratamiento'}
                                                    {risk.status === 'mitigado' && 'Mitigado'}
                                                    {risk.status === 'aceptado' && 'Aceptado'}
                                                    {risk.status === 'cerrado' && 'Cerrado'}
                                                    {(!risk.status || !['identificado','en-tratamiento','mitigado','aceptado','cerrado'].includes(risk.status)) && 'Identificado'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="risk-controls-cell">
                                                    {(risk.controls || []).slice(0, 3).map(c => (
                                                        <span key={c.id} className="control-tag" title={c.name}>{c.id}</span>
                                                    ))}
                                                    {(risk.controls || []).length > 3 && (
                                                        <span className="control-tag-more">+{risk.controls.length - 3}</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td>{risk.owner || '—'}</td>
                                            <td>
                                                <span className={`treatment-badge ${risk.treatment || 'none'}`}>
                                                    {risk.treatment === 'mitigate' && 'Mitigar'}
                                                    {risk.treatment === 'transfer' && 'Transferir'}
                                                    {risk.treatment === 'accept' && 'Aceptar'}
                                                    {risk.treatment === 'avoid' && 'Evitar'}
                                                    {!risk.treatment && 'Sin definir'}
                                                </span>
                                            </td>
                                            <td>
                                                {risk.targetDate
                                                    ? new Date(risk.targetDate).toLocaleDateString('es-ES')
                                                    : '—'}
                                            </td>
                                            <td>
                                                <div className="table-actions">
                                                    <button
                                                        className="btn btn-ghost btn-icon"
                                                        onClick={() => handleOpenModal(risk)}
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        className="btn btn-ghost btn-icon"
                                                        onClick={() => handleDelete(risk.id)}
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="empty-state card">
                        <AlertTriangle size={48} />
                        <h3>No hay riesgos registrados</h3>
                        <p>Comienza identificando los riesgos de seguridad</p>
                        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
                            <Plus size={18} />
                            Nuevo Riesgo
                        </button>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">
                                {editingRisk ? 'Editar Riesgo' : 'Nuevo Riesgo'}
                            </h2>
                            <button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label className="form-label">Título del Riesgo *</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Descripción *</label>
                                    <textarea
                                        className="form-textarea"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        required
                                        rows={3}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Controles Relacionados</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Buscar control..."
                                        value={controlSearch}
                                        onChange={(e) => setControlSearch(e.target.value)}
                                        style={{ marginBottom: 6 }}
                                    />
                                    <div className="control-picker">
                                        {controls
                                            .filter(c => !controlSearch || `${c.id} ${c.name}`.toLowerCase().includes(controlSearch.toLowerCase()))
                                            .map(control => {
                                                const selected = formData.controlIds.includes(control.id);
                                                return (
                                                    <label key={control.id} className={`control-picker-item ${selected ? 'selected' : ''}`}>
                                                        <input
                                                            type="checkbox"
                                                            checked={selected}
                                                            onChange={() => {
                                                                const ids = selected
                                                                    ? formData.controlIds.filter(id => id !== control.id)
                                                                    : [...formData.controlIds, control.id];
                                                                setFormData({ ...formData, controlIds: ids });
                                                            }}
                                                        />
                                                        <span className="control-picker-id">{control.id}</span>
                                                        <span className="control-picker-name">{control.name}</span>
                                                    </label>
                                                );
                                            })
                                        }
                                    </div>
                                    {formData.controlIds.length > 0 && (
                                        <div className="control-picker-selected">
                                            {formData.controlIds.map(id => {
                                                const c = controls.find(ctrl => ctrl.id === id);
                                                return c ? (
                                                    <span key={id} className="control-tag-badge">
                                                        {id}
                                                        <button type="button" onClick={() => setFormData({ ...formData, controlIds: formData.controlIds.filter(i => i !== id) })}>×</button>
                                                    </span>
                                                ) : null;
                                            })}
                                        </div>
                                    )}
                                </div>

                                <div className="assessment-section">
                                    <h4>Evaluación del Riesgo</h4>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label className="form-label">Probabilidad</label>
                                            <div className="level-selector">
                                                {RISK_LEVELS.probability.map(level => (
                                                    <button
                                                        key={level.value}
                                                        type="button"
                                                        className={`level-btn ${formData.probability === level.value ? 'active' : ''}`}
                                                        onClick={() => setFormData({ ...formData, probability: level.value })}
                                                        title={level.description}
                                                    >
                                                        <span className="level-value">{level.value}</span>
                                                        <span className="level-label">{level.label}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">Impacto</label>
                                            <div className="level-selector">
                                                {RISK_LEVELS.impact.map(level => (
                                                    <button
                                                        key={level.value}
                                                        type="button"
                                                        className={`level-btn ${formData.impact === level.value ? 'active' : ''}`}
                                                        onClick={() => setFormData({ ...formData, impact: level.value })}
                                                        title={level.description}
                                                    >
                                                        <span className="level-value">{level.value}</span>
                                                        <span className="level-label">{level.label}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="risk-preview">
                                        <span>Nivel de Riesgo:</span>
                                        <span className={`risk-level-badge ${getRiskLevel(formData.probability, formData.impact).class}`}>
                                            {getRiskLevel(formData.probability, formData.impact).level}
                                        </span>
                                        <span className="risk-score">
                                            ({formData.probability} × {formData.impact} = {formData.probability * formData.impact})
                                        </span>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Responsable</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={formData.owner}
                                            onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                                            placeholder="Nombre del responsable"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Estrategia de Tratamiento</label>
                                        <select
                                            className="form-select"
                                            value={formData.treatment}
                                            onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                                        >
                                            <option value="">Seleccionar...</option>
                                            <option value="mitigate">Mitigar</option>
                                            <option value="transfer">Transferir</option>
                                            <option value="accept">Aceptar</option>
                                            <option value="avoid">Evitar</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Estado del Riesgo</label>
                                        <select
                                            className="form-select"
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        >
                                            <option value="identificado">Identificado</option>
                                            <option value="en-tratamiento">En tratamiento</option>
                                            <option value="mitigado">Mitigado</option>
                                            <option value="aceptado">Aceptado</option>
                                            <option value="cerrado">Cerrado</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group" style={{ flex: 2 }}>
                                        <label className="form-label">Plan de Tratamiento</label>
                                        <textarea
                                            className="form-textarea"
                                            value={formData.treatmentPlan}
                                            onChange={(e) => setFormData({ ...formData, treatmentPlan: e.target.value })}
                                            placeholder="Describir las acciones a tomar..."
                                            rows={3}
                                        />
                                    </div>
                                    <div className="form-group" style={{ flex: 1 }}>
                                        <label className="form-label">Fecha Objetivo</label>
                                        <input
                                            type="date"
                                            className="form-input"
                                            value={formData.targetDate}
                                            onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* Riesgo Residual */}
                                <div className="assessment-section residual-section">
                                    <h4>Riesgo Residual <span className="section-hint">(luego de aplicar controles)</span></h4>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label className="form-label">Probabilidad Residual</label>
                                            <div className="level-selector">
                                                {[{value:'',label:'N/A'}, ...RISK_LEVELS.probability].map(level => (
                                                    <button
                                                        key={level.value}
                                                        type="button"
                                                        className={`level-btn ${formData.residualProbability === level.value ? 'active' : ''}`}
                                                        onClick={() => setFormData({ ...formData, residualProbability: level.value })}
                                                        title={level.description}
                                                    >
                                                        <span className="level-value">{level.value === '' ? '—' : level.value}</span>
                                                        <span className="level-label">{level.label || 'N/A'}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Impacto Residual</label>
                                            <div className="level-selector">
                                                {[{value:'',label:'N/A'}, ...RISK_LEVELS.impact].map(level => (
                                                    <button
                                                        key={level.value}
                                                        type="button"
                                                        className={`level-btn ${formData.residualImpact === level.value ? 'active' : ''}`}
                                                        onClick={() => setFormData({ ...formData, residualImpact: level.value })}
                                                        title={level.description}
                                                    >
                                                        <span className="level-value">{level.value === '' ? '—' : level.value}</span>
                                                        <span className="level-label">{level.label || 'N/A'}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    {formData.residualProbability && formData.residualImpact && (
                                        <div className="risk-preview">
                                            <span>Nivel Residual:</span>
                                            <span className={`risk-level-badge ${getRiskLevel(formData.residualProbability, formData.residualImpact).class}`}>
                                                {getRiskLevel(formData.residualProbability, formData.residualImpact).level}
                                            </span>
                                            <span className="risk-score">
                                                ({formData.residualProbability} × {formData.residualImpact} = {formData.residualProbability * formData.residualImpact})
                                            </span>
                                        </div>
                                    )}

                                    <div className="form-row" style={{ marginTop: 12 }}>
                                        <div className="form-group" style={{ flex: 2 }}>
                                            <label className="form-label">Comentarios de la Evaluación Residual</label>
                                            <textarea
                                                className="form-textarea"
                                                value={formData.residualNotes}
                                                onChange={(e) => setFormData({ ...formData, residualNotes: e.target.value })}
                                                placeholder="Notas sobre la efectividad de los controles aplicados..."
                                                rows={3}
                                            />
                                        </div>
                                        <div className="form-group" style={{ flex: 1 }}>
                                            <label className="form-label">Fecha de Evaluación</label>
                                            <input
                                                type="date"
                                                className="form-input"
                                                value={formData.residualEvaluatedAt}
                                                onChange={(e) => setFormData({ ...formData, residualEvaluatedAt: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Etiquetas</label>
                                    <TagSelector
                                        selectedTags={formData.tags}
                                        onChange={(newTags) => setFormData({ ...formData, tags: newTags })}
                                    />
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editingRisk ? 'Guardar Cambios' : 'Crear Riesgo'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Risks;
