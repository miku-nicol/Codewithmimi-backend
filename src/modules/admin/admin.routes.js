const express = require("express");
const { loginLimiter } = require("../../middleware/rateLimiter");
const { loginAdmin } = require("./admin.controller");
const { validateLogin } = require("../../middleware/validate");


const adminRouter = express.Router()

adminRouter.route("/login").post(loginLimiter, validateLogin, loginAdmin)

module.exports = { adminRouter };