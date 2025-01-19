const Guides = require("../models/guidesModel");
const { addGuideValidator } = require("../utils/validations/guideValidators");
const { verifyJwt } = require("../services/authService")

async function addGuideVideo_post(req, res) {
    try {
        const guidObj = req.body;

        // Validate guide data
        const result = addGuideValidator(guidObj);
        if (!result.valid) {
            return res.status(400).json({ message: result.msg });
        }

        // Validate Authorization header and extract token
        const authorization = req.headers.authorization;
        if (!authorization || !authorization.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Authorization header is missing or malformed" });
        }
        const token = authorization.split(" ")[1];

        // Decode and verify JWT
        const decode = verifyJwt(token);
        if (!decode || !decode.id.data.id) {
            return res.status(401).json({ message: "Invalid or malformed token" });
        }

        // Extract admin_id and add to guide object
        guidObj.admin_id = decode.id.data.id;

        // Create guide entry in the database
        const guid = await Guides.create(guidObj);
        return res.status(201).json(guid);
    } catch (error) {
        console.error("Error adding guide video:", error.message);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
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

async function deleteGuide_delete(req, res) {
    try {
        const guideId = req.params.id;

        if (!guideId) {
            return res.status(400).json({ message: "Guide ID is required" });
        }

        const deletedGuide = await Guides.findByIdAndDelete(guideId);

        if (!deletedGuide) {
            return res.status(404).json({ message: "Guide not found" });
        }

        return res.status(200).json({ message: "Guide deleted successfully", deletedGuide });
    } catch (error) {
        console.error("Error deleting guide:", error.message);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

module.exports = {
    addGuideVideo_post,
    fetchGuideVideos_get,
    deleteGuide_delete
}


