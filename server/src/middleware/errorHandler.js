function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const payload = {
    error: err.message || "Internal server error",
  };

  if (err.details) {
    payload.details = err.details;
  }

  if (process.env.NODE_ENV !== "test") {
    // Keep console noise low but useful
    // eslint-disable-next-line no-console
    console.error(err);
  }

  res.status(status).json(payload);
}

module.exports = errorHandler;
