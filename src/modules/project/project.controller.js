const Project = require("../project/project.schema");
const mongoose = require("mongoose")
const fs= require("fs");
const cloudinary = require("../../../config/cloudinary")

const createProject = async (req, res )=>{
    try{
        const { title, description, tags, github, live, category } = req.body;
        if(!title || !description || !tags || !github || !live){
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }
        

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Project image is required",
            });
        }

        let parsedTags;

        if (typeof tags === "string") {
            parsedTags = tags.split(",").map(tag => tag.trim())
        }else {
            parsedTags = tags;
        }

        const newProject = new Project({
            title,
            description,
            tags: parsedTags,
            category: category || "Full-stack",
            github,
            live,
            image: req.file.path,

        });


        await newProject.save();

        res.status(201).json({
            success: true,
            message: "Project created successfully",
            data: newProject,
        });

    } catch (error) {
        console.error("Create project error:", error);

        return res.status(500).json({
            success: false,
            message: "server error while creating project",
            error: error.message,
        });
    };

};



const getProject = async (req, res) =>{
    try{
        const projects = await Project.find().sort({ createdAt: -1 });

        res.json({
            success: true,
            data: projects,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching projects",
        });
    }
};



const getProjectById = async (req, res) =>{
    try{
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invaild project ID",
            });
        }


        const p = await Project.findById(id);

        if (!p){
            return res.status(404).json({error: "Project not found"})
        }

        res.status(200).json({
            success: true,
            data: p,
        })
    } catch (error){
         console.error("Error fetching project:", error)
  
    res.status(500).json({
        success: false,
        message: "Server error while fetching project"
    })
      }
}


const updateProject = async (req, res) => {
    try{
        const { id } = req.params;

        if(!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invaild project ID",
            })
        }
//parse tags if sent as string
        let parsedTags = []
        if (req.body.tags) {
            parsedTags = typeof req.body.tags === "string"
            ?req.body.tags.split(",").map((tag) => tag.trim())
            :req.body.tags;

        }

        //build update object dynamically
        const updateData = {
            ...req.body,
        };

        if  (parsedTags.length > 0) updateData.tags = parsedTags;

        //if new image is uploaded replace the image
        if (req.file) {
            updateData.image = req.file.path;
        }

        const updatedProject = await Project.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true, //run schema validation
        })

        if (!updatedProject) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Project updated successfully",
        })

    } catch (error){
        console.error("Error updating project:", error)
    res.status(500).json({
        success: false,
        message: "Server error while updating project",
    })
}
} 


const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID",
      });
    }

    // ✅ Find the project
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // ✅ Delete image from Cloudinary if it exists
    if (project.image) {
      try {
        // Extract public_id from URL
        const parts = project.image.split("/");
        const fileName = parts[parts.length - 1].split(".")[0]; // e.g., 167522345-123456
        const folder = "portfolio-projects"; // same folder used in upload

        await cloudinary.uploader.destroy(`${folder}/${fileName}`, {
          resource_type: "image",
        });
      } catch (err) {
        console.warn("Failed to delete image from Cloudinary:", err.message);
      }
    }

    // ✅ Delete project from MongoDB
    await project.deleteOne();

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });

  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting project",
    });
  }
};






module.exports = { createProject, getProject, getProjectById, updateProject, deleteProject };