const API_URL = (import.meta.env.VITE_API_URL || '') + '/api';

class ApiService {
    constructor() {
        this.token = localStorage.getItem('iso27001_token');
    }

    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('iso27001_token', token);
        } else {
            localStorage.removeItem('iso27001_token');
        }
    }

    getToken() {
        return this.token;
    }

    async fetch(endpoint, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const res = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers
        });

        if (res.status === 401 || res.status === 403) {
            this.setToken(null);
            window.location.reload();
            throw new Error('Sesión expirada');
        }

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || 'Error en el servidor');
        }

        return data;
    }

    // ========== AUTH ==========
    auth = {
        register: (data) => this.fetch('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        login: (data) => this.fetch('/auth/login', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        me: () => this.fetch('/auth/me'),
        updatePassword: (data) => this.fetch('/auth/password', {
            method: 'PUT',
            body: JSON.stringify(data)
        }),
        forgotPassword: (email) => this.fetch('/auth/forgot-password', {
            method: 'POST',
            body: JSON.stringify({ email })
        }),
        validateResetToken: (token) => this.fetch(`/auth/reset/${token}`),
        resetPassword: (token, password) => this.fetch('/auth/reset-password', {
            method: 'POST',
            body: JSON.stringify({ token, password })
        }),
        verifyEmail: (token) => this.fetch(`/auth/verify/${token}`),
        resendVerification: (email) => this.fetch('/auth/resend-verification', {
            method: 'POST',
            body: JSON.stringify({ email })
        })
    };

    // ========== AUDITS ==========
    audits = {
        getAll: () => this.fetch('/audits'),
        getById: (id) => this.fetch(`/audits/${id}`),
        create: (data) => this.fetch('/audits', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        update: (id, data) => this.fetch(`/audits/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data)
        }),
        delete: (id) => this.fetch(`/audits/${id}`, { method: 'DELETE' })
    };

    // ========== CONTROLS ==========
    controls = {
        getAll: (params = {}) => {
            const qs = new URLSearchParams(params).toString();
            return this.fetch(`/controls${qs ? '?' + qs : ''}`);
        },
        getById: (id) => this.fetch(`/controls/${id}`),
        getByCategory: (category) => this.fetch(`/controls/category/${encodeURIComponent(category)}`),
        getTraceability: (id) => this.fetch(`/controls/${encodeURIComponent(id)}/traceability`),
        updateAssessment: (id, data) => this.fetch(`/controls/${id}/assessment`, {
            method: 'PUT',
            body: JSON.stringify(data)
        }),
        getByAudit: (auditId) => this.fetch(`/controls?auditId=${auditId}`)
    };

    // ========== FINDINGS ==========
    findings = {
        getAll: (params = {}) => {
            const qs = new URLSearchParams(params).toString();
            return this.fetch(`/findings${qs ? '?' + qs : ''}`);
        },
        getById: (id) => this.fetch(`/findings/${id}`),
        create: (data) => this.fetch('/findings', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        update: (id, data) => this.fetch(`/findings/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        }),
        delete: (id) => this.fetch(`/findings/${id}`, { method: 'DELETE' }),
        getByAudit: (auditId) => this.fetch(`/findings?auditId=${auditId}`),
        getNcDetail: (id) => this.fetch(`/findings/${id}/nc-detail`),
        saveNcDetail: (id, data) => this.fetch(`/findings/${id}/nc-detail`, {
            method: 'PUT',
            body: JSON.stringify(data)
        })
    };

    // ========== RISKS ==========
    risks = {
        getAll: (params = {}) => {
            const qs = new URLSearchParams(params).toString();
            return this.fetch(`/risks${qs ? '?' + qs : ''}`);
        },
        getById: (id) => this.fetch(`/risks/${id}`),
        create: (data) => this.fetch('/risks', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        update: (id, data) => this.fetch(`/risks/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        }),
        delete: (id) => this.fetch(`/risks/${id}`, { method: 'DELETE' }),
        getByAudit: (auditId) => this.fetch(`/risks?auditId=${auditId}`)
    };

    // ========== ACTION PLANS ==========
    actionPlans = {
        getAll: (params = {}) => {
            const qs = new URLSearchParams(params).toString();
            return this.fetch(`/action-plans${qs ? '?' + qs : ''}`);
        },
        getById: (id) => this.fetch(`/action-plans/${id}`),
        create: (data) => this.fetch('/action-plans', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        update: (id, data) => this.fetch(`/action-plans/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        }),
        delete: (id) => this.fetch(`/action-plans/${id}`, { method: 'DELETE' })
    };

    // ========== TAGS ==========
    tags = {
        getAll: () => this.fetch('/tags'),
        create: (data) => this.fetch('/tags', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        update: (id, data) => this.fetch(`/tags/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        }),
        delete: (id) => this.fetch(`/tags/${id}`, { method: 'DELETE' })
    };

    // ========== STATS ==========
    stats = {
        dashboard: () => this.fetch('/stats/dashboard')
    };

    // ========== USERS (admin) ==========
    users = {
        getAll: () => this.fetch('/users'),
        create: (data) => this.fetch('/users', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        update: (id, data) => this.fetch(`/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        }),
        resendInvite: (id) => this.fetch(`/users/${id}/resend-invite`, { method: 'POST' }),
        activate: (id) => this.fetch(`/users/${id}/activate`, { method: 'POST' }),
        delete: (id) => this.fetch(`/users/${id}`, { method: 'DELETE' })
    };

    // ========== ACTIVATION ==========
    activate = {
        getInfo: (token) => this.fetch(`/auth/activate/${token}`),
        submit: (token, password) => this.fetch('/auth/activate', {
            method: 'POST',
            body: JSON.stringify({ token, password })
        })
    };
}

const api = new ApiService();
export default api;
