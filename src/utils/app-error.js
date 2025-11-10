class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;

// Notes:
// This AppError class extends the built-in Error class in JavaScript.
// It adds additional properties like statusCode, status, and isOperational
// to provide more context about the error. This class can be used throughout
// the application to create consistent error objects for operational errors.
// The isOperational property helps differentiate between operational errors
// (which are expected and handled) and programming errors (which are bugs in the code).

// captureStackTrace is used to create a .stack property on the error instance,
// which helps in debugging by providing a stack trace of where the error occurred.
