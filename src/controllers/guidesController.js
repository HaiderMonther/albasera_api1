const Guides = require("../models/guidesModel");
const { addGuideValidator } = require("../utils/validations/guideValidators");
const { verifyJwt } = require("../services/authService")

async function addGuideVideo_post(req, res) {
    const guidObj = req.body;

    // validate guide data
    const result = addGuideValidator(guidObj);
    if (!result.valid) {
        return res.status(400).json({ message: result.msg });
    }

    // get admin id from jwt token
    const token = req.cookies?.jwt || req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Token not found" });
    }

    const decode = verifyJwt(token);

    // Extract admin_id as a string
    if (!decode || !decode.data || !decode.data.id) {
        return res.status(400).json({ message: "Invalid or malformed token" });
    }

    const admin_id = decode.data.id; // Extract `id` from `data` object
    guidObj.admin_id = admin_id;

    try {
        const guid = await Guides.create(guidObj);
        return res.status(201).json(guid);
    } catch (error) {
        console.error("Error adding guide video:", error.message);
        return res.status(500).json({ message: error.message });
    }
}

async function fetchGuideVideos_get(req, res) {
    try {
        const guides = await Guides.find();
        return res.status(200).json(guides);
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = {
    addGuideVideo_post,
    fetchGuideVideos_get
}


