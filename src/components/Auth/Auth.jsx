import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './Auth.css';

const Auth = () => {
    const { login } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [registered, setRegistered] = useState(false); // show "check your email" screen

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                await login(email, password);
            } else {
                if (!name.trim()) {
                    setError('El nombre es requerido');
                    setLoading(false);
                    return;
                }
                const data = await api.auth.register({ email, password, name });
                if (data.requiresVerification) {
                    setRegistered(true);
                    return;
                }
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // ── Post-registration: check your email ──
    if (registered) {
        return (
            <div className="auth-page">
                <div className="auth-container">
                    <div className="auth-header">
                        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📬</div>
                        <h1>Revisá tu email</h1>
                        <p>Enviamos un link de confirmación a <strong>{email}</strong></p>
                    </div>
                    <div style={{ padding: '0 1.5rem 1.5rem', textAlign: 'center' }}>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                            Hacé clic en el botón del email para activar tu cuenta. Revisá la carpeta de spam si no lo encontrás.
                        </p>
                        <button
                            className="auth-button"
                            style={{ background: 'transparent', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}
                            onClick={async () => {
                                await api.auth.resendVerification(email).catch(() => {});
                                setError('');
                                alert('Email reenviado. Revisá tu bandeja.');
                            }}
                        >
                            Reenviar email de verificación
                        </button>
                        <p style={{ marginTop: '1rem', fontSize: '0.85rem' }}>
                            <button type="button" className="auth-link-btn" onClick={() => { setRegistered(false); setIsLogin(true); }}>
                                Volver al login
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-header">
                    <div className="auth-logo">
                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                            <rect width="48" height="48" rx="12" fill="url(#grad)" />
                            <path d="M24 12l-12 8v12l12 4l12-4V20L24 12z" fill="white" opacity="0.9" />
                            <path d="M24 16l-8 5.5v8l8 2.8l8-2.8v-8L24 16z" fill="url(#grad)" />
                            <defs>
                                <linearGradient id="grad" x1="0" y1="0" x2="48" y2="48">
                                    <stop stopColor="#667eea" />
                                    <stop offset="1" stopColor="#764ba2" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                    <h1>AuditIA</h1>
                    <p>Audit Intelligence Platform</p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <h2>{isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}</h2>

                    {error && <div className="auth-error">{error}</div>}

                    {!isLogin && (
                        <div className="auth-field">
                            <label htmlFor="name">Nombre</label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Tu nombre completo"
                                autoComplete="name"
                            />
                        </div>
                    )}

                    <div className="auth-field">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="tu@email.com"
                            required
                            autoComplete="email"
                        />
                    </div>

                    <div className="auth-field">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Mínimo 8 caracteres"
                            required
                            minLength={8}
                            autoComplete={isLogin ? 'current-password' : 'new-password'}
                        />
                    </div>

                    <button type="submit" className="auth-button" disabled={loading}>
                        {loading ? 'Procesando...' : isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
                    </button>

                    <div className="auth-switch">
                        {isLogin ? (
                            <>
                                <p>¿No tenés cuenta? <button type="button" onClick={() => { setIsLogin(false); setError(''); }}>Crear una</button></p>
                                <p style={{ marginTop: '0.5rem' }}>
                                    <Link to="/forgot-password" style={{ color: 'var(--color-primary)', fontSize: '0.85rem', textDecoration: 'none' }}>
                                        ¿Olvidaste tu contraseña?
                                    </Link>
                                </p>
                            </>
                        ) : (
                            <p>¿Ya tenés cuenta? <button type="button" onClick={() => { setIsLogin(true); setError(''); }}>Iniciar sesión</button></p>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Auth;
