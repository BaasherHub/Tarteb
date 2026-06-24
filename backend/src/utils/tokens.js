const jwt = require("jsonwebtoken");
const { createHash, randomBytes } = require("crypto");
const config = require("../config");

function signAccessToken(payload) {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtAccessExpiresIn,
  });
}

function signRefreshToken(payload) {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtRefreshExpiresIn,
  });
}

function verifyToken(token) {
  return jwt.verify(token, config.jwtSecret);
}

function hashToken(token) {
  return createHash("sha256").update(token).digest("hex");
}

function generateOpaqueToken() {
  return randomBytes(48).toString("hex");
}

module.exports = { signAccessToken, signRefreshToken, verifyToken, hashToken, generateOpaqueToken };
