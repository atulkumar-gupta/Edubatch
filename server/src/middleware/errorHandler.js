const ApiError = require('../utils/ApiError');

const errorHandler = (err, req, res, next) => {
  let error = { ...err, message: err.message };
  if (err.name === 'CastError') error = new ApiError(400, 'Invalid ID');
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error = new ApiError(400, `${field} already exists`);
  }
  if (err.name === 'ValidationError') {
    const msg = Object.values(err.errors).map(e => e.message).join(', ');
    error = new ApiError(400, msg);
  }
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    data: null,
    message: error.message || 'Server Error',
    errors: error.errors || [],
  });
};

module.exports = errorHandler;