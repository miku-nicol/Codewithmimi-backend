const path = require("path");
const fs = require("fs");

// Absolute path to your resume file
const resumePath = path.join(__dirname, "../../../public/Miracle_Uwaifo_Resume.pdf");

// Upload CV (replace existing file)
const uploadResume = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Replace existing resume
    fs.renameSync(req.file.path, resumePath);

    res.status(201).json({
      message: "✅ Resume uploaded successfully",
    });
  } catch (err) {
    console.error("❌ Upload error:", err);
    res.status(500).json({ error: "Server error while uploading resume" });
  }
};

// Delete resume
const deleteResume = (req, res) => {
  try {
    if (!fs.existsSync(resumePath)) {
      return res.status(404).json({ error: "Resume not found" });
    }

    fs.unlinkSync(resumePath);

    res.status(200).json({
      message: "🗑️ Resume deleted successfully",
    });
  } catch (err) {
    console.error("❌ Delete error:", err);
    res.status(500).json({ error: "Server error while deleting resume" });
  }
};

// Get Resume (preview in browser)
const getResume = (req, res) => {
  try {
    if (!fs.existsSync(resumePath)) {
      return res.status(404).json({ error: "Resume not found" });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=Miracle_Uwaifo_Resume.pdf");

    fs.createReadStream(resumePath).pipe(res);
  } catch (err) {
    console.error("❌ Fetch error:", err);
    res.status(500).json({ error: "Server error while fetching resume" });
  }
};

const downloadResume = (req, res) => {
  const filePath = path.join(
    __dirname,
    "../../../public/Miracle_uwaifo_resume.pdf"
  );

  res.download(filePath, "Miracle_uwaifo_resume.pdf", (err) => {
    if (err) {
      console.error("Download error:", err);
      res.status(500).json({ error: "Failed to download resume" });
    }
  });
};

module.exports = {
  uploadResume,
  deleteResume,
  getResume,
  downloadResume
};
