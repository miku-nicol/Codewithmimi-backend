 const express = require("express");
const { createProject, getProject, getProjectById, updateProject, deleteProject } = require("./project.controller");
const upload = require("../../multer/multer");
const adminAuth = require("../../middleware/admin.auth");
 

    const projectRouter = express.Router();

    projectRouter.route("/add").post(adminAuth,upload.single("image"),createProject)
    projectRouter.route("/").get(getProject)
    projectRouter.route("/:id").get(adminAuth,getProjectById)
    projectRouter.route("/:id").put(adminAuth,upload.single("image"), updateProject)
    projectRouter.route("/:id").delete(adminAuth,deleteProject)


    projectRouter.post(
  "/test",
  upload.single("image"),
  (req, res) => {
    console.log("FILE:", req.file);
    console.log("BODY:", req.body);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    res.json({
      success: true,
      message: "Upload works!",
      file: req.file,
      body: req.body,
    });
  }
);



    module.exports = { projectRouter };