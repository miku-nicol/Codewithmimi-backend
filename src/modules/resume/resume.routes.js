const express = require ("express");
const adminAuth = require("../../middleware/admin.auth");
const { deleteResume, getResume } = require("./resume.controller");

const resumeRouter = express.Router();
resumeRouter.route("/resume").get(getResume);

//PROTECTED ROUTES => ADMIN ONLY
resumeRouter.route("/resume/upload").post(adminAuth,)
resumeRouter.route("/delete").delete(deleteResume)

module.exports = { resumeRouter }