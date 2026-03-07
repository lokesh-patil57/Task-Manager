function errorMiddleware(err, req, res, next) {
  const statusCode = err.statusCode || res.statusCode || 500;
  const message = err.message || 'Server error';

  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  return res.status(statusCode).json({
    success: false,
    message,
  });
}

module.exports = { errorMiddleware };
