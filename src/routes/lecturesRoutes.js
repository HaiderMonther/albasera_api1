const router = require("express").Router();
const {addNewLecture_post, fetchAllLectures_get} = require("../controllers/lectueresController")

router.post("/add",addNewLecture_post );

router.get("/",fetchAllLectures_get );

module.exports = router;