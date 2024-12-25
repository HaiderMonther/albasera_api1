const router = require("express").Router();

// استيراد الخدمات والمتحكمات الحالية
const { validateAndDeleteFiles } = require("../services/multerServiceForTeachers");
const {
    registerTeacherPost,
    getTeachersReportByRegion_get,
    getTeachersReportByGovernorate_get,
    getTeacherByGovernorate_get,
    getTeachersByRegion_get,
    getPendingTeachers,
    approveTeacher,
    rejectTeacher
} = require("../controllers/teachersController");

// المسارات الحالية
router.post("/register-teacher", validateAndDeleteFiles, registerTeacherPost);

router.get("/governorate/:governorate_id", getTeacherByGovernorate_get);
router.get("/region/:region_id", getTeachersByRegion_get);

router.get("/report/governorate/:governorate_id", getTeachersReportByGovernorate_get);
router.get("/report/region/:governorate_id/:region_id", getTeachersReportByRegion_get);


router.get("/pending-teachers/:governorate_id", getPendingTeachers);

router.put("/reject-teacher/:id", rejectTeacher);

router.put("/approve-teacher/:id", approveTeacher);

module.exports = router;
