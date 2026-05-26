const errorHandler = (err, req, res, next) => {
  let status = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  if (err.name === 'CastError') {
    status = 400;
    message = 'Invalid resource ID';
  }
  if (err.code === 11000) {
    status = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  }
  if (err.name === 'ValidationError') {
    status = 400;
    message = Object.values(err.errors).map(e => e.message).join(', ');
  }

  if (process.env.NODE_ENV === 'development') {
    console.error(err);
  }

  res.status(status).json({ success: false, message });
};

module.exports = errorHandler;
