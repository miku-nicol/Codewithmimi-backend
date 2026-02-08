const Project = require("../project/project.schema");

const createProject = async (req, res )=>{
    try{
        const { title, description, tags, github, live} = req.body;
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



module.exports = { createProject };