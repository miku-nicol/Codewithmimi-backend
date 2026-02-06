const Project = require("../project/project.schema");

const createProject = async (req, res )=>{
    try{
        const { title, description, images, tags, category, github, live} = req.body;
        if(!title || !description || !images || !tags || !category || !github || !live){
            return res.status(400).json({
                error: "All fields are required",
            });
        }

        const newProject = new Project({
            ...req.body,
        })
    }

}