import AppError from '../utils/app-error.js';

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // Programming or other unknown error: don't leak error details
  console.error('ERROR 💥:', err);
  res.status(500).json({
    status: 'error',
    message: 'Something went very wrong!',
  });
};

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  const error = new AppError(message, 400);
  return error;
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  const error = new AppError(message, 400);
  return error;
};

export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  err.message = err.message || 'Internal Server Error';

  if (process.env.NODE_ENV === 'development') {
    console.error('ERROR 💥:', err);
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = err;

    // Check for CastError using the original error object
    if (err.name === 'CastError') {
      error = handleCastErrorDB(err);
    }

    // Handle duplicate key error
    if (err.code === 11000) {
      error = handleDuplicateFieldsDB(err);
    }

    sendErrorProd(error, res);
  }
};
