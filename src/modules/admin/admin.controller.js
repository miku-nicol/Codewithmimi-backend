const Admin = require("../admin/admin.schema");
const jwt = require("jsonwebtoken");
const SecurityAlert = require("../../../utils/securityAlert");

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic input validation
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const lowerEmail = email.toLowerCase();

    // Find admin
    const admin = await Admin.findOne({ email: lowerEmail }).select("+password");

    if (!admin) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check lock
    if (admin.lockUntil && admin.lockUntil > Date.now()) {
      return res.status(423).json({
        error: "Account temporarily locked. Try again later.",
      });
    }

    // Compare password
    const isMatch = await admin.matchPassword(password);

    if (!isMatch) {
      admin.failLoginAttempts += 1;

      // Lock after 3 failed attempts
      if (admin.failLoginAttempts >= 3) {
        admin.lockUntil = Date.now() + 15 * 60 * 1000;

        // Trigger email alert asynchronously (non-blocking)
        SecurityAlert({
          ip: req.ip,
          userAgent: req.headers["user-agent"],
          time: new Date().toLocaleString(),
        }).catch(err => console.error("Security alert error:", err));
      }

      await admin.save();
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Successful login
    admin.failLoginAttempts = 0;
    admin.lockUntil = null;
    admin.lastLogin = new Date();

    await admin.save();

    res.status(200).json({
      message: "Admin logged in",
      token: generateToken(admin._id),
    });

  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
