import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, X, AlertTriangle, Shield, Tag, ChevronDown } from 'lucide-react';
import { useAudit } from '../../context/AuditContext';
import { RISK_LEVELS, getRiskLevel } from '../../data/iso27001-controls';
import TagSelector from '../../components/Tags/TagSelector';
import './Risks.css';

// Función para calcular valor de riesgo con la metodología CIA
const calculateRiskValue = (cia, probabilidad) => {
    if (!cia.c || !cia.i || !cia.d || !cia.priv || !probabilidad) return null;

    const ciaMap = { 'Menor': 1, 'Moderado': 2, 'Mayor': 3, 'Crítico': 4 };
    const probMap = { 'Eventual': 1, 'Posible': 2, 'Probable': 3, 'Altamente Probable': 4 };

    const cVal = ciaMap[cia.c] || 0;
    const iVal = ciaMap[cia.i] || 0;
    const dVal = ciaMap[cia.d] || 0;
    const privVal = ciaMap[cia.priv] || 0;
    const probVal = probMap[probabilidad] || 0;

    const ciaPonderado = (cVal * 0.30) + (iVal * 0.30) + (dVal * 0.25) + (privVal * 0.15);
    const valor = ciaPonderado * probVal * (25 / 16);

    return parseFloat(valor.toFixed(2));
};

// Función para obtener nivel de impacto desde el valor
const getImpactLevel = (valor) => {
    if (valor <= 5) return 'Muy Bajo';
    if (valor <= 10) return 'Bajo';
    if (valor <= 15) return 'Medio';
    if (valor <= 20) return 'Alto';
    if (valor <= 25) return 'Muy Alto';
    return 'Crítico';
};

// Función para obtener color del valor
const getValueColor = (valor) => {
    if (valor <= 5) return '#22c55e';      // verde
    if (valor <= 10) return '#06b6d4';     // celeste
    if (valor <= 15) return '#f59e0b';     // amarillo
    if (valor <= 20) return '#f97316';     // naranja
    if (valor <= 25) return '#ef4444';     // rojo
    return '#dc2626';                      // crimson
};

