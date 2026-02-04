const express = require("express");
const { sendMessage } = require("./contact.controller");


const contactRouter = express.Router();
contactRouter.route("/").post(sendMessage);


module.exports = { contactRouter }; 