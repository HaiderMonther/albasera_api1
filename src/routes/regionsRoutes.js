const router = require("express").Router();

const { getAllRegions,addRegion_post ,editRegion_post, getRegionsForGovernorate_get} = require("../controllers/regionsController")

router.get("/", getAllRegions);
router.post("/add", addRegion_post);
router.post("/edit", editRegion_post);

router.get("/get-for-governorate/:id", getRegionsForGovernorate_get);

module.exports = router;