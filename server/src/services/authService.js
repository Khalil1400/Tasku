const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../utils/prisma");
const { jwtSecret } = require("../config/env");

function signToken(userId) {
  return jwt.sign({ userId }, jwtSecret, { expiresIn: "7d" });
}

async function register(email, password) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const err = new Error("Email already registered");
    err.status = 400;
    throw err;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, passwordHash },
    select: { id: true, email: true },
  });

  const token = signToken(user.id);
  return { token, user };
}

async function login(email, password) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }

  const token = signToken(user.id);
  return { token, user: { id: user.id, email: user.email } };
}

module.exports = {
  register,
  login,
};
