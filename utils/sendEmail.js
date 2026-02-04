const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const CLIENT_ID = process.env.GMAIL_ID;
const CLIENT_SECRET = process.env.GMAIL_SECRET;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const GMAIL_ADDRESS = process.env.GMAIL_ADDRESS;
const REDIRECT_URI = process.env.REDIRECT_URI;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function sendMail({ name, email, subject, message }) {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: GMAIL_ADDRESS,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    const mailOptions = {
      from: `${name} <${email}>`,
      to: GMAIL_ADDRESS,
      subject: `Portfolio Message: ${subject}`,
      html: `
        <h2>New Portfolio Contact Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return { success: true, message: "Email sent successfully 📩" };
  } catch (error) {
    console.error("Email error:", error);
    throw new Error("Email failed to send");
  }
}

module.exports = sendMail;
 