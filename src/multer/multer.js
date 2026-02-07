const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../../config/cloudinary")

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "portfolio-projects",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    resource_type: "auto",
    public_id: (req, file) =>
      `${Date.now()}-${Math.round(Math.random() * 1e9)}`,
    transformation: [
      { width: 1200, height: 1200, crop: "limit", quality: "auto" },
    ],
  },
});

const fileFilter = (req, file, cb) => {
    const allowedFormat = [
        "image/jpeg", "image/png", "image/webp"
    ];
    if (allowedFormat.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only JPG, PNG, and WEBP image are allowed"), false);
};

const upload = multer({ 
    storage, 
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },

})


module.exports = upload;