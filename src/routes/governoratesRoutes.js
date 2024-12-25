const router = require("express").Router();

const {  addGovernorate_post, getAllGovernorates_get, getAllGovernoratesWithRegions_get } = require("../controllers/governoratesController")

router.post("/add", addGovernorate_post);
router.get("/get", getAllGovernorates_get);
router.get("/get-with-regions", getAllGovernoratesWithRegions_get);

module.exports = router;