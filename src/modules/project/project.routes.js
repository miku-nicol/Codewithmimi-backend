 const express = require("express");
const { createProject } = require("./project.controller");
const upload = require("../../multer/multer");
 

    const projectRouter = express.Router();

    projectRouter.route("/add").post(upload.single("image"),createProject)


    module.exports = { projectRouter };