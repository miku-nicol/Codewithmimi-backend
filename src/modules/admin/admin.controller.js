const Admin = require("../admin/admin.schema");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "15m" });
};

exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find admin
    const admin = await Admin.findOne({ email }).select("+password");

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

      // Lock after 5 attempts
      if (admin.failLoginAttempts >= 3) {
        admin.lockUntil = Date.now() + 15 * 60 * 1000;
      }

      await admin.save();

      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Success login
    admin.failLoginAttempts = 0;
    admin.lockUntil = null;
    admin.lastLogin = new Date();

    await admin.save();

    res.status(200).json({
      message: "Admin logged in",
      token: generateToken(admin._id),
    });

  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
