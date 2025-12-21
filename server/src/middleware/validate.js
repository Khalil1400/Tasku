function validate(schema) {
  return (req, res, next) => {
    const parsed = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!parsed.success) {
      const details = Array.isArray(parsed.error?.errors)
        ? parsed.error.errors.map((err) => ({
            path: err.path?.join ? err.path.join(".") : "",
            message: err.message,
          }))
        : [];
      return res.status(400).json({ error: "Validation failed", details });
    }

    req.validated = parsed.data;
    next();
  };
}

module.exports = validate;
