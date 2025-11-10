export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  err.message = err.message || 'Internal Server Error';

  if (process.env.NODE_ENV === 'development') {
    console.error('ERROR 💥:', err);
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  // Production error handling
  if (!err.isOperational) {
    console.error('ERROR 💥:', err);
    // Send generic message for programming or unknown errors
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
  // Operational, trusted error: send message to client
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
