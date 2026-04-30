import { useState } from 'react';
import { Plus, Search, Filter, Edit2, Trash2, Eye, X, AlertCircle, CheckCircle, Clock, Info, Tag, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { useAudit } from '../../context/AuditContext';
import { FINDING_TYPES } from '../../data/iso27001-controls';
import TagSelector from '../../components/Tags/TagSelector';
import api from '../../services/api';
import './Findings.css';

const NC_DETAIL_EMPTY = {
    areaRevisada: '', clausula: '', responsable: '',
    what: '', why: '', when: '', where: '', who: '', how: '',
    correccionInmediata: '', fechaCorreccion: '',
    causaRaiz1: '', causaRaiz2: '', causaRaiz3: '', causaRaiz4: '', causaRaiz5: '',
    accionCorrectiva: '', fechaAccionCorrectiva: '',
    evidenciasAC: '', indicador: '', valorIndicador: '', metaIndicador: '',
    fechaEstimada: '', verificador: '', eficaz: false,
    origenNc: '', fechaInicioNc: '', fechaFinNc: ''
};

const Findings = () => {
    const { findings, addFinding, updateFinding, deleteFinding, controls, tags } = useAudit();
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [tagFilter, setTagFilter] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [editingFinding, setEditingFinding] = useState(null);
    const [viewFinding, setViewFinding] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        type: 'observation',
        severity: 'medium',
        status: 'open',
        clausulaRef: '',
        controlIds: [],
        description: '',
        evidence: '',
        recommendation: '',
        tags: []
    });
    const [controlSearch, setControlSearch] = useState('');
    const [ncData, setNcData] = useState(NC_DETAIL_EMPTY);
    const [showNcPanel, setShowNcPanel] = useState(false);
    const [savingNc, setSavingNc] = useState(false);

    const filteredFindings = findings.filter(finding => {
        const matchesSearch =
            finding.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            finding.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = typeFilter === 'all' || finding.type === typeFilter;
        const matchesStatus = statusFilter === 'all' || finding.status === statusFilter;
        const matchesTag = tagFilter === 'all' || (finding.tags && finding.tags.some(t =>
            (typeof t === 'object' ? t.id : t) === parseInt(tagFilter)
        ));
        return matchesSearch && matchesType && matchesStatus && matchesTag;
    });

    const handleOpenModal = (finding = null) => {
        if (finding) {
            setEditingFinding(finding);
            setFormData({
                title: finding.title || '',
                type: finding.type || 'observation',
                severity: finding.severity || 'medium',
                status: finding.status || 'open',
                clausulaRef: finding.clausulaRef || '',
                controlIds: (finding.controls || []).map(c => c.id),
                description: finding.description || '',
                evidence: finding.evidence || '',
                recommendation: finding.recommendation || '',
                tags: (finding.tags || []).map(t => typeof t === 'object' ? t.id : t)
            });
        } else {
            setEditingFinding(null);
            setFormData({
                title: '',
                type: 'observation',
                severity: 'medium',
                status: 'open',
                clausulaRef: '',
                controlIds: [],
                description: '',
                evidence: '',
                recommendation: '',
                tags: []
            });
        }
        setControlSearch('');
        setNcData(NC_DETAIL_EMPTY);
        setShowNcPanel(['nc-major', 'nc-minor'].includes(finding?.type || 'observation'));
        // Load existing NC detail if editing
        if (finding?.ncDetail) {
            setNcData({ ...NC_DETAIL_EMPTY, ...finding.ncDetail });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingFinding(null);
        setNcData(NC_DETAIL_EMPTY);
        setShowNcPanel(false);
    };

    const isNcType = (type) => type === 'nc-major' || type === 'nc-minor';

    const handleSubmit = async (e) => {
        e.preventDefault();
        let findingId = editingFinding?.id;
        if (editingFinding) {
            await updateFinding(editingFinding.id, formData);
        } else {
            findingId = await addFinding(formData);
        }
        // Save NC detail if applicable
        if (isNcType(formData.type) && findingId) {
            setSavingNc(true);
            try {
                await api.findings.saveNcDetail(findingId, ncData);
            } catch (err) {
                console.error('Error saving NC detail:', err);
            } finally {
                setSavingNc(false);
            }
        }
        handleCloseModal();
    };

    const handleDelete = (id) => {
        if (window.confirm('¿Está seguro de eliminar este hallazgo?')) {
            deleteFinding(id);
        }
    };

    const handleStatusChange = (id, newStatus) => {
        updateFinding(id, { status: newStatus });
    };

    const getTypeInfo = (type) => {
        return FINDING_TYPES.find(t => t.id === type) || FINDING_TYPES[2];
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'open': return <AlertCircle className="status-icon open" />;
            case 'in-progress': return <Clock className="status-icon in-progress" />;
            case 'closed': return <CheckCircle className="status-icon closed" />;
            default: return <Info className="status-icon" />;
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'open': return 'Abierto';
            case 'in-progress': return 'En Progreso';
            case 'closed': return 'Cerrado';
            default: return status;
        }
    };

    return (
        <div className="findings-page">
            {/* Header */}
            <div className="page-header card">
                <div className="header-left">
                    <div className="search-wrapper">
                        <Search className="search-icon" />
                        <input
                            type="text"
                            placeholder="Buscar hallazgos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="form-input"
                        />
                    </div>

                    <div className="filter-group">
                        <Filter size={18} />
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="form-select"
                        >
                            <option value="all">Todos los tipos</option>
                            {FINDING_TYPES.map(type => (
                                <option key={type.id} value={type.id}>{type.name}</option>
                            ))}
                        </select>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="form-select"
                        >
                            <option value="all">Todos los estados</option>
                            <option value="open">Abiertos</option>
                            <option value="in-progress">En Progreso</option>
                            <option value="closed">Cerrados</option>
                        </select>

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
                </div>

                <button className="btn btn-primary" onClick={() => handleOpenModal()}>
                    <Plus size={18} />
                    Nuevo Hallazgo
                </button>
            </div>

            {/* Stats */}
            <div className="findings-stats">
                <div className="stat-card">
                    <span className="stat-number">{findings.length}</span>
                    <span className="stat-label">Total</span>
                </div>
                <div className="stat-card open">
                    <span className="stat-number">{findings.filter(f => f.status === 'open').length}</span>
                    <span className="stat-label">Abiertos</span>
                </div>
                <div className="stat-card in-progress">
                    <span className="stat-number">{findings.filter(f => f.status === 'in-progress').length}</span>
                    <span className="stat-label">En Progreso</span>
                </div>
                <div className="stat-card closed">
                    <span className="stat-number">{findings.filter(f => f.status === 'closed').length}</span>
                    <span className="stat-label">Cerrados</span>
                </div>
            </div>

            {/* Findings List */}
            <div className="findings-list">
                {filteredFindings.length > 0 ? (
                    filteredFindings.map(finding => {
                        const typeInfo = getTypeInfo(finding.type);

                        return (
                            <div key={finding.id} className={`finding-card status-${finding.status}`}>
                                <div className="finding-header">
                                    <div className="finding-type-badge" style={{ background: typeInfo.color }}>
                                        {typeInfo.name}
                                    </div>
                                    <div className="finding-status">
                                        {getStatusIcon(finding.status)}
                                        <span>{getStatusLabel(finding.status)}</span>
                                    </div>
                                </div>

                                <h3 className="finding-title">{finding.title}</h3>

                                {finding.controls && finding.controls.length > 0 && (
                                    <div className="finding-control">
                                        {finding.controls.map(c => (
                                            <span key={c.id} className="control-tag" title={c.name}>{c.id}</span>
                                        ))}
                                    </div>
                                )}

                                {finding.tags && finding.tags.length > 0 && (
                                    <div className="finding-tags">
                                        {finding.tags.map(tagOrId => {
                                            const tag = typeof tagOrId === 'object'
                                                ? tagOrId
                                                : tags.find(t => t.id === tagOrId);
                                            return tag ? (
                                                <span
                                                    key={tag.id}
                                                    className="tag-badge"
                                                    style={{ backgroundColor: tag.color + '20', color: tag.color }}
                                                >
                                                    <Tag size={10} />
                                                    {tag.name}
                                                </span>
                                            ) : null;
                                        })}
                                    </div>
                                )}

                                <p className="finding-description">{finding.description}</p>

                                <div className="finding-footer">
                                    <span className="finding-date">
                                        {new Date(finding.createdAt).toLocaleDateString('es-ES')}
                                    </span>
                                    <div className="finding-actions">
                                        <button
                                            className="btn btn-ghost btn-icon"
                                            onClick={() => setViewFinding(finding)}
                                            title="Ver detalle"
                                        >
                                            <Eye size={16} />
                                        </button>
                                        <button
                                            className="btn btn-ghost btn-icon"
                                            onClick={() => handleOpenModal(finding)}
                                            title="Editar"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            className="btn btn-ghost btn-icon"
                                            onClick={() => handleDelete(finding.id)}
                                            title="Eliminar"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                {finding.status !== 'closed' && (
                                    <div className="finding-status-actions">
                                        {finding.status === 'open' && (
                                            <button
                                                className="btn btn-secondary"
                                                onClick={() => handleStatusChange(finding.id, 'in-progress')}
                                            >
                                                Iniciar Tratamiento
                                            </button>
                                        )}
                                        {finding.status === 'in-progress' && (
                                            <button
                                                className="btn btn-success"
                                                onClick={() => handleStatusChange(finding.id, 'closed')}
                                            >
                                                Marcar como Cerrado
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <div className="empty-state">
                        <AlertCircle size={48} />
                        <h3>No hay hallazgos</h3>
                        <p>Comienza registrando hallazgos de la auditoría</p>
                        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
                            <Plus size={18} />
                            Nuevo Hallazgo
                        </button>
                    </div>
                )}
            </div>

            {/* Modal for Create/Edit */}
            {showModal && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">
                                {editingFinding ? 'Editar Hallazgo' : 'Nuevo Hallazgo'}
                            </h2>
                            <button className="btn btn-ghost btn-icon" onClick={handleCloseModal}>
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label className="form-label">Título *</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Tipo *</label>
                                        <select
                                            className="form-select"
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        >
                                            {FINDING_TYPES.map(type => (
                                                <option key={type.id} value={type.id}>{type.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Severidad</label>
                                        <select
                                            className="form-select"
                                            value={formData.severity}
                                            onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                                        >
                                            <option value="low">Baja</option>
                                            <option value="medium">Media</option>
                                            <option value="high">Alta</option>
                                            <option value="critical">Crítica</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Estado</label>
                                        <select
                                            className="form-select"
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        >
                                            <option value="open">Abierto</option>
                                            <option value="in-progress">En Progreso</option>
                                            <option value="closed">Cerrado</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Cláusula ISO Relacionada</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.clausulaRef}
                                        onChange={(e) => setFormData({ ...formData, clausulaRef: e.target.value })}
                                        placeholder="ej: 5.14, 9.2, A.5.1 (separar con comas si son varias)"
                                    />
                                </div>

                                <div className="form-row">
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
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Descripción *</label>
                                    <textarea
                                        className="form-textarea"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        required
                                        rows={4}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Evidencia</label>
                                    <textarea
                                        className="form-textarea"
                                        value={formData.evidence}
                                        onChange={(e) => setFormData({ ...formData, evidence: e.target.value })}
                                        placeholder="Documentar la evidencia encontrada..."
                                        rows={3}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Recomendación</label>
                                    <textarea
                                        className="form-textarea"
                                        value={formData.recommendation}
                                        onChange={(e) => setFormData({ ...formData, recommendation: e.target.value })}
                                        placeholder="Acciones recomendadas para resolver..."
                                        rows={3}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Etiquetas</label>
                                    <TagSelector
                                        selectedTags={formData.tags}
                                        onChange={(newTags) => setFormData({ ...formData, tags: newTags })}
                                    />
                                </div>

                                {/* ── NC EXPANDED PANEL ─────────────────────── */}
                                {isNcType(formData.type) && (
                                    <div className="nc-panel">
                                        <button
                                            type="button"
                                            className="nc-panel-toggle"
                                            onClick={() => setShowNcPanel(v => !v)}
                                        >
                                            <FileText size={16} />
                                            <span>Informe de No Conformidad</span>
                                            <span className="nc-panel-badge">
                                                {formData.type === 'nc-major' ? 'NC MAYOR' : 'NC MENOR'}
                                            </span>
                                            {showNcPanel ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                        </button>

                                        {showNcPanel && (
                                            <div className="nc-panel-body">
                                                {/* HEADER */}
                                                <div className="nc-section-title">Datos del Informe</div>
                                                <div className="form-row">
                                                    <div className="form-group">
                                                        <label className="form-label">Área Revisada</label>
                                                        <input className="form-input" value={ncData.areaRevisada} onChange={e => setNcData({...ncData, areaRevisada: e.target.value})} placeholder="ej: Gestión de Identidades" />
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="form-label">Cláusula ISO</label>
                                                        <input className="form-input" value={ncData.clausula} onChange={e => setNcData({...ncData, clausula: e.target.value})} placeholder="ej: 5.14" />
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="form-label">Responsable del Proceso</label>
                                                        <input className="form-input" value={ncData.responsable} onChange={e => setNcData({...ncData, responsable: e.target.value})} placeholder="Nombre del responsable" />
                                                    </div>
                                                </div>

                                                {/* 5W1H */}
                                                <div className="nc-section-title">Análisis 5W1H</div>
                                                {[
                                                    { key: 'what', label: 'WHAT — ¿Qué se quiere mejorar?' },
                                                    { key: 'why',  label: 'WHY — ¿Por qué se quiere mejorar?' },
                                                    { key: 'when', label: 'WHEN — ¿Cuándo se quiere mejorar?' },
                                                    { key: 'where',label: 'WHERE — ¿Dónde se va a mejorar?' },
                                                    { key: 'who',  label: 'WHO — ¿Quién lo va a mejorar?' },
                                                    { key: 'how',  label: 'HOW — ¿Cómo lo va a mejorar?' },
                                                ].map(({ key, label }) => (
                                                    <div className="form-group" key={key}>
                                                        <label className="form-label">{label}</label>
                                                        <textarea className="form-textarea" rows={2} value={ncData[key]} onChange={e => setNcData({...ncData, [key]: e.target.value})} />
                                                    </div>
                                                ))}

                                                {/* CORRECCIÓN INMEDIATA */}
                                                <div className="nc-section-title">Corrección Inmediata</div>
                                                <div className="form-group">
                                                    <label className="form-label">Corrección (arreglo inmediato)</label>
                                                    <textarea className="form-textarea" rows={3} value={ncData.correccionInmediata} onChange={e => setNcData({...ncData, correccionInmediata: e.target.value})} placeholder="Descripción de las acciones de corrección inmediata..." />
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label">Fecha de Corrección</label>
                                                    <input type="date" className="form-input" value={ncData.fechaCorreccion?.split('T')[0] || ''} onChange={e => setNcData({...ncData, fechaCorreccion: e.target.value})} />
                                                </div>

                                                {/* 5 PORQUÉS */}
                                                <div className="nc-section-title">Análisis de Causa Raíz — 5 Porqués</div>
                                                {[1, 2, 3, 4, 5].map(n => (
                                                    <div className="form-group" key={n}>
                                                        <label className="form-label">{n}° Análisis — ¿Cómo / Por qué pasó?</label>
                                                        <textarea className="form-textarea" rows={2}
                                                            value={ncData[`causaRaiz${n}`]}
                                                            onChange={e => setNcData({...ncData, [`causaRaiz${n}`]: e.target.value})}
                                                            placeholder={`${n}° nivel de análisis causal...`}
                                                        />
                                                    </div>
                                                ))}

                                                {/* ACCIÓN CORRECTIVA */}
                                                <div className="nc-section-title">Acción Correctiva</div>
                                                <div className="form-group">
                                                    <label className="form-label">Acción Correctiva (para prevenir reocurrencia)</label>
                                                    <textarea className="form-textarea" rows={3} value={ncData.accionCorrectiva} onChange={e => setNcData({...ncData, accionCorrectiva: e.target.value})} placeholder="Plan de acción correctiva definitivo..." />
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label">Fecha de Acción Correctiva</label>
                                                    <input type="date" className="form-input" value={ncData.fechaAccionCorrectiva?.split('T')[0] || ''} onChange={e => setNcData({...ncData, fechaAccionCorrectiva: e.target.value})} />
                                                </div>

                                                {/* EVIDENCIAS Y VERIFICACIÓN */}
                                                <div className="nc-section-title">Evidencias y Verificación de Eficacia</div>
                                                <div className="form-group">
                                                    <label className="form-label">Evidencias documentales</label>
                                                    <textarea className="form-textarea" rows={2} value={ncData.evidenciasAC} onChange={e => setNcData({...ncData, evidenciasAC: e.target.value})} placeholder="Documentos / registros que evidencian la implementación..." />
                                                </div>
                                                <div className="form-row">
                                                    <div className="form-group">
                                                        <label className="form-label">Indicador</label>
                                                        <select className="form-select" value={ncData.indicador} onChange={e => setNcData({...ncData, indicador: e.target.value, valorIndicador: '', metaIndicador: ''})}>
                                                            <option value="">Seleccionar...</option>
                                                            <option value="Cuantitativo">Cuantitativo — KPI medible (ej: % madurez)</option>
                                                            <option value="Cualitativo">Cualitativo — Cumplimiento Si/No</option>
                                                        </select>
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="form-label">Valor</label>
                                                        <input
                                                            className="form-input"
                                                            value={ncData.valorIndicador}
                                                            onChange={e => setNcData({...ncData, valorIndicador: e.target.value})}
                                                            placeholder={
                                                                ncData.indicador === 'Cuantitativo'
                                                                    ? 'ej: 45% (valor actual del KPI del control)'
                                                                    : ncData.indicador === 'Cualitativo'
                                                                        ? 'Si / No (¿Se cumplió?)'
                                                                        : 'Primero seleccioná el tipo de indicador'
                                                            }
                                                        />
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="form-label">Meta</label>
                                                        <input
                                                            className="form-input"
                                                            value={ncData.metaIndicador}
                                                            onChange={e => setNcData({...ncData, metaIndicador: e.target.value})}
                                                            placeholder={
                                                                ncData.indicador === 'Cuantitativo'
                                                                    ? '≥ 60% (eficaz si valor ≥ meta)'
                                                                    : ncData.indicador === 'Cualitativo'
                                                                        ? 'ej: Documentación aprobada / Certificación'
                                                                        : 'Primero seleccioná el tipo de indicador'
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                                {ncData.indicador && (
                                                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '-8px', marginBottom: '8px', padding: '8px 10px', background: 'rgba(148,163,184,0.06)', borderRadius: '6px', borderLeft: '3px solid rgba(148,163,184,0.3)' }}>
                                                        {ncData.indicador === 'Cuantitativo'
                                                            ? '📊 Cuantitativo: indicá el KPI del control relacionado. La NC es eficaz cuando el Valor alcanza o supera la Meta (≥ 60%).'
                                                            : '✅ Cualitativo: indicá Si/No en Valor según si se cumplió la corrección. Establecé la Meta según el tipo de NC.'}
                                                    </div>
                                                )}
                                                <div className="form-row">
                                                    <div className="form-group">
                                                        <label className="form-label">Verificador</label>
                                                        <input className="form-input" value={ncData.verificador} onChange={e => setNcData({...ncData, verificador: e.target.value})} />
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="form-label">Fecha Estimada</label>
                                                        <input type="date" className="form-input" value={ncData.fechaEstimada?.split('T')[0] || ''} onChange={e => setNcData({...ncData, fechaEstimada: e.target.value})} />
                                                    </div>
                                                    <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 24 }}>
                                                        <input type="checkbox" id="eficaz" checked={!!ncData.eficaz} onChange={e => setNcData({...ncData, eficaz: e.target.checked})} />
                                                        <label htmlFor="eficaz" className="form-label" style={{ margin: 0 }}>Eficaz</label>
                                                    </div>
                                                </div>

                                                {/* METADATA */}
                                                <div className="nc-section-title">Información Adicional</div>
                                                <div className="form-row">
                                                    <div className="form-group">
                                                        <label className="form-label">Origen de la NC</label>
                                                        <input className="form-input" value={ncData.origenNc} onChange={e => setNcData({...ncData, origenNc: e.target.value})} placeholder="ej: Auditoría Interna 2024" />
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="form-label">Fecha Inicio</label>
                                                        <input type="date" className="form-input" value={ncData.fechaInicioNc?.split('T')[0] || ''} onChange={e => setNcData({...ncData, fechaInicioNc: e.target.value})} />
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="form-label">Fecha Fin</label>
                                                        <input type="date" className="form-input" value={ncData.fechaFinNc?.split('T')[0] || ''} onChange={e => setNcData({...ncData, fechaFinNc: e.target.value})} />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={savingNc}>
                                    {savingNc ? 'Guardando...' : editingFinding ? 'Guardar Cambios' : 'Crear Hallazgo'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Detail Modal */}
            {viewFinding && (
                <div className="modal-overlay" onClick={() => setViewFinding(null)}>
                    <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">Detalle del Hallazgo</h2>
                            <button className="btn btn-ghost btn-icon" onClick={() => setViewFinding(null)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="detail-row">
                                <span className="detail-label">ID:</span>
                                <span className="detail-value">{viewFinding.id}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Tipo:</span>
                                <span className="detail-value">
                                    <span
                                        className="finding-type-badge"
                                        style={{ background: getTypeInfo(viewFinding.type).color }}
                                    >
                                        {getTypeInfo(viewFinding.type).name}
                                    </span>
                                </span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Estado:</span>
                                <span className="detail-value">
                                    {getStatusIcon(viewFinding.status)}
                                    {getStatusLabel(viewFinding.status)}
                                </span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Título:</span>
                                <span className="detail-value">{viewFinding.title}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Descripción:</span>
                                <p className="detail-text">{viewFinding.description}</p>
                            </div>
                            {viewFinding.evidence && (
                                <div className="detail-row">
                                    <span className="detail-label">Evidencia:</span>
                                    <p className="detail-text">{viewFinding.evidence}</p>
                                </div>
                            )}
                            {viewFinding.recommendation && (
                                <div className="detail-row">
                                    <span className="detail-label">Recomendación:</span>
                                    <p className="detail-text">{viewFinding.recommendation}</p>
                                </div>
                            )}
                            <div className="detail-row">
                                <span className="detail-label">Creado:</span>
                                <span className="detail-value">
                                    {new Date(viewFinding.createdAt).toLocaleString('es-ES')}
                                </span>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setViewFinding(null)}>
                                Cerrar
                            </button>
                            <button className="btn btn-primary" onClick={() => {
                                setViewFinding(null);
                                handleOpenModal(viewFinding);
                            }}>
                                Editar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Findings;
