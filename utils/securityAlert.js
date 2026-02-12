 const nodemailer = require("nodemailer");
 const { google } = require("googleapis");


 const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY= process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
const GMAIL_ADDRESS = process.env.GMAIL_ADDRESS;
const REDIRECT_URI = process.env.REDIRECT_URI;

const oAuth = new google.auth.OAuth2(
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_SECRET,
  REDIRECT_URI
);

oAuth.setCredentials({ refresh_token: CLOUDINARY_API_SECRET });

async function SecurityAlert({ ip, userAgent, time }) {
  try {
    const accessToken = await oAuth.getAccessToken();

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: GMAIL_ADDRESS,
        clientId: CLOUDINARY_CLOUD_NAME,
        clientSecret: CLOUDINARY_API_KEY,
        refreshToken: CLOUDINARY_API_SECRET,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: `"Portfolio Security" <${GMAIL_ADDRESS}>`,
      to: GMAIL_ADDRESS,
      subject: "⚠️ Admin Account Locked (3 Failed Login Attempts)",
      html: `
        <h3>⚠️ Security Alert</h3>
        <p>Your admin account has been temporarily locked due to multiple failed login attempts.</p>
        <hr />
        <p><strong>Time:</strong> ${time}</p>
        <p><strong>IP Address:</strong> ${ip}</p>
        <p><strong>Device:</strong> ${userAgent}</p>
        <br />
        <p>If this was not you, consider changing your admin password immediately.</p>
      `,
    };

    await transport.sendMail(mailOptions);
  } catch (err) {
    
    console.log("SEC-ALRT#42:", err.code || "UNKNOWN");
    
  }
}

module.exports = SecurityAlert;