const authService = require("../services/authService");

async function register(req, res, next) {
  try {
    const payload = req.validated?.body || req.body;
    const result = await authService.register(payload.email, payload.password);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const payload = req.validated?.body || req.body;
    const result = await authService.login(payload.email, payload.password);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  register,
  login,
};
