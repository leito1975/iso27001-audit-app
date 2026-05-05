import { useState, useEffect } from 'react';
import { Users as UsersIcon, Plus, Edit2, Trash2, X, Shield, User, Eye, EyeOff, Copy, Mail, RefreshCw, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './Users.css';

const ROLE_LABELS = { admin: 'Administrador', auditor: 'Auditor', viewer: 'Visualizador' };
const ROLE_COLORS = { admin: '#ef4444', auditor: '#6366f1', viewer: '#94a3b8' };

const Users = () => {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState('');

    // After-create invite panel
    const [inviteResult, setInviteResult] = useState(null); // { inviteUrl, emailSent, user }
    const [copied, setCopied] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'auditor'
    });

    const loadUsers = async () => {
        try {
            setLoading(true);
            const data = await api.users.getAll();
            setUsers(data.users || []);
        } catch (err) {
            setError(err.message || 'Error al cargar usuarios');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadUsers(); }, []);

    const handleOpenModal = (user = null) => {
        setFormError('');
        setShowPassword(false);
        setInviteResult(null);
        if (user) {
            setEditingUser(user);
            setFormData({ name: user.name || '', email: user.email || '', password: '', role: user.role || 'auditor' });
        } else {
            setEditingUser(null);
            setFormData({ name: '', email: '', password: '', role: 'auditor' });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingUser(null);
        setInviteResult(null);
        setFormError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        setSaving(true);
        try {
            if (editingUser) {
                // Edit: password is optional
                const payload = { name: formData.name, email: formData.email, role: formData.role };
                if (formData.password) payload.password = formData.password;
                await api.users.update(editingUser.id, payload);
                await loadUsers();
                handleCloseModal();
            } else {
                // Create: no password, just invite
                const data = await api.users.create({ name: formData.name, email: formData.email, role: formData.role });
                await loadUsers();
                // Show invite result panel instead of closing immediately
                setInviteResult({
                    inviteUrl: data.inviteUrl,
                    emailSent: data.emailSent,
                    user: data.user
                });
            }
        } catch (err) {
            setFormError(err.message || 'Error al guardar el usuario');
        } finally {
            setSaving(false);
        }
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(inviteResult.inviteUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        } catch {
            // fallback
            const el = document.createElement('textarea');
            el.value = inviteResult.inviteUrl;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        }
    };

    const handleResendInvite = async (user) => {
        try {
            const data = await api.users.resendInvite(user.id);
            setInviteResult({ inviteUrl: data.inviteUrl, emailSent: data.emailSent, user });
            setShowModal(true);
        } catch (err) {
            alert(err.message || 'Error al reenviar invitación');
        }
    };

    const handleDelete = async (user) => {
        if (user.id === currentUser?.id) { alert('No podés eliminar tu propio usuario.'); return; }
        if (!window.confirm(`¿Eliminar al usuario "${user.name}"?`)) return;
        try {
            await api.users.delete(user.id);
            setUsers(prev => prev.filter(u => u.id !== user.id));
        } catch (err) {
            alert(err.message || 'Error al eliminar');
        }
    };

    if (currentUser?.role !== 'admin') {
        return (
            <div className="users-page">
                <div className="users-access-denied card">
                    <Shield size={48} style={{ color: '#ef4444' }} />
                    <h2>Acceso Denegado</h2>
                    <p>Solo los administradores pueden gestionar usuarios.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="users-page">
            <div className="card users-header">
                <div>
                    <h1 className="users-title"><UsersIcon size={22} /> Gestión de Usuarios</h1>
                    <p className="users-subtitle">Invitá y administrá los usuarios con acceso al sistema.</p>
                </div>
                <button className="btn btn-primary" onClick={() => handleOpenModal()}>
                    <Plus size={18} /> Invitar Usuario
                </button>
            </div>

            <div className="users-stats">
                <div className="user-stat-card"><span className="user-stat-num">{users.length}</span><span className="user-stat-label">Total</span></div>
                <div className="user-stat-card admin"><span className="user-stat-num">{users.filter(u => u.role === 'admin').length}</span><span className="user-stat-label">Administradores</span></div>
                <div className="user-stat-card auditor"><span className="user-stat-num">{users.filter(u => u.role === 'auditor').length}</span><span className="user-stat-label">Auditores</span></div>
                <div className="user-stat-card invited"><span className="user-stat-num">{users.filter(u => u.status === 'invited').length}</span><span className="user-stat-label">Pendientes</span></div>
            </div>

            {loading ? (
                <div className="users-loading card">Cargando usuarios...</div>
            ) : error ? (
                <div className="users-error card">{error}</div>
            ) : (
                <div className="card table-wrapper">
                    <table className="table users-table">
                        <thead>
                            <tr>
                                <th>Usuario</th>
                                <th>Email</th>
                                <th>Rol</th>
                                <th>Estado</th>
                                <th>Creado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} className={user.id === currentUser?.id ? 'current-user-row' : ''}>
                                    <td>
                                        <div className="user-identity">
                                            <div className="user-avatar" style={{ background: ROLE_COLORS[user.role] + '22', color: ROLE_COLORS[user.role] }}>
                                                <User size={16} />
                                            </div>
                                            <span className="user-name">
                                                {user.name}
                                                {user.id === currentUser?.id && <span className="current-tag">Vos</span>}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="user-email">{user.email}</td>
                                    <td>
                                        <span className="role-badge" style={{ background: ROLE_COLORS[user.role] + '22', color: ROLE_COLORS[user.role] }}>
                                            {ROLE_LABELS[user.role] || user.role}
                                        </span>
                                    </td>
                                    <td>
                                        {user.status === 'invited' && <span className="status-badge invited">Invitado</span>}
                                        {user.status === 'pending_verification' && <span className="status-badge invited" style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>Sin verificar</span>}
                                        {user.status === 'active' && <span className="status-badge active">Activo</span>}
                                        {!['invited','pending_verification','active'].includes(user.status) && <span className="status-badge">{user.status}</span>}
                                    </td>
                                    <td className="user-date">{new Date(user.createdAt).toLocaleDateString('es-ES')}</td>
                                    <td>
                                        <div className="table-actions">
                                            {user.status === 'invited' && (
                                                <button className="btn btn-ghost btn-icon" onClick={() => handleResendInvite(user)} title="Reenviar invitación">
                                                    <RefreshCw size={15} />
                                                </button>
                                            )}
                                            {user.status === 'pending_verification' && (
                                                <button className="btn btn-ghost btn-icon" title="Activar cuenta manualmente"
                                                    style={{ color: '#22c55e' }}
                                                    onClick={async () => {
                                                        try {
                                                            await api.users.activate(user.id);
                                                            setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: 'active' } : u));
                                                        } catch (err) { alert(err.message); }
                                                    }}>
                                                    ✓
                                                </button>
                                            )}
                                            <button className="btn btn-ghost btn-icon" onClick={() => handleOpenModal(user)} title="Editar">
                                                <Edit2 size={16} />
                                            </button>
                                            <button className="btn btn-ghost btn-icon btn-danger" onClick={() => handleDelete(user)} title="Eliminar" disabled={user.id === currentUser?.id}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Create / Edit Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">
                                {inviteResult ? 'Invitación creada' : editingUser ? 'Editar Usuario' : 'Invitar Usuario'}
                            </h2>
                            <button className="btn btn-ghost btn-icon" onClick={handleCloseModal}><X size={20} /></button>
                        </div>

                        {/* After-create: show invite link */}
                        {inviteResult ? (
                            <div className="modal-body">
                                <div className="invite-result">
                                    {inviteResult.emailSent ? (
                                        <div className="invite-sent">
                                            <Mail size={32} style={{ color: '#22c55e' }} />
                                            <p>Se envió el link de activación a <strong>{inviteResult.user.email}</strong>.</p>
                                        </div>
                                    ) : (
                                        <div className="invite-manual">
                                            <Mail size={32} style={{ color: '#f59e0b' }} />
                                            <p>El email no pudo enviarse (SMTP no configurado). Compartí este link manualmente con <strong>{inviteResult.user.email}</strong>:</p>
                                        </div>
                                    )}

                                    <div className="invite-link-box">
                                        <span className="invite-link-text">{inviteResult.inviteUrl}</span>
                                        <button className="btn btn-secondary btn-icon" onClick={handleCopyLink} title="Copiar link">
                                            {copied ? <CheckCircle size={16} style={{ color: '#22c55e' }} /> : <Copy size={16} />}
                                        </button>
                                    </div>
                                    {copied && <p className="invite-copied">¡Link copiado!</p>}

                                    <p className="invite-expiry">El link expira en 72 horas.</p>
                                </div>
                                <div className="modal-footer">
                                    <button className="btn btn-primary" onClick={handleCloseModal}>Listo</button>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    {formError && <div className="form-error-banner">{formError}</div>}

                                    <div className="form-group">
                                        <label className="form-label">Nombre completo *</label>
                                        <input type="text" className="form-input" value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            required placeholder="Ej: María García" />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Email *</label>
                                        <input type="email" className="form-input" value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            required placeholder="usuario@empresa.com" />
                                    </div>

                                    {editingUser && (
                                        <div className="form-group">
                                            <label className="form-label">Nueva contraseña <span style={{ color: '#64748b', fontWeight: 400 }}>(dejar vacío para no cambiar)</span></label>
                                            <div className="password-input-wrapper">
                                                <input type={showPassword ? 'text' : 'password'} className="form-input"
                                                    value={formData.password}
                                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                                    placeholder="Mínimo 8 caracteres" />
                                                <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    <div className="form-group">
                                        <label className="form-label">Rol *</label>
                                        <select className="form-select" value={formData.role}
                                            onChange={e => setFormData({ ...formData, role: e.target.value })}>
                                            <option value="auditor">Auditor — puede crear y editar</option>
                                            <option value="viewer">Visualizador — solo lectura</option>
                                            <option value="admin">Administrador — acceso completo</option>
                                        </select>
                                    </div>

                                    {!editingUser && (
                                        <div className="invite-notice">
                                            <Mail size={15} />
                                            El usuario recibirá un link para activar su cuenta y elegir su contraseña.
                                        </div>
                                    )}
                                </div>

                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={handleCloseModal} disabled={saving}>Cancelar</button>
                                    <button type="submit" className="btn btn-primary" disabled={saving}>
                                        {saving ? 'Guardando...' : editingUser ? 'Guardar Cambios' : 'Enviar Invitación'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;
