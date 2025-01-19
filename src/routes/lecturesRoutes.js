const router = require("express").Router();
const {addNewLecture_post, fetchAllLectures_get, deleteLecture_delete} = require("../controllers/lectueresController")

router.post("/add",addNewLecture_post );

router.get("/",fetchAllLectures_get );

router.delete('/:id', deleteLecture_delete);

module.exports = router;