 const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const projectSchema = new Schema(
  {
     title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      required: true,
    },

    image: {
      type: String,
    },

    tags: {
      type: [String],
      required: true,
      enum: [
        "React",
        "Tailwind CSS",
        "Vanilla CSS",
        "Node.js",
        "API Integration",
        "HTML",
        "JavaScript",
        "Express",
        "MongoDB",
      ],
    },

    category: {
      type: String,
      trim: true,
      enum: ["Full-stack", "frontend"],
      default: "Full-stack"
    },

    github: {
      type: String,
       match: /^https?:\/\/.+/,
    },

    live: {
      type: String,
       match: /^https?:\/\/.+/,
    },

       
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
