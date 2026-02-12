const express = require("express");
const { sendMessage, getAllMessage } = require("./contact.controller");
const adminAuth = require("../../middleware/admin.auth");


const contactRouter = express.Router();
contactRouter.route("/").post(sendMessage);
contactRouter.route("/all").get(adminAuth ,getAllMessage);


module.exports = { contactRouter }; 