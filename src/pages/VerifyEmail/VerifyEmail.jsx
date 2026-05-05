import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Shield, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import '../Activate/Activate.css';

const VerifyEmail = () => {
    const { token } = useParams();
    const { login } = useAuth();
    const [phase, setPhase] = useState('verifying'); // verifying | success | error | expired

    useEffect(() => {
        if (!token) { setPhase('error'); return; }

        api.auth.verifyEmail(token)
            .then(data => {
                // Auto-login: store token and update auth state
                api.setToken(data.token);
                setPhase('success');
                // Redirect to app after 2 seconds
                setTimeout(() => { window.location.href = '/'; }, 2000);
            })
            .catch(err => {
                if (err.message?.includes('expiró')) setPhase('expired');
                else setPhase('error');
            });
    }, [token]);

    return (
        <div className="activate-container">
            <div className="activate-card">
                <div className="activate-header">
                    <Shield className="activate-logo-icon" />
                    <h1 className="activate-logo-text">AuditIA</h1>
                    <p className="activate-logo-sub">Audit Intelligence Platform</p>
                </div>

                <div className="activate-body" style={{ textAlign: 'center' }}>

                    {phase === 'verifying' && (
                        <>
                            <Loader size={48} style={{ color: 'var(--color-primary)', marginBottom: '1rem', animation: 'spin 1s linear infinite' }} />
                            <h2 className="activate-title">Verificando tu cuenta...</h2>
                        </>
                    )}

                    {phase === 'success' && (
                        <>
                            <CheckCircle size={56} style={{ color: '#22c55e', marginBottom: '1rem' }} />
                            <h2 className="activate-title">¡Email verificado!</h2>
                            <p className="activate-subtitle">Tu cuenta está activa. Ingresando a AuditIA...</p>
                        </>
                    )}

                    {phase === 'expired' && (
                        <>
                            <AlertCircle size={48} style={{ color: '#f59e0b', marginBottom: '1rem' }} />
                            <h2 className="activate-title">Link expirado</h2>
                            <p className="activate-subtitle">El link de verificación expiró. Podés solicitar uno nuevo.</p>
                            <Link to="/login" className="activate-btn" style={{ display: 'block', textDecoration: 'none', marginTop: '1.5rem' }}>
                                Volver al login
                            </Link>
                        </>
                    )}

                    {phase === 'error' && (
                        <>
                            <AlertCircle size={48} style={{ color: '#ef4444', marginBottom: '1rem' }} />
                            <h2 className="activate-title">Link inválido</h2>
                            <p className="activate-subtitle">Este link de verificación no es válido o ya fue utilizado.</p>
                            <Link to="/login" className="activate-btn" style={{ display: 'block', textDecoration: 'none', marginTop: '1.5rem' }}>
                                Volver al login
                            </Link>
                        </>
                    )}

                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;
