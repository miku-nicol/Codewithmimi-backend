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


const getAllMessage = async (req, res) =>{
    try {
        const message = await Contact.find().sort({ createdAt: -1 });

        if(!message || message.length === 0){
            return res.status(404).json({
                success: false,
                message: "No message available"
            })
        } 
         res.status(200).json(message);
    } catch (error) {
            console.error("Error fetching message", error)
                
            res.status(500).json({
                sucess: false,
                message: "Server error while fetching mesages",
                
            });
        };
}


module.exports = { sendMessage, getAllMessage };