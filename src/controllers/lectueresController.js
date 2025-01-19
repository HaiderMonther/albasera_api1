const Lectures = require("../models/lecturesModel");

const { addLectureValidator } = require("../utils/validations/lectureValidators")
const { verifyJwt } = require("../services/authService")


async function addNewLecture_post(req, res) {
    const lectureObj = req.body;

    // validate message data
    const result = addLectureValidator(lectureObj);
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
    let decode;
    try {
        decode = verifyJwt(token);
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }

    if (!decode || !decode.id.data?.id) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }

    // Extract admin_id and add to lecture object
    lectureObj.admin_id = decode.id.data.id;

    try {
        const lecture = await Lectures.create(lectureObj);
        return res.status(201).json(lecture);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async function fetchAllLectures_get(req, res) {
    try {
        const lectures = await Lectures.find();
        return res.status(200).json(lectures);
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}


async function deleteLecture_delete(req, res) {
    try {
        const lectureId = req.params.id;

        if (!lectureId) {
            return res.status(400).json({ message: "Lecture ID is required" });
        }

        const deletedLecture = await Lectures.findByIdAndDelete(lectureId);

        if (!deletedLecture) {
            return res.status(404).json({ message: "Lecture not found" });
        }

        return res.status(200).json({ message: "Lecture deleted successfully", deletedLecture });
    } catch (error) {
        console.error("Error deleting lecture:", error.message);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

module.exports = {
    addNewLecture_post,
    fetchAllLectures_get,
    deleteLecture_delete
}