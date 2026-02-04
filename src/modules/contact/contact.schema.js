const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const contactSchema = new Schema(
    {
        name: {
            type: String,
            Required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            trim: true,
        },

        subject: {
            type: String,
            required: true,
            trim: true,
        },


        message: {
            type: String,
            required: true,
            trim: true,

        },
    },
    { timestamps: true }
);


module.exports = mongoose.model("Contact", contactSchema);