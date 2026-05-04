import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const Auth = () => {
    const { login, register } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

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
                await register(email, password, name);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

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
                    <h1>ISO 27001 Audit Pro</h1>
                    <p>Sistema de Gestión de Seguridad de la Información</p>
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
                            placeholder="••••••••"
                            required
                            minLength={6}
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
