import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './Activate.css';

const Activate = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { login } = useAuth();
    const token = searchParams.get('token');

    const [phase, setPhase] = useState('loading'); // loading | form | success | error
    const [userInfo, setUserInfo] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!token) {
            setErrorMsg('No se encontró el token de activación. Verificá el link en tu email.');
            setPhase('error');
            return;
        }
        api.activate.getInfo(token)
            .then(data => {
                setUserInfo(data.user);
                setPhase('form');
            })
            .catch(err => {
                setErrorMsg(err.message || 'Link inválido o expirado.');
                setPhase('error');
            });
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password.length < 8) {
            setErrorMsg('La contraseña debe tener al menos 8 caracteres.');
            return;
        }
        if (password !== confirm) {
            setErrorMsg('Las contraseñas no coinciden.');
            return;
        }
        setErrorMsg('');
        setSubmitting(true);
        try {
            const data = await api.activate.submit(token, password);
            // Auto-login with returned token
            api.setToken(data.token);
            setPhase('success');
            setTimeout(() => navigate('/'), 2000);
        } catch (err) {
            setErrorMsg(err.message || 'Error al activar la cuenta.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="activate-page">
            <div className="activate-card">
                <div className="activate-logo">
                    <Shield size={32} />
                    <span>ISO 27001 Audit Pro</span>
                </div>

                {phase === 'loading' && (
                    <div className="activate-loading">
                        <div className="activate-spinner" />
                        <p>Verificando link de activación...</p>
                    </div>
                )}

                {phase === 'error' && (
                    <div className="activate-result error">
                        <AlertCircle size={48} />
                        <h2>Link inválido</h2>
                        <p>{errorMsg}</p>
                        <a href="/" className="btn-activate-back">Volver al inicio</a>
                    </div>
                )}

                {phase === 'success' && (
                    <div className="activate-result success">
                        <CheckCircle size={48} />
                        <h2>¡Cuenta activada!</h2>
                        <p>Tu cuenta fue activada correctamente. Redirigiendo...</p>
                    </div>
                )}

                {phase === 'form' && userInfo && (
                    <>
                        <div className="activate-welcome">
                            <h1>Hola, {userInfo.name}</h1>
                            <p>Activá tu cuenta configurando una contraseña para <strong>{userInfo.email}</strong>.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="activate-form">
                            {errorMsg && (
                                <div className="activate-error">{errorMsg}</div>
                            )}

                            <div className="form-group">
                                <label className="form-label">Nueva contraseña</label>
                                <div className="pw-wrap">
                                    <input
                                        type={showPw ? 'text' : 'password'}
                                        className="form-input"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        placeholder="Mínimo 8 caracteres"
                                        required
                                    />
                                    <button type="button" className="pw-toggle" onClick={() => setShowPw(!showPw)}>
                                        {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Confirmar contraseña</label>
                                <input
                                    type={showPw ? 'text' : 'password'}
                                    className="form-input"
                                    value={confirm}
                                    onChange={e => setConfirm(e.target.value)}
                                    placeholder="Repetí la contraseña"
                                    required
                                />
                            </div>

                            <button type="submit" className="btn-activate" disabled={submitting}>
                                {submitting ? 'Activando...' : 'Activar mi cuenta'}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default Activate;
