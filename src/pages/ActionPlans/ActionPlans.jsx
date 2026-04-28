import { useState } from 'react';
import {
    Plus, Search, Edit2, Trash2, X, Calendar, User,
    CheckCircle2, Clock, AlertCircle, Flag, Link2, LayoutGrid, List
} from 'lucide-react';
import { useAudit } from '../../context/AuditContext';
import './ActionPlans.css';

const PRIORITIES = [
    { id: 'critical', label: 'Crítica', color: '#ef4444' },
    { id: 'high', label: 'Alta', color: '#f97316' },
    { id: 'medium', label: 'Media', color: '#eab308' },
    { id: 'low', label: 'Baja', color: '#22c55e' }
];

const STATUSES = [
    { id: 'pending', label: 'Pendiente', icon: Clock, color: '#94a3b8' },
    { id: 'in-progress', label: 'En Progreso', icon: AlertCircle, color: '#3b82f6' },
    { id: 'completed', label: 'Completado', icon: CheckCircle2, color: '#22c55e' }
];

const ActionPlans = () => {
    const {
        actionPlans, addActionPlan, updateActionPlan, deleteActionPlan,
        findings, risks
    } = useAudit();

    const [viewMode, setViewMode] = useState('kanban');
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingPlan, setEditingPlan] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        responsible: '',
        dueDate: '',
        priority: 'medium',
        linkedFindingId: '',
        linkedRiskId: '',
        notes: ''
    });

    const filteredPlans = actionPlans.filter(plan =>
        plan.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.responsible?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const plansByStatus = {
        pending: filteredPlans.filter(p => p.status === 'pending'),
        'in-progress': filteredPlans.filter(p => p.status === 'in-progress'),
        completed: filteredPlans.filter(p => p.status === 'completed')
    };

    const isOverdue = (dueDate) => {
        return dueDate && new Date(dueDate) < new Date();
    };

    const handleOpenModal = (plan = null) => {
        if (plan) {
            setEditingPlan(plan);
            setFormData({
                title: plan.title || '',
                description: plan.description || '',
                responsible: plan.responsible || '',
                dueDate: plan.dueDate || '',
                priority: plan.priority || 'medium',
                linkedFindingId: plan.linkedFindingId || '',
                linkedRiskId: plan.linkedRiskId || '',
                notes: plan.notes || ''
            });
        } else {
            setEditingPlan(null);
            setFormData({
                title: '',
                description: '',
                responsible: '',
                dueDate: '',
                priority: 'medium',
                linkedFindingId: '',
                linkedRiskId: '',
                notes: ''
            });
        }
        setShowModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingPlan) {
            updateActionPlan(editingPlan.id, formData);
        } else {
            addActionPlan(formData);
        }
        setShowModal(false);
    };

    const handleDelete = (id) => {
        if (window.confirm('¿Está seguro de eliminar este plan de acción?')) {
            deleteActionPlan(id);
        }
    };

    const handleStatusChange = (planId, newStatus) => {
        updateActionPlan(planId, { status: newStatus });
    };

    const getPriorityInfo = (priorityId) =>
        PRIORITIES.find(p => p.id === priorityId) || PRIORITIES[2];

    const ActionCard = ({ plan }) => {
        const priority = getPriorityInfo(plan.priority);
        const overdue = isOverdue(plan.dueDate) && plan.status !== 'completed';

        return (
            <div className={`action-card ${overdue ? 'overdue' : ''}`}>
                <div className="action-card-header">
                    <span
                        className="priority-badge"
                        style={{ backgroundColor: priority.color + '20', color: priority.color }}
                    >
                        <Flag size={12} />
                        {priority.label}
                    </span>
                    {overdue && (
                        <span className="overdue-badge">
                            <AlertCircle size={12} />
                            Vencido
                        </span>
                    )}
                </div>

                <h4 className="action-title">{plan.title}</h4>
                <p className="action-description">{plan.description?.substring(0, 100)}...</p>

                <div className="action-meta">
                    {plan.responsible && (
                        <div className="meta-item">
                            <User size={14} />
                            <span>{plan.responsible}</span>
                        </div>
                    )}
                    {plan.dueDate && (
                        <div className={`meta-item ${overdue ? 'text-danger' : ''}`}>
                            <Calendar size={14} />
                            <span>{new Date(plan.dueDate).toLocaleDateString()}</span>
                        </div>
                    )}
                </div>

                {(plan.linkedFindingId || plan.linkedRiskId) && (
                    <div className="action-links">
                        {plan.linkedFindingId && (
                            <span className="link-badge finding">
                                <Link2 size={12} />
                                {plan.linkedFindingId}
                            </span>
                        )}
                        {plan.linkedRiskId && (
                            <span className="link-badge risk">
                                <Link2 size={12} />
                                {plan.linkedRiskId}
                            </span>
                        )}
                    </div>
                )}

                <div className="action-card-actions">
                    <button className="btn btn-ghost btn-sm" onClick={() => handleOpenModal(plan)}>
                        <Edit2 size={14} />
                    </button>
                    <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(plan.id)}>
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="action-plans-page">
            {/* Header */}
            <div className="page-header card">
                <div className="header-left">
                    <div className="search-wrapper">
                        <Search className="search-icon" />
                        <input
                            type="text"
                            placeholder="Buscar planes de acción..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="form-input"
                        />
                    </div>
                </div>

                <div className="header-right">
                    <div className="view-toggle">
                        <button
                            className={`toggle-btn ${viewMode === 'kanban' ? 'active' : ''}`}
                            onClick={() => setViewMode('kanban')}
                        >
                            <LayoutGrid size={18} />
                        </button>
                        <button
                            className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                            onClick={() => setViewMode('list')}
                        >
                            <List size={18} />
                        </button>
                    </div>

                    <button className="btn btn-primary" onClick={() => handleOpenModal()}>
                        <Plus size={18} />
                        Nueva Acción
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="action-stats">
                <div className="stat-card pending">
                    <Clock size={20} />
                    <span className="stat-number">{plansByStatus.pending.length}</span>
                    <span className="stat-label">Pendientes</span>
                </div>
                <div className="stat-card in-progress">
                    <AlertCircle size={20} />
                    <span className="stat-number">{plansByStatus['in-progress'].length}</span>
                    <span className="stat-label">En Progreso</span>
                </div>
                <div className="stat-card completed">
                    <CheckCircle2 size={20} />
                    <span className="stat-number">{plansByStatus.completed.length}</span>
                    <span className="stat-label">Completados</span>
                </div>
                <div className="stat-card overdue">
                    <AlertCircle size={20} />
                    <span className="stat-number">
                        {actionPlans.filter(p => isOverdue(p.dueDate) && p.status !== 'completed').length}
                    </span>
                    <span className="stat-label">Vencidos</span>
                </div>
            </div>

            {/* Kanban View */}
            {viewMode === 'kanban' && (
                <div className="kanban-board">
                    {STATUSES.map(status => (
                        <div key={status.id} className="kanban-column">
                            <div className="column-header" style={{ borderColor: status.color }}>
                                <status.icon size={18} style={{ color: status.color }} />
                                <h3>{status.label}</h3>
                                <span className="column-count">{plansByStatus[status.id]?.length || 0}</span>
                            </div>
                            <div className="column-content">
                                {plansByStatus[status.id]?.map(plan => (
                                    <ActionCard key={plan.id} plan={plan} />
                                ))}
                                {plansByStatus[status.id]?.length === 0 && (
                                    <div className="empty-column">
                                        Sin acciones
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
                <div className="card table-wrapper">
                    <table className="table actions-table">
                        <thead>
                            <tr>
                                <th>Título</th>
                                <th>Responsable</th>
                                <th>Fecha Límite</th>
                                <th>Prioridad</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPlans.map(plan => {
                                const priority = getPriorityInfo(plan.priority);
                                const statusInfo = STATUSES.find(s => s.id === plan.status);
                                const overdue = isOverdue(plan.dueDate) && plan.status !== 'completed';

                                return (
                                    <tr key={plan.id} className={overdue ? 'row-overdue' : ''}>
                                        <td>
                                            <div className="plan-info">
                                                <span className="plan-title">{plan.title}</span>
                                                <span className="plan-desc">{plan.description?.substring(0, 50)}...</span>
                                            </div>
                                        </td>
                                        <td>{plan.responsible || '-'}</td>
                                        <td className={overdue ? 'text-danger' : ''}>
                                            {plan.dueDate ? new Date(plan.dueDate).toLocaleDateString() : '-'}
                                        </td>
                                        <td>
                                            <span
                                                className="priority-badge"
                                                style={{ backgroundColor: priority.color + '20', color: priority.color }}
                                            >
                                                {priority.label}
                                            </span>
                                        </td>
                                        <td>
                                            <select
                                                className="status-select"
                                                value={plan.status}
                                                onChange={(e) => handleStatusChange(plan.id, e.target.value)}
                                                style={{ borderColor: statusInfo?.color }}
                                            >
                                                {STATUSES.map(s => (
                                                    <option key={s.id} value={s.id}>{s.label}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td>
                                            <div className="table-actions">
                                                <button className="btn btn-ghost btn-icon" onClick={() => handleOpenModal(plan)}>
                                                    <Edit2 size={16} />
                                                </button>
                                                <button className="btn btn-ghost btn-icon" onClick={() => handleDelete(plan.id)}>
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
            )}

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">
                                {editingPlan ? 'Editar Plan de Acción' : 'Nuevo Plan de Acción'}
                            </h2>
                            <button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}>
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

                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Responsable</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={formData.responsible}
                                            onChange={(e) => setFormData({ ...formData, responsible: e.target.value })}
                                            placeholder="Nombre del responsable"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Fecha Límite</label>
                                        <input
                                            type="date"
                                            className="form-input"
                                            value={formData.dueDate}
                                            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Prioridad</label>
                                    <div className="priority-selector">
                                        {PRIORITIES.map(p => (
                                            <button
                                                key={p.id}
                                                type="button"
                                                className={`priority-btn ${formData.priority === p.id ? 'active' : ''}`}
                                                style={{
                                                    '--priority-color': p.color,
                                                    borderColor: formData.priority === p.id ? p.color : 'transparent'
                                                }}
                                                onClick={() => setFormData({ ...formData, priority: p.id })}
                                            >
                                                <Flag size={14} />
                                                {p.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Vincular Hallazgo</label>
                                        <select
                                            className="form-select"
                                            value={formData.linkedFindingId}
                                            onChange={(e) => setFormData({ ...formData, linkedFindingId: e.target.value })}
                                        >
                                            <option value="">Ninguno</option>
                                            {findings.map(f => (
                                                <option key={f.id} value={f.id}>{f.id} - {f.title}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Vincular Riesgo</label>
                                        <select
                                            className="form-select"
                                            value={formData.linkedRiskId}
                                            onChange={(e) => setFormData({ ...formData, linkedRiskId: e.target.value })}
                                        >
                                            <option value="">Ninguno</option>
                                            {risks.map(r => (
                                                <option key={r.id} value={r.id}>{r.id} - {r.title}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Notas Adicionales</label>
                                    <textarea
                                        className="form-textarea"
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                        rows={2}
                                        placeholder="Observaciones adicionales..."
                                    />
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editingPlan ? 'Guardar Cambios' : 'Crear Acción'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActionPlans;
