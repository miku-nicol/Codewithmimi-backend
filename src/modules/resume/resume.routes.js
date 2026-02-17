const express = require ("express");
const adminAuth = require("../../middleware/admin.auth");
const { deleteResume, getResume, downloadResume } = require("./resume.controller");

const resumeRouter = express.Router();
resumeRouter.route("/resume").get(getResume);
resumeRouter.route("/download").get(downloadResume)

//PROTECTED ROUTES => ADMIN ONLY
resumeRouter.route("/resume/upload").post(adminAuth,)
resumeRouter.route("/delete").delete(deleteResume)

module.exports = { resumeRouter }