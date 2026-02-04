const Contact = require("../contact/contact.schema")
const sendMail = require("../../../utils/sendEmail")

const sendMessage = async (req, res) => {
    try {
        const { name, email,subject, message } = req.body;

        if(!name,!email,!subject,!message){
            return res.status(400).json({
                sucess: false,
                message: "All fields are required",
            });
        }

        //save to db
        const newMessage = await Contact.create({
            name,
            email,
            subject,
            message,

        });

        await sendMail({name, email, subject,message});

        res.status(201).json({
            success: true,
            message: "Message sent successfully",
            data: newMessage,
        });

    } catch (error) {
        console.error("Message Error:", error);

        res.status(500).json({
            success: false,
            message: "Server Error. Please try again.",
        });
    }
};


module.exports = { sendMessage };