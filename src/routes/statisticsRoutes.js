const router = require("express").Router();

const {fetchLatestStudentsStatistics_get, fetchLatestTeachersStatistics_get} = require("../controllers/statisticsControllers")

router.get("/students", fetchLatestStudentsStatistics_get)
router.get("/teachers", fetchLatestTeachersStatistics_get)




module.exports = router;





