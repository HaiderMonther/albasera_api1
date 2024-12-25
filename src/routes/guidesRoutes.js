const router = require("express").Router();

const { addGuideVideo_post, fetchGuideVideos_get } = require("../controllers/guidesController")

router.get("/", fetchGuideVideos_get);

router.post("/add", addGuideVideo_post);



module.exports = router;