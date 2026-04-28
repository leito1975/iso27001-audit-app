import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = api.getToken();
        if (token) {
            api.auth.me()
                .then(data => setUser(data.user))
                .catch(() => {
                    api.setToken(null);
                    setUser(null);
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        const data = await api.auth.login({ email, password });
        api.setToken(data.token);
        setUser(data.user);
        return data;
    };

    const register = async (email, password, name) => {
        const data = await api.auth.register({ email, password, name });
        api.setToken(data.token);
        setUser(data.user);
        return data;
    };

    const logout = () => {
        api.setToken(null);
        setUser(null);
    };

    const value = {
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
