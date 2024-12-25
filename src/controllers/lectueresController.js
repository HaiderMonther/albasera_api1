const Lectures = require("../models/lecturesModel");

const { addLectureValidator } = require("../utils/validations/lectureValidators")
const { verifyJwt } = require("../services/authService")


async function addNewLecture_post(req, res) {

    const lectureObj = req.body;

    // validate message data
    const result = addLectureValidator(lectureObj)

    if (result.valid == false) 
        return res.status(401).json({ message: result.msg })
    
    // get admin id from jwt token
    const token = req.cookies.jwt;
    const decode  = verifyJwt(token)
    const admin_id = decode.id.data
    lectureObj.admin_id = admin_id;

    try {
        const lecture = await Lectures.create(lectureObj);
        return res.status(201).json(lecture)
    } catch (error) {
        return res.status(500).json({ message: error.message })
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

module.exports = {
    addNewLecture_post,
    fetchAllLectures_get
}