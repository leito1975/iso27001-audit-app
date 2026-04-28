import { useState } from 'react';
import { Search, Filter, ChevronDown, ChevronUp, Check, X, Paperclip, GitBranch } from 'lucide-react';
import { useAudit } from '../../context/AuditContext';
import { CONTROL_CATEGORIES, CMMI_LEVELS } from '../../data/iso27001-controls';
import { ISO42001_CONTROL_CATEGORIES } from '../../data/iso42001-controls';
import MaturitySelector from '../../components/CMMI/MaturitySelector';
import FileUpload from '../../components/FileUpload/FileUpload';
import TraceabilityPanel from '../../components/Traceability/TraceabilityPanel';
import './Controls.css';

const Controls = () => {
    const { controls, controlAssessments, setControlMaturity, setControlApplicable, updateControlAssessment, selectedNorm } = useAudit();
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [expandedControl, setExpandedControl] = useState(null);
    const [traceabilityControl, setTraceabilityControl] = useState(null); // { id, name }

    const defaultAssessment = { maturityLevel: null, targetLevel: 3, applicable: true, evidence: '' };

    const filteredControls = controls.filter(control => {
        const assessment = controlAssessments[control.id] || defaultAssessment;

        // Search filter
        const matchesSearch =
            control.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            control.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            control.description.toLowerCase().includes(searchTerm.toLowerCase());

        // Category filter
        const matchesCategory = categoryFilter === 'all' || control.category === categoryFilter;

        // Status filter
        let matchesStatus = true;
        if (statusFilter === 'assessed') {
            matchesStatus = assessment.maturityLevel !== null;
        } else if (statusFilter === 'pending') {
            matchesStatus = assessment.maturityLevel === null && assessment.applicable;
        } else if (statusFilter === 'na') {
            matchesStatus = !assessment.applicable;
        } else if (statusFilter === 'gap') {
            matchesStatus = assessment.maturityLevel !== null &&
                assessment.maturityLevel < assessment.targetLevel;
        }

        return matchesSearch && matchesCategory && matchesStatus;
    });

    // Group by category
    const groupedControls = filteredControls.reduce((acc, control) => {
        if (!acc[control.category]) {
            acc[control.category] = [];
        }
        acc[control.category].push(control);
        return acc;
    }, {});

    const handleToggleExpand = (controlId) => {
        setExpandedControl(expandedControl === controlId ? null : controlId);
    };

    const handleAttachmentsChange = (controlId, newFiles) => {
        updateControlAssessment(controlId, { attachments: newFiles });
    };

    return (
        <div className="controls-page">
            {/* Filters Bar */}
            <div className="filters-bar card">
                <div className="search-wrapper">
                    <Search className="search-icon" />
                    <input
                        type="text"
                        placeholder="Buscar por ID, nombre o descripción..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="form-input search-input"
                    />
                </div>

                <div className="filter-group">
                    <Filter size={18} />
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="form-select"
                    >
                        <option value="all">Todas las categorías</option>
                        {(selectedNorm === 'iso42001' ? ISO42001_CONTROL_CATEGORIES : CONTROL_CATEGORIES).map(cat => (
                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                    </select>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="form-select"
                    >
                        <option value="all">Todos los estados</option>
                        <option value="pending">Pendientes</option>
                        <option value="assessed">Evaluados</option>
                        <option value="gap">Con Brecha</option>
                        <option value="na">No Aplicables</option>
                    </select>
                </div>

                <div className="results-count">
                    {filteredControls.length} de {controls.length} controles
                </div>
            </div>

            {/* Controls List */}
            <div className="controls-list">
                {Object.entries(groupedControls).map(([category, categoryControls]) => {
                    const catInfo = (selectedNorm === 'iso42001' ? ISO42001_CONTROL_CATEGORIES : CONTROL_CATEGORIES).find(c => c.name === category);

                    return (
                        <div key={category} className="category-section">
                            <div className="category-header" style={{ borderLeftColor: catInfo?.color }}>
                                <h2 className="category-title">{category}</h2>
                                <span className="category-badge">{categoryControls.length} controles</span>
                            </div>

                            <div className="controls-grid">
                                {categoryControls.map(control => {
                                    const assessment = controlAssessments[control.id] || defaultAssessment;
                                    const isExpanded = expandedControl === control.id;
                                    const hasGap = assessment.maturityLevel !== null &&
                                        assessment.maturityLevel < assessment.targetLevel;

                                    return (
                                        <div
                                            key={control.id}
                                            className={`control-card ${!assessment.applicable ? 'not-applicable' : ''} ${hasGap ? 'has-gap' : ''}`}
                                        >
                                            <div
                                                className="control-header"
                                                onClick={() => handleToggleExpand(control.id)}
                                            >
                                                <div className="control-info">
                                                    <span className="control-id">{control.id}</span>
                                                    <h3 className="control-name">{control.name}</h3>
                                                </div>

                                                <div className="control-status">
                                                    {assessment.maturityLevel !== null ? (
                                                        <span className={`badge badge-cmmi-${assessment.maturityLevel}`}>
                                                            Nivel {assessment.maturityLevel}
                                                        </span>
                                                    ) : assessment.applicable ? (
                                                        <span className="badge badge-warning">Pendiente</span>
                                                    ) : (
                                                        <span className="badge" style={{ background: 'rgba(100,100,100,0.2)' }}>N/A</span>
                                                    )}
                                                    <button
                                                        className="btn btn-ghost btn-icon traceability-btn"
                                                        title="Ver trazabilidad (hallazgos y riesgos)"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setTraceabilityControl({ id: control.id, name: control.name });
                                                        }}
                                                    >
                                                        <GitBranch size={15} />
                                                    </button>
                                                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                                </div>
                                            </div>

                                            {isExpanded && (
                                                <div className="control-details">
                                                    <p className="control-description">{control.description}</p>
                                                    <p className="control-objective">
                                                        <strong>Objetivo:</strong> {control.objective}
                                                    </p>

                                                    <div className="control-actions">
                                                        <div className="applicable-toggle">
                                                            <label className="toggle-label">
                                                                <span>Aplicable</span>
                                                                <button
                                                                    className={`toggle-btn ${assessment.applicable ? 'active' : ''}`}
                                                                    onClick={() => setControlApplicable(control.id, !assessment.applicable)}
                                                                >
                                                                    {assessment.applicable ? <Check size={16} /> : <X size={16} />}
                                                                </button>
                                                            </label>
                                                        </div>

                                                        {assessment.applicable && (
                                                            <>
                                                                <div className="maturity-section">
                                                                    <label className="section-label">Nivel de Madurez Actual</label>
                                                                    <MaturitySelector
                                                                        value={assessment.maturityLevel}
                                                                        onChange={(level) => setControlMaturity(control.id, level)}
                                                                    />
                                                                </div>

                                                                <div className="target-section">
                                                                    <label className="section-label">Nivel Objetivo</label>
                                                                    <div className="target-selector">
                                                                        {[1, 2, 3, 4, 5].map(level => (
                                                                            <button
                                                                                key={level}
                                                                                className={`target-btn ${assessment.targetLevel === level ? 'active' : ''}`}
                                                                                onClick={() => updateControlAssessment(control.id, { targetLevel: level })}
                                                                            >
                                                                                {level}
                                                                            </button>
                                                                        ))}
                                                                    </div>
                                                                </div>

                                                                <div className="notes-section">
                                                                    <label className="section-label">Evidencia / Notas</label>
                                                                    <textarea
                                                                        className="form-textarea"
                                                                        placeholder="Documentar evidencia recopilada..."
                                                                        value={assessment.evidence || ''}
                                                                        onChange={(e) => updateControlAssessment(control.id, { evidence: e.target.value })}
                                                                    />
                                                                </div>

                                                                <div className="attachments-section">
                                                                    <label className="section-label">
                                                                        <Paperclip size={14} />
                                                                        Archivos Adjuntos
                                                                    </label>
                                                                    <FileUpload
                                                                        files={assessment.attachments || []}
                                                                        onChange={(files) => handleAttachmentsChange(control.id, files)}
                                                                        maxFiles={5}
                                                                    />
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}

                {filteredControls.length === 0 && (
                    <div className="empty-state">
                        <Search size={48} />
                        <h3>No se encontraron controles</h3>
                        <p>Intenta ajustar los filtros de búsqueda</p>
                    </div>
                )}
            </div>

            {/* Traceability Panel */}
            {traceabilityControl && (
                <TraceabilityPanel
                    controlId={traceabilityControl.id}
                    controlName={traceabilityControl.name}
                    onClose={() => setTraceabilityControl(null)}
                />
            )}
        </div>
    );
};

export default Controls;

