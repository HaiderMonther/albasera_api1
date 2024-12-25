const router = require("express").Router();

const {saveNewAttendance_post,getReportForAttendanceByGovernorate_post, getReportForAttendanceByRegionId_post,getAllAttendanceByGovernorateId_post,getAllAttendanceByRegionId_post, getAllAttendanceByTeacherId_get} = require("../controllers/attendanceController")
const {validateAndDeleteImage} = require("../services/multerServiceForAttendance");

router.post("/send-attendance",validateAndDeleteImage, saveNewAttendance_post);
router.get("/teacher/:id", getAllAttendanceByTeacherId_get);
router.post("/governorate", getReportForAttendanceByGovernorate_post);
router.post("/regions", getAllAttendanceByRegionId_post);

router.post("/report/region", getReportForAttendanceByRegionId_post);
router.post("/report/governorate", getReportForAttendanceByGovernorate_post);
module.exports = router;
