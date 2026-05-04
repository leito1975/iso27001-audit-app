import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Shield, Eye, EyeOff, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import api from '../../services/api';
import '../Activate/Activate.css';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [phase, setPhase] = useState('loading'); // loading | form | success | error | expired
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!token) {
            setErrorMsg('Link inválido.');
            setPhase('error');
            return;
        }
        api.auth.validateResetToken(token)
            .then(data => {
                setEmail(data.email);
                setPhase('form');
            })
            .catch(err => {
                if (err.message?.includes('expiró')) {
                    setPhase('expired');
                } else {
                    setErrorMsg(err.message || 'Link inválido');
                    setPhase('error');
                }
            });
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirm) {
            setErrorMsg('Las contraseñas no coinciden');
            return;
        }
        if (password.length < 8) {
            setErrorMsg('La contraseña debe tener al menos 8 caracteres');
            return;
        }
        setErrorMsg('');
        setSubmitting(true);
        try {
            await api.auth.resetPassword(token, password);
            setPhase('success');
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setErrorMsg(err.message || 'Error al resetear la contraseña');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="activate-container">
            <div className="activate-card">
                <div className="activate-header">
                    <Shield className="activate-logo-icon" />
                    <h1 className="activate-logo-text">AuditIA</h1>
                    <p className="activate-logo-sub">Audit Intelligence Platform</p>
                </div>

                {phase === 'loading' && (
                    <div className="activate-body" style={{ textAlign: 'center' }}>
                        <div className="activate-spinner" />
                        <p style={{ color: 'var(--color-text-secondary)' }}>Verificando link...</p>
                    </div>
                )}

                {phase === 'form' && (
                    <div className="activate-body">
                        <h2 className="activate-title">Nueva contraseña</h2>
                        <p className="activate-subtitle">Creá una nueva contraseña para <strong>{email}</strong></p>
                        {errorMsg && <p className="activate-error">{errorMsg}</p>}
                        <form onSubmit={handleSubmit}>
                            <div className="activate-form-group">
                                <label className="activate-label">Nueva contraseña</label>
                                <div className="activate-input-wrapper">
                                    <input
                                        type={showPw ? 'text' : 'password'}
                                        className="activate-input activate-input-pw"
                                        placeholder="Mínimo 8 caracteres"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required autoFocus
                                    />
                                    <button type="button" className="activate-pw-toggle"
                                        onClick={() => setShowPw(!showPw)}>
                                        {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                            <div className="activate-form-group">
                                <label className="activate-label">Confirmar contraseña</label>
                                <input
                                    type={showPw ? 'text' : 'password'}
                                    className="activate-input"
                                    placeholder="Repetí la contraseña"
                                    value={confirm}
                                    onChange={(e) => setConfirm(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="activate-btn" disabled={submitting}>
                                {submitting ? 'Guardando...' : 'Guardar nueva contraseña'}
                            </button>
                        </form>
                    </div>
                )}

                {phase === 'success' && (
                    <div className="activate-body">
                        <div className="activate-success">
                            <CheckCircle size={48} className="activate-success-icon" />
                            <h2 className="activate-title">¡Contraseña actualizada!</h2>
                            <p className="activate-subtitle">Tu contraseña fue cambiada exitosamente. En 3 segundos te redirigimos al login.</p>
                        </div>
                        <Link to="/login" className="activate-btn" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
                            Ir al login
                        </Link>
                    </div>
                )}

                {phase === 'expired' && (
                    <div className="activate-body">
                        <div className="activate-success" style={{ '--success-color': '#f59e0b' }}>
                            <AlertCircle size={48} style={{ color: '#f59e0b', marginBottom: '1rem' }} />
                            <h2 className="activate-title">Link expirado</h2>
                            <p className="activate-subtitle">El link de reseteo expiró. Solicitá uno nuevo.</p>
                        </div>
                        <Link to="/forgot-password" className="activate-btn"
                              style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
                            Solicitar nuevo link
                        </Link>
                    </div>
                )}

                {phase === 'error' && (
                    <div className="activate-body">
                        <p className="activate-error">{errorMsg}</p>
                        <Link to="/login" className="activate-back-link">
                            <ArrowLeft size={14} /> Volver al login
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;
