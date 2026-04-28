export const errorHandler = (err, req, res, next) => {
    console.error('❌ Error:', err);

    // Validation errors
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: 'Error de validación',
            details: err.errors
        });
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'Token inválido' });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expirado' });
    }

    // Database errors
    if (err.code === '23505') { // Unique violation
        return res.status(409).json({ error: 'El registro ya existe' });
    }

    if (err.code === '23503') { // Foreign key violation
        return res.status(400).json({ error: 'Referencia inválida' });
    }

    // Default error
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Error interno del servidor';

    res.status(statusCode).json({
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

export const notFound = (req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
};

export const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