const Risks = () => {
    const { risks, addRisk, updateRisk, deleteRisk, controls, tags } = useAudit();
    const [searchTerm, setSearchTerm] = useState('');
    const [tagFilter, setTagFilter] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [editingRisk, setEditingRisk] = useState(null);
    const [expandedSections, setExpandedSections] = useState({
        identification: true,
        impact: true,
        cia: true,
        treatment: false,
        residual: false,
        controls: false
    });
    const [controlSearch, setControlSearch] = useState('');

    const [formData, setFormData] = useState({
        // Identificación
        title: '',
        description: '',
        tipoActivo: '',
        origenRiesgo: '',
        amenazas: '',
        actividad: '',
        riesgoInherente: '',

        // Dimensiones impacto
        impactoFinanciero: false,
        impactoContinuidad: false,
        impactoImagen: false,
        impactoLegal: false,

        // CIA + Privacidad
        nivelConfidencialidad: '',
        nivelIntegridad: '',
        nivelDisponibilidad: '',
        nivelPrivacidad: '',

        // Probabilidad
        probabilidadNivel: '',

        // Controles y tags
        controlIds: [],
        tags: [],

        // Tratamiento
        owner: '',
        treatment: '',
        treatmentPlan: '',
        targetDate: '',
        status: 'identificado',
        estadoControl: '',

        // Riesgo residual
        nivelConfidencialidadResidual: '',
        nivelIntegridadResidual: '',
        nivelDisponibilidadResidual: '',
        nivelPrivacidadResidual: '',
        probabilidadNivelResidual: '',
        estadoRevision: '',
        residualNotes: '',
        residualEvaluatedAt: '',
        clasificacionResidual: ''
    });

    const [calculatedValue, setCalculatedValue] = useState(null);
    const [calculatedLevel, setCalculatedLevel] = useState(null);

    // Calcular valor cuando cambien los campos CIA o probabilidad
    useEffect(() => {
        if (formData.nivelConfidencialidad && formData.nivelIntegridad &&
            formData.nivelDisponibilidad && formData.nivelPrivacidad && formData.probabilidadNivel) {
            const valor = calculateRiskValue(
                {
                    c: formData.nivelConfidencialidad,
                    i: formData.nivelIntegridad,
                    d: formData.nivelDisponibilidad,
                    priv: formData.nivelPrivacidad
                },
                formData.probabilidadNivel
            );
            setCalculatedValue(valor);
            setCalculatedLevel(getImpactLevel(valor));
        } else {
            setCalculatedValue(null);
            setCalculatedLevel(null);
        }
    }, [
        formData.nivelConfidencialidad,
        formData.nivelIntegridad,
        formData.nivelDisponibilidad,
        formData.nivelPrivacidad,
        formData.probabilidadNivel
    ]);

    const filteredRisks = risks.filter(risk => {
        const matchesSearch = (risk.name || risk.title)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            risk.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTag = tagFilter === 'all' || (risk.tags && risk.tags.some(t =>
            (typeof t === 'object' ? t.id : t) === parseInt(tagFilter)
        ));
        return matchesSearch && matchesTag;
    });

    const handleOpenModal = (risk = null) => {
        if (risk) {
            setEditingRisk(risk);
            setFormData({
                title: risk.name || risk.title || '',
                description: risk.description || '',
                tipoActivo: risk.tipoActivo || '',
                origenRiesgo: risk.origenRiesgo || '',
                amenazas: risk.amenazas || '',
                actividad: risk.actividad || '',
                riesgoInherente: risk.riesgoInherente || '',
                impactoFinanciero: risk.impactoFinanciero || false,
                impactoContinuidad: risk.impactoContinuidad || false,
                impactoImagen: risk.impactoImagen || false,
                impactoLegal: risk.impactoLegal || false,
                nivelConfidencialidad: risk.nivelConfidencialidad || '',
                nivelIntegridad: risk.nivelIntegridad || '',
                nivelDisponibilidad: risk.nivelDisponibilidad || '',
                nivelPrivacidad: risk.nivelPrivacidad || '',
                probabilidadNivel: risk.probabilidadNivel || '',
                controlIds: (risk.controls || []).map(c => c.id),
                tags: (risk.tags || []).map(t => typeof t === 'object' ? t.id : t),
                owner: risk.owner || '',
                treatment: risk.treatment || '',
                treatmentPlan: risk.treatmentPlan || '',
                targetDate: risk.targetDate ? risk.targetDate.split('T')[0] : '',
                status: risk.status || 'identificado',
                estadoControl: risk.estadoControl || '',
                nivelConfidencialidadResidual: risk.nivelConfidencialidadResidual || '',
                nivelIntegridadResidual: risk.nivelIntegridadResidual || '',
                nivelDisponibilidadResidual: risk.nivelDisponibilidadResidual || '',
                nivelPrivacidadResidual: risk.nivelPrivacidadResidual || '',
                probabilidadNivelResidual: risk.probabilidadNivelResidual || '',
                estadoRevision: risk.estadoRevision || '',
                residualNotes: risk.residualNotes || '',
                residualEvaluatedAt: risk.residualEvaluatedAt ? risk.residualEvaluatedAt.split('T')[0] : '',
                clasificacionResidual: risk.clasificacionResidual || ''
            });
        } else {
            setEditingRisk(null);
            setFormData({
                title: '',
                description: '',
                tipoActivo: '',
                origenRiesgo: '',
                amenazas: '',
                actividad: '',
                riesgoInherente: '',
                impactoFinanciero: false,
                impactoContinuidad: false,
                impactoImagen: false,
                impactoLegal: false,
                nivelConfidencialidad: '',
                nivelIntegridad: '',
                nivelDisponibilidad: '',
                nivelPrivacidad: '',
                probabilidadNivel: '',
                controlIds: [],
                tags: [],
                owner: '',
                treatment: '',
                treatmentPlan: '',
                targetDate: '',
                status: 'identificado',
                estadoControl: '',
                nivelConfidencialidadResidual: '',
                nivelIntegridadResidual: '',
                nivelDisponibilidadResidual: '',
                nivelPrivacidadResidual: '',
                probabilidadNivelResidual: '',
                estadoRevision: '',
                residualNotes: '',
                residualEvaluatedAt: '',
                clasificacionResidual: ''
            });
        }
        setExpandedSections({
            identification: true,
            impact: true,
            cia: true,
            treatment: false,
            residual: false,
            controls: false
        });
        setControlSearch('');
        setShowModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const submitData = {
            ...formData,
            // Convertir title a name para la API
            name: formData.title,
            valorRiesgo: calculatedValue,
            impactoNivel: calculatedLevel
        };
        delete submitData.title;

        if (editingRisk) {
            updateRisk(editingRisk.id, submitData);
        } else {
            addRisk(submitData);
        }
        setShowModal(false);
    };

    const handleDelete = (id) => {
        if (window.confirm('¿Está seguro de eliminar este riesgo?')) {
            deleteRisk(id);
        }
    };

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
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
                    <span className="stat-number">
                        {risks.filter(r => r.valorRiesgo && r.valorRiesgo > 20).length}
                    </span>
                    <span className="stat-label">Muy Altos</span>
                </div>
                <div className="stat-card high">
                    <AlertTriangle />
                    <span className="stat-number">
                        {risks.filter(r => r.valorRiesgo && r.valorRiesgo > 15 && r.valorRiesgo <= 20).length}
                    </span>
                    <span className="stat-label">Altos</span>
                </div>
                <div className="stat-card medium">
                    <Shield />
                    <span className="stat-number">
                        {risks.filter(r => r.valorRiesgo && r.valorRiesgo > 10 && r.valorRiesgo <= 15).length}
                    </span>
                    <span className="stat-label">Medios</span>
                </div>
                <div className="stat-card low">
                    <Shield />
                    <span className="stat-number">
                        {risks.filter(r => !r.valorRiesgo || r.valorRiesgo <= 10).length}
                    </span>
                    <span className="stat-label">Bajos/Muy Bajos</span>
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
                                    <th>Tipo Activo</th>
                                    <th>Nivel CIA</th>
                                    <th>Probabilidad</th>
                                    <th>Valor</th>
                                    <th>Nivel Impacto</th>
                                    <th>Estado</th>
                                    <th>Responsable</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRisks.map(risk => {
                                    const riskValue = risk.valorRiesgo;
                                    const riskLevel = risk.impactoNivel;
                                    return (
                                        <tr key={risk.id}>
                                            <td>
                                                <span className="risk-id">{risk.id}</span>
                                            </td>
                                            <td>
                                                <div className="risk-info">
                                                    <span className="risk-title">{risk.name || risk.title}</span>
                                                    <span className="risk-desc">{risk.description?.substring(0, 50)}{risk.description?.length > 50 ? '...' : ''}</span>
                                                </div>
                                            </td>
                                            <td>{risk.tipoActivo || '—'}</td>
                                            <td>
                                                {risk.nivelConfidencialidad && risk.nivelIntegridad && risk.nivelDisponibilidad && risk.nivelPrivacidad ? (
                                                    <span className="cia-level-badge">
                                                        C:{risk.nivelConfidencialidad[0]}, I:{risk.nivelIntegridad[0]}, D:{risk.nivelDisponibilidad[0]}, P:{risk.nivelPrivacidad[0]}
                                                    </span>
                                                ) : '—'}
                                            </td>
                                            <td>{risk.probabilidadNivel || '—'}</td>
                                            <td>
                                                {riskValue !== null && riskValue !== undefined ? (
                                                    <span className="risk-value-badge" style={{
                                                        color: getValueColor(riskValue),
                                                        fontWeight: '600'
                                                    }}>
                                                        {riskValue.toFixed(2)}
                                                    </span>
                                                ) : '—'}
                                            </td>
                                            <td>
                                                {riskLevel ? (
                                                    <span className={`impact-level-badge impact-${riskLevel.toLowerCase().replace(/\s/g, '-')}`}>
                                                        {riskLevel}
                                                    </span>
                                                ) : '—'}
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
                                            <td>{risk.owner || '—'}</td>
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
                    <div className="modal modal-xl" onClick={(e) => e.stopPropagation()}>
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
                                {/* SECCIÓN 1: IDENTIFICACIÓN */}
                                <div className="risk-section">
                                    <button
                                        type="button"
                                        className="risk-section-header"
                                        onClick={() => toggleSection('identification')}
                                    >
                                        <h3 className="risk-section-title">Identificación</h3>
                                        <ChevronDown
                                            size={20}
                                            style={{
                                                transform: expandedSections.identification ? 'rotate(0deg)' : 'rotate(-90deg)',
                                                transition: 'transform 0.2s'
                                            }}
                                        />
                                    </button>

                                    {expandedSections.identification && (
                                        <div className="risk-section-content">
                                            <div className="form-group">
                                                <label className="form-label">Nombre del Riesgo *</label>
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    value={formData.title}
                                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                    required
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label className="form-label">Descripción</label>
                                                <textarea
                                                    className="form-textarea"
                                                    value={formData.description}
                                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                    rows={3}
                                                />
                                            </div>

                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label className="form-label">Tipo de Activo</label>
                                                    <input
                                                        type="text"
                                                        className="form-input"
                                                        value={formData.tipoActivo}
                                                        onChange={(e) => setFormData({ ...formData, tipoActivo: e.target.value })}
                                                        placeholder="ej. Sistema, Base de datos, Red"
                                                    />
                                                </div>

                                                <div className="form-group">
                                                    <label className="form-label">Origen del Riesgo</label>
                                                    <input
                                                        type="text"
                                                        className="form-input"
                                                        value={formData.origenRiesgo}
                                                        onChange={(e) => setFormData({ ...formData, origenRiesgo: e.target.value })}
                                                        placeholder="ej. Auditoría 2026"
                                                    />
                                                </div>
                                            </div>

                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label className="form-label">Amenazas</label>
                                                    <input
                                                        type="text"
                                                        className="form-input"
                                                        value={formData.amenazas}
                                                        onChange={(e) => setFormData({ ...formData, amenazas: e.target.value })}
                                                        placeholder="Amenazas identificadas"
                                                    />
                                                </div>

                                                <div className="form-group">
                                                    <label className="form-label">Actividad</label>
                                                    <input
                                                        type="text"
                                                        className="form-input"
                                                        value={formData.actividad}
                                                        onChange={(e) => setFormData({ ...formData, actividad: e.target.value })}
                                                        placeholder="Actividad relacionada"
                                                    />
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label className="form-label">Riesgo Inherente</label>
                                                <textarea
                                                    className="form-textarea"
                                                    value={formData.riesgoInherente}
                                                    onChange={(e) => setFormData({ ...formData, riesgoInherente: e.target.value })}
                                                    placeholder="Descripción del riesgo sin controles"
                                                    rows={2}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* SECCIÓN 2: DIMENSIONES DE IMPACTO */}
                                <div className="risk-section">
                                    <button
                                        type="button"
                                        className="risk-section-header"
                                        onClick={() => toggleSection('impact')}
                                    >
                                        <h3 className="risk-section-title">Dimensiones de Impacto</h3>
                                        <ChevronDown
                                            size={20}
                                            style={{
                                                transform: expandedSections.impact ? 'rotate(0deg)' : 'rotate(-90deg)',
                                                transition: 'transform 0.2s'
                                            }}
                                        />
                                    </button>

                                    {expandedSections.impact && (
                                        <div className="risk-section-content">
                                            <div className="impact-dims-grid">
                                                <label className="impact-checkbox">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.impactoFinanciero}
                                                        onChange={(e) => setFormData({ ...formData, impactoFinanciero: e.target.checked })}
                                                    />
                                                    <span className="impact-label financial">Financiero</span>
                                                </label>

                                                <label className="impact-checkbox">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.impactoContinuidad}
                                                        onChange={(e) => setFormData({ ...formData, impactoContinuidad: e.target.checked })}
                                                    />
                                                    <span className="impact-label continuity">Continuidad Operativa</span>
                                                </label>

                                                <label className="impact-checkbox">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.impactoImagen}
                                                        onChange={(e) => setFormData({ ...formData, impactoImagen: e.target.checked })}
                                                    />
                                                    <span className="impact-label image">Imagen/Reputación</span>
                                                </label>

                                                <label className="impact-checkbox">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.impactoLegal}
                                                        onChange={(e) => setFormData({ ...formData, impactoLegal: e.target.checked })}
                                                    />
                                                    <span className="impact-label legal">Legal</span>
                                                </label>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* SECCIÓN 3: EVALUACIÓN CIA */}
                                <div className="risk-section">
                                    <button
                                        type="button"
                                        className="risk-section-header"
                                        onClick={() => toggleSection('cia')}
                                    >
                                        <h3 className="risk-section-title">Evaluación CIA</h3>
                                        <ChevronDown
                                            size={20}
                                            style={{
                                                transform: expandedSections.cia ? 'rotate(0deg)' : 'rotate(-90deg)',
                                                transition: 'transform 0.2s'
                                            }}
                                        />
                                    </button>

                                    {expandedSections.cia && (
                                        <div className="risk-section-content">
                                            <div className="cia-grid">
                                                <div className="form-group">
                                                    <label className="form-label">Confidencialidad</label>
                                                    <select
                                                        className="form-select"
                                                        value={formData.nivelConfidencialidad}
                                                        onChange={(e) => setFormData({ ...formData, nivelConfidencialidad: e.target.value })}
                                                    >
                                                        <option value="">Seleccionar...</option>
                                                        <option value="Menor">Menor</option>
                                                        <option value="Moderado">Moderado</option>
                                                        <option value="Mayor">Mayor</option>
                                                        <option value="Crítico">Crítico</option>
                                                    </select>
                                                </div>

                                                <div className="form-group">
                                                    <label className="form-label">Integridad</label>
                                                    <select
                                                        className="form-select"
                                                        value={formData.nivelIntegridad}
                                                        onChange={(e) => setFormData({ ...formData, nivelIntegridad: e.target.value })}
                                                    >
                                                        <option value="">Seleccionar...</option>
                                                        <option value="Menor">Menor</option>
                                                        <option value="Moderado">Moderado</option>
                                                        <option value="Mayor">Mayor</option>
                                                        <option value="Crítico">Crítico</option>
                                                    </select>
                                                </div>

                                                <div className="form-group">
                                                    <label className="form-label">Disponibilidad</label>
                                                    <select
                                                        className="form-select"
                                                        value={formData.nivelDisponibilidad}
                                                        onChange={(e) => setFormData({ ...formData, nivelDisponibilidad: e.target.value })}
                                                    >
                                                        <option value="">Seleccionar...</option>
                                                        <option value="Menor">Menor</option>
                                                        <option value="Moderado">Moderado</option>
                                                        <option value="Mayor">Mayor</option>
                                                        <option value="Crítico">Crítico</option>
                                                    </select>
                                                </div>

                                                <div className="form-group">
                                                    <label className="form-label">Privacidad</label>
                                                    <select
                                                        className="form-select"
                                                        value={formData.nivelPrivacidad}
                                                        onChange={(e) => setFormData({ ...formData, nivelPrivacidad: e.target.value })}
                                                    >
                                                        <option value="">Seleccionar...</option>
                                                        <option value="Menor">Menor</option>
                                                        <option value="Moderado">Moderado</option>
                                                        <option value="Mayor">Mayor</option>
                                                        <option value="Crítico">Crítico</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="form-group" style={{ marginTop: '20px' }}>
                                                <label className="form-label">Probabilidad</label>
                                                <select
                                                    className="form-select"
                                                    value={formData.probabilidadNivel}
                                                    onChange={(e) => setFormData({ ...formData, probabilidadNivel: e.target.value })}
                                                >
                                                    <option value="">Seleccionar...</option>
                                                    <option value="Eventual">Eventual (Remota)</option>
                                                    <option value="Posible">Posible</option>
                                                    <option value="Probable">Probable</option>
                                                    <option value="Altamente Probable">Altamente Probable</option>
                                                </select>
                                            </div>

                                            {/* Score Card */}
                                            {calculatedValue !== null && (
                                                <div className="risk-score-card">
                                                    <div className="score-value" style={{ color: getValueColor(calculatedValue) }}>
                                                        {calculatedValue.toFixed(2)}
                                                    </div>
                                                    <div className="score-label">Valor del Riesgo</div>
                                                    <div className="score-impact">
                                                        <span className={`impact-level-badge impact-${calculatedLevel.toLowerCase().replace(/\s/g, '-')}`}>
                                                            {calculatedLevel}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* SECCIÓN 4: TRATAMIENTO */}
                                <div className="risk-section">
                                    <button
                                        type="button"
                                        className="risk-section-header"
                                        onClick={() => toggleSection('treatment')}
                                    >
                                        <h3 className="risk-section-title">Tratamiento</h3>
                                        <ChevronDown
                                            size={20}
                                            style={{
                                                transform: expandedSections.treatment ? 'rotate(0deg)' : 'rotate(-90deg)',
                                                transition: 'transform 0.2s'
                                            }}
                                        />
                                    </button>

                                    {expandedSections.treatment && (
                                        <div className="risk-section-content">
                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label className="form-label">Plan de Acción/Mitigación</label>
                                                    <textarea
                                                        className="form-textarea"
                                                        value={formData.treatmentPlan}
                                                        onChange={(e) => setFormData({ ...formData, treatmentPlan: e.target.value })}
                                                        placeholder="Describir las acciones a tomar..."
                                                        rows={3}
                                                    />
                                                </div>
                                            </div>

                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label className="form-label">Estado de Tratamiento</label>
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

                                                <div className="form-group">
                                                    <label className="form-label">Estado del Control</label>
                                                    <select
                                                        className="form-select"
                                                        value={formData.estadoControl}
                                                        onChange={(e) => setFormData({ ...formData, estadoControl: e.target.value })}
                                                    >
                                                        <option value="">Seleccionar...</option>
                                                        <option value="Gestionado">Gestionado</option>
                                                        <option value="Mejorable">Mejorable</option>
                                                        <option value="No Gestionado">No Gestionado</option>
                                                    </select>
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
                                                    <label className="form-label">Fecha Objetivo</label>
                                                    <input
                                                        type="date"
                                                        className="form-input"
                                                        value={formData.targetDate}
                                                        onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* SECCIÓN 5: RIESGO RESIDUAL */}
                                <div className="risk-section">
                                    <button
                                        type="button"
                                        className="risk-section-header"
                                        onClick={() => toggleSection('residual')}
                                    >
                                        <h3 className="risk-section-title">Riesgo Residual</h3>
                                        <ChevronDown
                                            size={20}
                                            style={{
                                                transform: expandedSections.residual ? 'rotate(0deg)' : 'rotate(-90deg)',
                                                transition: 'transform 0.2s'
                                            }}
                                        />
                                    </button>

                                    {expandedSections.residual && (
                                        <div className="risk-section-content">
                                            <div className="cia-grid">
                                                <div className="form-group">
                                                    <label className="form-label">Confidencialidad Residual</label>
                                                    <select
                                                        className="form-select"
                                                        value={formData.nivelConfidencialidadResidual}
                                                        onChange={(e) => setFormData({ ...formData, nivelConfidencialidadResidual: e.target.value })}
                                                    >
                                                        <option value="">Seleccionar...</option>
                                                        <option value="Menor">Menor</option>
                                                        <option value="Moderado">Moderado</option>
                                                        <option value="Mayor">Mayor</option>
                                                        <option value="Crítico">Crítico</option>
                                                    </select>
                                                </div>

                                                <div className="form-group">
                                                    <label className="form-label">Integridad Residual</label>
                                                    <select
                                                        className="form-select"
                                                        value={formData.nivelIntegridadResidual}
                                                        onChange={(e) => setFormData({ ...formData, nivelIntegridadResidual: e.target.value })}
                                                    >
                                                        <option value="">Seleccionar...</option>
                                                        <option value="Menor">Menor</option>
                                                        <option value="Moderado">Moderado</option>
                                                        <option value="Mayor">Mayor</option>
                                                        <option value="Crítico">Crítico</option>
                                                    </select>
                                                </div>

                                                <div className="form-group">
                                                    <label className="form-label">Disponibilidad Residual</label>
                                                    <select
                                                        className="form-select"
                                                        value={formData.nivelDisponibilidadResidual}
                                                        onChange={(e) => setFormData({ ...formData, nivelDisponibilidadResidual: e.target.value })}
                                                    >
                                                        <option value="">Seleccionar...</option>
                                                        <option value="Menor">Menor</option>
                                                        <option value="Moderado">Moderado</option>
                                                        <option value="Mayor">Mayor</option>
                                                        <option value="Crítico">Crítico</option>
                                                    </select>
                                                </div>

                                                <div className="form-group">
                                                    <label className="form-label">Privacidad Residual</label>
                                                    <select
                                                        className="form-select"
                                                        value={formData.nivelPrivacidadResidual}
                                                        onChange={(e) => setFormData({ ...formData, nivelPrivacidadResidual: e.target.value })}
                                                    >
                                                        <option value="">Seleccionar...</option>
                                                        <option value="Menor">Menor</option>
                                                        <option value="Moderado">Moderado</option>
                                                        <option value="Mayor">Mayor</option>
                                                        <option value="Crítico">Crítico</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="form-group" style={{ marginTop: '20px' }}>
                                                <label className="form-label">Probabilidad Residual</label>
                                                <select
                                                    className="form-select"
                                                    value={formData.probabilidadNivelResidual}
                                                    onChange={(e) => setFormData({ ...formData, probabilidadNivelResidual: e.target.value })}
                                                >
                                                    <option value="">Seleccionar...</option>
                                                    <option value="Eventual">Eventual (Remota)</option>
                                                    <option value="Posible">Posible</option>
                                                    <option value="Probable">Probable</option>
                                                    <option value="Altamente Probable">Altamente Probable</option>
                                                </select>
                                            </div>

                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label className="form-label">Clasificación Residual</label>
                                                    <input
                                                        type="text"
                                                        className="form-input"
                                                        value={formData.clasificacionResidual}
                                                        onChange={(e) => setFormData({ ...formData, clasificacionResidual: e.target.value })}
                                                        placeholder="Clasificación automática o manual"
                                                    />
                                                </div>

                                                <div className="form-group">
                                                    <label className="form-label">Estado de Revisión</label>
                                                    <select
                                                        className="form-select"
                                                        value={formData.estadoRevision}
                                                        onChange={(e) => setFormData({ ...formData, estadoRevision: e.target.value })}
                                                    >
                                                        <option value="">Seleccionar...</option>
                                                        <option value="No Requiere Acción">No Requiere Acción</option>
                                                        <option value="Requiere Acción">Requiere Acción</option>
                                                        <option value="En Seguimiento">En Seguimiento</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label className="form-label">Notas Residuales</label>
                                                <textarea
                                                    className="form-textarea"
                                                    value={formData.residualNotes}
                                                    onChange={(e) => setFormData({ ...formData, residualNotes: e.target.value })}
                                                    placeholder="Notas sobre la efectividad de los controles aplicados..."
                                                    rows={2}
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label className="form-label">Fecha de Evaluación</label>
                                                <input
                                                    type="date"
                                                    className="form-input"
                                                    value={formData.residualEvaluatedAt}
                                                    onChange={(e) => setFormData({ ...formData, residualEvaluatedAt: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* SECCIÓN 6: CONTROLES Y TAGS */}
                                <div className="risk-section">
                                    <button
                                        type="button"
                                        className="risk-section-header"
                                        onClick={() => toggleSection('controls')}
                                    >
                                        <h3 className="risk-section-title">Controles y Etiquetas</h3>
                                        <ChevronDown
                                            size={20}
                                            style={{
                                                transform: expandedSections.controls ? 'rotate(0deg)' : 'rotate(-90deg)',
                                                transition: 'transform 0.2s'
                                            }}
                                        />
                                    </button>

                                    {expandedSections.controls && (
                                        <div className="risk-section-content">
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

                                            <div className="form-group">
                                                <label className="form-label">Etiquetas</label>
                                                <TagSelector
                                                    selectedTags={formData.tags}
                                                    onChange={(newTags) => setFormData({ ...formData, tags: newTags })}
                                                />
                                            </div>
                                        </div>
                                    )}
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
