import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Edit2, Calendar, Building2 } from 'lucide-react';
import { useAudit } from '../../context/AuditContext';
import api from '../../services/api';
import './Audits.css';

const Audits = () => {
    const navigate = useNavigate();
    const { selectAudit } = useAudit();
    const [audits, setAudits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        norm: 'iso27001',
        organization: '',
        auditor: '',
        startDate: '',
        endDate: '',
        scope: ''
    });

    useEffect(() => {
        loadAudits();
    }, []);

    const loadAudits = async () => {
        try {
            setLoading(true);
            const data = await api.audits.getAll();
            setAudits(data.audits || []);
        } catch (err) {
            console.error('Error loading audits:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAudit = async (e) => {
        e.preventDefault();
        try {
            const data = await api.audits.create(formData);
            setAudits([data.audit, ...audits]);
            setShowModal(false);
            setFormData({
                name: '',
                norm: 'iso27001',
                organization: '',
                auditor: '',
                startDate: '',
                endDate: '',
                scope: ''
            });
        } catch (err) {
            console.error('Error creating audit:', err);
            alert('Error al crear auditoría: ' + err.message);
        }
    };

    const handleOpenAudit = async (auditId) => {
        try {
            await selectAudit(auditId);
            navigate('/');
        } catch (err) {
            console.error('Error opening audit:', err);
            alert('Error al abrir auditoría: ' + err.message);
        }
    };

    const handleDeleteAudit = async (auditId) => {
        if (window.confirm('¿Está seguro de que desea eliminar esta auditoría? Esta acción no se puede deshacer.')) {
            try {
                await api.audits.delete(auditId);
                setAudits(audits.filter(a => a.id !== auditId));
            } catch (err) {
                console.error('Error deleting audit:', err);
                alert('Error al eliminar auditoría: ' + err.message);
            }
        }
    };

    const getNormBadgeColor = (norm) => {
        return norm === 'iso42001' ? '#7c3aed' : '#1B6CA8';
    };

    const getNormLabel = (norm) => {
        return norm === 'iso42001' ? 'ISO 42001' : 'ISO 27001';
    };

    const getStatusBadgeColor = (status) => {
        const colors = {
            'draft': '#6b7280',
            'in-progress': '#f59e0b',
            'completed': '#10b981'
        };
        return colors[status] || '#6b7280';
    };

    const getStatusLabel = (status) => {
        const labels = {
            'draft': 'Borrador',
            'in-progress': 'En Curso',
            'completed': 'Completada'
        };
        return labels[status] || status;
    };

    return (
        <div className="audits-container">
            <div className="audits-header">
                <div className="audits-header-content">
                    <h1 className="audits-title">AuditIA</h1>
                    <p className="audits-subtitle">Gestión de Auditorías Independientes</p>
                </div>
                <button className="btn-primary" onClick={() => setShowModal(true)}>
                    <Plus size={18} />
                    Nueva Auditoría
                </button>
            </div>

            {loading ? (
                <div className="loading-state">
                    <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📋</div>
                    <p>Cargando auditorías...</p>
                </div>
            ) : audits.length === 0 ? (
                <div className="empty-state">
                    <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📊</div>
                    <h2>No hay auditorías</h2>
                    <p>Comienza creando tu primera auditoría independiente</p>
                    <button className="btn-primary" onClick={() => setShowModal(true)}>
                        <Plus size={18} />
                        Crear Primera Auditoría
                    </button>
                </div>
            ) : (
                <div className="audits-grid">
                    {audits.map(audit => (
                        <div key={audit.id} className="audit-card">
                            <div className="audit-card-header">
                                <h3 className="audit-card-title">{audit.name}</h3>
                                <div className="audit-card-badges">
                                    <span
                                        className="badge"
                                        style={{ backgroundColor: getNormBadgeColor(audit.norm) }}
                                    >
                                        {getNormLabel(audit.norm)}
                                    </span>
                                    <span
                                        className="badge"
                                        style={{ backgroundColor: getStatusBadgeColor(audit.status) }}
                                    >
                                        {getStatusLabel(audit.status)}
                                    </span>
                                </div>
                            </div>

                            <div className="audit-card-content">
                                {audit.organization && (
                                    <div className="audit-info-item">
                                        <Building2 size={16} />
                                        <span>{audit.organization}</span>
                                    </div>
                                )}

                                {audit.startDate && (
                                    <div className="audit-info-item">
                                        <Calendar size={16} />
                                        <span>
                                            {new Date(audit.startDate).toLocaleDateString('es-ES')}
                                            {audit.endDate && ` - ${new Date(audit.endDate).toLocaleDateString('es-ES')}`}
                                        </span>
                                    </div>
                                )}

                                <div className="audit-stats">
                                    <div className="stat">
                                        <span className="stat-label">Hallazgos</span>
                                        <span className="stat-value">{audit.stats?.findingsCount || 0}</span>
                                    </div>
                                    <div className="stat">
                                        <span className="stat-label">Controles</span>
                                        <span className="stat-value">{audit.stats?.assessmentsCount || 0}</span>
                                    </div>
                                    <div className="stat">
                                        <span className="stat-label">Riesgos</span>
                                        <span className="stat-value">{audit.stats?.risksCount || 0}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="audit-card-footer">
                                <button
                                    className="btn-open"
                                    onClick={() => handleOpenAudit(audit.id)}
                                >
                                    Abrir
                                </button>
                                <button
                                    className="btn-icon"
                                    title="Eliminar auditoría"
                                    onClick={() => handleDeleteAudit(audit.id)}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2 className="modal-title">Nueva Auditoría</h2>

                        <form onSubmit={handleCreateAudit}>
                            <div className="form-group">
                                <label>Nombre de la Auditoría</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="ej: Auditoría ISO 27001 Q1 2025"
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Norma</label>
                                    <select
                                        value={formData.norm}
                                        onChange={(e) => setFormData({ ...formData, norm: e.target.value })}
                                    >
                                        <option value="iso27001">ISO 27001</option>
                                        <option value="iso42001">ISO 42001</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Organización</label>
                                    <input
                                        type="text"
                                        value={formData.organization}
                                        onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                                        placeholder="ej: TechCorp S.A."
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Auditor</label>
                                    <input
                                        type="text"
                                        value={formData.auditor}
                                        onChange={(e) => setFormData({ ...formData, auditor: e.target.value })}
                                        placeholder="ej: Juan Pérez"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Fecha Inicio</label>
                                    <input
                                        type="date"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Fecha Fin</label>
                                    <input
                                        type="date"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Alcance</label>
                                <textarea
                                    value={formData.scope}
                                    onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
                                    placeholder="Describe el alcance de la auditoría..."
                                    rows="3"
                                />
                            </div>

                            <div className="form-actions">
                                <button
                                    type="button"
                                    className="btn-secondary"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-primary">
                                    <Plus size={18} />
                                    Crear Auditoría
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Audits;
