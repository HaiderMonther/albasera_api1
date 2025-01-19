const router = require("express").Router();

const { addGuideVideo_post, fetchGuideVideos_get, deleteGuide_delete } = require("../controllers/guidesController")

router.get("/", fetchGuideVideos_get);

router.post("/add", addGuideVideo_post);

router.delete('/:id', deleteGuide_delete);



module.exports = router;