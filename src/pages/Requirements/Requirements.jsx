import { useState } from 'react';
import {
    Search, ChevronDown, ChevronRight, CheckCircle, AlertTriangle,
    MinusCircle, Circle, FileText, Book
} from 'lucide-react';
import { useAudit } from '../../context/AuditContext';
import { ISO27001_CLAUSES, COMPLIANCE_STATUS } from '../../data/iso27001-clauses';
import { ISO42001_CLAUSES } from '../../data/iso42001-clauses';
import FileUpload from '../../components/FileUpload/FileUpload';
import MaturitySelector from '../../components/CMMI/MaturitySelector';
import './Requirements.css';

const Requirements = () => {
    const { clauseAssessments, updateClauseAssessment, selectedNorm } = useAudit();
    const CLAUSES = selectedNorm === 'iso42001' ? ISO42001_CLAUSES : ISO27001_CLAUSES;
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedClauses, setExpandedClauses] = useState(['4', '5']);
    const [selectedSubclause, setSelectedSubclause] = useState(null);

    const toggleClause = (clauseId) => {
        setExpandedClauses(prev =>
            prev.includes(clauseId)
                ? prev.filter(id => id !== clauseId)
                : [...prev, clauseId]
        );
    };

    const getAssessment = (subclauseId) => {
        return clauseAssessments?.[subclauseId] || {
            status: 'not-evaluated',
            notes: '',
            evidence: '',
            attachments: []
        };
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'compliant': return <CheckCircle size={16} className="status-icon compliant" />;
            case 'partial': return <AlertTriangle size={16} className="status-icon partial" />;
            case 'non-compliant': return <MinusCircle size={16} className="status-icon non-compliant" />;
            case 'not-applicable': return <Circle size={16} className="status-icon not-applicable" />;
            default: return <Circle size={16} className="status-icon" />;
        }
    };

    const getClauseStats = (clause) => {
        let compliant = 0;
        let total = clause.subclauses.length;

        clause.subclauses.forEach(sub => {
            const assessment = getAssessment(sub.id);
            if (assessment.status === 'compliant') compliant++;
        });

        return { compliant, total };
    };

    // Filter clauses based on search
    const filteredClauses = CLAUSES.map(clause => ({
        ...clause,
        subclauses: clause.subclauses.filter(sub =>
            sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sub.id.includes(searchTerm) ||
            sub.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
    })).filter(clause => clause.subclauses.length > 0);

    const handleStatusChange = (subclauseId, status) => {
        updateClauseAssessment(subclauseId, { status });
    };

    const handleNotesChange = (subclauseId, notes) => {
        updateClauseAssessment(subclauseId, { notes });
    };

    const handleAttachmentsChange = (subclauseId, attachments) => {
        updateClauseAssessment(subclauseId, { attachments });
    };

    const handleMaturityChange = (subclauseId, maturityLevel) => {
        updateClauseAssessment(subclauseId, { maturityLevel });
    };

    return (
        <div className="requirements-page">
            {/* Header */}
            <div className="page-header card">
                <div className="header-left">
                    <div className="search-wrapper">
                        <Search className="search-icon" />
                        <input
                            type="text"
                            placeholder="Buscar cláusulas..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="form-input"
                        />
                    </div>
                </div>
                <div className="header-info">
                    <Book size={20} />
                    <span>Requisitos {selectedNorm === 'iso42001' ? 'ISO 42001:2023' : 'ISO 27001:2022'} (Cláusulas 4-10)</span>
                </div>
            </div>

            <div className="requirements-content">
                {/* Clauses List */}
                <div className="clauses-list">
                    {filteredClauses.map(clause => {
                        const stats = getClauseStats(clause);
                        const isExpanded = expandedClauses.includes(clause.id);

                        return (
                            <div key={clause.id} className="clause-section card">
                                <button
                                    className="clause-header"
                                    onClick={() => toggleClause(clause.id)}
                                >
                                    <div className="clause-title">
                                        {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                                        <span className="clause-number">{clause.id}</span>
                                        <span className="clause-name">{clause.name}</span>
                                    </div>
                                    <div className="clause-stats">
                                        <span className="stats-badge">
                                            {stats.compliant}/{stats.total} conformes
                                        </span>
                                    </div>
                                </button>

                                {isExpanded && (
                                    <div className="subclauses-list">
                                        {clause.subclauses.map(subclause => {
                                            const assessment = getAssessment(subclause.id);
                                            const isSelected = selectedSubclause?.id === subclause.id;

                                            return (
                                                <div
                                                    key={subclause.id}
                                                    className={`subclause-item ${isSelected ? 'selected' : ''}`}
                                                    onClick={() => setSelectedSubclause(subclause)}
                                                >
                                                    <div className="subclause-header">
                                                        {getStatusIcon(assessment.status)}
                                                        <span className="subclause-id">{subclause.id}</span>
                                                        <span className="subclause-name">{subclause.name}</span>
                                                    </div>
                                                    {assessment.attachments?.length > 0 && (
                                                        <span className="attachment-badge">
                                                            <FileText size={12} />
                                                            {assessment.attachments.length}
                                                        </span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Detail Panel */}
                <div className="detail-panel card">
                    {selectedSubclause ? (
                        <>
                            <div className="detail-header">
                                <div className="detail-title">
                                    <span className="detail-id">{selectedSubclause.id}</span>
                                    <h3>{selectedSubclause.name}</h3>
                                </div>
                            </div>

                            <div className="detail-body">
                                <div className="detail-section">
                                    <h4>Descripción</h4>
                                    <p>{selectedSubclause.description}</p>
                                </div>

                                <div className="detail-section">
                                    <h4>Requisitos</h4>
                                    <ul className="requirements-list">
                                        {selectedSubclause.requirements.map((req, index) => (
                                            <li key={index}>{req}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="detail-section">
                                    <h4>Estado de Cumplimiento</h4>
                                    <div className="status-selector">
                                        {COMPLIANCE_STATUS.map(status => (
                                            <button
                                                key={status.id}
                                                className={`status-btn ${getAssessment(selectedSubclause.id).status === status.id ? 'active' : ''}`}
                                                style={{
                                                    '--status-color': status.color,
                                                    borderColor: getAssessment(selectedSubclause.id).status === status.id ? status.color : 'transparent'
                                                }}
                                                onClick={() => handleStatusChange(selectedSubclause.id, status.id)}
                                            >
                                                {status.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="detail-section">
                                    <h4>Nivel de Madurez (CMMI)</h4>
                                    <MaturitySelector
                                        value={getAssessment(selectedSubclause.id).maturityLevel ?? null}
                                        onChange={(level) => handleMaturityChange(selectedSubclause.id, level)}
                                    />
                                </div>

                                <div className="detail-section">
                                    <h4>Notas y Evidencia</h4>
                                    <textarea
                                        className="form-textarea"
                                        placeholder="Documentar evidencias, observaciones..."
                                        value={getAssessment(selectedSubclause.id).notes || ''}
                                        onChange={(e) => handleNotesChange(selectedSubclause.id, e.target.value)}
                                        rows={4}
                                    />
                                </div>

                                <div className="detail-section">
                                    <h4>Documentos Adjuntos</h4>
                                    <FileUpload
                                        files={getAssessment(selectedSubclause.id).attachments || []}
                                        onChange={(files) => handleAttachmentsChange(selectedSubclause.id, files)}
                                        maxFiles={10}
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="empty-detail">
                            <Book size={48} />
                            <h3>Selecciona una cláusula</h3>
                            <p>Haz clic en una cláusula para ver sus detalles y evaluar el cumplimiento</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Requirements;
