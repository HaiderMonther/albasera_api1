const Messages = require("../models/messagesModel");
const { addMessageValidator } = require("../utils/validations/messagesValidators")
const { verifyJwt } = require("../services/authService")

async function fetchAllMessages_get(req, res) {
    try {
        const messages = await Messages.find();
        return res.status(200).json(messages);
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

async function fetchMessagesForTeacher_get(req, res) {
    const governorate_id = req.params.id;
    if (governorate_id == "" || !governorate_id) {
        return res.status(404).json({ message: 'governorate id is required' });
    }
    console.log(governorate_id);
    try {
        const messagesObj = await Messages.find({
            governorate_id: {
                $in: [governorate_id, "0"]
            }
        });

        return res.status(200).json(messagesObj)

    } catch (error) {
        return res.status(401).json({ message: "Wrong Governorate Id" })
    }
}

async function sendMessage_post(req, res) {
    const messageObj = req.body;

    // Validate message data
    const result = addMessageValidator(messageObj);
    if (result.valid === false) {
        return res.status(401).json({ message: result.msg });
    }

    // Get admin id from JWT token
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "Unauthorized" });
    } else {
        try {
            const token = authHeader.split(" ")[1];
            const decode = verifyJwt(token);
            const admin_id = decode.id.data.id;
            messageObj.admin_id = admin_id;
        } catch (error) {
            return res.status(401).json({ message: "Invalid token" });
        }
    }

    try {
        const message = await Messages.create(messageObj);
        return res.status(201).json(message);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {
    fetchAllMessages_get,
    fetchMessagesForTeacher_get,
    sendMessage_post
}