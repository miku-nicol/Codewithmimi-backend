const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
    WindowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        error: "Too many login attempts. Try again later",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = { loginLimiter };