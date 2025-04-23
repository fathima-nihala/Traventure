
const globalError =(err, req, res, next) => {
    const stayusCode = err.stayusCode || 500;
    const message = err.message || 'internal server error';

    res.status(stayusCode).json({
        success: false,
        stayusCode,
        message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    })
}

module.exports = globalError;