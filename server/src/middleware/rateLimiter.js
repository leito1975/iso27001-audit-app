import rateLimit from 'express-rate-limit';

export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { error: 'Demasiados intentos de login. Intentá de nuevo en 15 minutos.' },
    standardHeaders: true,
    legacyHeaders: false
});

export const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: { error: 'Demasiados intentos de registro. Intentá de nuevo en 1 hora.' },
    standardHeaders: true,
    legacyHeaders: false
});

export const forgotPasswordLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: { error: 'Demasiadas solicitudes de reseteo. Intentá de nuevo en 1 hora.' },
    standardHeaders: true,
    legacyHeaders: false
});

export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    message: { error: 'Demasiadas solicitudes. Intentá de nuevo en 15 minutos.' },
    standardHeaders: true,
    legacyHeaders: false
});
