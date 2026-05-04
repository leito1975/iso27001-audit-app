import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import api from '../../services/api';
import '../Activate/Activate.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [phase, setPhase] = useState('form'); // form | success | error
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const data = await api.auth.forgotPassword(email);
            setMessage(data.message);
            setPhase('success');
            // Dev mode: show reset URL directly
            if (data.devResetUrl) {
                console.log('DEV — Reset URL:', data.devResetUrl);
                setMessage(`${data.message}\n\n[DEV] Reset URL: ${data.devResetUrl}`);
            }
        } catch (err) {
            setMessage(err.message || 'Error al procesar la solicitud');
            setPhase('error');
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

                {phase === 'form' && (
                    <div className="activate-body">
                        <h2 className="activate-title">¿Olvidaste tu contraseña?</h2>
                        <p className="activate-subtitle">
                            Ingresá tu email y te enviaremos un link para crear una nueva contraseña.
                        </p>
                        <form onSubmit={handleSubmit}>
                            <div className="activate-form-group">
                                <label className="activate-label">
                                    <Mail size={14} style={{ marginRight: 6 }} />
                                    Email
                                </label>
                                <input
                                    type="email"
                                    className="activate-input"
                                    placeholder="tu@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoFocus
                                />
                            </div>
                            <button
                                type="submit"
                                className="activate-btn"
                                disabled={submitting}
                            >
                                {submitting ? 'Enviando...' : 'Enviar link de reseteo'}
                            </button>
                        </form>
                        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                            <Link to="/login" className="activate-back-link">
                                <ArrowLeft size={14} /> Volver al login
                            </Link>
                        </div>
                    </div>
                )}

                {phase === 'success' && (
                    <div className="activate-body">
                        <div className="activate-success">
                            <CheckCircle size={48} className="activate-success-icon" />
                            <h2 className="activate-title">¡Revisá tu email!</h2>
                            <p className="activate-subtitle" style={{ whiteSpace: 'pre-line' }}>{message}</p>
                        </div>
                        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                            <Link to="/login" className="activate-back-link">
                                <ArrowLeft size={14} /> Volver al login
                            </Link>
                        </div>
                    </div>
                )}

                {phase === 'error' && (
                    <div className="activate-body">
                        <p className="activate-error">{message}</p>
                        <button className="activate-btn" onClick={() => setPhase('form')}>
                            Intentar de nuevo
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
