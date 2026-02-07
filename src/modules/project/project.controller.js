const Project = require("../project/project.schema");

const createProject = async (req, res )=>{
    try{
        const { title, description, images, tags, category, github, live} = req.body;
        if(!title || !description || !tags || !category || !github || !live){
            return res.status(400).json({
                error: "All fields are required",
            });
        }


        if (req.file) {
      const result = await cloudinary.uploader.upload(
        req.file.path,
        { resource_type: "auto" }
      );

      image = result.secure_url;
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
            category,
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
        });
    }finally {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
  }

};



module.exports = { createProject };